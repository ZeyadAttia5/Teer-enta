import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Switch, Select, notification, Popconfirm, InputNumber, Row, Col, Card } from 'antd';
import {getActivities, createActivity, updateActivity, deleteActivity, getMyActivities} from '../../api/activity.ts'; // Replace with actual API path
import { getActivityCategories } from '../../api/activityCategory.ts';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import moment from 'moment';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { getPreferenceTags } from "../../api/preferenceTags.ts";
import { useLocation } from 'react-router-dom';

const { Item } = Form;
const { Option } = Select;

const AllActivitiesCRUD = ({setFlag}) => {
    setFlag(false);
    const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
    const [activities, setActivities] = useState([]);
    const [categories, setCategories] = useState([]);
    const [preferenceTags, setPreferenceTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentActivity, setCurrentActivity] = useState(null);
    const [location, setLocation] = useState({ lat: 0, lng: 0 }); // Default location
    const [form] = Form.useForm();
    const locationn = useLocation();

    // Fetch activities, categories, and tags on component load
    useEffect(() => {
        if (locationn.pathname === '/activities/my') {
            console.log('My Activities');
            getMActivities();
        } else {
            console.log('All Activities');
            fetchActivities(); // Assuming fetchActivities is your function to get all activities
        }
        fetchCategories();
        fetchPreferenceTags();
    }, [locationn.pathname]);

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
    const getMActivities = async () => {
        setLoading(true);
        try {
            const response = await getMyActivities();
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
            specialDiscounts: activity.specialDiscounts,
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
                await updateActivity(activityData, currentActivity._id);
                notification.success({ message: 'Activity updated successfully' });
            } else {
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
            render: (name) => (
                <span style={{ fontWeight: 'bold', color: '#389e0d' }}>{name}</span>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => (
                <span style={{ color: '#52c41a' }}>{moment(date).format('YYYY-MM-DD')}</span>
            ),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (time) => (
                <span style={{ color: '#73d13d' }}>{time}</span>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (loc) => (
                <span style={{ color: '#52c41a' }}>
                ({loc.lat}, {loc.lng})
            </span>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => (
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                {category?.category || 'N/A'}
            </span>
            ),
        },
        {
            title: 'Preference Tags',
            dataIndex: 'preferenceTags',
            key: 'preferenceTags',
            render: (preferenceTags) => (
                <span style={{ color: '#73d13d' }}>
                {preferenceTags.map(tag => tag.tag).join(', ')}
            </span>
            ),
        },
        {
            title: 'Special Discounts',
            dataIndex: 'specialDiscounts',
            key: 'specialDiscounts',
            render: (discounts) => (
                <Row gutter={[16, 24]} justify="center" style={{ padding: '20px' }}>
                    {discounts.map((discount, index) => (
                        <Col
                            key={index}
                            xs={24} sm={12} md={8} lg={6}
                            style={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <Card
                                hoverable
                                title={`${discount.discount}% Off`}
                                bordered={false}
                                style={{
                                    width: '100%',
                                    maxWidth: '280px',
                                    textAlign: 'center',
                                    borderRadius: '12px',
                                    backgroundColor: '#f6ffed',
                                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.3s ease',
                                }}
                                bodyStyle={{ padding: '16px' }}
                                headStyle={{
                                    backgroundColor: '#52c41a',
                                    color: 'white',
                                    borderRadius: '12px 12px 0 0',
                                    fontSize: '16px',
                                    padding: '12px',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <p style={{ fontSize: '14px', color: '#666' }}>
                                    {discount.Description}
                                </p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    <span
                                        style={{
                                            color: discount.isAvailable ? '#52c41a' : '#ff4d4f',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                    {discount.isAvailable ? 'Available' : 'Not Available'}
                                </span>
                                </p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ),
        },
        {
            title: user ? 'Actions' : "",
            key: 'actions',
            render: (record) => (
                <span>
                {user && (user.userRole === "Advertiser" && user._id === record.createdBy) && (
                    <div>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => handleEditActivity(record)}
                            style={{
                                backgroundColor: '#52c41a',
                                color: 'white',
                                border: 'none',
                                marginRight: '10px',
                            }}
                        />
                        <Popconfirm
                            title="Are you sure you want to delete this activity?"
                            onConfirm={() => handleDeleteActivity(record._id)}
                        >
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    border: 'none',
                                }}
                            />
                        </Popconfirm>
                    </div>
                )}
            </span>
            ),
        }
    ];


    return (
        <div className="container mx-auto p-4">
            {user && (user.userRole === "Admin" || user.userRole === "Advertiser") && (
            <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleCreateActivity}
                className="mb-4 bg-green-600"
            >
                Create Activity
            </Button>
            )}
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
                    <Item label="Preference Tags" name="preferenceTags">
                        <Select mode="multiple" placeholder="Select Tags">
                            {preferenceTags.map((tag) => (
                                <Option key={tag._id} value={tag._id}>
                                    {tag.tag}
                                </Option>
                            ))}
                        </Select>
                    </Item>

                    {/* Special Discounts Section */}
                    <Item label="Special Discounts">
                        <Form.List name="specialDiscounts">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'discount']}
                                                fieldKey={[fieldKey, 'discount']}
                                                rules={[{ required: true, message: 'Missing discount' }]}
                                                style={{ flex: 1 }}
                                            >
                                                <InputNumber placeholder="Discount (%)" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'Description']}
                                                fieldKey={[fieldKey, 'Description']}
                                                rules={[{ required: true, message: 'Missing description' }]}
                                                style={{ flex: 2, marginLeft: 8 }}
                                            >
                                                <Input placeholder="Description" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'isAvailable']}
                                                fieldKey={[fieldKey, 'isAvailable']}
                                                valuePropName="checked"
                                                style={{ marginLeft: 8 }}
                                            >
                                                <Switch />
                                            </Form.Item>
                                            <Button type="link" onClick={() => remove(name)} style={{ marginLeft: 8 }}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block>
                                            Add Discount
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Item>

                    <Button type="primary" htmlType="submit" className="bg-green-600">
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default AllActivitiesCRUD;
