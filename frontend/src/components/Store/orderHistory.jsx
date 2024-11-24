import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Card,
    Table,
    Tag,
    Button,
    Typography,
    Space,
    message,
    Tooltip,
    Modal,
    Empty,
    Spin,
    Input,
    Select,
    Badge,
    Image,
    Statistic
} from 'antd';
import {
    ShoppingOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    DollarOutlined,
    FilterOutlined,
    SearchOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { getOrders, cancelOrder } from '../../api/order.ts';
import { getMyCurrency } from '../../api/profile.ts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [currency, setCurrency] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [ordersResponse, currencyResponse] = await Promise.all([
                getOrders(),
                getMyCurrency()
            ]);

            const sortedOrders = ordersResponse.data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
            setFilteredOrders(sortedOrders);
            setCurrency(currencyResponse.data);
        } catch (error) {
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getPriceDisplay = (price) => {
        if (!price) return '0.00';
        const convertedPrice = price * (currency?.rate || 1);
        return `${currency?.code || '$'} ${convertedPrice.toFixed(2)}`;
    };

    const handleCancelOrder = async (orderId) => {
        confirm({
            title: 'Cancel Order',
            icon: <ExclamationCircleOutlined className="text-indigo-600" />,
            content: 'Are you sure you want to cancel this order? The amount will be refunded to your wallet.',
            okText: 'Yes, Cancel',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    await cancelOrder(orderId);
                    message.success('Order cancelled successfully');
                    fetchInitialData();
                } catch (error) {
                    message.error(error.response?.data?.message || 'Failed to cancel order');
                }
            },
        });
    };

    const handleViewDetails = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': '#3730a3',     // indigo-700
            'Completed': '#059669',   // emerald-600
            'Cancelled': '#dc2626'    // red-600
        };
        return colors[status] || '#6b7280';
    };

    const getBadgeStatus = (status) => {
        const statusMap = {
            'Pending': 'processing',
            'Completed': 'success',
            'Cancelled': 'error'
        };
        return statusMap[status] || 'default';
    };

    const handleSearch = (value) => {
        setSearchText(value);
        applyFilters(value, statusFilter, priceRange);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        applyFilters(searchText, value, priceRange);
    };

    const handlePriceRange = (value) => {
        setPriceRange(value);
        const ranges = {
            'low': { min: 0, max: 100 * (currency?.rate || 1) },
            'medium': { min: 100 * (currency?.rate || 1), max: 500 * (currency?.rate || 1) },
            'high': { min: 500 * (currency?.rate || 1), max: Infinity }
        };
        applyFilters(searchText, statusFilter, value, ranges);
    };

    const applyFilters = (search, status, price, ranges = null) => {
        let filtered = [...orders];

        if (status !== 'all') {
            filtered = filtered.filter(order => order.status === status);
        }

        if (price !== 'all') {
            const priceRanges = ranges || {
                'low': { min: 0, max: 100 * (currency?.rate || 1) },
                'medium': { min: 100 * (currency?.rate || 1), max: 500 * (currency?.rate || 1) },
                'high': { min: 500 * (currency?.rate || 1), max: Infinity }
            };

            filtered = filtered.filter(order => {
                const convertedPrice = order.totalPrice * (currency?.rate || 1);
                return convertedPrice >= priceRanges[price].min &&
                    convertedPrice < priceRanges[price].max;
            });
        }

        if (search) {
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(search.toLowerCase()) ||
                order.products.some(p =>
                    p.product.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        setFilteredOrders(filtered);
    };

    const columns = [
        {
            title: 'Order Details',
            key: 'orderDetails',
            render: (_, order) => (
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                        <Text strong className="text-indigo-900">
                            #{order._id.slice(-6)}
                        </Text>
                        <Badge
                            status={getBadgeStatus(order.status)}
                            text={
                                <Text style={{ color: getStatusColor(order.status) }}>
                                    {order.status}
                                </Text>
                            }
                        />
                    </div>
                    <Text className="text-gray-500">
                        {dayjs(order.createdAt).format('MMM D, YYYY h:mm A')}
                    </Text>
                </div>
            )
        },
        {
            title: 'Products',
            key: 'products',
            render: (_, order) => (
                <div className="space-y-3">
                    {order.products.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                width={50}
                                height={50}
                                className="rounded-md object-cover"
                                fallback="data:image/png;base64,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"
                            />
                            <div>
                                <Text strong className="text-indigo-900">
                                    {item.product.name}
                                </Text>
                                <div className="text-sm text-gray-500">
                                    <Tooltip title={`Original: $${item.price.toFixed(2)}`}>
                                        Quantity: {item.quantity} × {getPriceDisplay(item.price)}
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
        },
        {
            title: 'Delivery Address',
            key: 'address',
            render: (_, order) => (
                <Tooltip title={order.deliveryAddress}>
                    <Text className="text-gray-600 truncate max-w-xs block">
                        {order.deliveryAddress}
                    </Text>
                </Tooltip>
            )
        },
        {
            title: 'Total Amount',
            key: 'total',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (_, order) => (
                <div className="text-right">
                    <Tooltip title={`Original: $${order.totalPrice.toFixed(2)}`}>
                        <Text strong className="text-lg text-indigo-600">
                            {getPriceDisplay(order.totalPrice)}
                        </Text>
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, order) => (
                <Space>
                    {order.status === 'Pending' && (
                        <Button
                            danger
                            onClick={() => handleCancelOrder(order._id)}
                            icon={<CloseCircleOutlined />}
                        >
                            Cancel Order
                        </Button>
                    )}
                    <Button
                        type="link"
                        className="text-indigo-600 hover:text-indigo-800"
                        onClick={() => handleViewDetails(order._id)}
                    >
                        View Details
                    </Button>
                </Space>
            )
        }
    ];

    // Statistics for the dashboard with currency conversion
    const getOrderStats = () => {
        const total = orders.length;
        const pending = orders.filter(o => o.status === 'Pending').length;
        const completed = orders.filter(o => o.status === 'Completed').length;
        const cancelled = orders.filter(o => o.status === 'Cancelled').length;
        const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        const convertedTotalSpent = totalSpent * (currency?.rate || 1);

        return {
            total,
            pending,
            completed,
            cancelled,
            totalSpent: getPriceDisplay(totalSpent)
        };
    };

    const stats = getOrderStats();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Title level={2} className="text-center text-indigo-900 mb-6">
                        <ShoppingOutlined className="mr-3" />
                        Order History
                    </Title>

                    {currency && (
                        <Text className="text-gray-500 block text-center mb-6">
                            Prices shown in {currency.code} (1 USD = {currency.rate} {currency.code})
                        </Text>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <Statistic
                                title="Total Orders"
                                value={stats.total}
                                prefix={<ShoppingCartOutlined className="text-indigo-600" />}
                            />
                        </Card>
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <Statistic
                                title="Pending"
                                value={stats.pending}
                                prefix={<ClockCircleOutlined className="text-indigo-600" />}
                            />
                        </Card>
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <Statistic
                                title="Completed"
                                value={stats.completed}
                                prefix={<CheckCircleOutlined className="text-green-600" />}
                            />
                        </Card>
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <Statistic
                                title="Cancelled"
                                value={stats.cancelled}
                                prefix={<CloseCircleOutlined className="text-red-600" />}
                            />
                        </Card>
                        <Card className="shadow-md hover:shadow-lg transition-shadow">
                            <Tooltip title={`Original price in USD`}>
                                <Statistic
                                    title="Total Spent"
                                    value={stats.totalSpent}
                                    prefix={<DollarOutlined className="text-green-600" />}
                                />
                            </Tooltip>
                        </Card>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                placeholder="Search orders..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                onChange={e => handleSearch(e.target.value)}
                                className="w-full"
                            />
                            <Select
                                defaultValue="all"
                                onChange={handleStatusFilter}
                                className="w-full"
                                placeholder="Filter by Status"
                            >
                                <Option value="all">All Status</Option>
                                <Option value="Pending">Pending</Option>
                                <Option value="Completed">Completed</Option>
                                <Option value="Cancelled">Cancelled</Option>
                            </Select>
                            <Select
                                defaultValue="all"
                                onChange={handlePriceRange}
                                className="w-full"
                                placeholder="Filter by Price"
                            >
                                <Option value="all">All Prices</Option>
                                <Option value="low">
                                    {currency ? `${currency.code} 0 - ${getPriceDisplay(100)}` : '$0 - $100'}
                                </Option>
                                <Option value="medium">
                                    {currency ? `${getPriceDisplay(100)} - ${getPriceDisplay(500)}` : '$100 - $500'}
                                </Option>
                                <Option value="high">
                                    {currency ? `${getPriceDisplay(500)}+` : '$500+'}
                                </Option>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <Card className="shadow-lg rounded-lg">
                    <Table
                        columns={columns}
                        dataSource={filteredOrders}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} orders`,
                            showSizeChanger: true,
                            showQuickJumper: true
                        }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <Text className="text-gray-500">
                                            No orders found
                                        </Text>
                                    }
                                />
                            )
                        }}
                        className="custom-table"
                    />
                </Card>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                .custom-table .ant-table-thead > tr > th {
                    background-color: #f8fafc;
                    color: #312e81;
                    font-weight: 600;
                }
                
                .custom-table .ant-table-tbody > tr:hover > td {
                    background-color: #eef2ff;
                }

                .ant-statistic-title {
                    color: #6366f1;
                }

                .ant-statistic-content {
                    color: #312e81;
                }

                .ant-select-focused .ant-select-selector {
                    border-color: #6366f1 !important;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
                }

                .ant-input:focus, 
                .ant-input-focused {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                }

                .ant-btn-dangerous {
                    background: #fee2e2;
                    border-color: #ef4444;
                    color: #ef4444;
                }

                .ant-btn-dangerous:hover {
                    background: #fecaca;
                    border-color: #dc2626;
                    color: #dc2626;
                }

                .ant-pagination-item-active {
                    border-color: #6366f1;
                }

                .ant-pagination-item-active a {
                    color: #6366f1;
                }

                .ant-tooltip {
                    max-width: 300px;
                }

                .ant-table-cell {
                    vertical-align: top;
                }
            `}</style>
        </div>
    );
};

export default OrderHistory;