import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Modal, Input } from "antd";
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
      //save it in a variable to use it later
      const complaint = await getComplaint(complaint_id);

      await updateComplaint({
        ...complaint.data,
        status: status,
      });

      //refetch the whole complaints list
      const response = await getComplaints();
      setComplaints(response.data);
      if (modalVisible) {
        const updatedComplaint = response.data.find(
          (c) => c._id === complaint_id
        );
        setSelectedComplaint(updatedComplaint);
      }
      message.success("Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  const updateReply = async (complaint_id) => {
    try {
      //save it in a variable to use it later
      const complaint = await getComplaint(complaint_id);

      await updateComplaint({
        ...complaint.data,
        reply: replyText,
      });

      //refetch the whole complaints list
      const response = await getComplaints();
      setComplaints(response.data);
      if (modalVisible) {
        const updatedComplaint = response.data.find(
          (c) => c._id === complaint_id
        );
        setSelectedComplaint(updatedComplaint);
      }
      message.success("Reply submitted successfully");
    } catch (error) {
      message.error("Failed to submit reply");
    }
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
            onClick={() => showComplaintDetails(record._id)}
            style={{ marginRight: 8 }}
          >
            View Details
          </Button>
          <Button
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
          <Button onClick={() => showReplyModal(record._id)}>Reply</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Complaints Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col">
          <label htmlFor="statusFilter" className="font-semibold mb-1">
            Filter by Status:
          </label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setselectedStatus(e.target.value)}
            className="p-2 border border-slate-700 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="sortBy" className="font-semibold mb-1">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-slate-700 rounded-md"
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
        />
      )}
      <Modal
        title="Complaint Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        style={{ top: 20, padding: "20px" }}
      >
        {selectedComplaint && (
          <div className="complaint-details">
            <p>
              <strong>Title:</strong> {selectedComplaint.title}
            </p>
            <p>
              <strong>Body:</strong> {selectedComplaint.body}
            </p>
            <p>
              <strong>User:</strong>{" "}
              {selectedComplaint.createdBy.username || "Unknown"}
            </p>
            <p>
              <strong>Status:</strong> {selectedComplaint.status}
            </p>
            <p>
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
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <Button
                onClick={() => updateStatus(selectedComplaint._id, "Pending")}
                disabled={selectedComplaint.status === "Pending"}
                style={{ marginRight: 8 }}
              >
                Pending
              </Button>
              <Button
                onClick={() => updateStatus(selectedComplaint._id, "Resolved")}
                disabled={selectedComplaint.status === "Resolved"}
                style={{ marginRight: 8 }}
              >
                Resolved
              </Button>
              <Button onClick={() => updateReply(selectedComplaint._id)}>
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
      >
        <Input.TextArea
          rows={4}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Enter your reply here"
        />
      </Modal>
    </div>
  );
};

export default ComplaintsManagement;
