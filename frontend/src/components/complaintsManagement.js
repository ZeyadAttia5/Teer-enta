import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Modal, Input } from "antd";
//import { getComplaints, updateComplaintStatus } from "../../../api/complaints"; // Assume these API functions exist

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
      return new Date(a.dateSubmitted) - new Date(b.dateSubmitted);
    } else if (sortBy === "Date descending") {
      return new Date(b.dateSubmitted) - new Date(a.dateSubmitted);
    }
    return 0;
  });

  useEffect(() => {
    const hardcodedComplaints = [
      {
        _id: "1",
        title: "Complaint 1",
        description: "Description for complaint 1",
        body: "Body of complaint 1",
        dateSubmitted: new Date("2023-10-01"),
        createdBy: "User1",
        status: "Pending",
        reply: "Reply to complaint 1",
      },
      {
        _id: "2",
        title: "Complaint 2",
        description: "Description for complaint 2",
        body: "Body of complaint 2",
        dateSubmitted: new Date("2023-10-02"),
        createdBy: "User2",
        status: "Resolved",
        reply: "Reply to complaint 2",
      },
      {
        _id: "3",
        title: "Complaint 3",
        description: "Description for complaint 3",
        body: "Body of complaint 3",
        dateSubmitted: new Date("2023-10-03"),
        createdBy: "User3",
        status: "Pending",
        reply: "Reply to complaint 3",
      },
    ];

    setComplaints(hardcodedComplaints);
    setLoading(false);
  }, []);

  const showComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

  const showReplyModal = (complaint) => {
    setSelectedComplaint(complaint);
    setReplyModalVisible(true);
  };

  const handleReplySubmit = () => {
    try {
      setComplaints((prevComplaints) => {
        return prevComplaints.map((complaint) => {
          if (complaint._id === selectedComplaint._id) {
            return { ...complaint, reply: replyText };
          }
          return complaint;
        });
      });

      message.success("Reply submitted successfully");
      setReplyModalVisible(false);
      setReplyText("");
    } catch (error) {
      message.error("Failed to submit reply");
    }
  };

  const updateStatus = (complaintId, status) => {
    try {
      setComplaints((prevComplaints) => {
        return prevComplaints.map((complaint) => {
          if (complaint._id === complaintId) {
            return { ...complaint, status };
          }
          return complaint;
        });
      });

      message.success("Complaint status updated successfully");
      setModalVisible(false); // Close the modal here
      // Fetch complaints again
      // const data = await getComplaints();
      // setComplaints(data);
    } catch (error) {
      message.error("Failed to update complaint status");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Body", dataIndex: "body", key: "body" },
    {
      title: "Date Submitted",
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
      render: (date) => new Date(date).toLocaleDateString(), // Format the date here
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => showComplaintDetails(record)}
            style={{ marginRight: 8 }}
          >
            View Details
          </Button>
          <Button
            onClick={() => updateStatus(record._id, "Pending")}
            disabled={record.status === "Pending"}
            style={{ marginRight: 8 }}
          >
            Set Pending
          </Button>
          <Button
            onClick={() => updateStatus(record._id, "Resolved")}
            disabled={record.status === "Resolved"}
            style={{ marginRight: 8 }}
          >
            Resolve
          </Button>
          <Button onClick={() => showReplyModal(record)}>Reply</Button>
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
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        style={{ top: 20 }}
        bodyStyle={{ padding: "20px" }}
      >
        {selectedComplaint && (
          <div className="complaint-details">
            <p>
              <strong>Title:</strong> {selectedComplaint.title}
            </p>
            <p>
              <strong>Category:</strong> {selectedComplaint.category}
            </p>
            <p>
              <strong>Status:</strong> {selectedComplaint.status}
            </p>
            <p>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selectedComplaint.dateSubmitted).toLocaleDateString()}
            </p>
            <p>
              <strong>Description:</strong> {selectedComplaint.description}
            </p>
            {/* Add more details as needed */}
            <div style={{ marginTop: 20 }}>
              <Button
                onClick={() => updateStatus(selectedComplaint._id, "Pending")}
                disabled={selectedComplaint.status === "Pending"}
                style={{ marginRight: 8 }}
              >
                Set Pending
              </Button>
              <Button
                onClick={() => updateStatus(selectedComplaint._id, "Resolved")}
                disabled={selectedComplaint.status === "Resolved"}
              >
                Resolve
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        title="Reply to Complaint"
        visible={replyModalVisible}
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
