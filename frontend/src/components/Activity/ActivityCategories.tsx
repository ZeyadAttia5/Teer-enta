import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  notification,
  ConfigProvider,
  Spin,
  Tooltip,
  Popconfirm,
    message
} from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TagsOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getActivityCategories,
  createActivityCategory,
  updateActivityCategory,
  deleteActivityCategory,
} from "../../api/activityCategory.ts";

const { Item } = Form;

const ActivityCategories = ({ setFlag }) => {
  setFlag(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getActivityCategories();
      setCategories(data);
    } catch (error) {
      message.warning(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateActivityCategory(values, currentCategory?._id);
        message.success("Activity category Updated Successfully")
      } else {
        await createActivityCategory(values);
        message.success("Category created successfully");
      }
      fetchCategories();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.warning(error.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteActivityCategory(id);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      message.warning(error.response?.data?.message);
    }
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "category",
      key: "category",
      render: (text) => (
        <div className="flex items-center">
          <TagsOutlined className="mr-2 text-[#1C325B]" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div className="flex items-center">
          <FileTextOutlined className="mr-2 text-[#1C325B]" />
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
        user.userRole === "Admin" &&
        user._id === record.createdBy && (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit Tag">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsEditing(true);
                  setCurrentCategory(record);
                  form.setFieldsValue(record);
                  setModalVisible(true);
                }}
                className="bg-[#1C325B] hover:bg-[#1C325B]/90"
              >
              </Button>
            </Tooltip>
            <Tooltip title="Delete Category">
              <Popconfirm
                title="Delete Category"
                description="Are you sure you want to delete this Category?"
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
        <div className="w-[90%] p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <AppstoreOutlined className="text-xl flex-shrink-0" />
                      <h3
                        className="m-0 text-lg font-semibold"
                        style={{ color: "white" }}
                      >
                        Activity Categories
                      </h3>
                    </div>
                    <p className="text-gray-200 mt-2 mb-0 opacity-90">
                      Manage and organize activity categories
                    </p>
                  </div>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentCategory(null);
                      form.resetFields();
                      setModalVisible(true);
                    }}
                    className="bg-[#2A4575] hover:bg-[#2A4575]/90 border-none"
                    size="large"
                  >
                    Create Category
                  </Button>
                </div>
              </div>

              {/* Table Section */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey={(record) => record._id}
                    pagination={{
                      pageSize: 10,
                      showTotal: (total) => `Total ${total} categories`,
                    }}
                    className="border border-gray-200 rounded-lg"
                    rowClassName="hover:bg-[#1C325B]/5"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal
            title={
              <div className="text-lg font-semibold text-[#1C325B]">
                {isEditing ? "Edit Category" : "Create New Category"}
              </div>
            }
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false);
              form.resetFields();
            }}
            footer={null}
            className="top-8"
            maskClosable={!submitting}
            closable={!submitting}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="mt-4"
            >
              <Item
                label="Category Name"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Please input the category name!",
                  },
                ]}
              >
                <Input
                  prefix={<TagsOutlined className="text-gray-400" />}
                  placeholder="Enter category name"
                  className="h-10"
                  disabled={submitting}
                />
              </Item>

              <Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter category description"
                  rows={4}
                  disabled={submitting}
                />
              </Item>

              <Item
                label="Status"
                name="isActive"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch
                  disabled={submitting}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
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
                  {isEditing ? "Update" : "Create"} Category
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ActivityCategories;
