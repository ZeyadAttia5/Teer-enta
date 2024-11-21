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
        <Badge.Ribbon
          text={item.isActive ? "Active" : "Inactive"}
          color={item.isActive ? "green" : "red"}
        >
            
          <Card
            hoverable
            title={
              <Space>
                {getVehicleIcon(item.vehicleType)}
                <Text strong className="text-first">
                  {`Trip #${item._id.slice(-6)}`}
                </Text>
              </Space>
            }
          >
            {/* Trip Date */}
            <Space>
                <CalendarOutlined />
                <Text className="text-first">
                  {dayjs(item.date).format("MMM D, YYYY")}
                </Text>
              </Space>

            <Space direction="vertical" size="large" className="w-full">
              {/* Pickup and Drop-Off Locations */}
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {/* Pickup Location */}
                  <div className="flex items-center gap-2 text-first">
                    <CompassOutlined />
                    <Text>Pickup:</Text>
                    <Tooltip title="View Pickup Location on Map">
                      <a
                        href={`https://maps.google.com/?q=${item.pickupLocation.lat},${item.pickupLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-second hover:underline"
                      >
                        View on map
                      </a>
                    </Tooltip>
                  </div>
                  {/* Drop-Off Location */}
                  <div className="flex items-center gap-2 text-first">
                    
                    <Text>Drop-off:</Text>
                    <Tooltip title="View Drop-off Location on Map">
                      <a
                        href={`https://maps.google.com/?q=${item.dropOffLocation.lat},${item.dropOffLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-second hover:underline"
                      >
                        View on map
                      </a>
                    </Tooltip>
                  </div>
                </div>
              </div>
      
              

              {/* Promo Code Section */}
              <div className="border-t border-gray-200 pt-4">
  {/* Notes */}
  {item.notes && (
    <Text type="secondary" ellipsis={{ tooltip: item.notes }} className="text-third mb-4">
      Notes: {item.notes}
    </Text>
  )}

  {/* Promo Code Section */}
  <div className="flex gap-2 mb-4">
    <Input
      prefix={<TagOutlined />}
      value={promoCode}
      onChange={(e) => setPromoCode(e.target.value)}
      placeholder="Enter promo code"
      className="flex-1"
    />
    <Button
      onClick={handleApplyPromo}
      loading={applyingPromo}
      type="primary"
      className="bg-second hover:bg-first border-second hover:border-first"
    >
      Apply
    </Button>
  </div>
</div>

      
              {/* Pricing Information */}
              <Space direction="vertical" size="small">
                <div className="flex items-center gap-2 text-first text-2xl">
                  <DollarOutlined />
                  {promoDiscount > 0 && (
                    <Text delete type="secondary" className="text-third">
                      Original: {currency?.code}{" "}
                      {(item.price * currency?.rate).toFixed(2)}
                    </Text>
                  )}
                </div>
                <Text strong className="text-xl text-first">
                  Final Price: {currency?.code} {calculateFinalPrice(item.price)}
                </Text>
                {promoDiscount > 0 && (
                  <Text type="success" className="text-first">
                    Promo discount: {promoDiscount}% off
                  </Text>
                )}
              </Space>
      

      {/* Book Now Button */}
              <Button
                type="primary"
                block
                onClick={() => onBook(item._id, promoCode)}
                className="bg-second border-second hover:bg-first hover:border-first"
              >
                Book Now
              </Button>

              {/* Advertiser Info */}
              <Card size="small" title="Advertiser Info" className="mt-4 bg-fourth">
                <Space align="start">
                  <Avatar src={item.createdBy.logoUrl} icon={<UserOutlined />} />
                  <Space direction="vertical" size={0}>
                    <Text strong className="text-first">
                      Username: {item.createdBy.username ?? "NA"}
                    </Text>
                    <Text strong className="text-first">
                      Company: {item.createdBy.companyName ?? "NA"}
                    </Text>
                    <Text type="secondary" className="text-sm text-third">
                      Industry: {item.createdBy.industry ?? "NA"}
                    </Text>
                    {item.createdBy.website && (
                      <Space size={4}>
                        <GlobalOutlined />
                        <a
                          href={item.createdBy.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-second hover:underline"
                        >
                          Website
                        </a>
                      </Space>
                    )}
                  </Space>
                </Space>
              </Card>
      
              {/* Created Date */}
              <Text type="secondary" className="text-sm text-third">
                Created at: {dayjs(item.createdAt).format("MMM D, YYYY")}
              </Text>
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
                <List.Item style={{ marginLeft: '20px' , marginBottom: '20px'}}>
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