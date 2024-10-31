// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Tag } from "antd";
// import { getMyComplaints } from "../../../api/complaint.ts";
// import CreateComplaint from "./createComplaint"; // Adjust the import path as necessary

// const MyComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedComplaint, setSelectedComplaint] = useState(null);
//   const [createModalVisible, setCreateModalVisible] = useState(false);

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const response = await getMyComplaints();
//         setComplaints(response.data);
//       } catch (error) {
//         console.error("Failed to fetch complaints:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComplaints();
//   }, []);

//   const handleViewDetails = (complaint) => {
//     setSelectedComplaint(complaint);
//     setModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//     setSelectedComplaint(null);
//   };

//   const handleCreateComplaint = () => {
//     setCreateModalVisible(true);
//   };

//   const handleCloseCreateModal = () => {
//     setCreateModalVisible(false);
//   };

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "Date",
//       dataIndex: "date",
//       key: "date",
//       render: (date) => formatDate(date),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => (
//         <Tag color={status === "Pending" ? "orange" : "green"}>{status}</Tag>
//       ),
//     },
//     {
//       title: "Reply",
//       dataIndex: "reply",
//       key: "reply",
//       render: (reply) => (reply ? "Yes" : "No"),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Button type="primary" onClick={() => handleViewDetails(record)}>
//           View
//         </Button>
//       ),
//     },
//   ];

//   const formatDate = (dateString) => {
//     const options = { day: "2-digit", month: "2-digit", year: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div>
//       <Button
//         type="primary"
//         onClick={handleCreateComplaint}
//         style={{ marginBottom: 16, marginRight: 16 }}
//       >
//         Create Complaint
//       </Button>
//       <Table
//         columns={columns}
//         dataSource={complaints}
//         loading={loading}
//         rowKey="id"
//       />
//       <Modal
//         title="Complaint Details"
//         visible={modalVisible}
//         onCancel={handleCloseModal}
//         footer={[
//           <Button key="close" onClick={handleCloseModal}>
//             Close
//           </Button>,
//         ]}
//       >
//         {selectedComplaint && (
//           <div>
//             <p>
//               <strong>Title:</strong> {selectedComplaint.title}
//             </p>
//             <p>
//               <strong>Body:</strong> {selectedComplaint.body}
//             </p>

//             <p>
//               <strong>Date Submitted:</strong>{" "}
//               {formatDate(selectedComplaint.date)}
//             </p>

//             <p>
//               <strong>Status:</strong> {selectedComplaint.status}
//             </p>
//             <p>
//               <strong>Reply:</strong>{" "}
//               {selectedComplaint.reply
//                 ? selectedComplaint.reply
//                 : "No reply yet"}
//             </p>
//           </div>
//         )}
//       </Modal>

//       <CreateComplaint onClose={handleCloseCreateModal} />
//     </div>
//   );
// };

// export default MyComplaints;

import React, { useEffect, useState } from "react";
import { Table, Form, Input, Button, Modal, Tag, message } from "antd";
import {
  getComplaint,
  getMyComplaints,
  addComplaint,
} from "../../../api/complaint.ts";
// import { set } from "mongoose";
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
        console.log(response);
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
      console.log(complaintId);
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
    const data = {
      ...values,
    };

    try {
      const response = await addComplaint(data);
      console.log("Response: ", response);
      form.resetFields(); // Reset form fields
    } catch (error) {
      console.error("There was an error submitting the complaint: ", error);
    }

    handleCloseCreateModal();
    // Re-fetch complaints to rerender the table
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
    <div>
      <Button
        type="primary"
        onClick={handleCreateComplaint}
        style={{ marginBottom: 16, marginRight: 16 }}
      >
        Create Complaint
      </Button>
      <Table
        columns={columns}
        dataSource={complaints}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title="Complaint Details"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>,
        ]}
      >
        {selectedComplaint && (
          <div>
            <p>
              <strong>Title:</strong> {selectedComplaint.title}
            </p>
            <p>
              <strong>Body:</strong> {selectedComplaint.body}
            </p>

            <p>
              <strong>Date Submitted:</strong>{" "}
              {formatDate(selectedComplaint.date)}
            </p>

            <p>
              <strong>Status:</strong> {selectedComplaint.status}
            </p>
            <p>
              <strong>Reply:</strong>{" "}
              {selectedComplaint.reply
                ? selectedComplaint.reply
                : "No reply yet"}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Create Complaint"
        visible={createModalVisible}
        onCancel={handleCloseCreateModal}
        footer={null}
      >
        {
          <Form layout="vertical" onFinish={onFinish} form={form}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              label="Body"
              name="body"
              rules={[{ required: true, message: "Please input the body!" }]}
            >
              <TextArea rows={6} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        }
      </Modal>
    </div>
  );
};
export default MyComplaints;
