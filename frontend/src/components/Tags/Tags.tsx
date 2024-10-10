import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, notification, Popconfirm } from 'antd';
import { getTags, createTag, updateTag, deleteTag } from '../../api/tags.ts'; // Update this path based on your actual file structure
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';


const { Item } = Form;
const { Option } = Select;

const Tag = ({setFlag}) => {
    setFlag(false);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTag, setCurrentTag] = useState(null);
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch tags when the component loads
    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const response = await getTags();
            setTags(response.data);
        } catch (error) {
            notification.error({ message: 'Error fetching tags' });
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
            await deleteTag(id);
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
                await updateTag(values, currentTag._id);
                notification.success({ message: 'Tag updated successfully' });
            } else {
                await createTag(values);
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
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Historical Period', dataIndex: 'historicalPeriod', key: 'historicalPeriod' },
        { title: 'Active', dataIndex: 'isActive', key: 'isActive', render: (text, record) => <Switch checked={record.isActive} disabled /> },
        // { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    {(user && user.userRole === 'TourismGovernor' && user._id === record.createdBy) && (
                        <>
                            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditTag(record)} />
                            <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteTag(record._id)}>
                                <Button type="link" icon={<DeleteOutlined />} />
                            </Popconfirm>
                        </>
                    )}
                </span>
            )
        }
    ];

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-green-600">Tags Management</h1>
                {(user && user.userRole === 'TourismGovernor') && (
                    <Button type="primary" icon={<PlusOutlined />} className="bg-green-600" onClick={handleCreateTag}>
                        Create Tag
                    </Button>
                )}
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
                    <Item label="Name" name="name" rules={[{ required: true, message: 'Please input the tag name!' }]}>
                        <Input />
                    </Item>
                    <Item label="Type" name="type">
                        <Select placeholder="Select Type">
                            <Option value="Monuments">Monuments</Option>
                            <Option value="Museums">Museums</Option>
                            <Option value="Religious">Religious</Option>
                            <Option value="Sites">Sites</Option>
                            <Option value="Palaces">Palaces</Option>
                            <Option value="Castles">Castles</Option>
                        </Select>
                    </Item>
                    <Item label="Historical Period" name="historicalPeriod">
                        <Select placeholder="Select Historical Period">
                            <Option value="Ancient">Ancient</Option>
                            <Option value="Medieval">Medieval</Option>
                            <Option value="Modern">Modern</Option>
                        </Select>
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

export default Tag;
