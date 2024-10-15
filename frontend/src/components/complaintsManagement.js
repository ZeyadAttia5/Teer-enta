import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Modal } from "antd";
//import { getComplaints, updateComplaintStatus } from "../../../api/complaints"; // Assume these API functions exist

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const hardcodedComplaints = [
      {
        _id: "1",
        title: "Complaint 1",
        description: "Description for complaint 1",
        body: "Body of complaint 1",
        dateSubmitted: "2023-10-01",
        createdBy: "User1",
        status: "Pending",
        reply: "Reply to complaint 1",
      },
      {
        _id: "2",
        title: "Complaint 2",
        description: "Description for complaint 2",
        body: "Body of complaint 2",
        dateSubmitted: "2023-10-02",
        createdBy: "User2",
        status: "Resolved",
        reply: "Reply to complaint 2",
      },
      {
        _id: "3",
        title: "Complaint 3",
        description: "Description for complaint 3",
        body: "Body of complaint 3",
        dateSubmitted: "2023-10-03",
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
            onClick={() => updateStatus(record._id, "pending")}
            disabled={record.status === "pending"}
            style={{ marginRight: 8 }}
          >
            Set Pending
          </Button>
          <Button
            onClick={() => updateStatus(record._id, "approved")}
            disabled={record.status === "approved"}
          >
            Approve
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Complaints Management
      </h2>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={complaints}
          rowKey="_id"
          bordered
        />
      )}
      <Modal
        title="Complaint Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedComplaint && (
          <div>
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
              <strong>Date Submitted:</strong> {selectedComplaint.dateSubmitted}
            </p>
            <p>
              <strong>Description:</strong> {selectedComplaint.description}
            </p>
            {/* Add more details as needed */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComplaintsManagement;
