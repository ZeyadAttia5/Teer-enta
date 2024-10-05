import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Switch, Select, notification, Popconfirm, InputNumber } from 'antd';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../api/activity.ts'; // Replace with actual API path
import { getActivityCategories } from '../api/activityCategory.ts';
import { getTags } from '../api/tags.ts';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import 'tailwindcss/tailwind.css';
import moment from 'moment';
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import {getPreferenceTags} from "../api/preferenceTags.ts";

const { Item } = Form;
const { Option } = Select;

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [preferenceTags, setPreferenceTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [location, setLocation] = useState({ lat: 0, lng: 0 }); // Default location
    const [form] = Form.useForm();

    // Fetch activities, categories, and tags on component load
    useEffect(() => {
        fetchActivities();
        fetchCategories();
        fetchPreferenceTags();
    }, []);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await getActivities();
            setActivities(response.data);
        } catch (error) {
            notification.error({ message: 'Error fetching activities' });
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getActivityCategories();
            setCategories(response);
        } catch (error) {
            notification.error({ message: 'Error fetching categories' });
        }
    };

    const fetchPreferenceTags = async () => {
        try {
            const response = await getPreferenceTags();
            setPreferenceTags(response.data);
        } catch (error) {
            notification.error({ message: 'Error fetching tags' });
        }
    };

    const handleCreateActivity = () => {
        setIsEditing(false);
        setCurrentActivity(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditActivity = (activity) => {
        setIsEditing(true);
        setCurrentActivity(activity);
        form.setFieldsValue({
            ...activity,
            date: moment(activity.date),
            time: moment(activity.time, 'HH:mm'),
            priceMin: activity.price?.min,
            priceMax: activity.price?.max,
            preferenceTags: activity.preferenceTags.map(tag => tag._id),
            category: activity.category?._id,
        });
        setLocation(activity.location);
        setIsModalVisible(true);
    };

    const handleDeleteActivity = async (id) => {
        try {
            await deleteActivity(id);
            notification.success({ message: 'Activity deleted successfully' });
            fetchActivities();
        } catch (error) {
            notification.error({ message: 'Error deleting activity' });
        }
    };

    const handleFormSubmit = async (values) => {
        // console.log(values);
        const activityData = {
            ...values,
            date: values.date.toISOString(),
            time: values.time.format('HH:mm'),
            location,
            price: {
                min: values.priceMin,
                max: values.priceMax,
            },
            preferenceTags: values.preferenceTags, // Assuming these are tag _ids
            category: values.category, // Assuming this is category _id
        };

        try {
            if (isEditing && currentActivity) {
                // console.log("here",activityData);
                await updateActivity(activityData, currentActivity._id);
                notification.success({ message: 'Activity updated successfully' });
            } else {
                // console.log("here",activityData);
                await createActivity(activityData);
                notification.success({ message: 'Activity created successfully' });
            }
            fetchActivities();
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Error submitting activity' });
        }
    };
    const mapContainerStyle = {
        height: "400px",
        width: "100%"
    };

    const center = {
        lat: location.lat || -34.397,
        lng: location.lng || 150.644
    };

    const handleMapClick = (event) => {
        setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });

    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (loc) => `(${loc.lat}, ${loc.lng})`,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category?.category || 'N/A',
        },
        {
            title: 'PreferenceTags',
            dataIndex: 'preferenceTags',
            key: 'preferenceTags',
            render: (preferenceTags) => preferenceTags.map(tag => tag.tag).join(', '),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record) => (
                <span>
          <Button
              icon={<EditOutlined />}
              onClick={() => handleEditActivity(record)}
              className="mr-2"
          />
          <Popconfirm
              title="Are you sure you want to delete this activity?"
              onConfirm={() => handleDeleteActivity(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleCreateActivity}
                className="mb-4 bg-green-600"
            >
                Create Activity
            </Button>
            <Table
                columns={columns}
                dataSource={activities}
                rowKey="_id"
                loading={loading}
            />

            <Modal
                title={isEditing ? 'Edit Activity' : 'Create Activity'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleFormSubmit} layout="vertical">
                    <Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                    <Item label="Date" name="date" rules={[{ required: true }]}>
                        <DatePicker />
                    </Item>
                    <Item label="Time" name="time" rules={[{ required: true }]}>
                        <TimePicker format="HH:mm" />
                    </Item>
                    <Item label="Price Min" name="priceMin">
                        <InputNumber />
                    </Item>
                    <Item label="Price Max" name="priceMax">
                        <InputNumber />
                    </Item>
                    <Item label="Booking Open" name="isBookingOpen" valuePropName="checked">
                        <Switch />
                    </Item>
                    <Item label="Active" name="isActive" valuePropName="checked">
                        <Switch />
                    </Item>
                    <Item label="Location">
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
                    </Item>
                    <Item label="Category" name="category" rules={[{ required: true }]}>
                        <Select placeholder="Select Category">
                            {categories.map((category) => (
                                <Option key={category._id} value={category._id}>
                                    {category.category}
                                </Option>
                            ))}
                        </Select>
                    </Item>
                    <Item label="PreferenceTags" name="preferenceTags">
                        <Select mode="multiple" placeholder="Select Tags">
                            {preferenceTags.map((tag) => (
                                <Option key={tag._id} value={tag._id}>
                                    {tag.tag}
                                </Option>
                            ))}
                        </Select>
                    </Item>
                    <Button type="primary" htmlType="submit" className="bg-green-600">
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Activities;
