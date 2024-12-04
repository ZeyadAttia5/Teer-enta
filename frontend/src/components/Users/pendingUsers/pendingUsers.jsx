import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button, Popconfirm, ConfigProvider, Badge, Typography } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons';
import { getPendingAccounts, acceptUser, rejectUser } from "../../../api/account.ts";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const PendingUsers = ({ setFlag }) => {
  setFlag(false);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getPendingAccounts();
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          message.error("Unexpected data format");
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch users";
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const acceptUserr = async (id) => {
    try {
      await acceptUser(id);
      message.success("User accepted successfully");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to accept user";
      message.error(errorMessage);
    }
  };

  const rejectUserr = async (id) => {
    try {
      await rejectUser(id);
      message.success("User rejected successfully");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reject user";
      message.error(errorMessage);
    }
  };

  const showDocuments = (id) => {
    navigate(`/showDocuments/${id}`);
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => (
          <div className="flex items-center gap-2">
            <UserOutlined className="text-[#1C325B]" />
            <span className="font-medium">{text}</span>
          </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
          <span className="text-gray-600">{email}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'userRole',
      key: 'userRole',
      render: (role) => (
          <Badge
              className={`px-3 py-1 rounded-full text-xs font-medium
                    ${role === 'admin' ? 'bg-[#1C325B] text-white' :
                  role === 'moderator' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-gray-100 text-gray-700'}`}
          >
            {role.toUpperCase()}
          </Badge>
      ),
    },
    {
      title: 'Profile Status',
      dataIndex: 'hasProfile',
      key: 'hasProfile',
      render: (hasProfile) => (
          <div className="flex items-center gap-2">
            {hasProfile ? (
                <CheckOutlined className="text-emerald-500" />
            ) : (
                <CloseOutlined className="text-red-500" />
            )}
            <span className={`${hasProfile ? 'text-emerald-600' : 'text-red-600'} font-medium`}>
                        {hasProfile ? 'Complete' : 'Incomplete'}
                    </span>
          </div>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
          <div className="flex items-center gap-2">
            <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => acceptUserr(record._id)}
                className="bg-green-500 hover:bg-green-600 text-white"
            >
              Accept
            </Button>
            <Popconfirm
                title="Reject User"
                description="Are you sure you want to reject this user?"
                onConfirm={() => rejectUserr(record._id)}
                okText="Reject"
                cancelText="Cancel"
                okButtonProps={{
                  className: 'bg-red-500 hover:bg-red-600',
                  danger: true,
                }}
            >
              <Button
                  type="text"
                  icon={<CloseOutlined />}
                  className="text-red-500 hover:text-red-600"
              >
                Reject
              </Button>
            </Popconfirm>
            <Button
                type="default"
                icon={<FileTextOutlined />}
                onClick={() => showDocuments(record._id)}
                className="hover:bg-gray-100"
            >
              Documents
            </Button>
          </div>
      ),
    },
  ];

  if (loading) {
    return (
        <div className="flex justify-center items-center">
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
        <div className='flex justify-center'>
        <div className=" p-8 w-[90%]">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center gap-1 mb-2">
                  <UserOutlined className="text-xl flex-shrink-0" />
                  <Title
                      level={3}
                      className="m-0"
                      style={{ color: 'white' }}
                  >
                    Pending User Management
                  </Title>
                </div>
                <p className="text-gray-200 mt-2 mb-0 opacity-90">
                  Review and manage pending user accounts
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
                    showTotal: (total) => `Total ${total} pending users`,
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

export default PendingUsers;
