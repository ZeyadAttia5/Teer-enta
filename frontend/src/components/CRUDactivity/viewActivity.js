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

    const fetchActivities = async () => {
        try {
            const response = await axios.get('http://localhost:8000/activity');
            setActivities(response.data);
        } catch (error) {
            message.error('Error fetching activities: ' + error.response?.data?.message);
        }
    };

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
            await axios.delete(`http://localhost:8000/activity/delete/${id}`);
            message.success('Activity deleted successfully!');
            fetchActivities();
        } catch (error) {
            message.error('Error deleting activity: ' + error.response?.data?.message);
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
            price: { min: activity.price.min, max: activity.price.max },
            category: activity.category?._id || '',
            tags: activity.tags.map(tag => tag._id) || [],
            specialDiscounts: activity.specialDiscounts || [],
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
            await axios.put(`http://localhost:8000/activity/update/${id}`, formData);
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
                    <Card
                        key={activity._id}
                        title={activity.name}
                        className="hover:shadow-lg transition-shadow duration-200"
                        extra={
                            <div className="flex space-x-2">
                                <Button
                                    type="default"
                                    icon={<EditOutlined />}
                                    onClick={() => handleEditClick(activity)}
                                />
                                <Button
                                    type="default"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(activity._id)}
                                />
                            </div>
                        }
                    >
                        <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {activity.time}</p>
                        <p><strong>Location:</strong> {activity.location}</p>
                        <p><strong>Price:</strong> ${activity.price.min} - ${activity.price.max}</p>
                        <p><strong>Category:</strong> {activity.category?.name}</p>
                        <p><strong>Tags:</strong> {activity.tags.map(tag => tag.name).join(', ')}</p>

                        {/* Place the editing form directly under the tags */}
                        {editingActivityId === activity._id && (
                            <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md">
                                <h3 className="text-2xl font-semibold">Edit Activity</h3>
                                <Form
                                    layout="vertical"
                                    onFinish={() => handleUpdateSubmit(activity._id)}
                                    className="space-y-4"
                                >
                                    <Form.Item label="Name" required>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={(e) => handleFormChange('name', e.target.value)}
                                            required
                                            className="border border-gray-300 rounded-md"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Date" required>
                                        <Input
                                            type="date"
                                            name="date"
                                            value={new Date(formData.date).toISOString().split('T')[0]}
                                            onChange={(e) => handleFormChange('date', e.target.value)}
                                            required
                                            className="border border-gray-300 rounded-md"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Time" required>
                                        <Input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={(e) => handleFormChange('time', e.target.value)}
                                            required
                                            className="border border-gray-300 rounded-md"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Location" required>
                                        <Input
                                            name="location"
                                            value={formData.location}
                                            onChange={(e) => handleFormChange('location', e.target.value)}
                                            required
                                            className="border border-gray-300 rounded-md"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Min Price" required>
                                        <Input
                                            type="number"
                                            name="price.min"
                                            value={formData.price?.min || ''}
                                            onChange={(e) => handleFormChange('price.min', e.target.value)}
                                            required
                                            className="border border-gray-300 rounded-md"
                                        />
                                    </Form.Item>
                                    <Form.Item label="Max Price" required>
                                        <Input
                                            type="number"
                                            name="price.max"
                                            value={formData.price?.max || ''}
                                            onChange={(e) => handleFormChange('price.max', e.target.value)}
                                            required
                                            className="border border-gray-300 rounded-md"
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Checkbox
                                            checked={formData.isBookingOpen}
                                            onChange={() => setFormData({ ...formData, isBookingOpen: !formData.isBookingOpen })}
                                        >
                                            Booking Open
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item label="Category" required>
                                        <Select
                                            name="category"
                                            value={formData.category}
                                            onChange={(value) => handleFormChange('category', value)}
                                            required
                                            className="border border-gray-300 rounded-md"
                                        >
                                            <Option value="">Select Category</Option>
                                            {categories.map(cat => (
                                                <Option key={cat._id} value={cat._id}>{cat.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Tags">
                                        {tags.map(tag => (
                                            <Checkbox
                                                key={tag._id}
                                                checked={formData.tags.includes(tag._id)}
                                                onChange={() => handleTagChange(tag._id)}
                                            >
                                                {tag.name}
                                            </Checkbox>
                                        ))}
                                    </Form.Item>
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
                                </Form>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ViewActivity;



