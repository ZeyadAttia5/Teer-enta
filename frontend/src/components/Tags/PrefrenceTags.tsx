import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, notification, Popconfirm, ConfigProvider } from 'antd';
import {PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UserOutlined} from '@ant-design/icons';
import { getPreferenceTags, createPreferenceTag, updatePreferenceTag, deletePreferenceTag } from '../../api/preferenceTags.ts';
import {TagIcon} from "lucide-react";

const { Item } = Form;

const PreferenceTags = ({ setFlag }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setFlag(false);
    fetchTags();
  }, [setFlag]);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await getPreferenceTags();
      setTags(response.data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch preference tags',
        className: 'bg-white shadow-lg'
      });
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
      notification.success({
        message: 'Success',
        description: 'Tag deleted successfully',
        className: 'bg-white shadow-lg'
      });
      fetchTags();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to delete tag',
        className: 'bg-white shadow-lg'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updatePreferenceTag({ ...currentTag, ...values });
        notification.success({
          message: 'Success',
          description: 'Tag updated successfully',
          className: 'bg-white shadow-lg'
        });
      } else {
        await createPreferenceTag(values);
        notification.success({
          message: 'Success',
          description: 'Tag created successfully',
          className: 'bg-white shadow-lg'
        });
      }
      fetchTags();
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to save tag',
        className: 'bg-white shadow-lg'
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      className: 'font-medium'
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
          <div className="flex items-center space-x-2">
            <Switch
                checked={isActive}
                disabled
                className={isActive ? "bg-emerald-500" : "bg-gray-200"}
            />
            <span className={`${isActive ? 'text-emerald-600 font-medium' : 'text-gray-500'} inline-flex items-center`}>
            {isActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                  Active
                </>
            ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                  Inactive
                </>
            )}
          </span>
          </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
          <div className="flex space-x-2">
            <Button
                type="text"
                icon={<EditOutlined className="text-[#1C325B]" />}
                onClick={() => handleEditTag(record)}
                className="hover:bg-[#1C325B]/10"
            />
            <Popconfirm
                title="Delete Tag"
                description="Are you sure you want to delete this tag?"
                icon={<ExclamationCircleOutlined className="text-red-500" />}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{
                  className: 'bg-red-500 hover:bg-red-600 border-red-500'
                }}
                onConfirm={() => handleDeleteTag(record._id)}
            >
              <Button
                  type="text"
                  icon={<DeleteOutlined className="text-red-500" />}
                  className="hover:bg-red-50"
              />
            </Popconfirm>
          </div>
      )
    }
  ];

  return (
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1C325B',
            },
          }}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/*<div className="bg-white rounded-lg shadow-sm">*/}
              {/* Header Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div
                      className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                    {/* Header Section */}
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        <TagIcon className="text-xl flex-shrink-0"/>
                        <h3 className="m-0 text-lg font-semibold" style={{color: "white"}}>
                          Preference Tags
                        </h3>
                      </div>
                      <p className="text-gray-200 mt-2 mb-0 opacity-90">
                        Manage and organize your system preference tags.
                      </p>
                    </div>

                    {/* Action Button */}
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={handleCreateTag}
                        className="bg-[#2A4575] hover:bg-[#2A4575]/90 border-none"
                        size="large"
                    >
                      Create Tag
                    </Button>
                  </div>
                </div>
              </div>


              {/* Table Section */}
              <div className="px-6 py-4">
                <Table
                    columns={columns}
                    dataSource={tags}
                    rowKey={(record) => record._id}
                    loading={loading}
                    pagination={{
                      defaultPageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} items`,
                      className: 'mt-4'
                    }}
                    className="border border-gray-200 rounded-lg"
                    locale={{
                      emptyText: (
                          <div className="py-8 text-center">
                            <ExclamationCircleOutlined className="text-gray-400 text-2xl mb-2"/>
                            <p className="text-gray-500">No tags found</p>
                          </div>
                      )
                    }}
                    rowClassName="hover:bg-[#1C325B]/5"
                />
              </div>
            {/*</div>*/}
          </div>

          {/* Modal */}
          <Modal
              title={
                <div className="text-lg font-semibold text-[#1C325B]">
                  {isEditing ? 'Edit Tag' : 'Create New Tag'}
                </div>
              }
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
              className="top-8"
          >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                className="pt-4"
            >
              <Item
                  label={<span className="text-gray-700">Tag Name</span>}
                  name="tag"
                  rules={[{required: true, message: 'Please input the tag name!'}]}
              >
                <Input
                    placeholder="Enter tag name"
                    className="h-10"
                />
              </Item>

              <Item
                  label={<span className="text-gray-700">Status</span>}
                  name="isActive"
                  valuePropName="checked"
                  initialValue={true}
              >
                <Switch className="bg-emerald-500" />
              </Item>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                    onClick={() => setIsModalVisible(false)}
                    className="hover:bg-gray-50 border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="bg-[#1C325B] hover:bg-[#1C325B]/90"
                >
                  {isEditing ? 'Update' : 'Create'}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </ConfigProvider>
  );
};

export default PreferenceTags;