import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Space,
  List,
  Rate,
  Skeleton,
  Row,
  Col,
  Statistic,
  Avatar,
  Alert,
  Badge,
  Button,
  message,
  Tooltip,
  Divider,
  Modal,
  Input,
  Tabs,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ShareAltOutlined,
  CopyOutlined,
  MailOutlined,
  StopOutlined,
  RocketOutlined,
  StarOutlined,
  HeartOutlined,
  HeartFilled,
  InfoCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import StaticMap from "../shared/GoogleMaps/ViewLocation";
import { getActivity } from "../../api/activity.ts";
import { getMyCurrency } from "../../api/profile.ts";
import TabPane from "antd/es/tabs/TabPane";
import LoginConfirmationModal from "./../shared/LoginConfirmationModel.js";
const { Title, Text } = Typography;

const ActivityDetails = ({ setFlag }) => {
  const { id: ActivityId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activityResponse, currencyResponse] = await Promise.all([
          getActivity(ActivityId),
          getMyCurrency(),
        ]);

        setActivity(activityResponse.data);
        setCurrency(currencyResponse.data);
      } catch (err) {
        setError(err?.message || "Failed to fetch activity details");
      } finally {
        setLoading(false);
      }
    };

    if (ActivityId) {
      fetchData();
    }
  }, [ActivityId]);

  const handleActivityBooking = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/touristActivities/book/${ActivityId}`);
  };

  const handleShareEmail = () => {
    const subject = `Check out this activity: ${activity?.name}`;
    const body = `
Activity Details:
Name: ${activity?.name}
Date: ${new Date(activity?.date).toLocaleDateString()}
Time: ${activity?.time}
Location: ${
      activity?.location
        ? `Latitude: ${activity?.location?.lat}, Longitude: ${activity?.location?.lng}`
        : "Location not specified"
    }
Price Range: ${currency?.code} ${
      activity?.price?.min
        ? (currency?.rate * activity?.price?.min).toFixed(2)
        : "N/A"
    } - ${
      activity?.price?.max
        ? (currency?.rate * activity?.price?.max).toFixed(2)
        : "N/A"
    }
Category: ${activity?.category?.category || "N/A"}

Special Discounts:
${
  activity?.specialDiscounts
    ?.map(
      (discount) =>
        `${discount.discount}% OFF - ${discount.Description} (${
          discount.isAvailable ? "Available" : "Not Available"
        })`
    )
    .join("\n") || "No special discounts available"
}

