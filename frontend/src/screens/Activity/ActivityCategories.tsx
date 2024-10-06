import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, notification, Popconfirm } from 'antd';
import { getActivityCategories, createActivityCategory, updateActivityCategory, deleteActivityCategory } from '../../api/activityCategory.ts'; // Update this path based on your actual file structure
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';

const { Item } = Form;

const ActivityCategories = ({setFlag}) => {
    setFlag(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [form] = Form.useForm();

    // Fetch categories when the component loads
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getActivityCategories();
            setCategories(data);
        } catch (error) {
            notification.error({ message: 'Error fetching activity categories' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = () => {
        setIsEditing(false);
        setCurrentCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditCategory = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
        form.setFieldsValue(category);
        setIsModalVisible(true);
    };

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await deleteActivityCategory(id);
            notification.success({ message: 'Category deleted successfully' });
            fetchCategories();
        } catch (error) {
            notification.error({ message: 'Error deleting category' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (isEditing) {
                await updateActivityCategory(values, currentCategory._id);
                notification.success({ message: 'Category updated successfully' });
            } else {
                await createActivityCategory(values);
                notification.success({ message: 'Category created successfully' });
            }
            fetchCategories();
            setIsModalVisible(false);
        } catch (error) {
            notification.error({ message: 'Error saving category' });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Category', dataIndex: 'category', key: 'category' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (text, record) => <Switch checked={record.isActive} disabled /> },
        // { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCategory(record)} />
                    <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteCategory(record._id)}>
                        <Button type="link" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </>
            )
        }
    ];

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-green-600">Activity Categories</h1>
                <Button type="primary" icon={<PlusOutlined />} className="bg-green-600" onClick={handleCreateCategory}>
                    Create Category
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={categories}
                rowKey={(record) => record._id}
                loading={loading}
                className="bg-white shadow-md"
            />

            <Modal
                title={isEditing ? 'Edit Category' : 'Create Category'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Item label="Category" name="category" rules={[{ required: true, message: 'Please input the category name!' }]}>
                        <Input />
                    </Item>
                    <Item label="Description" name="description">
                        <Input.TextArea rows={4} />
                    </Item>
                    <Item label="Active" name="isActive" valuePropName="checked">
                        <Switch />
                    </Item>
                    <div className="flex justify-end">
                        <Button onClick={() => setIsModalVisible(false)} className="mr-2">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-green-600">
                            {isEditing ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ActivityCategories;
