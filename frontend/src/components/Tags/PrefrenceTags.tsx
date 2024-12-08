import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    notification,
    Popconfirm,
    ConfigProvider,
    Tooltip, message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  TagsOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  getPreferenceTags,
  createPreferenceTag,
  updatePreferenceTag,
  deletePreferenceTag,
} from "../../api/preferenceTags.ts";

const { Item } = Form;

const PreferenceTags = ({ setFlag }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
        message.warning(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await updatePreferenceTag({ ...currentTag, ...values });
        message.success("Tag updated successfully");
      } else {
        await createPreferenceTag(values);
        message.success("Tag created successfully");
      }
      fetchTags();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
        message.warning(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePreferenceTag(id);
      message.success("Preference Tag deleted successfully")
      fetchTags();
    } catch (error) {
        message.warning(error.response.data.message);
    }
  };

  const columns = [
    {
      title: "Tag Name",
      dataIndex: "tag",
      key: "tag",
      render: (text) => (
          <div className="flex items-center">
            <TagsOutlined className="mr-2 text-[#1C325B]" />
            <span className="font-medium">{text}</span>
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
      render: (_, record) => (
          <div className="flex items-center gap-2">
            <Tooltip title="Edit Prefrence Tag">
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
              </Button>
            </Tooltip>
            <Tooltip title="Delete Prefrence Tag">
              <Popconfirm
                  title="Delete Prefrence Tag"
                  description="Are you sure you want to delete this Prefrence Tag?"
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
                    className="hover:bg-red-50  items-center gap-1 px-3 py-1 border border-red-300 rounded-lg
                transition-all duration-200 hover:border-red-500"
                >
                  {/*<span className="text-red-500 font-medium"></span>*/}
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
                          Preference Tags
                        </h3>
                      </div>
                      <p className="text-gray-200 mt-2 mb-0 opacity-90">
                        Manage and organize your system preference tags
                      </p>
                    </div>

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
                    name="tag"
                    rules={[{ required: true, message: "Please enter tag name" }]}
                >
                  <Input
                      prefix={<TagsOutlined className="text-gray-400" />}
                      placeholder="Enter tag name"
                      className="h-10"
                  />
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

export default PreferenceTags;