More details: ${window.location.href}
        `;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => message.success("Link copied to clipboard!"))
      .catch(() => message.warning("Failed to copy link"));
  };

  const averageRating =
    activity?.ratings?.length > 0
      ? (
          activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
          activity.ratings.length
        ).toFixed(1)
      : 0;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Skeleton active className="max-w-2xl w-full" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert
          type="error"
          message="Error"
          description={error}
          className="max-w-md"
        />
      </div>
    );

  if (!activity)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert
          type="warning"
          message="Activity not found"
          className="max-w-md"
        />
      </div>
    );

  return (
    <div className="flex justify-center ">
      <LoginConfirmationModal
        open={isLoginModalOpen}
        setOpen={setIsLoginModalOpen}
        content="Please login Book an Activity."
      />
      <div className="w-[90%]">
        {/* Hero Section */}
        <div className="relative h-[400px] overflow-hidden shadow-lg shadow-gray-300">
          <img
            src={activity.imageUrl || "/api/placeholder/1200/600"}
            alt={activity.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0" />

          {/* Share Actions */}
          <div className="absolute top-6 right-6 flex gap-2">
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyLink}
              className="bg-white/90 hover:bg-white border-none"
            />
            <Button
              icon={<MailOutlined />}
              onClick={handleShareEmail}
              className="bg-white/90 hover:bg-white border-none"
            />
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-1 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-4">
                <Title
                  level={1}
                  className="text-white m-0 text-4xl md:text-5xl font-bold"
                >
                  <span className="text-white">{activity.name}</span>
                </Title>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <CalendarOutlined />
                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <ClockCircleOutlined />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <TagOutlined />
                    <span>{activity.category?.category}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <StarOutlined />
                    <Rate
                      disabled
                      value={Number(averageRating)}
                      allowHalf
                      className="text-sm"
                    />
                    <span>({activity.ratings?.length} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 -mt-10 relative z-10">
          <Row gutter={[24, 24]} className="flex flex-wrap">
            {/* Left Column */}
            <Col xs={24} lg={16} className="flex flex-col">
              {/* Booking Card */}
              <Card className="mb-6 rounded-xl mt-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-4">
                  <div className="w-full md:w-auto">
                    <Text className="block text-gray-500 mb-4 text-lg">
                      Price Range
                    </Text>
                    <div className="flex flex-wrap justify-center md:justify-start gap-8">
                      <div>
                        <Text className="text-sm text-gray-400">From</Text>
                        <div className="flex items-baseline gap-1">
                          <Text className="text-lg text-gray-500">
                            {currency?.code}
                          </Text>
                          <Text className="text-4xl font-bold text-blue-950">
                            {activity.price?.min
                              ? (currency?.rate * activity.price.min).toFixed(1)
                              : "N/A"}
                          </Text>
                        </div>
                      </div>
                      <div>
                        <Text className="text-sm text-gray-400">To</Text>
                        <div className="flex items-baseline gap-1">
                          <Text className="text-lg text-gray-500">
                            {currency?.code}
                          </Text>
                          <Text className="text-4xl font-bold text-blue-950">
                            {activity.price?.max
                              ? (currency?.rate * activity.price.max).toFixed(1)
                              : "N/A"}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(!user || user.userRole === "Tourist") && (
                    <Button
                      size="large"
                      type="danger"
                      onClick={handleActivityBooking}
                      disabled={!activity.isBookingOpen}
                      className={`
                            px-12 h-14 text-lg font-semibold rounded-lg
                            ${
                              activity.isBookingOpen
                                ? "bg-blue-950 text-white hover:bg-black border-none"
                                : "bg-gray-200 text-gray-500 border-none"
                            }
                        `}
                    >
                      {activity.isBookingOpen ? "Book Now" : "Not Available"}
                    </Button>
                  )}
                </div>

                {activity.specialDiscounts?.some((d) => d.isAvailable) && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <Text className="text-yellow-800 flex items-center gap-2">
                      <PercentageOutlined />
                      Special discounts available! Check offers section for
                      details.
                    </Text>
                  </div>
                )}
              </Card>

              {/* Content Container */}
              <div className="flex-1 flex flex-col gap-6">
                {/* About Section */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6">
                  <Title
                    level={4}
                    className="m-0 flex items-center gap-2 text-blue-600 mb-6"
                  >
                    <InfoCircleOutlined />
                    About This Activity
                  </Title>

                  <div className="space-y-6">
                    <div>
                      <Text className="text-gray-500 block mb-3">
                        Categories & Tags
                      </Text>
                      <div className="flex flex-wrap gap-2">
                        <Tag color="blue" className="px-4 py-1 text-sm">
                          {activity.category?.category}
                        </Tag>
                        {activity.preferenceTags?.map((tag, index) => (
                          <Tag
                            key={index}
                            color="green"
                            className="px-4 py-1 text-sm"
                          >
                            {tag.tag}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                      <div className="flex items-center gap-3">
                        <UserOutlined className="text-blue-600" />
                        <div>
                          <Text className="text-gray-500 block text-sm">
                            Created By
                          </Text>
                          <Text className="text-gray-800 font-medium">
                            {activity.createdBy?.username}
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ClockCircleOutlined className="text-blue-600" />
                        <div>
                          <Text className="text-gray-500 block text-sm">
                            Last Updated
                          </Text>
                          <Text className="text-gray-800 font-medium">
                            {new Date(activity.updatedAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 flex-1">
                  <Title
                    level={4}
                    className="m-0 flex items-center gap-2 text-blue-600 mb-6"
                  >
                    <EnvironmentOutlined />
                    Location
                  </Title>
                  <div className="h-[400px] rounded-lg overflow-hidden">
                    <StaticMap
                      longitude={activity.location?.lng}
                      latitude={activity.location?.lat}
                    />
                  </div>
                </div>
              </div>
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={8}>
              <Card
                className="mt-8 bg-gradient-to-br from-gray-50 to-white  top-8"
                title={
                  <div className="flex items-center gap-2">
                    <PercentageOutlined className="text-red-500 text-lg" />
                    <span className="text-gray-800 font-medium">
                      Special Offers
                    </span>
                  </div>
                }
              >
                <div className=" overflow-y-auto pr-2 bg-gradient-to-br from-gray-50 to-white ">
                  {activity.specialDiscounts?.length > 0 ? (
                    <List
                      dataSource={activity.specialDiscounts}
                      renderItem={(discount) => (
                        <Card
                          className="mb-4 last:mb-0 hover:shadow-md transition-shadow"
                          bodyStyle={{ padding: "16px" }}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-baseline gap-2">
                                <Text className="text-4xl font-bold text-red-500">
                                  {discount.discount}%
                                </Text>
                                <div className="flex flex-col">
                                  <Text className="text-lg font-semibold">
                                    OFF
                                  </Text>
                                  <Tag
                                    color={
                                      discount.isAvailable
                                        ? "success"
                                        : "default"
                                    }
                                  >
                                    {discount.isAvailable
                                      ? "Active Now"
                                      : "Expired"}
                                  </Tag>
                                </div>
                              </div>
                              <Text className="block text-gray-600 mt-2">
                                {discount.Description}
                              </Text>
                            </div>
                          </div>
                        </Card>
                      )}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <PercentageOutlined className="text-2xl text-gray-300 mb-2" />
                      <Text className="block text-gray-500">
                        No special offers available
                      </Text>
                    </div>
                  )}
                </div>
              </Card>

              <style jsx>{`
                ::-webkit-scrollbar {
                  width: 4px;
                }
                ::-webkit-scrollbar-track {
                  background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                  background: #e2e8f0;
                  border-radius: 4px;
                }
                ::-webkit-scrollbar-thumb:hover {
                  background: #cbd5e1;
                }
              `}</style>
            </Col>
          </Row>

          {/* Activity Reviews and Comments Section */}
          <div className="mt-8">
            <Card className="shadow-xl rounded-xl bg-gradient-to-br from-gray-50 to-white">
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="fancy-tabs"
              >
                <TabPane
                  tab={
                    <span className="flex items-center gap-2 px-3 py-2">
                      <StarOutlined className="text-blue-500" />
                      <span className="font-medium">Ratings</span>
                    </span>
                  }
                  key="1"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
                    <div className="text-center">
                      <Text className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        {averageRating}
                      </Text>
                      <div className="my-3">
                        <Rate
                          disabled
                          value={Number(averageRating)}
                          allowHalf
                          className="text-yellow-400"
                        />
                      </div>
                      <Text className="text-gray-600">
                        Based on {activity.ratings?.length || 0} reviews
                      </Text>
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <List
                      itemLayout="horizontal"
                      dataSource={activity.ratings}
                      renderItem={(rating) => (
                        <List.Item className="rounded-xl transition-all duration-300 p-4 mb-2">
                          <List.Item.Meta
                            avatar={
                              <div className="relative">
                                <Avatar
                                  icon={<UserOutlined />}
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                                  {/*<StarOutlined className="text-yellow-400 text-xs"/>*/}
                                </div>
                              </div>
                            }
                            title={
                              <div className="flex justify-between items-center">
                                <Text strong className="text-gray-800">
                                  {rating.user?.username}
                                </Text>
                                <div className="flex items-center gap-2">
                                  <Rate
                                    disabled
                                    defaultValue={rating.rating}
                                    className="text-sm"
                                  />
                                  <Text className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    {new Date(
                                      rating.createdAt
                                    ).toLocaleDateString()}
                                  </Text>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                      locale={{
                        emptyText: (
                          <div className="text-center py-8">
                            {/*<StarOutlined className="text-4xl text-gray-300 mb-2"/>*/}
                            <Text className="block text-gray-400">
                              No reviews yet
                            </Text>
                          </div>
                        ),
                      }}
                    />
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2 px-3 py-2">
                      <MessageOutlined className="text-green-500" />
                      <span className="font-medium">Comments</span>
                    </span>
                  }
                  key="2"
                >
                  <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    <List
                      dataSource={activity.comments}
                      renderItem={(comment) => (
                        <List.Item className=" rounded-xl transition-all duration-300 p-4 mb-2">
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                icon={<UserOutlined />}
                                className="bg-gradient-to-r from-green-500 to-emerald-500"
                              />
                            }
                            title={
                              <div className="flex justify-between items-center">
                                <Text strong className="text-gray-800">
                                  {comment.user?.username}
                                </Text>
                                <Text className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                  {new Date(
                                    comment.createdAt
                                  ).toLocaleDateString()}
                                </Text>
                              </div>
                            }
                            description={
                              <div className="mt-2 bg-white p-3 rounded-lg shadow-sm">
                                <Text className="text-gray-600">
                                  {comment.comment}
                                </Text>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                      locale={{
                        emptyText: (
                          <div className="text-center py-8">
                            <MessageOutlined className="text-4xl text-gray-300 mb-2" />
                            <Text className="block text-gray-400">
                              No comments yet
                            </Text>
                          </div>
                        ),
                      }}
                    />
                  </div>
                </TabPane>
              </Tabs>

              <style jsx>{`
                .fancy-tabs .ant-tabs-nav {
                  margin-bottom: 1rem;
                  background: #f8fafc;
                  padding: 0.5rem;
                  border-radius: 0.75rem;
                }

                .fancy-tabs .ant-tabs-tab {
                  margin: 0 !important;
                  padding: 0.5rem !important;
                  border-radius: 0.5rem;
                  transition: all 0.3s;
                }

                .fancy-tabs .ant-tabs-tab:hover {
                  background: white;
                }

                .fancy-tabs .ant-tabs-tab-active {
                  background: white !important;
                  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
                }

                .fancy-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                  color: #4f46e5 !important;
                }

                .fancy-tabs .ant-tabs-ink-bar {
                  display: none;
                }

                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #e2e8f0;
                  border-radius: 1rem;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #cbd5e1;
                }
              `}</style>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
