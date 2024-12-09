import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  message,
  Button,
  Modal,
  Input,
  Switch,
  Tag,
  Descriptions,
  Divider,
  ConfigProvider,
  Select,
} from "antd";
import {
  EyeOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getComplaints,
  getComplaint,
  updateComplaint,
} from "../../../api/complaint.ts";
import Title from "antd/es/skeleton/Title";
import { BadgeIcon, FrownIcon } from "lucide-react";

const { Option } = Select;

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Filtered and sorted complaints
  const filteredComplaints = complaints.filter((complaint) =>
    selectedStatus
      ? complaint.status.toLowerCase() === selectedStatus.toLowerCase()
      : true
  );

  const sortedComplaints = filteredComplaints.sort((a, b) => {
    if (sortBy === "Date ascending") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "Date descending") {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await getComplaints();
      setComplaints(data);
    } catch (error) {
      message.warning(error.response.data.message||"Failed to fetch complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const showComplaintDetails = async (complaintId) => {
    try {
      const response = await getComplaint(complaintId);
      setSelectedComplaint(response.data);
      setReplyText(response.data.reply || "");
      setModalVisible(true);
    } catch (error) {
      message.warning(error.response.data.message||"Failed to fetch complaint details");
    }
  };

  const handleStatusChange = async (checked) => {
    const newStatus = checked ? "Resolved" : "Pending";
    try {
      await updateComplaint({
        ...selectedComplaint,
        status: newStatus,
      });

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === selectedComplaint._id
            ? { ...complaint, status: newStatus }
            : complaint
        )
      );

      setSelectedComplaint((prev) => ({
        ...prev,
        status: newStatus,
      }));

      message.success("Status updated successfully");
    } catch (error) {
      message.warning("Failed to update status");
    }
  };

  const updateReply = async () => {
    try {
      await updateComplaint({
        ...selectedComplaint,
        reply: replyText,
      });

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === selectedComplaint._id
            ? { ...complaint, reply: replyText }
            : complaint
        )
      );
      setModalVisible(false);

      message.success("Reply submitted successfully");
    } catch (error) {
      message.warning("Failed to submit reply");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
    },
    {
      title: "User",
      dataIndex: ["createdBy", "username"],
      key: "username",
      render: (username) => (
        <span className="text-[#1C325B] font-medium">{username}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          icon={
            status === "Resolved" ? (
              <CheckCircleOutlined />
            ) : (
              <ClockCircleOutlined />
            )
          }
          color={status === "Resolved" ? "success" : "warning"}
          className="px-3 py-1"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date Submitted",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showComplaintDetails(record._id)}
          className="bg-[#1C325B] hover:bg-[#1C325B]/90"
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
        <div className=" p-6 w-[90%]">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center gap-1 mb-2">
                  <FrownIcon className="text-xl flex-shrink-0" />
                  <h3
                    className="m-0 text-lg font-semibold"
                    style={{ color: "white" }}
                  >
                    Complaints Management
                  </h3>
                </div>
                <p className="text-gray-200 mt-2 mb-0 opacity-90">
                  Manage and respond to user complaints
                </p>
              </div>

              {/* Filters Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <FilterOutlined className="text-[#1C325B]" />
                    <Select
                      placeholder="Filter by Status"
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      className="w-full"
                      allowClear
                    >
                      <Option value="">All Statuses</Option>
                      <Option value="Pending">Pending</Option>
                      <Option value="Resolved">Resolved</Option>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SortAscendingOutlined className="text-[#1C325B]" />
                    <Select
                      placeholder="Sort by Date"
                      value={sortBy}
                      onChange={setSortBy}
                      className="w-full"
                      allowClear
                    >
                      <Option value="">Sort by Precedence</Option>
                      <Option value="Date ascending">
                        Date (Oldest first)
                      </Option>
                      <Option value="Date descending">
                        Date (Newest first)
                      </Option>
                    </Select>
                  </div>
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
                    dataSource={sortedComplaints}
                    rowKey="_id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} complaints`,
                    }}
                    className="border border-gray-200 rounded-lg"
                    rowClassName="hover:bg-[#1C325B]/5"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details Modal */}
          <Modal
            title={
              <div className="text-lg font-semibold text-[#1C325B] pb-3 border-b">
                Complaint Details
              </div>
            }
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
            className="top-8"
          >
            {selectedComplaint && (
              <div className="py-4">
                <Descriptions
                  bordered
                  column={1}
                  labelStyle={{
                    backgroundColor: "#f8fafc",
                    fontWeight: "600",
                    width: "150px",
                  }}
                  contentStyle={{
                    backgroundColor: "white",
                  }}
                >
                  <Descriptions.Item label="Title">
                    {selectedComplaint?.title}
                  </Descriptions.Item>
                  <Descriptions.Item label="Description">
                    {selectedComplaint?.body}
                  </Descriptions.Item>
                  <Descriptions.Item label="Submitted By">
                    {selectedComplaint?.createdBy?.username}
                  </Descriptions.Item>
                  <Descriptions.Item label="Date">
                    {new Date(selectedComplaint?.date).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag
                      icon={
                        selectedComplaint?.status === "Resolved" ? (
                          <CheckCircleOutlined />
                        ) : (
                          <ClockCircleOutlined />
                        )
                      }
                      color={
                        selectedComplaint?.status === "Resolved"
                          ? "success"
                          : "warning"
                      }
                      className="px-3 py-1"
                    >
                      {selectedComplaint?.status}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div className="space-y-4">
                  <div className="font-semibold text-[#1C325B]">Reply</div>
                  <Input.TextArea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter your reply here..."
                    className="w-full"
                  />

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        Mark as resolved:
                      </span>
                      <Switch
                        checked={selectedComplaint?.status === "Resolved"}
                        onChange={handleStatusChange}
                        className={
                          selectedComplaint?.status === "Resolved"
                            ? "bg-emerald-500"
                            : ""
                        }
                      />
                    </div>
                    <div className="space-x-2">
                      <Button
                        onClick={() => setModalVisible(false)}
                        className="hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        onClick={updateReply}
                        className="bg-[#1C325B]"
                      >
                        Submit Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ComplaintsManagement;
