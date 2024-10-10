import React, { useEffect, useState } from 'react';
import { Table, Spin, message, Button, Popconfirm } from 'antd';
import axios from 'axios';
import {getUsers,deleteUser} from "../../../api/user.ts";

const AllUsers = ({setFlag}) => {
    setFlag(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    const Url = process.env.REACT_APP_BACKEND_URL;

    // Fetch users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                message.error('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Function to delete a user
    const deleteUserr = async (id) => {
        try {
            await deleteUser(id);
            message.success('User deleted successfully');
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    // Define table columns
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'userRole',
            key: 'userRole',
        },
        {
            title: 'Has Profile',
            dataIndex: 'hasProfile',
            key: 'hasProfile',
            render: (hasProfile) => (hasProfile ? 'Yes' : 'No'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this user?"
                    onConfirm={() => deleteUserr(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    // Display loading spinner if data is still loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold text-center mb-4">User Table</h2>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                bordered
            />
        </div>
    );
};

export default AllUsers;
