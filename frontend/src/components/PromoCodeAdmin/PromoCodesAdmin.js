import React, { useState, useEffect } from "react";
import { Table, Input, Button, Form, notification, Space } from "antd";
import "antd/dist/reset.css";
import { createPromoCode, getPromoCodes } from "../../api/promoCode.ts";


const PromoCodesAdmin = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [details, setDetails] = useState(false);

    // Fetch promo codes on component mount
    const fetchPromoCodes = async () => {
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
            });
        }
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    // Handle creating a new promo code
    const handleCreatePromoCode = async (values) => {
        setDetails({
            discount: values.discount,
            expiryDate: values.expiryDate,
            usageLimit: values.usageLimit,
        });
        setLoading(true);
        try {
            const response = await createPromoCode(details);
            notification.success({
                message: "Promo Code Created",
                description: response.data.message || "The promo code was created successfully.",
            });
            setCreating(false);
            fetchPromoCodes(); // Refresh the list
        } catch (error) {
            notification.error({
                message: "Error",
                description: error.response?.data?.message || "Failed to create the promo code.",
            });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Promo code",
            dataIndex: "code",
            key: "promo",
        },
        {
            title: "Discount (%)",
            dataIndex: "discount",
            key: "discount",
        },
        {
            title: "Expiry Date",
            dataIndex: "expiryDate",
            key: "expiryDate",
        },
        {
            title: "Usage Limit",
            dataIndex: "usageLimit",
            key: "usageLimit",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className=" p-8 rounded shadow-lg bg-white w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Promo Codes</h2>

                <button
            className="mb-4 text-second hover:underline"
            onClick={() => window.history.back()}
          >
            <span className=" text-2xl">←</span>Go back
          </button>
                <Table
                    columns={columns}
                    dataSource={promoCodes}
                    rowKey={(record) => record.id}
                    pagination={{ pageSize: 10 }}
                />

                
                <div className="mt-6 flex justify-center">
                    <Button type="danger" onClick={() => setCreating(!creating)}
                        className="bg-second text-white hover:bg-third"
                        >
                        {creating ? "Cancel" : "Create Promo Code"}
                    </Button>
                </div>

                
                {creating && (
                    <Form
                        layout="vertical"
                        onFinish={handleCreatePromoCode}
                        className="mt-6"
                    >
                        <Form.Item
                            label="Discount (%)"
                            name="discount"
                            rules={[
                                { required: true, message: "Please input the discount!" },
                            ]}
                        >
                            <Input type="number" placeholder="Enter discount" />
                        </Form.Item>

                        <Form.Item
                            label="Expiry Date"
                            name="expiryDate"
                            rules={[{ required: true, message: "Please input the expiry date!" }]}
                        >
                            <Input type="date" placeholder="Select expiry date" />
                        </Form.Item>

                        <Form.Item
                            label="Usage Limit"
                            name="usageLimit"
                            rules={[
                                { required: true, message: "Please input the usage limit!" },
                            ]}
                        >
                            <Input type="number" placeholder="Enter usage limit" />
                        </Form.Item>

                        <Space className="flex justify-end">
                            <Button onClick={() => setCreating(false)}
                            type="danger"
                                className=" text-first hover:bg-fourth"
                                >Cancel</Button>
                            <Button
                                type="danger"
                                htmlType="submit"
                                loading={loading}
                                className="bg-second text-white hover:bg-third"
                            >
                                Create
                            </Button>
                        </Space>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default PromoCodesAdmin;
