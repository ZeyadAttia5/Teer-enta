import React, { useState, useEffect } from 'react';
import {
    Form,
    Select,
    Button,
    Card,
    Table,
    Modal,
    Input,
    Typography,
    Divider,
    message,
    Radio,
    Space,
    Spin,
    Badge,
    Image,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    EnvironmentOutlined,
    ShoppingCartOutlined,
    WalletOutlined,
    CreditCardOutlined,
    TagOutlined,
    ShoppingOutlined,
    CheckCircleOutlined,
    InfoCircleOutlined, MoneyCollectOutlined
} from '@ant-design/icons';
import { checkout, getCartDetails } from "../../api/order.ts";
import { addAddress, getAllAddresses, getMyCurrency } from "../../api/profile.ts";
import { applyPromoCode } from "../../api/promoCode.ts";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../shared/CheckoutForm";
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
    // State Management
    const [form] = Form.useForm();
    const [addresses, setAddresses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [currency, setCurrency] = useState(null);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoCode, setPromoCode] = useState('');
    const [applyingPromo, setApplyingPromo] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const [paymentSucceed, setPaymentSucceed] = useState(false);
    // Initial Data Loading
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setPageLoading(true);
            const [cartResponse, addressesResponse, currencyResponse] = await Promise.all([
                getCartDetails(),
                getAllAddresses(),
                getMyCurrency()
            ]);

            setCartItems(cartResponse.data.cart || []);
            setTotalPrice(cartResponse.data.totalPrice || 0);
            setAddresses(addressesResponse.data.addresses || []);
            setCurrency(currencyResponse.data);
        } catch (error) {
            message.warning(error.response.data.message||'Failed to load checkout data');
            console.error('Checkout data loading error:', error);
        } finally {
            setPageLoading(false);
        }
    };

    // Promo Code Handling
    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            message.warning("Please enter a promo code");
            return;
        }

        setApplyingPromo(true);
        try {
            const response = await applyPromoCode(promoCode);
            setPromoDiscount(response.data.promoCode);
            message.success({
                content: "Promo code applied successfully!",
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
            });
        } catch (error) {
            message.warning({
                content: error.response?.data?.message || "Failed to apply promo code",
                icon: <InfoCircleOutlined style={{ color: '#ff4d4f' }} />
            });
        } finally {
            setApplyingPromo(false);
        }
    };

    // Price Calculations
    const calculateFinalPrice = (price) => {
        if (!price) return 0;
        // Only apply currency conversion here, not discount
        return (price * (currency?.rate || 1)).toFixed(2);
    };

    const getPriceDisplay = (price) => {
        return `${currency?.code || '$'} ${price}`;
    };

    const formatOrderSummary = () => {
        // Convert the total price to current currency
        const subtotal = calculateFinalPrice(totalPrice);
        // Calculate discount amount in current currency
        const discount = promoDiscount ? (parseFloat(subtotal) * promoDiscount / 100).toFixed(2) : 0;
        // Calculate final price by subtracting discount
        const final = (parseFloat(subtotal) - parseFloat(discount)).toFixed(2);

        return {
            subtotal: getPriceDisplay(subtotal),
            discount: getPriceDisplay(discount),
            final: getPriceDisplay(final)
        };
    };

    // Address Management
    const handleAddAddress = async (values) => {
        try {
            setLoading(true);
            await addAddress({ newAddress: values.newAddress });
            message.success({
                content: 'Address added successfully',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
            });
            setIsModalVisible(false);
            form.resetFields(['newAddress']);
            const response = await getAllAddresses();
            setAddresses(response.data.addresses || []);
        } catch (error) {
            message.warning('Failed to add address');
            console.error('Address addition error:', error);
        } finally {
            setLoading(false);
        }
    };
    // Payment Handling
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
        // Reset stripe form if payment method changes
        if (e.target.value !== 'Card') {
            form.setFieldsValue({ stripeToken: null });
        }
    };

    const handleSubmitOrder = async (values) => {
        if (!values.deliveryAddress) {
            message.warning("Please select a delivery address");
            return;
        }
        try {
            setLoading(true);
            const orderData = {
                deliveryAddress: values.deliveryAddress,
                paymentMethod: values.paymentMethod,
                promoCode: promoCode || undefined
            };

            const response = await checkout(orderData);

            message.success({
                content: 'Order placed successfully!',
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
            });

            // Reset form and fetch updated cart
            form.resetFields();
            setPromoCode('');
            setSelectedDate(null);
            navigate(`/products`);

        } catch (error) {
            message.warning({
                content: error.response?.data?.message || 'Failed to place order',
                icon: <InfoCircleOutlined style={{ color: '#ff4d4f' }} />
            });
            console.error('Order submission error:', error);
        } finally {
            setLoading(false);
        }
    };

