import React, { useEffect, useState } from "react";
import {
  Table,
  Spin,
  message,
  Button,
  Popconfirm,
  ConfigProvider,
  Badge,
  Typography,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getUsers, deleteUser } from "../../../api/account.ts";

const { Title } = Typography;

const AllUsers = ({ setFlag }) => {
  setFlag(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        message.warning({
          content: "Failed to fetch users",
          className: "custom-message",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUserr = async (id) => {
    try {
      await deleteUser(id);
      message.success({
        content: "User deleted successfully",
        className: "custom-message",
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      message.warning({
        content: "Failed to delete user",
        className: "custom-message",
      });
    }
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-[#1C325B]" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="text-gray-600">{email}</span>,
    },
    {
      title: "Role",
      dataIndex: "userRole",
      key: "userRole",
      render: (role) => (
        <Badge
          className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      role === "admin"
                        ? "bg-[#1C325B] text-white"
                        : role === "moderator"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
        >
          {role.toUpperCase()}
        </Badge>
      ),
    },
    {
      title: "Profile Status",
      dataIndex: "hasProfile",
      key: "hasProfile",
      render: (hasProfile) => (
        <div className="flex items-center gap-2">
          {hasProfile ? (
            <>
              <CheckCircleOutlined className="text-emerald-500" />
              <span className="text-emerald-600 font-medium">Complete</span>
            </>
          ) : (
            <>
              <ExclamationCircleOutlined className="text-amber-500" />
              <span className="text-amber-600 font-medium">Incomplete</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Delete User"
          description="Are you sure you want to delete this User?"
          icon={<ExclamationCircleOutlined className="text-red-500" />}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{
            className: "bg-red-500 hover:bg-red-600 border-red-500",
          }}
          onConfirm={() => deleteUserr(record._id)}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined className="text-lg" />}
            className="hover:bg-red-50 flex items-center gap-1 px-3 py-1 border border-red-300 rounded-lg
               transition-all duration-200 hover:border-red-500"
          >
            <span className="text-red-500 font-medium">Delete</span>
          </Button>
        </Popconfirm>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1C325B",
          borderRadius: 8,
        },
      }}
    >
      <div className="flex justify-center">
        <div className="w-[90%] p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center gap-1 mb-2">
                  <UserOutlined className="text-xl flex-shrink-0" />
                  <Title level={3} className="m-0" style={{ color: "white" }}>
                    User Management
                  </Title>
                </div>

                <p className="text-gray-200 mt-2 mb-0 opacity-90">
                  Manage and monitor user accounts
                </p>
              </div>

              {/* Table */}
              <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                className="rounded-lg border border-gray-200"
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total ${total} users`,
                }}
                rowClassName="hover:bg-[#1C325B]/5"
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AllUsers;
