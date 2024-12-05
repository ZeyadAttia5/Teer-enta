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

const { Title, Text } = Typography;

const ActivityDetails = ({ setFlag }) => {
  const { id: ActivityId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

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
      .catch(() => message.error("Failed to copy link"));
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
    <div className="flex justify-center">
      <div className="w-[90%]">
        {/* Hero Section */}
        <div className="relative h-30 overflow-hidden shadow-lg shadow-gray-300">
          <img
            src={activity.imageUrl || "/api/placeholder/1200/600"}
            alt={activity.name}
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

          {/* Share Actions */}
          <div className="absolute top-6 right-6 flex gap-2">
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyLink}
              className="bg-white/90 hover:bg-white border-none  "
            />
            <Button
              icon={<MailOutlined />}
              onClick={handleShareEmail}
              className="bg-white/90 hover:bg-white border-none  "
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
                  {activity.name}
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
          <Row gutter={[24, 24]}>
            {/* Left Column */}
            <Col xs={24} lg={16}>
              {/* Booking Card */}
              <Card className="mb-6   rounded-xl">
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

              {/* About Section */}
              <div className="bg-white rounded-xl   p-6 mb-6">
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
                          color="blue"
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
              <div className="bg-white rounded-xl   p-6">
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
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={8}>
              {/* Special Offers Section */}
              <div className="bg-white rounded-xl   p-6 mb-6">
                <Title
                  level={4}
                  className="m-0 flex items-center gap-2 text-blue-600 mb-6"
                >
                  <PercentageOutlined />
                  Special Offers
                </Title>
                {activity.specialDiscounts?.length > 0 ? (
                  <List
                    dataSource={activity.specialDiscounts}
                    renderItem={(discount) => (
                      <List.Item className="border-b last:border-b-0 block p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Text className="text-3xl font-bold text-red-500 block mb-2">
                              {discount.discount}% OFF
                            </Text>
                            <Text className="text-gray-600 block">
                              {discount.Description}
                            </Text>
                          </div>
                          <Tag
                            color={discount.isAvailable ? "success" : "error"}
                            className="text-sm"
                          >
                            {discount.isAvailable ? "Available" : "Expired"}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No special offers available
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-xl   p-6 mb-6">
                <Title
                  level={4}
                  className="m-0 flex items-center gap-2 text-blue-600 mb-6"
                >
                  <StarOutlined />
                  Reviews & Ratings
                </Title>
                {activity.ratings?.length > 0 ? (
                  <>
                    <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
                      <Text className="text-4xl font-bold text-blue-950">
                        {averageRating}
                      </Text>
                      <div className="my-2">
                        <Rate
                          disabled
                          value={Number(averageRating)}
                          allowHalf
                        />
                      </div>
                      <Text className="text-gray-500">
                        Based on {activity.ratings.length} reviews
                      </Text>
                    </div>
                    <List
                      dataSource={activity.ratings}
                      renderItem={(rating) => (
                        <List.Item className="border-b last:border-b-0">
                          <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={
                              <div className="flex justify-between items-center">
                                <Text strong>{rating.user?.username}</Text>
                                <Rate
                                  disabled
                                  value={rating.rating}
                                  className="text-sm"
                                />
                              </div>
                            }
                            description={
                              <div className="mt-2">
                                <Text className="text-gray-600">
                                  {rating.comment}
                                </Text>
                                <div className="mt-1">
                                  <Text className="text-gray-400 text-sm">
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
                    />
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-xl   p-6">
                <Title
                  level={4}
                  className="m-0 flex items-center gap-2 text-blue-600 mb-6"
                >
                  <MessageOutlined />
                  Comments
                </Title>
                {activity.comments?.length > 0 ? (
                  <List
                    dataSource={activity.comments}
                    renderItem={(comment) => (
                      <List.Item className="border-b last:border-b-0">
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={
                            <div className="flex justify-between items-center">
                              <Text strong>{comment.user?.username}</Text>
                              <Text className="text-gray-400 text-sm">
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </Text>
                            </div>
                          }
                          description={
                            <Text className="text-gray-600 mt-2">
                              {comment.comment}
                            </Text>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No comments yet
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
