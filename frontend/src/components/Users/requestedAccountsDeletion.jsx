import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button, Popconfirm, ConfigProvider, Typography } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import {approveAccountDeletion, getAllAccountsDeletionRequests, rejectAccountDeletion} from "../../api/account.ts";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AccountDeletionRequests = ({ setFlag }) => {
    setFlag(false);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getAllAccountsDeletionRequests();
                if (Array.isArray(response.data)) {
                    console.log(response.data);
                    setRequests(response.data);
                } else {
                    message.error("Unexpected data format");
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to fetch deletion requests";
                message.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleApproveDelete = async (id) => {
        try {
            await approveAccountDeletion(id);
            message.success("Account deletion approved");
            setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to approve deletion";
            message.error(errorMessage);
        }
    };

    const handleRejectDelete = async (id) => {
        try {
            await rejectAccountDeletion(id);
            message.success("Account deletion rejected");
            setRequests((prevRequests) => prevRequests.filter((request) => request._id !== id));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to reject deletion";
            message.error(errorMessage);
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: ['user', 'username'],
            key: 'username',
            render: (username) => (
                <div className="flex items-center gap-2">
                    <UserOutlined className="text-[#1C325B]" />
                    <span className="font-medium">{username}</span>
                </div>
            ),
        },
        {
            title: 'Name',
            dataIndex: ['user', 'name'],
            key: 'name',
            render: (name) => <span className="text-gray-600">{name}</span>,
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
            render: (email) => <span className="text-gray-600">{email}</span>,
        },
        {
            title: 'Role',
            dataIndex: ['user', 'userRole'],
            key: 'userRole',
            render: (role) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${role === 'Seller' ? 'bg-blue-100 text-blue-700' :
                                role === 'Buyer' ? 'bg-green-100 text-green-700' :
                                    'bg-gray-100 text-gray-700'}`}>
                    {role}
                </span>
            ),
        },
        {
            title: 'Request Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <span className="text-gray-600">
                    {new Date(date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <Popconfirm
                        title="Approve Deletion"
                        description="Are you sure you want to approve this account deletion?"
                        onConfirm={() => handleApproveDelete(record._id)}
                        okText="Approve"
                        cancelText="Cancel"
                        okButtonProps={{
                            className: 'bg-red-500 hover:bg-red-600',
                            danger: true,
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<DeleteOutlined />}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Approve
                        </Button>
                    </Popconfirm>
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={() => handleRejectDelete(record._id)}
                        className="text-gray-500 hover:text-gray-600"
                    >
                        Reject
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
                            <div
                                className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
                                <div className="flex items-center gap-1 mb-2">
                                    <DeleteOutlined className="text-xl flex-shrink-0"/>
                                    <Title
                                        level={3}
                                        className="m-0"
                                        style={{color: 'white'}}
                                    >
                                        Account Deletion Requests
                                    </Title>
                                </div>
                                <p className="text-gray-200 mt-2 mb-0 opacity-90">
                                    Review and manage account deletion requests
                                </p>
                            </div>

                            {/* Table */}
                            <Table
                                columns={columns}
                                dataSource={requests}
                                rowKey="_id"
                                className="rounded-lg border border-gray-200"
                                pagination={{
                                    pageSize: 10,
                                    showTotal: (total) => `Total ${total} deletion requests`,
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

export default AccountDeletionRequests;