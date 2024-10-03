import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditOutlined } from '@ant-design/icons';

const UpdateActivity = () => {
    const [activities, setActivities] = useState([]); // List of activities
    const [categories, setCategories] = useState([]);  // List of categories
    const [tags, setTags] = useState([]);              // List of tags
    const [selectedActivity, setSelectedActivity] = useState(null); // Activity selected for update
    const [message, setMessage] = useState(''); // Feedback message

    // Fetch activities, categories, and tags on component load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const activityRes = await axios.get('http://localhost:8000/activity');
                setActivities(activityRes.data); // Fetch activities
                
                const categoryRes = await axios.get('http://localhost:8000/activityCategory');
                setCategories(categoryRes.data); // Fetch categories
                
                const tagRes = await axios.get('http://localhost:8000/tag');
                setTags(tagRes.data); // Fetch tags
            } catch (error) {
                setMessage('Error fetching data: ' + (error.response?.data?.message || error.message));
            }
        };

        fetchData();
    }, []);

    // Handle form change
    const handleChange = (e) => {
        setSelectedActivity({ ...selectedActivity, [e.target.name]: e.target.value });
    };

    // Handle tags selection (multiple)
    const handleTagChange = (e) => {
        const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedActivity({ ...selectedActivity, tags: selectedTags });
    };

    // Handle activity update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/activity/update/${selectedActivity._id}`, selectedActivity);
            setMessage('Activity updated successfully!');
        } catch (error) {
            setMessage('Error updating activity: ' + (error.response?.data?.message || error.message));
        }
    };

    // Handle activity selection for update
    const selectActivityForUpdate = (activity) => {
        setSelectedActivity(activity); // Set the selected activity for editing
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Activity</h2>

            {/* Message Display */}
            {message && (
                <div
                    className={`mb-4 text-center p-3 rounded ${
                        message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {message}
                </div>
            )}

            {/* Activities List */}
            <ul className="space-y-4 mb-6">
                {activities.map(activity => (
                    <li key={activity._id} className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-700">{activity.name}</p>
                            <p className="text-gray-500 text-sm">{activity.location}</p>
                        </div>
                        <button
                            onClick={() => selectActivityForUpdate(activity)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                            <EditOutlined />
                        </button>
                    </li>
                ))}
            </ul>

            {/* Update Form */}
            {selectedActivity && (
                <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Edit Activity</h2>
                    <form onSubmit={handleUpdate}>
                        <input
                            type="text"
                            name="name"
                            value={selectedActivity.name}
                            onChange={handleChange}
                            placeholder="Activity Name"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="date"
                            name="date"
                            value={selectedActivity.date}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="time"
                            name="time"
                            value={selectedActivity.time}
                            onChange={handleChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            name="location"
                            value={selectedActivity.location}
                            onChange={handleChange}
                            placeholder="Location"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            name="priceMin"
                            value={selectedActivity.pricemin}
                            onChange={handleChange}
                            placeholder="Min Price"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            name="priceMax"
                            value={selectedActivity.pricemax}
                            onChange={handleChange}
                            placeholder="Max Price"
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />

                        {/* Category Dropdown */}
                        <select
                            name="category"
                            value={selectedActivity.category}
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
                        <select
                            name="tags"
                            multiple
                            value={selectedActivity.tags}
                            onChange={handleTagChange}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        >
                            <option value="" disabled>Select Tags</option>
                            {tags.map(tag => (
                                <option key={tag._id} value={tag._id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>

                        <label className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="isBookingOpen"
                                checked={selectedActivity.isBookingOpen}
                                onChange={() =>
                                    setSelectedActivity({ ...selectedActivity, isBookingOpen: !selectedActivity.isBookingOpen })
                                }
                                className="mr-2"
                            />
                            Booking Open
                        </label>
                        <label className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={selectedActivity.isActive}
                                onChange={() =>
                                    setSelectedActivity({ ...selectedActivity, isActive: !selectedActivity.isActive })
                                }
                                className="mr-2"
                            />
                            Is Active
                        </label>

                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                        >
                            Update Activity
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UpdateActivity;

