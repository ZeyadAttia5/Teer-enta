import React, { useEffect, useState } from "react";
import {
  List,
  Card,
  Tag,
  Space,
  Typography,
  Avatar,
  Tooltip,
  Badge,
  message,
  Button,
  Input,
  Modal,
} from "antd";
import {
  CarOutlined,
  CompassOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  GlobalOutlined,
  TagOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { BusFront } from "lucide-react";
import { ScooterIcon } from "./scooterIcon.jsx";
import { applyPromoCode } from "../../api/promoCode.ts";
import dayjs from "dayjs";
import {
  bookTransportation,
  getTransportations,
} from "../../api/transportation.ts";
import { getCurrency } from "../../api/account.ts";
import StaticMap from "../shared/GoogleMaps/ViewLocation.jsx";
import BookingPayment from "../shared/BookingPayment.jsx";
import LoginConfirmationModal from "../shared/LoginConfirmationModel";

const { Text } = Typography;

const getVehicleIcon = (type) => {
  let icon = <CarOutlined className="w-4 h-4 stroke-white" />;
  switch (type) {
    case "Car":
      icon = <CarOutlined className="w-4 h-4 stroke-white" />;
      break;
    case "Bus":
      icon = <BusFront className="w-4 h-4 stroke-white" />;
      break;
    case "Scooter":
      icon = <ScooterIcon className="stroke-white w-4 h-4" />;
      break;
    default:
      return;
  }

  return (
    <div className="flex items-center gap-2 justify-between text-xs bg-[#526D82] rounded-lg px-1 py-[2px] text-white">
      {icon}
      <span>{type}</span>
    </div>
  );
};

const TransportationCard = ({ item, currency, onBook }) => {
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [showAdvertiserInfo, setShowAdvertiserInfo] = useState(false);
  const [pickupAddress, setPickupAddress] = useState(null);
  const [dropOffAddress, setDropOffAddress] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
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
      message.warning(
        error.response?.data?.message || "Failed to apply promo code"
      );
    } finally {
      setApplyingPromo(false);
    }
  };

  const calculateFinalPrice = (price) => {
    const basePrice = price * currency?.rate;
    if (promoDiscount) {
      return (basePrice * (1 - promoDiscount / 100)).toFixed(2);
    }
    return basePrice.toFixed(2);
  };

  useEffect(() => {
    if (item.pickupLocation.lat && item.pickupLocation.lng) {
      const fetchAddress = async (lat, lng) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.status === "OK") {
            setPickupAddress(
              data.results[1]
                ? data.results[1].formatted_address
                : data.results[0].formatted_address
            );
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };
      fetchAddress(item.pickupLocation.lat, item.pickupLocation.lng);
    }

    if (item.dropOffLocation.lat && item?.dropOffLocation?.lng) {
      const fetchAddress = async (lat, lng) => {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          console.log("data", data);
          if (data.status === "OK") {
            setDropOffAddress(
              data.results[1]
                ? data.results[1].formatted_address
                : data.results[0].formatted_address
            );
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };
      fetchAddress(item.dropOffLocation.lat, item?.dropOffLocation?.lng);
    }
  }, [
    item?.pickupLocation?.lat,
    item?.pickupLocation?.lng,
    item?.dropOffLocation?.lat,
    item?.dropOffLocation?.lng,
  ]);

  const handleBookNow = () => {
    if(!user){
        setIsLoginModalOpen(true);
        return;
    }
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      if(!user){
        setIsLoginModalOpen(true);
        return;
      }
      await onBook(item._id, promoCode);
      setIsModalVisible(false);
    } catch (error) {
      message.warning(error.response?.data?.message || "Booking failed");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  console.log("pickupAddress", pickupAddress);
  console.log("dropOffAddress", dropOffAddress);
  return (
    <div className="">
      <LoginConfirmationModal
          open={isLoginModalOpen}
          setOpen={setIsLoginModalOpen}
          content="Please login to book transportation."
      />
      <Badge.Ribbon
        text={item.isActive ? "Active" : "Inactive"}
        color={item.isActive ? "green" : "red"}
      >
        <Card
          hoverable
          title={
            <Space align="center" size="large">
              {/* Space between elements horizontally */}
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
            <div className="flex justify-between items-center">
              <div className="flex items-center w-full">
                {/* Pickup Location - 50% width */}
                <div className="flex items-center gap-2 text-first w-1/2 pr-2">
                  <CompassOutlined />
                  <Text className="font-bold w-[50px] shrink-0">Pickup:</Text>
                  <Tooltip
                    title={pickupAddress}
                    placement="topLeft"
                    overlayStyle={{ maxWidth: "300px" }}
                  >
                    <Text
                      className="text-second hover:text-third hover:underline cursor-pointer truncate"
                      ellipsis
                    >
                      <a
                        href={`https://maps.google.com/?q=${item.pickupLocation?.lat},${item.pickupLocation?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate"
                      >
                        {pickupAddress ? pickupAddress : "NA"}
                      </a>
                    </Text>
                  </Tooltip>
                </div>

                <ArrowRightOutlined className="text-second" />

                {/* Drop-Off Location - 50% width */}
                <div className="flex items-center gap-2 text-first w-1/2 pl-2">
                  <Text className="font-bold w-[70px] shrink-0">Drop-off:</Text>
                  <Tooltip
                    title={dropOffAddress}
                    placement="topLeft"
                    overlayStyle={{ maxWidth: "300px" }}
                  >
                    <Text
                      className="text-second hover:text-third hover:underline cursor-pointer truncate"
                      ellipsis
                    >
                      <a
                        href={`https://maps.google.com/?q=${item.dropOffLocation?.lat},${item?.dropOffLocation?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate"
                      >
                        {dropOffAddress ? dropOffAddress : "NA"}
                      </a>
                    </Text>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Promo Code Section */}
            <div className="border-t border-gray-200 pt-4">
              {/* Notes */}
              {item.notes && (
                <Text
                  type="secondary"
                  ellipsis={{ tooltip: item.notes }}
                  className="text-third mb-4"
                >
                  Notes: {item.notes}
                </Text>
              )}
            </div>

            {/* Pricing Information */}
            <Space direction="vertical" size="small">
              <div className=" text-first text-2xl">
                <div className="flex items-center justify-between gap-2">
                  <DollarOutlined />
                  <Text strong className="text-xl text-first">
                    Final Price: {currency?.code}{" "}
                    {calculateFinalPrice(item.price)}
                  </Text>
                </div>
              </div>
              {promoDiscount > 0 && (
                <Text type="success" className="text-first">
                  Promo discount: {promoDiscount}% off
                </Text>
              )}
            </Space>

            {/* Book Now Button */}
            <Button
              type="danger"
              block
              onClick={handleBookNow}
              className="bg-first text-white border-fourth hover:bg-black"
            >
              Book Now
            </Button>

            {/* Advertiser Info */}

            <Card
              size="small"
              className="mt-1 bg-fourth mb-0 "
              onMouseEnter={() => setShowAdvertiserInfo(true)} // Show info when hovered
              onMouseLeave={() => setShowAdvertiserInfo(false)} // Hide info when mouse leaves
            >
              <div className="flex justify-between items-center">
                <div>
                  <Space align="center">
                    <Avatar
                      src={item.createdBy.logoUrl}
                      icon={<UserOutlined />}
                    />
                    {/* Hover Text */}
                    <Text className="text-second italic hover:cursor-pointer text-nowrap">
                      Advertiser
                    </Text>
                  </Space>
                </div>
                {/* Conditional Rendering for Advertiser Info */}
                {showAdvertiserInfo && (
                  <div className="flex justify-around">
                    <Space direction="" size={12}>
                      <div className="flex flex-col text-center gap-2 ">
                        <Text
                          className="border-2 rounded-full px-[6px] py-[3px] bg-first text-white font-bold text-xs"
                          strong
                        >
                          Username
                        </Text>
                        <span> {item.createdBy.username ?? "NA"}</span>
                      </div>
                      <div className="flex flex-col text-center gap-2 ">
                        <Text
                          strong
                          className="border-2 rounded-full px-1 py-[2px] bg-first text-white font-bold text-xs"
                        >
                          Company
                        </Text>
                        <span>{item.createdBy.companyName ?? "NA"}</span>
                      </div>
                      <div className="flex flex-col text-center gap-2 ">
                        <Text
                          strong
                          className="border-2 rounded-full px-1 py-[2px] bg-first text-white font-bold text-xs"
                        >
                          Industry
                        </Text>
                        <span> {item.createdBy.industry ?? "NA"}</span>
                      </div>
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
                  </div>
                )}
              </div>
            </Card>

            {/* Created Date */}
            <Text type="secondary" className="text-sm text-third">
              Created at: {dayjs(item.createdAt).format("MMM D, YYYY")}
            </Text>
          </Space>
        </Card>
      </Badge.Ribbon>

      {/* Booking Modal */}
      <Modal
        title="Complete Your Booking"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={null}
      >
        <BookingPayment
          onBookingClick={handleModalOk}
          currency={currency}
          amount={item.price}
          item={item}
          promoCode={promoCode}
          setPaymentMethod={setPaymentMethod}
        />
      </Modal>
    </div>
  );
};

const BookTransportation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(null);

  console.log("currency", currency);
  const fetchTransportation = async () => {
    setLoading(true);
    try {
      const response = await getTransportations();
      setData(response?.data);
    } catch (error) {
      message.warning("Failed to fetch transportation options");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response?.data);
    } catch (error) {
      message.warning("Failed to fetch currency information");
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
        message.warning("Please login to book transportation");
        return;
      }

      await bookTransportation({
        id,
        promoCode,
      });
      message.success("Transportation booked successfully");
    } catch (error) {
      message.warning(error.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="flex justify-center">
      <List
        grid={{
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        className="p-2 w-[90%]"
        dataSource={data}
        loading={loading}
        renderItem={(item) => (
          <List.Item style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <TransportationCard
              item={item}
              currency={currency}
              onBook={handleBook}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default BookTransportation;
