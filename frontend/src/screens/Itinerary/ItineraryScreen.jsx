// frontend/screens/ItineraryScreen.js
import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  Divider,
  message,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from '../../api/itinerary.ts';
import { getActivities } from '../../api/activities.ts';
import { getPreferenceTags } from '../../api/preferenceTags.ts';

import moment from 'moment';
import 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ItineraryScreen = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [form] = Form.useForm();

  // New State Variables for Activities and Preference Tags
  const [activitiesList, setActivitiesList] = useState([]);
  const [preferenceTagsList, setPreferenceTagsList] = useState([]);

  useEffect(() => {
    fetchItineraries();
    fetchActivities();
    fetchPreferenceTags();
  }, []);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await getItineraries();
      setItineraries(data);
    } catch (error) {
      message.error('Failed to fetch itineraries');
    }
    setLoading(false);
  };

  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setActivitiesList(data);
    } catch (error) {
      message.error('Failed to fetch activities');
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const data = await getPreferenceTags();
      setPreferenceTagsList(data);
    } catch (error) {
      message.error('Failed to fetch preference tags');
    }
  };

  const showModal = (itinerary = null) => {
    setEditingItinerary(itinerary);
    setIsModalVisible(true);
    if (itinerary) {
      // Format availableDates for RangePicker
      const formattedAvailableDates = itinerary.availableDates.map((date) => [
        moment(date.Date),
        moment(`${date.Date} ${date.Times}`, 'YYYY-MM-DD HH:mm'),
      ]);

      // Format timeline's startTime
      const formattedTimeline = itinerary.timeline.map((tl) => ({
        ...tl,
        startTime: tl.startTime ? moment(tl.startTime, 'HH:mm') : null,
      }));

      form.setFieldsValue({
        ...itinerary,
        availableDates: formattedAvailableDates,
        timeline: formattedTimeline,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItinerary(null);
    form.resetFields();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id);
      message.success('Itinerary deleted successfully');
      fetchItineraries();
    } catch (error) {
      message.error(
        error.response && error.response.status === 400
          ? 'Cannot delete itinerary with existing bookings'
          : 'Failed to delete itinerary'
      );
    }
  };

  const onFinish = async (values) => {
    try {
      // Format availableDates
      const formattedAvailableDates = values.availableDates.map(([start, end]) => ({
        Date: start.format('YYYY-MM-DD'),
        Times: end.format('HH:mm'),
      }));

      // Format activities
      const formattedActivities = values.activities
        ? values.activities.map((act) => ({
            activity: act.activity,
            duration: act.duration,
          }))
        : [];

      // Format locations
      const formattedLocations = values.locations
        ? values.locations.map((loc) => ({
            name: loc.name,
          }))
        : [];

      // Format timeline
      const formattedTimeline = values.timeline
        ? values.timeline.map((tl) => ({
            activity: tl.activity,
            startTime: tl.startTime ? tl.startTime.format('HH:mm') : null,
            duration: tl.duration,
          }))
        : [];

      // Prepare final data
      const formattedData = {
        ...values,
        availableDates: formattedAvailableDates,
        activities: formattedActivities,
        locations: formattedLocations,
        timeline: formattedTimeline,
        preferenceTags: values.preferenceTags || [],
        // Exclude Ratings and Comments from Form Data
      };

      if (editingItinerary) {
        await updateItinerary(editingItinerary._id, formattedData);
        message.success('Itinerary updated successfully');
      } else {
        await createItinerary(formattedData);
        message.success('Itinerary created successfully');
      }
      handleCancel();
      fetchItineraries();
    } catch (error) {
      message.error('Failed to save itinerary');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Accessibility',
      dataIndex: 'accessibility',
      key: 'accessibility',
    },
    {
      title: 'Pickup Location',
      dataIndex: 'pickupLocation',
      key: 'pickupLocation',
    },
    {
      title: 'Drop Off Location',
      dataIndex: 'dropOffLocation',
      key: 'dropOffLocation',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            className="mr-2"
            style={{ backgroundColor: '#02735F', color: '#fff', border: 'none' }}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            style={{ backgroundColor: '#02735F', color: '#fff', border: 'none' }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Itineraries</h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        className="mb-4"
        style={{ backgroundColor: '#02735F', borderColor: '#02735F' }}
      >
        Add Itinerary
      </Button>
      <Table
        dataSource={itineraries}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingItinerary ? 'Edit Itinerary' : 'Add Itinerary'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true }}
        >
          {/* Itinerary Name */}
          <Form.Item
            name="name"
            label="Itinerary Name"
            rules={[{ required: true, message: 'Please enter the itinerary name' }]}
          >
            <Input placeholder="Enter itinerary name" />
          </Form.Item>

          {/* Language */}
          <Form.Item name="language" label="Language" rules={[{ required: true }]}>
            <Select placeholder="Select language">
              <Option value="English">English</Option>
              <Option value="Spanish">Spanish</Option>
              {/* Add more languages as needed */}
            </Select>
          </Form.Item>

          {/* Price */}
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter price"
            />
          </Form.Item>

          {/* Accessibility */}
          <Form.Item name="accessibility" label="Accessibility">
            <Input placeholder="Enter accessibility details" />
          </Form.Item>

          {/* Pickup Location */}
          <Form.Item name="pickupLocation" label="Pickup Location">
            <Input placeholder="Enter pickup location" />
          </Form.Item>

          {/* Drop Off Location */}
          <Form.Item name="dropOffLocation" label="Drop Off Location">
            <Input placeholder="Enter drop off location" />
          </Form.Item>

          <Divider />

          {/* Activities */}
          <Form.List name="activities">
            {(fields, { add, remove }) => (
              <>
                <label className="block font-medium mb-2">Activities</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="start"
                  >
                    {/* Activity Dropdown */}
                    <Form.Item
                      {...restField}
                      name={[name, 'activity']}
                      rules={[{ required: true, message: 'Missing activity' }]}
                    >
                      <Select placeholder="Select activity" style={{ width: 200 }}>
                        {activitiesList.map((activity) => (
                          <Option key={activity._id} value={activity._id}>
                            {activity.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Duration */}
                    <Form.Item
                      {...restField}
                      name={[name, 'duration']}
                      rules={[{ required: true, message: 'Missing duration' }]}
                    >
                      <InputNumber
                        min={1}
                        formatter={(value) => `${value} min`}
                        parser={(value) => value.replace(' min', '')}
                        placeholder="Duration (min)"
                      />
                    </Form.Item>

                    {/* Remove Button */}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', borderColor: '#02735F', color: '#fff' }}
                  >
                    Add Activity
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          {/* Locations */}
          <Form.List name="locations">
            {(fields, { add, remove }) => (
              <>
                <label className="block font-medium mb-2">Locations</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="start"
                  >
                    {/* Location Name */}
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Missing location name' }]}
                    >
                      <Input placeholder="Location Name" />
                    </Form.Item>

                    {/* Remove Button */}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', borderColor: '#02735F', color: '#fff' }}
                  >
                    Add Location
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          {/* Timeline */}
          <Form.List name="timeline">
            {(fields, { add, remove }) => (
              <>
                <label className="block font-medium mb-2">Timeline</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="start"
                  >
                    {/* Activity Dropdown */}
                    <Form.Item
                      {...restField}
                      name={[name, 'activity']}
                      rules={[{ required: true, message: 'Missing activity' }]}
                    >
                      <Select placeholder="Select activity" style={{ width: 200 }}>
                        {activitiesList.map((activity) => (
                          <Option key={activity._id} value={activity._id}>
                            {activity.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Start Time */}
                    <Form.Item
                      {...restField}
                      name={[name, 'startTime']}
                      rules={[{ required: true, message: 'Missing start time' }]}
                    >
                      <DatePicker
                        showTime
                        format="HH:mm"
                        placeholder="Start Time"
                        style={{ width: 150 }}
                      />
                    </Form.Item>

                    {/* Duration */}
                    <Form.Item
                      {...restField}
                      name={[name, 'duration']}
                      rules={[{ required: true, message: 'Missing duration' }]}
                    >
                      <InputNumber
                        min={1}
                        formatter={(value) => `${value} min`}
                        parser={(value) => value.replace(' min', '')}
                        placeholder="Duration (min)"
                      />
                    </Form.Item>

                    {/* Remove Button */}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', borderColor: '#02735F', color: '#fff' }}
                  >
                    Add Timeline Entry
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          {/* Available Dates */}
          <Form.List name="availableDates">
            {(fields, { add, remove }) => (
              <>
                <label className="block font-medium mb-2">Available Dates and Times</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="start"
                  >
                    {/* RangePicker */}
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: 'Missing date range' }]}
                    >
                      <RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: 300 }}
                        placeholder={['Start Date', 'End Date']}
                      />
                    </Form.Item>

                    {/* Remove Button */}
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', borderColor: '#02735F', color: '#fff' }}
                  >
                    Add Available Date
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider />

          {/* Preference Tags */}
          <Form.Item name="preferenceTags" label="Preference Tags">
            <Select
              mode="multiple"
              placeholder="Select preference tags"
              allowClear
            >
              {preferenceTagsList.map((tag) => (
                <Option key={tag._id} value={tag.tag}>
                  {tag.tag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: '#02735F', borderColor: '#02735F' }}
            >
              {editingItinerary ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ItineraryScreen;
