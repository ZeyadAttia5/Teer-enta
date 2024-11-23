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
} from "antd";
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
    const fetchComplaints = async () => {
      try {
        const response = await getMyComplaints();
        setComplaints(response.data);
      } catch (error) {
        console.error("Failed to fetch complaints:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = async (complaintId) => {
    try {
      const response = await getComplaint(complaintId);
      setSelectedComplaint(response.data);
      setModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch complaint details");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedComplaint(null);
  };

  const handleCreateComplaint = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const onFinish = async (values) => {
    const data = { ...values };

    try {
      const response = await addComplaint(data);
      form.resetFields(); // Reset form fields
    } catch (error) {
      console.error("There was an error submitting the complaint: ", error);
    }

    handleCloseCreateModal();
    const response = await getMyComplaints();
    setComplaints(response.data);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Reply",
      dataIndex: "reply",
      key: "reply",
      render: (reply) => (reply ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewDetails(record._id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4 text-right">
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
        My Complaints
      </h2>
      <Button
        type="danger"
        onClick={handleCreateComplaint}
        className="bg-red-500 text-white hover:bg-red-600 mb-4 mr-4 mt-4"
        style={{ marginRight: "125px" }}
      >
        Create Complaint
      </Button>
      <Table
        columns={columns}
        dataSource={complaints}
        loading={loading}
        rowKey="id"
        className="mb-4"
      />
      {complaints.length === 0 && !loading && (
        <div className="text-center text-gray-500">
          <p>
            No complaints here! Looks like everything is running smoothly. 🎉
          </p>
        </div>
      )}
      <Modal
        title={<h2 className="font-bold text-center">Complaint Details</h2>}
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="close"
            onClick={handleCloseModal}
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
            <Descriptions bordered column={1} className="mb-4">
              <Descriptions.Item label="Title">
                {selectedComplaint.title}
              </Descriptions.Item>
              <Descriptions.Item label="Body">
                {selectedComplaint.body}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedComplaint.status === "Pending" ? "orange" : "green"
                  }
                >
                  {selectedComplaint.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date Submitted">
                {formatDate(selectedComplaint.date)}
              </Descriptions.Item>
              <Descriptions.Item label="Reply">
                {selectedComplaint.reply ? (
                  <span style={{ color: "grey", fontStyle: "italic" }}>
                    {selectedComplaint.reply}
                  </span>
                ) : (
                  "No reply yet"
                )}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
          </div>
        )}
      </Modal>

      <Modal
        title={<h2 className="font-bold text-center">Create Complaint</h2>}
        visible={createModalVisible}
        onCancel={handleCloseCreateModal}
        footer={null}
        className="top-5 p-5 h-4/5"
        bodyStyle={{
          fontFamily: "Arial, sans-serif",
          fontSize: "16px",
          lineHeight: "1.5",
          height: "calc(100% - 55px)",
        }}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please input the body!" }]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyComplaints;
