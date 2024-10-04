import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DeleteTag from '../CRUDtag/deleteTag';

const UpdateActivity = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [message, setMessage] = useState('');
    const [tagToAdd, setTagToAdd] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activityRes = await axios.get(`http://localhost:8000/activity/${id}`);
                setActivity(activityRes.data);
                setSelectedTags(activityRes.data.tags || []);
                
                const categoryRes = await axios.get('http://localhost:8000/activityCategory');
                setCategories(categoryRes.data);

                const tagRes = await axios.get('http://localhost:8000/tag');
                setTags(tagRes.data);

                setLoading(false);
            } catch (error) {
                setMessage('Error fetching data: ' + error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

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
            await axios.put(`http://localhost:8000/activity/update/${activity._id}`, {
                ...activity,
                tags: selectedTags
            });
            setMessage('Activity updated successfully!');
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            setMessage(`Error updating activity: ${errorMsg}`);
            console.error(error); // Log error for debugging
        }
    };

    const handleAddTag = () => {
        if (tagToAdd && !selectedTags.includes(tagToAdd)) {
            setSelectedTags([...selectedTags, tagToAdd]);
        }
        setTagToAdd('');
    };

    const handleRemoveTag = (tagId) => {
        setSelectedTags(selectedTags.filter(tag => tag._id !== tagId));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
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

                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedTags.length > 0 ? selectedTags.map(tag => (
                            <span key={tag._id} className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full cursor-pointer">
                                {tag.name}
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
