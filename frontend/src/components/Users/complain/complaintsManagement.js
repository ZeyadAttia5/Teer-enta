import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Modal, Input, Switch, Tag } from "antd";
import {
  getComplaints,
  getComplaint,
  updateComplaint,
} from "../../../api/complaint.ts";

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [selectedStatus, setselectedStatus] = useState("");
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
    const fetchComplaints = async () => {
      try {
        const data = await getComplaints();
        console.log(data);
        setComplaints(data.data);
      } catch (error) {
        message.error("Failed to fetch complaints");
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const showComplaintDetails = async (complaintId) => {
    try {
      console.log(complaintId);
      const response = await getComplaint(complaintId);
      setSelectedComplaint(response.data);
      setReplyText(response.data.reply || "");
      setModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch complaint details");
    }
  };

  const showReplyModal = async (complaintId) => {
    const complaint = await getComplaint(complaintId);
    setSelectedComplaint(complaint.data);
    setReplyText(complaint.data.reply || "");
    setReplyModalVisible(true);
  };

  const handleReplySubmit = async () => {
    try {
      await updateComplaint({
        ...selectedComplaint,
        reply: replyText,
      });

      message.success("Reply submitted successfully");
      setReplyModalVisible(false);
      setReplyText("");
      // Re-fetch the complaints list to update the UI
      const response = await getComplaints();
      setComplaints(response.data);
    } catch (error) {
      message.error("Failed to submit reply");
    }
  };

  const updateStatus = async (complaint_id, status) => {
    try {
      // Update the complaint status on the backend
      await updateComplaint({
        ...selectedComplaint,
        status: status,
      });

      // Update the complaint status locally
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaint_id ? { ...complaint, status } : complaint
        )
      );

      if (modalVisible) {
        setSelectedComplaint((prevComplaint) => ({
          ...prevComplaint,
          status,
        }));
      }

      message.success("Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const updateReply = async (complaint_id) => {
    try {
      // Update the complaint reply on the backend
      await updateComplaint({
        ...selectedComplaint,
        reply: replyText,
      });

      // Update the complaint reply locally
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaint_id
            ? { ...complaint, reply: replyText }
            : complaint
        )
      );

      if (modalVisible) {
        setSelectedComplaint((prevComplaint) => ({
          ...prevComplaint,
          reply: replyText,
        }));
      }

      message.success("Reply submitted successfully");
    } catch (error) {
      message.error("Failed to submit reply");
    }
  };

  const handleStatusChange = async (checked) => {
    const newStatus = checked ? "Resolved" : "Pending";
    await updateStatus(selectedComplaint._id, newStatus);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "User", dataIndex: ["createdBy", "username"], key: "username" },
    {
      title: "Date Submitted",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => showComplaintDetails(record._id)}
            style={{ marginRight: 8 }}
          >
            View Details
          </Button>

          {/* <Button
            onClick={() => updateStatus(record._id, "Pending")}
            disabled={record.status === "Pending"}
            style={{ marginRight: 8 }}
          >
            Pending
          </Button>
          <Button
            onClick={() => updateStatus(record._id, "Resolved")}
            disabled={record.status === "Resolved"}
            style={{ marginRight: 8 }}
          >
            Resolved
          </Button>
          <Button onClick={() => showReplyModal(record._id)}>Reply</Button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Complaints Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col">
          <label
            htmlFor="statusFilter"
            className="font-semibold mb-2 text-gray-700"
          >
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setselectedStatus(e.target.value)}
            className="p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="sortBy" className="font-semibold mb-2 text-gray-700">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-3 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select an option</option>
            <option value="Date ascending">Date (Ascending)</option>
            <option value="Date descending">Date (Descending)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={sortedComplaints}
          rowKey="_id"
          bordered
          className="bg-white shadow-md rounded-lg"
        />
      )}
      <Modal
        title={<h2 className="font-bold text-center">Complaint Details</h2>}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setModalVisible(false)}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Close
          </Button>,
        ]}
        className="top-5 p-5 h-4/5"
        bodyStyle={{
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          lineHeight: "1.5",
          height: "calc(100% - 55px)",
        }}
      >
        {selectedComplaint && (
          <div>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Title:</strong> {selectedComplaint.title}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Body:</strong> {selectedComplaint.body}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>User:</strong>{" "}
              {selectedComplaint.createdBy.username || "Unknown"}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Status:</strong>{" "}
              <Tag
                color={
                  selectedComplaint.status === "Pending" ? "orange" : "green"
                }
              >
                {selectedComplaint.status}
              </Tag>
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selectedComplaint.date).toLocaleDateString()}
            </p>
            <div>
              <strong>Reply:</strong>
              <Input.TextArea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Enter your reply here"
                className="mt-2 w-full"
              />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Switch
                checked={selectedComplaint.status === "Resolved"}
                onChange={handleStatusChange}
                checkedChildren="Resolved"
                unCheckedChildren="Pending"
                className={`${
                  selectedComplaint.status === "Resolved"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{ height: 30 }}
              />
              <Button
                onClick={() => updateReply(selectedComplaint._id)}
                type="primary"
                className="ml-2"
                style={{ alignSelf: "center" }}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Reply to Complaint"
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleReplySubmit}
        okText="Send Reply"
        bodyStyle={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          lineHeight: "1.5",
        }}
      >
        <Input.TextArea
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Enter your reply here"
          className="mt-2 w-full"
        />
      </Modal>
    </div>
  );
};

export default ComplaintsManagement;
