import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const CreateActivity = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isBookingOpen, setIsBookingOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    // Removed category state
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [discounts, setDiscounts] = useState([{ discount: '', description: '' }]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [availableTags, setAvailableTags] = useState([]);

    const Url = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${Url}/preferenceTag`);
                setAvailableTags(response.data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${Url}/activityCategory`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchTags();
        fetchCategories();
    }, [Url]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(minPrice) > parseFloat(maxPrice)) {
            setError('Minimum price cannot be greater than maximum price.');
            return;
        }

        for (const discount of discounts) {
            if (discount.discount === '' || discount.description === '') {
                setError('All discount fields must be filled.');
                return;
            }
            if (parseFloat(discount.discount) < 0 || parseFloat(discount.discount) > 100) {
                setError('Discount must be between 0 and 100.');
                return;
            }
        }

        if (!selectedCategory) {
            setError('Please select a category.');
            return;
        }

        if (!location.lat || !location.lng) {
            setError('Please select a location on the map.');
            return;
        }

        setError('');

        try {
            const newActivity = {
                name,
                date,
                time,
                location,
                price: {
                    min: parseFloat(minPrice),
                    max: parseFloat(maxPrice),
                },
                isBookingOpen,
                category: selectedCategory,
                tags,
                specialDiscounts: discounts.filter(d => d.discount !== '' && d.description !== ''),
                createdBy: user._id,
            };

            await axios.post(
                `${Url}/activity/create`,
                newActivity,
                {
                    headers:{
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setMessage('Activity created successfully!');
            setTimeout(() => {
                navigate('/view-activities');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError('Error creating activity: ' + error.response.data.message);
            } else {
                setError('Error creating activity: ' + error.message);
            }
        }
    };

    const handleAddTag = () => {
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
            setSelectedTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleDiscountChange = (index, field, value) => {
        const updatedDiscounts = discounts.map((discount, i) => (
            i === index ? { ...discount, [field]: value } : discount
        ));
        setDiscounts(updatedDiscounts);
    };

    const addDiscount = () => {
        setDiscounts([...discounts, { discount: '', description: '' }]);
    };

    const removeDiscount = (index) => {
        setDiscounts(discounts.filter((_, i) => i !== index));
    };

    // Google Maps configuration
    const mapContainerStyle = {
        height: "400px",
        width: "100%"
    };

    const center = {
        lat: location.lat || -34.397, // Default center
        lng: location.lng || 150.644 // Default center
    };

    const handleMapClick = (event) => {
        setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold mb-6">Create Activity</h2>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Activity Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={isBookingOpen}
                        onChange={() => setIsBookingOpen(!isBookingOpen)}
                        className="mr-2"
                    />
                    Booking Open
                </label>

                {/* Google Map for location selection */}
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={8}
                        center={center}
                        onClick={handleMapClick}
                    >
                        {location.lat && location.lng && (
                            <Marker position={location} />
                        )}
                    </GoogleMap>
                </LoadScript>

                {/* Category Selection */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.category}
                        </option>
                    ))}
                </select>

                {/* Tags Selection */}
                <div>
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">Select Tag</option>
                        {availableTags.map(tag => (
                            <option key={tag._id} value={tag._id}>
                                {tag.tag}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    >
                        Add Tag
                    </button>
                    <div className="mt-2">
                        {tags.map(tag => (
                            <div key={tag} className="inline-block mr-2">
                                <span>{availableTags.find(t => t._id === tag)?.tag || tag}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-1 text-red-500"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Special Discounts */}
                {discounts.map((discount, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <input
                            type="number"
                            placeholder="Discount (%)"
                            value={discount.discount}
                            onChange={(e) => handleDiscountChange(index, 'discount', e.target.value)}
                            className="border rounded p-2 w-full"
                            required
                            min="0"
                            max="100"
                        />
                        <input
                            type="text"
                            placeholder="Discount Description"
                            value={discount.description}
                            onChange={(e) => handleDiscountChange(index, 'description', e.target.value)}
                            className="border rounded p-2 w-full"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeDiscount(index)}
                            className="text-red-500"
                        >
                            &times;
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addDiscount}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                >
                    Add Discount
                </button>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Create Activity
                </button>
            </form>
        </div>
    );
};

export default CreateActivity;
