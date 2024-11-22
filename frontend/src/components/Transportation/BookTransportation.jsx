import React, { useEffect, useState } from "react";
import {
    List, Card, Tag, Space, Typography, Avatar, Tooltip, Badge, message, Button, Input
} from "antd";
import {
    CarOutlined, CompassOutlined, DollarOutlined, CalendarOutlined,
    UserOutlined, GlobalOutlined, TagOutlined
} from "@ant-design/icons";
import { applyPromoCode } from "../../api/promoCode.ts";
import dayjs from "dayjs";
import { bookTransportation, getTransportations } from "../../api/transportation.ts";
import { getCurrency } from "../../api/account.ts";
import StaticMap from '../shared/GoogleMaps/ViewLocation.jsx';

const { Text } = Typography;

const getVehicleIcon = (type) => {
    const colors = {
        Car: "#1890ff",
        Scooter: "#52c41a",
        Bus: "#722ed1",
    };
    return (
        <Tag color={colors[type]} icon={<CarOutlined/>}>
            {type}
        </Tag>
    );
};

const TransportationCard = ({ item, currency, onBook }) => {
    const [promoCode, setPromoCode] = useState("");
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [applyingPromo, setApplyingPromo] = useState(false);

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) {
            message.warning("Please enter a promo code");
            return;
        }

        setApplyingPromo(true);
        try {
            const response = await applyPromoCode(promoCode);
            setPromoDiscount(response.data.promoCode);
            message.success("Promo code applied successfully!");
        } catch (error) {
            message.error(error.response?.data?.message || "Failed to apply promo code");
        } finally {
            setApplyingPromo(false);
        }
    };

    const calculateFinalPrice = (price) => {
        const basePrice = price * currency?.rate;
        if (promoDiscount) {
            return (basePrice * (1 - promoDiscount/100)).toFixed(2);
        }
        return basePrice.toFixed(2);
    };

    return (
        <Badge.Ribbon text={item.isActive ? "Active" : "Inactive"} color={item.isActive ? "green" : "red"}>
            <Card
                hoverable
                title={
                    <Space>
                        {getVehicleIcon(item.vehicleType)}
                        <Text strong>{`Trip #${item._id.slice(-6)}`}</Text>
                    </Space>
                }
            >
                <Space direction="vertical" size="middle" style={{width: "100%"}}>
                    <Space>
                        <CompassOutlined/>
                        <Text>Pickup: </Text>
                        <Tooltip title={`${item.pickupLocation.lat}, ${item.pickupLocation.lng}`}>
                            <Tag color="blue">View on map</Tag>
                        </Tooltip>
                    </Space>
                    <StaticMap latitude={item.pickupLocation.lat} longitude={item.pickupLocation.lng}/>

                    <Space>
                        <CompassOutlined/>
                        <Text>Drop-off: </Text>
                        <Tooltip title={`${item.dropOffLocation.lat}, ${item.dropOffLocation.lng}`}>
                            <Tag color="purple">View on map</Tag>
                        </Tooltip>
                    </Space>
                    <StaticMap latitude={item.dropOffLocation.lat} longitude={item.dropOffLocation.lng}/>

                    <div className="border-t pt-4">
                        <Text className="block mb-3">Promo Code</Text>
                        <div className="flex gap-2 mb-4">
                            <Input
                                prefix={<TagOutlined />}
                                value={promoCode}
                                onChange={e => setPromoCode(e.target.value)}
                                placeholder="Enter promo code"
                                className="flex-1"
                            />
                            <Button
                                onClick={handleApplyPromo}
                                loading={applyingPromo}
                                type="primary"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    <Space direction="vertical">
                        <DollarOutlined/>
                        {promoDiscount > 0 && (
                            <Text delete type="secondary">
                                Original: {currency?.code} {(item.price * currency?.rate).toFixed(2)}
                            </Text>
                        )}
                        <Text strong>
                            Final Price: {currency?.code} {calculateFinalPrice(item.price)}
                        </Text>
                        {promoDiscount > 0 && (
                            <Text type="success">Promo discount: {promoDiscount}% off</Text>
                        )}
                    </Space>

                    <Space>
                        <CalendarOutlined/>
                        <Text>{dayjs(item.date).format("MMM D, YYYY")}</Text>
                    </Space>

                    {item.notes && (
                        <Text type="secondary" ellipsis={{tooltip: item.notes}}>
                            Notes: {item.notes}
                        </Text>
                    )}

                    <Card size="small" title="Advertiser Info">
                        <Space align="start">
                            <Avatar src={item.createdBy.logoUrl} icon={<UserOutlined/>}/>
                            <Space direction="vertical" size={0}>
                                <Text strong>Username: {item.createdBy.username ?? 'NA'}</Text>
                                <Text strong>Company: {item.createdBy.companyName ?? 'NA'}</Text>
                                <Text type="secondary" style={{fontSize: "12px"}}>
                                    Industry: {item.createdBy.industry ?? 'NA'}
                                </Text>
                                {item.createdBy.website && (
                                    <Space size={4}>
                                        <GlobalOutlined/>
                                        <a href={item.createdBy.website} target="_blank" rel="noopener noreferrer">
                                            Website
                                        </a>
                                    </Space>
                                )}
                            </Space>
                        </Space>
                    </Card>

                    <Text type="secondary" style={{fontSize: "12px"}}>
                        Created: {dayjs(item.createdAt).format("MMM D, YYYY")}
                    </Text>

                    <Button
                        type="primary"
                        block
                        onClick={() => onBook(item._id, promoCode)}
                    >
                        Book Now
                    </Button>
                </Space>
            </Card>
        </Badge.Ribbon>
    );
};

const BookTransportation = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState(null);

    const fetchTransportation = async () => {
        setLoading(true);
        try {
            const response = await getTransportations();
            setData(response.data);
        } catch (error) {
            message.error("Failed to fetch transportation options");
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrency = async () => {
        try {
            const response = await getCurrency();
            setCurrency(response.data);
        } catch (error) {
            message.error("Failed to fetch currency information");
        }
    };

    useEffect(() => {
        fetchCurrency();
        fetchTransportation();
    }, []);

    const handleBook = async (id, promoCode) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                message.error("Please login to book transportation");
                return;
            }

            await bookTransportation({
                id,
                promoCode
            });
            message.success("Transportation booked successfully");
        } catch (error) {
            message.error(error.response?.data?.message || "Booking failed");
        }
    };

    return (
        <List
            grid={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
            }}
            className="p-2"
            dataSource={data}
            loading={loading}
            renderItem={(item) => (
                <List.Item>
                    <TransportationCard
                        item={item}
                        currency={currency}
                        onBook={handleBook}
                    />
                </List.Item>
            )}
        />
    );
};

export default BookTransportation;