// Table Configuration
    const tableColumns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, record) => (
                <div className="flex items-center gap-4">
                    <Image
                        src={record.product.imageUrl}
                        alt={record.product.name}
                        className="rounded-lg object-cover"
                        width={60}
                        height={60}
                        fallback="data:image/png;base64,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"
                        preview={false}
                    />
                    <div className="flex flex-col">
                        <Text strong className="text-base mb-1">
                            {record.product.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            SKU: {record.product._id.slice(-6)}
                        </Text>
                        {record.product.description && (
                            <Text className="text-sm text-gray-500 mt-1">
                                {record.product.description}
                            </Text>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            render: (quantity) => (
                <Badge
                    count={quantity}
                    showZero
                    color="#1890ff"
                    className="text-base"
                    style={{ backgroundColor: '#1890ff' }}
                />
            )
        },
        {
            title: 'Unit Price',
            dataIndex: ['product', 'price'],
            key: 'price',
            width: 150,
            render: (price) => (
                <Tooltip title={`${currency?.code || '$'} ${(price * (currency?.rate || 1)).toFixed(2)}`}>
                    <Text strong className="text-lg">
                        {getPriceDisplay(price)}
                    </Text>
                </Tooltip>
            )
        },
        {
            title: 'Total',
            key: 'total',
            width: 150,
            render: (_, record) => {
                const total = record.quantity * record.product.price;
                return (
                    <Tooltip title={`${record.quantity} × ${getPriceDisplay(record.product.price)}`}>
                        <Text strong className="text-lg text-blue-600">
                            {getPriceDisplay(total)}
                        </Text>
                    </Tooltip>
                );
            }
        }
    ];

if (pageLoading) {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <Spin size="large" tip={
                <span className="mt-2 text-blue-600">Loading checkout...</span>
            } />
        </div>
    );
}

const orderSummary = formatOrderSummary();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Form
                form={form}
                onFinish={handleSubmitOrder}
                initialValues={{ paymentMethod: 'wallet' }}
                className="w-full"
                layout="vertical"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <Title level={2} className="text-blue-900 mb-2">
                            <ShoppingOutlined className="mr-3" />
                            Checkout
                        </Title>
                        {currency && (
                            <Text className="text-blue-600">
                                Prices shown in {currency.code} 
                            </Text>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Left Side */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items Card */}
                            <Card
                                className="shadow-lg rounded-xl border-0 hover:shadow-xl transition-shadow duration-300"
                                title={
                                    <div className="flex items-center text-blue-900 py-1">
                                        <ShoppingCartOutlined className="text-xl mr-2" />
                                        <span className="text-lg font-semibold">Order Items</span>
                                    </div>
                                }
                                headStyle={{ borderBottom: '2px solid #4338ca' }}
                                bodyStyle={{ backgroundColor: '#fafafa' }}
                            >
                                <Table
                                    columns={tableColumns}
                                    dataSource={cartItems}
                                    pagination={false}
                                    rowKey={(record) => record.product._id}
                                    className="custom-table"
                                    locale={{
                                        emptyText: (
                                            <div className="py-8 text-center text-blue-500">
                                                <ShoppingCartOutlined style={{ fontSize: '2rem' }} />
                                                <div className="mt-2">Your cart is empty</div>
                                            </div>
                                        )
                                    }}
                                />
                            </Card>

                            {/* Delivery Address Card */}
                            <Card
                                className="shadow-lg rounded-xl border-0 hover:shadow-xl transition-shadow duration-300"
                                title={
                                    <div className="flex items-center text-blue-900 py-1">
                                        <EnvironmentOutlined className="text-xl mr-2" />
                                        <span className="text-lg font-semibold">Delivery Address</span>
                                    </div>
                                }
                                headStyle={{ borderBottom: '2px solid #4338ca' }}
                                bodyStyle={{ backgroundColor: '#fafafa' }}
                            >
                                <Form.Item
                                    name="deliveryAddress"
                                    rules={[{ required: true, message: 'Please select a delivery address' }]}
                                >
                                    <Select
                                        size="large"
                                        placeholder="Select delivery address"
                                        className="w-full"
                                        bordered={false}
                                        // defaultValue={addresses[0]}
                                        // defaultOpen={true}
                                        notFoundContent={
                                            <div className="text-center py-4 text-blue-500">
                                                No addresses Added
                                            </div>
                                        }
                                        style={{ background: 'white' }}
                                    >
                                        {addresses.map((address, index) => (
                                            <Option key={index} value={address}>
                                                <div className="flex items-center py-2">
                                                    <EnvironmentOutlined className="text-blue-600 mr-2" />
                                                    <span className="text-blue-900">{address}</span>
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Button
                                    type="dashed"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsModalVisible(true)}
                                    size="large"
                                    className="w-full border-blue-400 text-blue-600 hover:text-blue-700
                                         hover:border-blue-500 bg-white"
                                >
                                    Add New Address
                                </Button>
                            </Card>

                            {/* Payment Method Card */}
                            <Card
                                className="shadow-lg rounded-xl border-0 hover:shadow-xl transition-shadow duration-300"
                                title={
                                    <div className="flex items-center text-blue-900 py-1">
                                        <CreditCardOutlined className="text-xl mr-2" />
                                        <span className="text-lg font-semibold">Payment Method</span>
                                    </div>
                                }
                                headStyle={{ borderBottom: '2px solid #4338ca' }}
                                bodyStyle={{ backgroundColor: '#fafafa' }}
                            >
                                {/* Promo Code Section */}
                                <div className="mb-6">
                                    <Text strong className="block mb-2 text-blue-900">Promo Code</Text>
                                    <Input.Group compact>
                                        <div className="flex w-full gap-2">
                                            <Input
                                                placeholder="Enter promo code"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                className="h-10 flex-1"
                                                prefix={<TagOutlined className="text-blue-400"/>}
                                            />
                                            <Button
                                                type="danger"
                                                onClick={handleApplyPromo}
                                                loading={applyingPromo}
                                                className="bg-second hover:bg-gray-600 text-white h-10 w-24"
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    </Input.Group>
                                </div>

                                <Form.Item
                                    name="paymentMethod"
                                    rules={[{required: true, message: 'Please select a payment method'}]}
                                >
                                    <Radio.Group onChange={handlePaymentMethodChange} className="w-full">
                                        <Space direction="vertical" className="w-full">
                                        <Radio.Button value="cash_on_delivery" className="h-16 w-full bg-white hover:bg-blue-50">
                                                <div className="flex items-center h-full">
                                                    <MoneyCollectOutlined className="text-xl text-blue-600 mr-3" />
                                                    <div>
                                                        <div className="font-semibold text-blue-900">
                                                            Cash on Delivery
                                                        </div>
                                                        <div className="text-sm text-blue-500">
                                                            Pay when you receive your order
                                                        </div>
                                                    </div>
                                                </div>
                                            </Radio.Button>
                                            <Radio.Button value="wallet"
                                                          className="h-16 w-full bg-white hover:bg-blue-50">
                                                <div className="flex items-center h-full">
                                                    <WalletOutlined className="text-xl text-blue-600 mr-3" />
                                                    <div>
                                                        <div className="font-semibold text-blue-900">
                                                            Wallet Balance
                                                        </div>
                                                        <div className="text-sm text-blue-500">
                                                            Pay using your wallet balance
                                                        </div>
                                                    </div>
                                                </div>
                                            </Radio.Button>
                                            <Radio.Button value="Card"
                                                          className="h-16 w-full bg-white hover:bg-blue-50">
                                                <div className="flex items-center h-full">
                                                    <CreditCardOutlined className="text-xl text-blue-600 mr-3" />
                                                    <div>
                                                        <div className="font-semibold text-blue-900">
                                                            Credit/Debit Card
                                                        </div>
                                                        <div className="text-sm text-blue-500">
                                                            Pay using your card
                                                        </div>
                                                    </div>
                                                </div>
                                            </Radio.Button>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                {paymentMethod === "Card" && (
                                    <div className="mt-6 p-4 bg-white rounded-lg border border-blue-100">
                                        <Elements stripe={stripePromise}>
                                            <CheckoutForm
                                                amount={totalPrice}
                                                code={currency?.code}
                                                withPayButton={true}
                                                discountedAmount={calculateFinalPrice(currency?.rate *totalPrice)}
                                                onPaymentSuccess={() => setPaymentSucceed(true)}
                                                onError={() => setPaymentSucceed(false)}
                                            />
                                        </Elements>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Order Summary - Right Side */}
                        <div className="lg:col-span-1">
                            <Card
                                className="shadow-lg rounded-xl border-0 sticky top-6 hover:shadow-xl transition-shadow duration-300"
                                title={
                                    <div className="flex items-center text-blue-900 py-1">
                                        <TagOutlined className="text-xl mr-2" />
                                        <span className="text-lg font-semibold">Order Summary</span>
                                    </div>
                                }
                                headStyle={{ borderBottom: '2px solid #4338ca' }}
                                bodyStyle={{ backgroundColor: '#fafafa' }}
                            >
                                <div className="space-y-6">
                                    {/* Price Breakdown */}
                                    <div className="space-y-4 bg-white p-4 rounded-lg">
                                        <div className="flex justify-between text-blue-900">
                                            <Text>Subtotal</Text>
                                            <Text strong>{orderSummary.subtotal}</Text>
                                        </div>
                                        {promoDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <Text>Discount ({promoDiscount}%)</Text>
                                                <Text strong>-{orderSummary.discount}</Text>
                                            </div>
                                        )}
                                        <Divider className="my-3 border-blue-100" />
                                        <div className="flex justify-between">
                                            <Text strong className="text-lg text-blue-900">Total</Text>
                                            <Text strong className="text-lg text-blue-600">
                                                {orderSummary.final}
                                            </Text>
                                        </div>
                                    </div>

                                    {/* Place Order Button */}
                                    <Button
                                        type="danger"
                                        size="large"
                                        htmlType="submit"
                                        loading={loading}
                                        disabled={cartItems.length === 0 || (paymentMethod === "Card" && !paymentSucceed)}
                                        className={`
                                            w-full 
                                            h-12 
                                            font-medium 
                                            transition-all 
                                            duration-200
                                            ${cartItems.length === 0 || (paymentMethod === "Card" && !paymentSucceed)
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                            : 'bg-blue-950 hover:bg-black text-white'
                                            }
                                        `}
                                    >
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </Button>

                                    {cartItems.length === 0 && (
                                        <div className="text-center text-blue-500 text-sm">
                                            Add items to your cart to proceed
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Form>

            {/* Add Address Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-2 text-blue-900">
                        <PlusOutlined />
                        <span className="text-lg font-semibold">Add New Address</span>
                    </div>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                className="custom-modal"
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddAddress}
                    className="pt-4"
                >
                    <Form.Item
                        name="newAddress"
                        label="Delivery Address"
                        rules={[
                            { required: true, message: 'Please enter your address' }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Enter your complete delivery address"
                            rows={4}
                            className="text-base"
                        />
                    </Form.Item>
                    <Form.Item className="mb-0 flex justify-end gap-2">
                        <Button onClick={() => setIsModalVisible(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                        >
                            Add Address
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Custom Styles */}
            <style jsx global>{`
            .ant-table {
                background: transparent;
            }

            .custom-table .ant-table-thead > tr > th {
                background-color: #f8fafc;
                color: #4338ca;
                font-weight: 600;
            }
            
            .custom-table .ant-table-tbody > tr:hover > td {
                background-color: #eef2ff;
            }

            .custom-modal .ant-modal-content {
                border-radius: 12px;
                overflow: hidden;
            }

            .ant-select-item-option-selected {
                background-color: #eef2ff !important;
                color: #4338ca !important;
            }

            .ant-radio-button-wrapper-checked {
                background-color: #eef2ff !important;
                border-color: #4338ca !important;
            }

            .ant-badge-count {
                background: #4338ca;
            }

            .ant-divider {
                border-color: #e0e7ff;
            }

            .ant-btn-primary:not([disabled]) {
                background: #4338ca;
            }

            .ant-btn-primary:not([disabled]):hover {
                background: #3730a3;
            }

            .ant-input-affix-wrapper:focus,
            .ant-input-affix-wrapper-focused {
                border-color: #4338ca;
                box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2);
            }

            .ant-select-focused .ant-select-selector {
                border-color: #4338ca !important;
                box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2) !important;
            }

            .ant-input:focus,
            .ant-input-focused {
                border-color: #4338ca;
                box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.2);
            }

            .ant-radio-button-wrapper:hover {
                color: #4338ca;
            }

            .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
                border-color: #4338ca;
            }
            
            .ant-btn-dashed:hover {
                border-color: #4338ca;
                color: #4338ca;
            }

            .ant-card {
                transition: all 0.3s ease;
            }

            .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child {
                border-color: #4338ca;
            }

            .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
                color: #4338ca;
                border-color: #4338ca;
            }

            .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
                background-color: #4338ca !important;
            }
        `}</style>
        </div>
    );
};

export default CheckoutPage