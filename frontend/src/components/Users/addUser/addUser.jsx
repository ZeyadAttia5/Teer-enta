import React, { useState } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import {addUser} from "../../../api/account.ts";

const { Option } = Select;

const AddUser = ({setFlag}) => {
    setFlag(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // Handle form submission
    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Sending the form data to the backend endpoint
            // console.log(values);
            const response = await addUser(values);
            message.success('User registered successfully');
            form.resetFields();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to register user';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Register User</h2>
            <Form
                form={form}
                name="userForm"
                layout="vertical"
                onFinish={onFinish}
            >
                {/* Username Input */}
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                        { required: true, message: 'Please enter your username' },
                    ]}
                >
                    <Input placeholder="Enter your username" className="rounded-md" />
                </Form.Item>

                {/* Password Input */}
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please enter your password' },
                    ]}
                >
                    <Input.Password placeholder="Enter your password" className="rounded-md" />
                </Form.Item>

                {/* Role Dropdown */}
                <Form.Item
                    name="userRole"
                    label="Role"
                    rules={[{ required: true, message: 'Please select a role' }]}
                >
                    <Select placeholder="Select a role" className="rounded-md">
                        <Option value="Admin">Admin</Option>
                        <Option value="TourismGovernor">Tourism Governor</Option>
                    </Select>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block className="bg-blue-500 hover:bg-blue-600 rounded-md">
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddUser;
