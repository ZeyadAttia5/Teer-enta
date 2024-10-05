import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button } from 'antd';
import axios from 'axios';

const PendingUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const Url = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${Url}/account/pending`);
                console.log(response.data); // Log the API response
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    message.error('Unexpected data format');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to fetch users';
                message.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const acceptUser = async (id) => {
        try {
            await axios.patch(`${Url}/account/accept/${id}`);
            message.success('User accepted successfully');
            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to accept user';
            message.error(errorMessage);
        }
    };

    const rejectUser = async (id) => {
        try {
            await axios.patch(`${Url}/account/reject/${id}`);
            message.success('User rejected successfully');
            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reject user';
            message.error(errorMessage);
        }
    };

    const showDocuments = (id) => {
        message.info(`Showing documents for user with ID: ${id}`);
        // Implement the logic to show user documents (e.g., redirect or open a modal)
    };

    const columns = [
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Role', dataIndex: 'userRole', key: 'userRole' },
        { title: 'Has Profile', dataIndex: 'hasProfile', key: 'hasProfile', render: (hasProfile) => (hasProfile ? 'Yes' : 'No') },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div>
                    <Button type="primary" onClick={() => acceptUser(record._id)} style={{ marginRight: 8 }}>
                        Accept
                    </Button>
                    <Button type="danger" onClick={() => rejectUser(record._id)} style={{ marginRight: 8 }}>
                        Reject
                    </Button>
                    <Button onClick={() => showDocuments(record._id)}>Show Documents</Button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-center mb-4">User Actions</h2>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id" // Ensure _id is correct
                bordered
            />
        </div>
    );
};

export default PendingUsers;
