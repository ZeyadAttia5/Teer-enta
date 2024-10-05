import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateActivity = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isBookingOpen, setIsBookingOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
const [category, setCategory] = useState('');
    const [tags, setTags] = useState([]); // For tags
    const [selectedTag, setSelectedTag] = useState(''); // For current tag input
    const [discounts, setDiscounts] = useState([{ discount: '', description: '' }]); // For discounts
    const [categories, setCategories] = useState([]); // Categories list
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

    // Fetch available tags (assuming you have a route for this)
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tag');
                setAvailableTags(response.data); // Assuming the response contains an array of tags
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/activityCategory');
                setCategories(response.data); // Assuming the response contains an array of categories
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchTags();
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for min and max price
        if (parseFloat(minPrice) > parseFloat(maxPrice)) {
            setError('Minimum price cannot be greater than maximum price.');
            return;
        }

        // Validation for discount
        for (const discount of discounts) {
            if (discount.discount < 0 || discount.discount > 100) {
                setError('Discount must be between 0 and 100.');
                return;
            }
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
                category,
                tags,
                specialDiscounts: discounts.filter(d => d.discount && d.description),
                createdBy: localStorage.getItem('userId'),
            };

            await axios.post('http://localhost:8000/activity/create', newActivity);
            setMessage('Activity created successfully!');

            setTimeout(() => {
                navigate('/view-activities');
            }, 2000);
        } catch (error) {
            setMessage('Error creating activity: ' + error.response?.data?.message);
        }
    };

    // Tag management
    const handleAddTag = () => {
        if (selectedTag && !tags.includes(selectedTag)) {
            setTags([...tags, selectedTag]);
            setSelectedTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Discount management
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
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                <label>
                    <input
                        type="checkbox"
                        checked={isBookingOpen}
                        onChange={() => setIsBookingOpen(!isBookingOpen)}
                    />
                    Booking Open
                </label>

                {/* Category input */}
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

                {/* Tags input */}
                <div>
                    <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="border rounded p-2 w-full"
                    >
                        <option value="">Select Tag</option>
                        {availableTags.map(tag => (
                            <option key={tag._id} value={tag._id}>
                                {tag.name}
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
                                <span>{availableTags.find(t => t._id === tag)?.name || tag}</span>
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

                {/* Discounts input */}
                {discounts.map((discount, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <input
                            type="number"
                            placeholder="Discount (%)"
                            value={discount.discount}
                            onChange={(e) => handleDiscountChange(index, 'discount', e.target.value)}
                            className="border rounded p-2 w-full"
                            required
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


