import React, { useEffect, useState } from "react";
import { Table, Spin, message, Button, Modal } from "antd";
//import { getComplaints, updateComplaintStatus } from "../../../api/complaints"; // Assume these API functions exist

const ComplaintsManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    // try {
    //   const response = await getComplaints();
    //   if (Array.isArray(response.data)) {
    //     setComplaints(response.data);
    //   } else {
    //     message.error("Unexpected data format");
    //   }
    // } catch (error) {
    //   const errorMessage =
    //     error.response?.data?.message || "Failed to fetch complaints";
    //   message.error(errorMessage);
    // } finally {
    //   setLoading(false);
    // }
  };

  const updateStatus = async (id, newStatus) => {
    // try {
    //   await updateComplaintStatus(id, newStatus);
    //   message.success(`Complaint status updated to ${newStatus}`);
    //   setComplaints((prevComplaints) =>
    //     prevComplaints.map((complaint) =>
    //       complaint._id === id ? { ...complaint, status: newStatus } : complaint
    //     )
    //   );
    // } catch (error) {
    //   const errorMessage =
    //     error.response?.data?.message || "Failed to update complaint status";
    //   message.error(errorMessage);
    // }
  };

  const showComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Status", dataIndex: "status", key: "status" },
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
