import React, { useState, useEffect } from "react";
import {
    Table,
    Input,
    Button,
    Form,
    notification,
    ConfigProvider,
    DatePicker,
    Modal,
    Spin, InputNumber
} from "antd";
import {
    ArrowLeftOutlined,
    PlusOutlined,
    GiftOutlined,
    CalendarOutlined,
    PercentageOutlined,
    TeamOutlined, UserOutlined
} from '@ant-design/icons';
import { createPromoCode, getPromoCodes } from "../../api/promoCode.ts";
import dayjs from 'dayjs';
import Title from "antd/es/skeleton/Title";
import {IconsManifest} from "react-icons";
import {TagsIcon} from "lucide-react";

const PromoCodesAdmin = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchPromoCodes = async () => {
        setLoading(true);
        try {
            const response = await getPromoCodes();
            const formattedPromoCodes = response.data.promoCodes.map((promoCode) => ({
                ...promoCode,
                expiryDate: new Date(promoCode.expiryDate).toLocaleDateString(),
            }));
            setPromoCodes(formattedPromoCodes);
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "Failed to fetch promo codes.",
                className: "bg-white shadow-lg",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const handleCreatePromoCode = async (values) => {
        setSubmitting(true);
        try {
            const formattedData = {
                discount: parseInt(values.discount),
                usageLimit: parseInt(values.usageLimit),
                expiryDate: values.expiryDate.format('YYYY-MM-DD'),
            };

            await createPromoCode(formattedData);

            notification.success({
                message: "Success",
                description: "Promo code created successfully",
                className: "bg-white shadow-lg",
            });

            setModalVisible(false);
            form.resetFields();
            fetchPromoCodes();
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "Failed to create promo code",
                className: "bg-white shadow-lg",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: "Promo Code",
            dataIndex: "code",
            key: "promo",
            render: (text) => (
                <div className="flex items-center">
                    <GiftOutlined className="mr-2 text-[#1C325B]" />
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            render: (value) => (
                <div className="flex items-center">
                    <PercentageOutlined className="mr-2 text-emerald-500" />
                    <span className="text-emerald-600 font-medium">{value}%</span>
                </div>
            ),
        },
        {
            title: "Expiry Date",
            dataIndex: "expiryDate",
            key: "expiryDate",
            render: (date) => (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-[#1C325B]" />
                    <span>{date}</span>
                </div>
            ),
        },
        {
            title: "Usage Limit",
            dataIndex: "usageLimit",
            key: "usageLimit",
            render: (limit) => (
                <div className="flex items-center">
                    <TeamOutlined className="mr-2 text-[#1C325B]" />
                    <span>{limit} uses</span>
                </div>
            ),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#1C325B",
                },
            }}
        >
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-200 ">
                            <div
                                className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                                {/* Header Section */}
                                <div>
                                    <div className="flex items-center gap-1 mb-2">
                                        <GiftOutlined className="text-xl flex-shrink-0"/>
                                        <h3 className="m-0 text-lg font-semibold" style={{color: "white"}}>
                                            Promo Code Management
                                        </h3>
                                    </div>
                                    <p className="text-gray-200 mt-2 mb-0 opacity-90">
                                        Manage and monitor promo codes
                                    </p>
                                </div>

                                {/* Action Button */}
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined/>}
                                    onClick={() => setModalVisible(true)}
                                    className="bg-[#2A4575] hover:bg-[#2A4575]/90 border-none"
                                    size="large"
                                >
                                    Create Promo Code
                                </Button>
                            </div>
                        </div>


                        {/* Table Section */}
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Spin size="large"/>
                                </div>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={promoCodes}
                                    rowKey={(record) => record._id}
                                    pagination={{
                                        pageSize: 10,
                                        showTotal: (total) => `Total ${total} promo codes`,
                                    }}
                                    className="border border-gray-200 rounded-lg"
                                    rowClassName="hover:bg-[#1C325B]/5"
                                    locale={{
                                        emptyText: (
                                            <div className="py-8 text-center text-gray-500">
                                                No promo codes found
                                            </div>
                                        ),
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Promo Code Modal */}
                <Modal
                    title={
                        <div className="text-lg font-semibold text-[#1C325B]">
                            Create New Promo Code
                        </div>
                    }
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        form.resetFields();
                    }}
                    footer={null}
                    className="top-8"
                    maskClosable={!submitting}
                    closable={!submitting}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleCreatePromoCode}
                        className="mt-4"
                    >
                        <Form.Item
                            label="Discount Percentage"
                            name="discount"
                        >
                            <InputNumber
                                placeholder="Enter discount percentage"
                                min={1}
                                max={100}
                                prefix={<PercentageOutlined className="text-gray-400" />}
                                className="h-10 w-full"
                                disabled={submitting}
                                formatter={value => `${value}`}
                                parser={value => value.replace('%', '')}
                                required
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Expiry Date"
                            name="expiryDate"
                            rules={[{ required: true, message: "Please select the expiry date!" }]}
                        >
                            <DatePicker
                                className="w-full h-10"
                                placeholder="Select expiry date"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                disabled={submitting}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Usage Limit"
                            name="usageLimit"
                        >
                            <InputNumber
                                min={1}
                                max={100}
                                prefix={<TeamOutlined className="text-gray-400" />}
                                placeholder="Enter usage limit"
                                className="h-10 w-full"
                                disabled={submitting}
                                formatter={value => `${value}`}
                                parser={value => value.replace(/[^\d]/g, '')}
                                required
                                size="large"
                            />
                        </Form.Item>

                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                onClick={() => {
                                    setModalVisible(false);
                                    form.resetFields();
                                }}
                                disabled={submitting}
                                className="hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                                className="bg-[#1C325B] hover:bg-[#1C325B]/90"
                            >
                                Create Promo Code
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default PromoCodesAdmin;