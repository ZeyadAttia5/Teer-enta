import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, notification, Popconfirm } from 'antd';
import { getPreferenceTags, createPreferenceTag, updatePreferenceTag, deletePreferenceTag } from '../api/preferenceTags.ts';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Item } = Form;

const PreferenceTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [form] = Form.useForm();

  // Fetch tags when the component loads
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await getPreferenceTags();
      setTags(response.data);
    } catch (error) {
      notification.error({ message: 'Error fetching preference tags' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = () => {
    setIsEditing(false);
    setCurrentTag(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTag = (tag) => {
    setIsEditing(true);
    setCurrentTag(tag);
    form.setFieldsValue(tag);
    setIsModalVisible(true);
  };

  const handleDeleteTag = async (id) => {
    setLoading(true);
    try {
      await deletePreferenceTag(id);
      notification.success({ message: 'Tag deleted successfully' });
      fetchTags();
    } catch (error) {
      notification.error({ message: 'Error deleting tag' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updatePreferenceTag({ ...currentTag, ...values });
        notification.success({ message: 'Tag updated successfully' });
      } else {
        await createPreferenceTag(values);
        notification.success({ message: 'Tag created successfully' });
      }
      fetchTags();
      setIsModalVisible(false);
    } catch (error) {
      notification.error({ message: 'Error saving tag' });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Tag', dataIndex: 'tag', key: 'tag' },
    // { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (text, record) => <Switch checked={record.isActive} disabled /> },
    // { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
          <>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditTag(record)} />
            <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteTag(record._id)}>
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </>
      )
    }
  ];

  return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Preference Tags</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTag}>
            Create Tag
          </Button>
        </div>

        <Table
            columns={columns}
            dataSource={tags}
            rowKey={(record) => record._id}
            loading={loading}
            className="bg-white shadow-md"
        />

        <Modal
            title={isEditing ? 'Edit Tag' : 'Create Tag'}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Item label="Tag" name="tag" rules={[{ required: true, message: 'Please input the tag name!' }]}>
              <Input />
            </Item>
            {/*<Item label="Active" name="isActive" valuePropName="checked">*/}
            {/*  <Switch />*/}
            {/*</Item>*/}
            <div className="flex justify-end">
              <Button onClick={() => setIsModalVisible(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
  );
};

export default PreferenceTags;
