import React, { useEffect, useState } from "react";
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Tag,
  message,
  Descriptions,
  Divider,
  ConfigProvider,
  Spin,
} from "antd";
import {
  MessageSquarePlus,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MessageCircle,
  XCircle,
} from "lucide-react";
import {
  getComplaint,
  getMyComplaints,
  addComplaint,
} from "../../../api/complaint.ts";

const { TextArea } = Input;

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await getMyComplaints();
      setComplaints(response.data);
    } catch (error) {
      message.warning(
        error.response.data.message || "Failed to fetch complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = async (complaintId) => {
    try {
      const response = await getComplaint(complaintId);
      setSelectedComplaint(response.data);
      setModalVisible(true);
    } catch (error) {
      message.warning(
        error.response.data.message || "Failed to fetch complaint details"
      );
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <span className="font-medium text-[#1C325B]">{text}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1C325B]" />
          <span>{formatDate(date)}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          className={`px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
            status === "Pending"
              ? "bg-orange-50 text-orange-600 border-orange-200"
              : "bg-green-50 text-green-600 border-green-200"
          }`}
        >
          {status === "Pending" ? (
            <Clock className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {status}
        </Tag>
      ),
    },
    {
      title: "Reply",
      dataIndex: "reply",
      key: "reply",
      render: (reply) => (
        <Tag
          className={`px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
            reply
              ? "bg-blue-50 text-blue-600 border-blue-200"
              : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          {reply ? (
            <MessageCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {reply ? "Replied" : "No Reply"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleViewDetails(record._id)}
          icon={<Eye className="w-4 h-4" />}
          className="bg-[#1C325B] hover:bg-[#1C325B]/90 flex items-center gap-1"
        >
          View
        </Button>
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
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header Section */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <AlertCircle className="w-6 h-6 text-white" />
                      <h3 className="m-0 text-lg font-semibold text-white">
                        My Complaints
                      </h3>
                    </div>
                    <p className="text-gray-200 mt-2 mb-0 opacity-90">
                      Manage and track your complaints
                    </p>
                  </div>

                  <Button
                    type="primary"
                    icon={<MessageSquarePlus className="w-4 h-4" />}
                    onClick={() => setCreateModalVisible(true)}
                    className="bg-[#2A4575] hover:bg-[#2A4575]/90 border-none flex items-center gap-1"
                    size="large"
                  >
                    Create Complaint
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
                    dataSource={complaints}
                    rowKey="_id"
                    pagination={{
                      pageSize: 10,
                      showTotal: (total) => `Total ${total} complaints`,
                    }}
                    className="border border-gray-200 rounded-lg"
                    rowClassName="hover:bg-[#1C325B]/5"
                    locale={{
                      emptyText: (
                        <div className="py-8 text-center text-gray-500">
                          No complaints found
                        </div>
                      ),
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* View Modal */}
          <Modal
            title={
              <div className="flex items-center gap-2 text-[#1C325B] pb-3 border-b">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Complaint Details</span>
              </div>
            }
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={[
              <Button
                key="close"
                onClick={() => setModalVisible(false)}
                className="hover:bg-gray-100"
              >
                Close
              </Button>,
            ]}
            width={700}
          >
            {selectedComplaint && (
              <div className="mt-4">
                <Descriptions
                  bordered
                  column={1}
                  className="rounded-lg overflow-hidden"
                  labelStyle={{
                    backgroundColor: "#f8fafc",
                    fontWeight: 500,
                    width: "150px",
                  }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Descriptions.Item label="Title">
                    {selectedComplaint.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {selectedComplaint.description}
                  </Descriptions.Item>
                  <Descriptions.Item label="Details">
                    {selectedComplaint.body}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag
                      className={`px-3 py-1 rounded-full flex items-center gap-1 w-fit ${
                        selectedComplaint.status === "Pending"
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-green-50 text-green-600 border-green-200"
                      }`}
                    >
                      {selectedComplaint.status === "Pending" ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {selectedComplaint.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1C325B]" />
                      {formatDate(selectedComplaint.date)}
                    </div>
                  </Descriptions.Item>
                  {selectedComplaint.reply && (
                    <Descriptions.Item label="Reply">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-blue-700 m-0">
                          {selectedComplaint.reply}
                        </p>
                      </div>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </div>
            )}
          </Modal>

          {/* Create Modal */}
          <Modal
            title={
              <div className="flex items-center gap-2 text-[#1C325B] pb-3 border-b">
                <MessageSquarePlus className="w-5 h-5" />
                <span className="font-semibold">Create Complaint</span>
              </div>
            }
            open={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            footer={null}
            width={600}
          >
            <Form
              layout="vertical"
              onFinish={async (values) => {
                try {
                  await addComplaint(values);
                  message.success("Complaint submitted successfully");
                  setCreateModalVisible(false);
                  form.resetFields();
                  fetchComplaints();
                } catch (error) {
                  message.warning("Failed to submit complaint");
                }
              }}
              form={form}
              className="mt-4"
            >
              <Form.Item
                label={<span className="text-gray-700 font-medium">Title</span>}
                name="title"
                rules={[{ required: true, message: "Please input the title!" }]}
              >
                <Input
                  placeholder="Enter complaint title"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Description</span>
                }
                name="description"
                rules={[
                  { required: true, message: "Please input the description!" },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Brief description of your complaint"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-gray-700 font-medium">Details</span>
                }
                name="body"
                rules={[
                  { required: true, message: "Please input the details!" },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Detailed explanation of your complaint"
                  className="rounded-md"
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setCreateModalVisible(false)}
                    className="hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-[#1C325B] hover:bg-[#1C325B]/90"
                  >
                    Submit Complaint
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default MyComplaints;
