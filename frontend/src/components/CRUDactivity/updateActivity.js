import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DeleteTag from '../CRUDtag/deleteTag'; // Assuming you have a separate tag CRUD component

const UpdateActivity = () => {
    const { id } = useParams(); // Get the activity ID from the URL
    const [activity, setActivity] = useState(null); // State for the selected activity
    const [categories, setCategories] = useState([]);  // List of categories
    const [tags, setTags] = useState([]);              // List of tags
    const [selectedTags, setSelectedTags] = useState([]); // State for selected tags
    const [message, setMessage] = useState('');
    const [tagToAdd, setTagToAdd] = useState(''); // Tag to be added
    const [loading, setLoading] = useState(true); // Loading state for async fetch

    // Fetch activity, categories, and tags
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the activity details
                const activityRes = await axios.get(`http://localhost:8000/activity/${id}`);
                setActivity(activityRes.data); // Set the selected activity
                setSelectedTags(activityRes.data.tags || []); // Initialize selected tags

                // Fetch categories
                const categoryRes = await axios.get('http://localhost:8000/activityCategory');
                setCategories(categoryRes.data);

                // Fetch tags
                const tagRes = await axios.get('http://localhost:8000/tag');
                setTags(tagRes.data);

                setLoading(false); // Done loading
            } catch (error) {
                setMessage('Error fetching data: ' + error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Handle input changes for both text inputs and checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Only allow numbers for price fields
        if ((name === 'price.min' || name === 'price.max') && !/^\d*$/.test(value)) {
            return; // Only numbers allowed
        }

        if (name === 'price.min' || name === 'price.max') {
            setActivity({
                ...activity,
                price: {
                    ...activity.price,
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

    // Validate if min price is less than max price
    const validatePrice = () => {
        const minPrice = parseFloat(activity.price?.min);
        const maxPrice = parseFloat(activity.price?.max);
        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
            setMessage('Min price should not be greater than max price');
            return false;
        }
        return true;
    };

    // Handle the activity update
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validatePrice()) return;

        try {
            await axios.put(`http://localhost:8000/activity/update/${activity._id}`,
                {
                    ...activity,
                    tags: selectedTags // Include the selected tags in the update request
                });
            setMessage('Activity updated successfully!');
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            setMessage(`Error updating activity: ${errorMsg}`);
        }
    };

    // Add the selected tag to the list of selected tags, ensuring no duplicates
    const handleAddTag = () => {
        if (tagToAdd && !selectedTags.includes(tagToAdd)) {
            setSelectedTags([...selectedTags, tagToAdd]);  // Add tag if it's not already selected
        }
        setTagToAdd('');  // Reset dropdown selection
    };

    // Remove a tag from the selected tags list
    const handleRemoveTag = (tagId) => {
        setSelectedTags(selectedTags.filter(tag => tag._id !== tagId)); // Remove tag locally
    };

    // Format the date for the input field
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    };

    if (loading) return <div>Loading...</div>; // Loading indicator

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">Edit Activity</h2>

            {/* Message Display */}
            {message && (
                <div className={`mb-4 p-3 text-center rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Activity Update Form */}
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
                        value={formatDate(activity.date)} // Display date in proper format
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <input
                        type="time" // Changed from 'time' to 'text'
                        name="time"
                        value={activity.time}
                        onChange={handleChange}
                        placeholder="Time (e.g., 10:00 AM)"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        name="location"
                        value={activity.location}
                        onChange={handleChange}
                        placeholder="Location"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />
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

                    {/* Category Dropdown */}
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
                    

                    {/* Tags Dropdown (Multiple Select) */}
                    <div className="flex items-center mb-4">
                        <select
                            value={tagToAdd}
                            onChange={(e) => setTagToAdd(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="" disabled>Select Tag</option>
                            {tags.map(tag => (
                                <option key={tag._id} value={tag._id}>
                                    {tag.name}
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

                    {/* Display Existing Tags with CRUD delete */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {activity.tags?.map(tag => (
                            <span
                                key={tag._id}
                                className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full cursor-pointer"
                            >
                                {tag.name}
                                <DeleteTag
                                    tagId={tag._id} // Pass the tag ID
                                    onDelete={() => handleRemoveTag(tag._id)} // Remove the tag from selectedTags
                                />
                            </span>
                        )) || 'No tags'}
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
