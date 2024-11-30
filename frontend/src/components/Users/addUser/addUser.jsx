import React, { useState } from 'react';
import {Form, Input, Button, Select, ConfigProvider, notification} from 'antd';
import { UserOutlined, LockOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { addUser } from "../../../api/account.ts";

const { Option } = Select;

const AddUser = ({setFlag}) => {
    setFlag(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await addUser(values);
            notification.success({
                message: 'Success',
                description: 'User registered successfully',
                className: 'bg-white shadow-lg',
            });
            form.resetFields();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'Failed to register user',
                className: 'bg-white shadow-lg',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1C325B",
                },
            }}
        >
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <UsergroupAddOutlined className="text-xl" />
                                <h3 className="m-0 text-lg font-semibold">
                                    Register New User
                                </h3>
                            </div>
                            <p className="text-gray-200 mt-2 mb-0 opacity-90">
                                Add a new administrator or tourism governor
                            </p>
                        </div>

                        {/* Form */}
                        <Form
                            form={form}
                            name="userForm"
                            layout="vertical"
                            onFinish={onFinish}
                            className="mt-6"
                        >
                            <Form.Item
                                name="username"
                                label={
                                    <span className="text-gray-700 font-medium">
                                        Username
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Please enter username' }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400" />}
                                    placeholder="Enter username"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={
                                    <span className="text-gray-700 font-medium">
                                        Password
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Please enter password' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400" />}
                                    placeholder="Enter password"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="userRole"
                                label={
                                    <span className="text-gray-700 font-medium">
                                        User Role
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Please select role' }
                                ]}
                            >
                                <Select
                                    placeholder="Select user role"
                                    size="large"
                                    className="rounded-lg"
                                >
                                    <Option value="Admin">
                                        <div className="flex items-center gap-2">
                                            <UsergroupAddOutlined className="text-[#1C325B]" />
                                            Administrator
                                        </div>
                                    </Option>
                                    <Option value="TourismGovernor">
                                        <div className="flex items-center gap-2">
                                            <UsergroupAddOutlined className="text-emerald-500" />
                                            Tourism Governor
                                        </div>
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item className="mt-8">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    className="w-full h-12 bg-[#1C325B] hover:bg-[#1C325B]/90
                                             rounded-lg text-base font-medium"
                                >
                                    Register User
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default AddUser;