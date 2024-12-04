import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  ConfigProvider,
  Spin,
  Tooltip,
  notification,
  Popconfirm,
} from "antd";
import {
  TagsOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { getTags, createTag, updateTag, deleteTag } from "../../api/tags.ts";

const { Item } = Form;
const { Option } = Select;

const Tag = ({ setFlag }) => {
  setFlag(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await getTags();
      setTags(response.data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to fetch tags",
        className: "bg-white shadow-lg",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateTag(values, currentTag._id);
        notification.success({
          message: "Success",
          description: "Tag updated successfully",
          className: "bg-white shadow-lg",
        });
      } else {
        await createTag(values);
        notification.success({
          message: "Success",
          description: "Tag created successfully",
          className: "bg-white shadow-lg",
        });
      }
      fetchTags();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Failed to save tag",
        className: "bg-white shadow-lg",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tagId) => {
    try {
      await deleteTag(tagId);
      notification.success({
        message: "Success",
        description: "Tag deleted successfully",
        className: "bg-white shadow-lg",
      });
      fetchTags();
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete tag",
        className: "bg-white shadow-lg",
      });
    }
  };

  const columns = [
    {
      title: "Tag Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="flex items-center">
          <TagsOutlined className="mr-2 text-[#1C325B]" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <div className="flex items-center">
          <AppstoreOutlined className="mr-2 text-[#1C325B]" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Historical Period",
      dataIndex: "historicalPeriod",
      key: "historicalPeriod",
      render: (text) => (
        <div className="flex items-center">
          <HistoryOutlined className="mr-2 text-[#1C325B]" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <div className="flex items-center">
          <CheckCircleOutlined
            className={`mr-2 ${
              isActive ? "text-emerald-500" : "text-gray-400"
            }`}
          />
          <span
            className={
              isActive ? "text-emerald-600 font-medium" : "text-gray-500"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        user &&
        user.userRole === "TourismGovernor" &&
        user._id === record.createdBy && (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit Tag">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsEditing(true);
                  setCurrentTag(record);
                  form.setFieldsValue(record);
                  setModalVisible(true);
                }}
                className="bg-[#1C325B] hover:bg-[#1C325B]/90"
              >
                Edit
              </Button>
            </Tooltip>
            <Tooltip title="Delete Tag">
              <Popconfirm
                title="Delete Tag"
                description="Are you sure you want to delete this tag?"
                icon={<ExclamationCircleOutlined className="text-red-500" />}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{
                  className: "bg-red-500 hover:bg-red-600 border-red-500",
                }}
                onConfirm={() => handleDelete(record._id)}
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined className="text-lg" />}
                  className="hover:bg-red-50 flex items-center gap-1 px-3 py-1 border border-red-300 rounded-lg
               transition-all duration-200 hover:border-red-500"
                >
                  <span className="text-red-500 font-medium">Delete</span>
                </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1C325B",
        },
      }}
    >
      <div className="flex justify-center">
        <div className="p-6 w-[90%]">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <TagsOutlined className="text-xl" />
                      <h3 className="m-0 text-lg font-semibold">
                        Tags Management
                      </h3>
                    </div>
                    <p className="text-gray-200 mt-2 mb-0 opacity-90">
                      Manage and organize your tags
                    </p>
                  </div>

                  {user?.userRole === "TourismGovernor" && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setIsEditing(false);
                        setCurrentTag(null);
                        form.resetFields();
                        setModalVisible(true);
                      }}
                      className="bg-[#2A4575] hover:bg-[#2A4575]/90 border-none"
                      size="large"
                    >
                      Create Tag
                    </Button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="p-6">
                <Table
                  columns={columns}
                  dataSource={tags}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showTotal: (total) => `Total ${total} tags`,
                  }}
                  className="border border-gray-200 rounded-lg"
                  rowClassName="hover:bg-[#1C325B]/5"
                />
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal
            title={
              <div className="text-lg font-semibold text-[#1C325B]">
                {isEditing ? "Edit Tag" : "Create New Tag"}
              </div>
            }
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
            }}
            footer={null}
            className="top-8"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="mt-4"
            >
              <Item
                label={
                  <span className="text-gray-700 font-medium">Tag Name</span>
                }
                name="name"
                rules={[{ required: true, message: "Please enter tag name" }]}
              >
                <Input
                  prefix={<TagsOutlined className="text-gray-400" />}
                  placeholder="Enter tag name"
                  className="h-10"
                />
              </Item>

              <Item
                label={<span className="text-gray-700 font-medium">Type</span>}
                name="type"
                rules={[{ required: true, message: "Please select type" }]}
              >
                <Select placeholder="Select type" className="h-10">
                  {[
                    "Monuments",
                    "Museums",
                    "Religious",
                    "Sites",
                    "Palaces",
                    "Castles",
                  ].map((type) => (
                    <Option key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <AppstoreOutlined className="text-[#1C325B]" />
                        {type}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Item>

              <Item
                label={
                  <span className="text-gray-700 font-medium">
                    Historical Period
                  </span>
                }
                name="historicalPeriod"
                rules={[{ required: true, message: "Please select period" }]}
              >
                <Select placeholder="Select period" className="h-10">
                  {["Ancient", "Medieval", "Modern"].map((period) => (
                    <Option key={period} value={period}>
                      <div className="flex items-center gap-2">
                        <HistoryOutlined className="text-[#1C325B]" />
                        {period}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Item>

              <Item
                label={
                  <span className="text-gray-700 font-medium">Status</span>
                }
                name="isActive"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Item>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    form.resetFields();
                  }}
                  disabled={submitting}
                  className="hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  className="bg-[#1C325B] hover:bg-[#1C325B]/90"
                >
                  {isEditing ? "Update" : "Create"} Tag
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Tag;
