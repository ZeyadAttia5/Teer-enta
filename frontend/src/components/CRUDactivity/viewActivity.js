import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, Checkbox, Form, message, Card } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const ViewActivity = () => {
    const [activities, setActivities] = useState([]);
    const [editingActivityId, setEditingActivityId] = useState(null);
    const [formData, setFormData] = useState({});
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    const fetchActivities = async () => {
        try {
            const response = await axios.get('http://localhost:8000/activity');
            setActivities(response.data);
        } catch (error) {
            message.error('Error fetching activities: ' + error.response?.data?.message);
        }
    };
    //df
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/activityCategory');
            setCategories(response.data);
        } catch (error) {
            message.error('Error fetching categories: ' + error.response?.data?.message);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:8000/tag');
            setTags(response.data);
        } catch (error) {
            message.error('Error fetching tags: ' + error.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchActivities();
        fetchCategories();
        fetchTags();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/activity/delete/${id}` ,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            message.success('Activity deleted successfully!');
            fetchActivities();
        } catch (error) {
            message.error('Error deleting activity: ' + error.response?.data?.message);
        }
    };


    const handleEditClick = (activity) => {
        console.log(activity);
        setEditingActivityId(activity._id);
        setFormData({
            name: activity.name,
            date: activity.date,
            time: activity.time,
            location: activity.location,
            isBookingOpen: activity.isBookingOpen,
            price: { min: activity.price.min, max: activity.price.max },
            category: activity.category?._id || '',
            tags: activity.tags.map(tag => tag._id) || [], // Assuming tags are stored by ID
            specialDiscounts: activity.specialDiscounts
                ? activity.specialDiscounts.map(dis => ({
                    discount: dis.discount,
                    Description: dis.description
                }))
                : []
        });
    };

    const handleFormChange = (name, value) => {
        if (name === 'price.min' || name === 'price.max') {
            const key = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                price: {
                    ...prev.price,
                    [key]: value,
                },
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
            await axios.put(`http://localhost:8000/activity/update/${id}`, formData ,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },

            });
            message.success('Activity updated successfully!');
            setEditingActivityId(null);
            fetchActivities();
        } catch (error) {
            message.error('Error updating activity: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold text-gray-800">Activities</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/create-activity')}
                >
                    Create New Activity
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        <option key={cat._id} value={cat._id}>{cat.category}</option>
                                    ))}
                                </select>
                                <div className="mb-4">
                                    <strong>Tags:</strong>
                                    <div className="flex flex-wrap">
                                        {tags.map(tag => (
                                            <Checkbox
                                                key={tag._id}
                                                checked={formData.tags.includes(tag._id)}
                                                onChange={() => handleTagChange(tag._id)}
                                            >
                                                {tag.name}
                                            </Checkbox>
                                        ))}
                                    </div>
                                    <Button type="primary" htmlType="submit" className="w-full">
                                        Update Activity
                                    </Button>
                                    <Button
                                        onClick={() => setEditingActivityId(null)}
                                        type="default"
                                        className="mt-2 w-full"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <h3 className="text-xl">{activity.name}</h3>
                                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                                <p>Time: {activity.time}</p>
                                <p>Location: {activity.location}</p>
                                <p>Price: {activity.price.min} - {activity.price.max}</p>
                                <p>Category: {activity.category?.category}</p>
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
            </div>
        </div>
    );
};

export default ViewActivity;



