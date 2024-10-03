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
  TimePicker,
  message,
  Space,
} from 'antd';
import {
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from '../../api/itinerary.ts';

import { getActivities } from '../../api/activities.ts';
import { getPreferenceTags } from '../../api/preferenceTags.ts';

import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import 'antd';
import moment from 'moment';

const { Option } = Select;

const ItineraryScreen = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [form] = Form.useForm();

  // **New State Variables**
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
      console.log(data);
      setItineraries(data);
    } catch (error) {
      message.error('Failed to fetch itineraries');
    }
    setLoading(false);
  };

  // **New Fetch Functions**
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
      form.setFieldsValue({
        ...itinerary,
        availableDates: itinerary.availableDates.map((date) => [
          moment(date.Date),
          moment(date.Times, 'HH:mm'),
        ]),
        // **Populate Activities and Timeline**
        activities: itinerary.activities.map((act) => ({
          activity: act.activity._id,
          duration: act.duration,
        })),
        timeline: itinerary.timeline.map((tl) => ({
          activity: tl.activity._id,
          startTime: tl.startTime ? moment(tl.startTime, 'HH:mm') : null,
          duration: tl.duration,
        })),
        // **Populate Preference Tags**
        preferenceTags: itinerary.preferenceTags.map((tag) => tag.tag),
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
    const formattedData = {
      ...values,
      availableDates: values.availableDates.map(([date, time]) => ({
        Date: date.format('YYYY-MM-DD'),
        Times: time.format('HH:mm'),
      })),
      activities: values.activities
        ? values.activities.map((act) => ({
            activity: act.activity,
            duration: act.duration,
          }))
        : [],
      locations: values.locations
        ? values.locations.map((loc) => ({
            name: loc.name,
          }))
        : [],
      timeline: values.timeline
        ? values.timeline.map((tl) => ({
            activity: tl.activity,
            startTime: tl.startTime ? tl.startTime.format('HH:mm') : null,
            duration: tl.duration,
          }))
        : [],
      preferenceTags: values.preferenceTags || [],
      // **Exclude Ratings and Comments from Form Data**
    };
    console.log(" Formatted Data: " +  formattedData);
    try {
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
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ isActive: true }}
        >
          <Form.Item
            name="name"
            label="Itinerary Name"
            rules={[{ required: true, message: 'Please enter the itinerary name' }]}
          >
            <Input placeholder="Enter itinerary name" />
          </Form.Item>

          <Form.Item name="language" label="Language" rules={[{ required: true }]}>
            <Select placeholder="Select language">
              <Option value="English">English</Option>
              <Option value="Spanish">Spanish</Option>
              <Option value="Arabic">Arabic</Option>
              {/* Add more languages as needed */}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `$ ${value}`}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter price"
            />
          </Form.Item>

          <Form.Item name="accessibility" label="Accessibility">
            <Input placeholder="Enter accessibility details" />
          </Form.Item>

          <Form.Item name="pickupLocation" label="Pickup Location">
            <Input placeholder="Enter pickup location" />
          </Form.Item>

          <Form.Item name="dropOffLocation" label="Drop Off Location">
            <Input placeholder="Enter drop off location" />
          </Form.Item>

          {/* **Activities Section** */}
          <Form.List name="activities">
            {(fields, { add, remove }) => (
              <div>
                <label className="font-semibold">Activities</label>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'activity']}
                      fieldKey={[fieldKey, 'activity']}
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
                    <Form.Item
                      {...restField}
                      name={[name, 'duration']}
                      fieldKey={[fieldKey, 'duration']}
                      rules={[{ required: true, message: 'Missing duration' }]}
                    >
                      <InputNumber
                        min={1}
                        placeholder="Duration (minutes)"
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', color: '#fff', borderColor: '#02735F' }}
                  >
                    Add Activity
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          {/* **Locations Section** */}
          <Form.List name="locations">
            {(fields, { add, remove }) => (
              <div>
                <label className="font-semibold">Locations</label>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      fieldKey={[fieldKey, 'name']}
                      rules={[{ required: true, message: 'Missing location name' }]}
                    >
                      <Input placeholder="Location Name" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', color: '#fff', borderColor: '#02735F' }}
                  >
                    Add Location
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          {/* **Timeline Section** */}
          <Form.List name="timeline">
            {(fields, { add, remove }) => (
              <div>
                <label className="font-semibold">Timeline</label>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'activity']}
                      fieldKey={[fieldKey, 'activity']}
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
                    <Form.Item
                      {...restField}
                      name={[name, 'startTime']}
                      fieldKey={[fieldKey, 'startTime']}
                      rules={[{ required: true, message: 'Missing start time' }]}
                    >
                      <TimePicker format="HH:mm" placeholder="Start Time" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'duration']}
                      fieldKey={[fieldKey, 'duration']}
                      rules={[{ required: true, message: 'Missing duration' }]}
                    >
                      <InputNumber
                        min={1}
                        placeholder="Duration (minutes)"
                        style={{ width: 150 }}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', color: '#fff', borderColor: '#02735F' }}
                  >
                    Add Timeline Entry
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          {/* **Available Dates Section** */}
          <Form.List name="availableDates">
            {(fields, { add, remove }) => (
              <div>
                <label className="font-semibold">Available Dates and Times</label>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'Date']}
                      fieldKey={[fieldKey, 'Date']}
                      rules={[{ required: true, message: 'Missing date' }]}
                    >
                      <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'Times']}
                      fieldKey={[fieldKey, 'Times']}
                      rules={[{ required: true, message: 'Missing time' }]}
                    >
                      <TimePicker format="HH:mm" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ backgroundColor: '#02735F', color: '#fff', borderColor: '#02735F' }}
                  >
                    Add Available Date
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>

          {/* **Preference Tags Section** */}
          <Form.Item name="preferenceTags" label="Preference Tags">
            <Select
              mode="multiple"
              placeholder="Select preference tags"
              allowClear
            >
              {preferenceTagsList.map((tag) => (
                <Option key={tag._id} value={tag._id}>
                  {tag.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
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
