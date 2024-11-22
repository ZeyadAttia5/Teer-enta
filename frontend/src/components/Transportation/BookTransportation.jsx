import React, { useEffect, useState } from "react";
import {
    List, Card, Tag, Space, Typography, Avatar, Tooltip, Badge, message, Button, Input
} from "antd";
import {
    CarOutlined ,CompassOutlined, DollarOutlined, CalendarOutlined,
    UserOutlined, GlobalOutlined, TagOutlined, ArrowRightOutlined 
} from "@ant-design/icons";
import { applyPromoCode } from "../../api/promoCode.ts";
import dayjs from "dayjs";
import { bookTransportation, getTransportations } from "../../api/transportation.ts";
import { getCurrency } from "../../api/account.ts";
import StaticMap from '../shared/GoogleMaps/ViewLocation.jsx';

const { Text } = Typography;

const getVehicleIcon = (type) => {
    const colors = {
        Car: "#526D82",
        Scooter: "#526D82",
        Bus: "#526D82",
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
const [showAdvertiserInfo, setShowAdvertiserInfo] = useState(false);
const [pickupAddress, setPickupAddress] = useState(null);
  const [dropOffAddress, setDropOffAddress] = useState(null);

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

    
    useEffect(() => {
      if (item.pickupLocation.lat && item.pickupLocation.lng) {
          const fetchAddress = async (lat, lng) => {
              try {
                  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=REACT_APP_GOOGLE_MAPS_API_KEY`);
                  const data = await response.json();
                  if (data.status === 'OK') {
                      setPickupAddress(data.results[0].formatted_address);
                  }
              } catch (error) {
                  console.error('Error fetching address:', error);
              }
          };
          fetchAddress(item.pickupLocation.lat, item.pickupLocation.lng);
      }
  
      if (item.dropOffLocation.lat && item?.dropOffLocation?.lng) {
          const fetchAddress = async (lat, lng) => {
              try {
                  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=REACT_APP_GOOGLE_MAPS_API_KEY`);
                  const data = await response.json();
                  if (data.status === 'OK') {
                      setDropOffAddress(data.results[0].formatted_address);
                  }
              } catch (error) {
                  console.error('Error fetching address:', error);
              }
          };
          fetchAddress(item.dropOffLocation.lat, item?.dropOffLocation?.lng);
      }
  }, [item?.pickupLocation?.lat, item?.pickupLocation?.lng, item?.dropOffLocation?.lat, item?.dropOffLocation?.lng]);

  
    return (
      
      <Badge.Ribbon
      text={item.isActive ? "Active" : "Inactive"}
      color={item.isActive ? "green" : "red"}
    >
      <Card
        hoverable
        title={
          <Space align="center" size="large"> {/* Space between elements horizontally */}
            <div style={{ color: item.isActive ? "#27374D" : "#526D82" }}>
              {/* Vehicle Icon with color palette */}
              {getVehicleIcon(item.vehicleType)}
            </div>

             <Space size="small" align="center">
              <CalendarOutlined />
              <Text className="text-first">
                {dayjs(item.date).format("MMM D, YYYY")}
              </Text>
            </Space>
            
            <Text strong className="text-first">
              {`Trip #${item._id.slice(-6)}`}
            </Text>
            
           
          </Space>
        }
      >

            <Space direction="vertical" size="large" className="w-full">
              {/* Pickup and Drop-Off Locations */}
              <div className="flex justify-between items-center  ">
                <div className="flex gap-6">
                  {/* Pickup Location */}
                  <div className="flex items-center gap-1 text-first">
                    <CompassOutlined />
                    <Text className="font-bold" >Pickup:</Text>
                    <Tooltip title="View Pickup Location on Map">
                      <a
                        href={`https://maps.google.com/?q=${item.pickupLocation.lat},${item.pickupLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-second hover:text-third hover:underline "
                      >
                        View on map
                      </a>
                    </Tooltip>
                  </div>
                  <ArrowRightOutlined className="text-second" />

                  {/* Drop-Off Location */}
                  <div className="flex items-center gap-1 text-first">
                    
                    <Text className="font-bold">Drop-off:</Text>
                    <Tooltip title="View Drop-off Location on Map">
                      <a
                        href={`https://maps.google.com/?q=${item.dropOffLocation.lat},${item?.dropOffLocation?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-second hover:text-third hover:underline "
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
      className="hover:bg-first bg-second  border-second hover:border-first mb-0"
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
                className="bg-second border-fourth hover:bg-fourth hover:border-first"
              >
                Book Now
              </Button>

              {/* Advertiser Info */}
<Card size="small" title="" className="mt-1 bg-fourth underline mb-0">
  <Space align="start">
    <Avatar src={item.createdBy.logoUrl} icon={<UserOutlined />} />
    {/* Hover Text */}
    <Text
      className="text-second italic hover:cursor-pointer"
      onMouseEnter={() => setShowAdvertiserInfo(true)} // Show info when hovered
      onMouseLeave={() => setShowAdvertiserInfo(false)} // Hide info when mouse leaves
    >
      Advertiser
    </Text>
    {/* Conditional Rendering for Advertiser Info */}
    {showAdvertiserInfo && (
      <Space direction="horizontal" size={12}>
        <Text strong>{`Username: ${item.createdBy.username ?? "NA"}`}</Text>
        <Text strong>{`Company: ${item.createdBy.companyName ?? "NA"}`}</Text>
        <Text type="secondary" className="text-sm text-third">
          {`Industry: ${item.createdBy.industry ?? "NA"}`}
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
    )}
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