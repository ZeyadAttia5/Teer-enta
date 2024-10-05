import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DeleteTag from '../CRUDtag/deleteTag';
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";

const UpdateActivity = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [message, setMessage] = useState('');
    const [tagToAdd, setTagToAdd] = useState('');
    const [loading, setLoading] = useState(true);

    const Url = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch activity details by ID
                const activityRes = await axios.get(`${Url}/activity/67018de429b48f5bfd655002`);
                setActivity(activityRes.data);
                setSelectedTags(activityRes.data.tags || []); // Pre-select the tags

                // Fetch categories
                const categoryRes = await axios.get(`${Url}/activityCategory`);
                setCategories(categoryRes.data);

                // Fetch all available tags
                const tagRes = await axios.get(`${Url}/preferenceTag`);
                setTags(tagRes.data);

                setLoading(false);
            } catch (error) {
                setMessage('Error fetching data: ' + error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [id, Url]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if ((name === 'price.min' || name === 'price.max') && !/^\d*$/.test(value)) {
            return; // Only allow numbers for price fields
        }

        if (name === 'price.min' || name === 'price.max') {
            setActivity({
                ...activity,
                price: {
                    ...activity.price,
                    [name.split('.')[1]]: value
                }
            });
        } else if (name === 'location.lat' || name === 'location.lng') {
            setActivity({
                ...activity,
                location: {
                    ...activity.location,
                    [name.split('.')[1]]: value
                }
            });
        } else {
            setActivity({
                ...activity,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const validatePrice = () => {
        const minPrice = parseFloat(activity.price?.min);
        const maxPrice = parseFloat(activity.price?.max);
        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
            setMessage('Min price should not be greater than max price');
            return false;
        }
        return true;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validatePrice()) return;

        try {
            // Update the activity with the selected tags
            await axios.put(`${Url}/activity/update/${activity._id}`, {
                ...activity,
                tags: selectedTags.map(tag => tag._id)  // Send only tag IDs
            });
            setMessage('Activity updated successfully!');
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            setMessage(`Error updating activity: ${errorMsg}`);
        }
    };

    const handleAddTag = () => {
        // Find the tag object by its ID and add it if it's not already selected
        const tagObject = tags.find(tag => tag._id === tagToAdd);
        if (tagObject && !selectedTags.some(tag => tag._id === tagObject._id)) {
            setSelectedTags([...selectedTags, tagObject]);
        }
        setTagToAdd(''); // Reset the tag select input
    };

    const handleRemoveTag = (tagId) => {
        // Remove the tag from the selectedTags list
        setSelectedTags(selectedTags.filter(tag => tag._id !== tagId));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">Edit Activity</h2>

            {message && (
                <div className={`mb-4 p-3 text-center rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            {activity && (
                <form onSubmit={handleUpdate} className="bg-white shadow-md p-6 rounded-lg max-w-lg mx-auto">
                    <input
                        type="text"
                        name="name"
                        value={activity.name}
                        onChange={handleChange}
                        placeholder="Activity Name"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <input
                        type="date"
                        name="date"
                        value={formatDate(activity.date)}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <input
                        type="time"
                        name="time"
                        value={activity.time}
                        onChange={handleChange}
                        placeholder="Time (e.g., 10:00 AM)"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
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
                    <input
                        type="text"
                        name="price.min"
                        value={activity.price?.min || ''}
                        onChange={handleChange}
                        placeholder="Min Price"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        name="price.max"
                        value={activity.price?.max || ''}
                        onChange={handleChange}
                        placeholder="Max Price"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />

                    <select
                        name="category"
                        value={activity.category}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.category}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center mb-4">
                        <select
                            value={tagToAdd}
                            onChange={(e) => setTagToAdd(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="" disabled>Select Tag</option>
                            {tags.map(tag => (
                                <option key={tag._id} value={tag._id}>
                                    {tag.tag}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="ml-2 p-2 bg-blue-500 text-white rounded"
                        >
                            Add Tag
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedTags.length > 0 ? selectedTags.map(tag => (
                            <span key={tag._id} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full cursor-pointer">
                                {tag.tag}
                                <DeleteTag tagId={tag._id} onDelete={() => handleRemoveTag(tag._id)} />
                            </span>
                        )) : 'No tags selected'}
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Update Activity
                    </button>
                </form>
            )}
        </div>
    );
};

export default UpdateActivity;
