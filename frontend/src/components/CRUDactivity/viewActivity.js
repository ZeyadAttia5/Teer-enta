import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewActivity = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [editingActivityId, setEditingActivityId] = useState(null); // For tracking which activity is being edited
    const [formData, setFormData] = useState({}); // Stores form data for the activity being edited
    const [categories, setCategories] = useState([]); // To store categories
    const [tags, setTags] = useState([]); // To store tags
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const response = await axios.get('http://localhost:8000/activity');
            setActivities(response.data);
        } catch (error) {
            setMessage('Error fetching activities: ' + error.response?.data?.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/activityCategory'); // Adjust to your categories endpoint
            setCategories(response.data);
        } catch (error) {
            setMessage('Error fetching categories: ' + error.response?.data?.message);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:8000/tag'); // Adjust to your tags endpoint
            setTags(response.data);
        } catch (error) {
            setMessage('Error fetching tags: ' + error.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchActivities(); // Automatically fetch activities when the page loads
        fetchCategories(); // Fetch categories
        fetchTags(); // Fetch tags
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/activity/delete/${id}`);
            setMessage('Activity deleted successfully!');
            fetchActivities(); // Refresh the list after deletion
        } catch (error) {
            setMessage('Error deleting activity: ' + error.response?.data?.message);
        }
    };

    const handleEditClick = (activity) => {
        setEditingActivityId(activity._id);
        setFormData({
            name: activity.name,
            date: activity.date,
            time: activity.time,
            location: activity.location,
            isBookingOpen: activity.isBookingOpen,
            price: { min: activity.price.min, max: activity.price.max }, // Ensure this reflects the correct structure
            category: activity.category?._id || '',
            tags: activity.tags.map(tag => tag._id) || [], // Assuming tags are stored by ID
            specialDiscounts: activity.specialDiscounts || []
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        // Handle price updates separately
        if (name === 'price.min' || name === 'price.max') {
            const key = name.split('.')[1]; // Get 'min' or 'max'
            setFormData(prev => ({
                ...prev,
                price: {
                    ...prev.price,
                    [key]: value
                }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleTagChange = (tagId) => {
        setFormData(prev => {
            const tags = prev.tags.includes(tagId)
                ? prev.tags.filter(id => id !== tagId)
                : [...prev.tags, tagId];
            return { ...prev, tags };
        });
    };

    const handleUpdateSubmit = async (id) => {
        try {
            await axios.put(`http://localhost:8000/activity/update/${id}`, formData);
            setMessage('Activity updated successfully!');
            setEditingActivityId(null);
            fetchActivities(); // Refresh the list after updating
        } catch (error) {
            setMessage('Error updating activity: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Activities</h2>
        <button
    onClick={() => navigate('/create-activity')}
    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
>
    Create New Activity
</button>
    </div>


            {message && <p className="text-red-500">{message}</p>}

            <ul className="space-y-4">
                {activities.map(activity => (
                    <li key={activity._id} className="bg-white shadow-md p-4 rounded-lg">
                        {editingActivityId === activity._id ? (
                            // Render update form when editing
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateSubmit(activity._id); }}>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="border rounded p-2 w-full mb-2"
                                    required
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={new Date(formData.date).toISOString().split('T')[0]}
                                    onChange={handleFormChange}
                                    className="border rounded p-2 w-full mb-2"
                                    required
                                />
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleFormChange}
                                    className="border rounded p-2 w-full mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleFormChange}
                                    className="border rounded p-2 w-full mb-2"
                                    required
                                />
                                <input
                                    type="number"
                                    name="price.min"
                                    value={formData.price?.min || ''}
                                    onChange={handleFormChange}
                                    className="border rounded p-2 w-full mb-2"
                                    placeholder="Min Price"
                                    required
                                />
                                <input
                                    type="number"
                                    name="price.max"
                                    value={formData.price?.max || ''}
                                    onChange={handleFormChange}
                                    className="border rounded p-2 w-full mb-2"
                                    placeholder="Max Price"
                                    required
                                />
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isBookingOpen"
                                        checked={formData.isBookingOpen}
                                        onChange={() => setFormData({ ...formData, isBookingOpen: !formData.isBookingOpen })}
                                    />
                                    Booking Open
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="border rounded p-2 w-full mb-2 text-black"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                <div className="mb-4">
                                    <strong>Tags:</strong>
                                    <div className="flex flex-wrap">
                                        {tags.map(tag => (
                                            <label key={tag._id} className="flex items-center mr-4 text-black">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.tags.includes(tag._id)}
                                                    onChange={() => handleTagChange(tag._id)}
                                                    className="mr-2"
                                                />
                                                {tag.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <strong>Special Discounts:</strong>
                                    {formData.specialDiscounts.map((discount, index) => (
                                        <div key={index} className="flex mb-2">
                                            <input
                                                type="number"
                                                placeholder="Discount (%)"
                                                value={discount.discount}
                                                onChange={(e) => {
                                                    const newDiscounts = [...formData.specialDiscounts];
                                                    newDiscounts[index].discount = e.target.value;
                                                    setFormData({ ...formData, specialDiscounts: newDiscounts });
                                                }}
                                                className="border rounded p-2 w-1/4 mr-2"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={discount.description}
                                                onChange={(e) => {
                                                    const newDiscounts = [...formData.specialDiscounts];
                                                    newDiscounts[index].description = e.target.value;
                                                    setFormData({ ...formData, specialDiscounts: newDiscounts });
                                                }}
                                                className="border rounded p-2 w-3/4"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                specialDiscounts: [...prev.specialDiscounts, { discount: '', description: '' }]
                                            }));
                                        }}
                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                    >
                                        Add Discount
                                    </button>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        Update Activity
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingActivityId(null)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <h3 className="text-xl">{activity.name}</h3>
                                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                                <p>Time: {activity.time}</p>
                                <p>Location: {activity.location}</p>
                                <p>Price: {activity.price.min} - {activity.price.max}</p>
                                <p>Category: {activity.category?.name}</p>
                                <p>Tags: {activity.tags.map(tag => tag.name).join(', ')}</p>
                                <p>Discounts: {activity.specialDiscounts.map(discount => `${discount.discount}% ${discount.description}`).join(', ')}</p>
                                <div className="flex mt-4">
                                    <button onClick={() => handleEditClick(activity)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(activity._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewActivity;


