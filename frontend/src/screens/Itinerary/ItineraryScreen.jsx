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
  message,
} from 'antd';
import {
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from '../../api/itinerary.ts';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import 'antd';
import moment from 'moment';


const { Option } = Select;
const { RangePicker } = DatePicker;

const ItineraryScreen = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchItineraries();
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
      activities: values.activities || [],
      locations: values.locations || [],
      timeline: values.timeline || [],
    };

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

          {/* Activities */}
          {/* You can expand this section to dynamically add activities, locations, timelines, etc. */}
          {/* For simplicity, it's omitted here */}

          {/* Available Dates */}
          <Form.Item
            name="availableDates"
            label="Available Dates and Times"
            rules={[{ required: true, message: 'Please select available dates and times' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              placeholder={['Select start date', 'Select end date']}
            />
          </Form.Item>

          <Form.Item name="isActive" label="Active Status" valuePropName="checked">
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
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
