import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  CopyOutlined, MailOutlined,
} from "@ant-design/icons";
import MapContainer from "../shared/GoogleMaps/GoogleMaps";
import { TActivity } from "../../types/Activity/Activity";
import StaticMap from "../shared/GoogleMaps/ViewLocation";
import { getActivity } from "../../api/activity.ts";

const { Title, Text } = Typography;

const ActivityDetails: React.FC = () => {
  const { id: ActivityId } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<TActivity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const response = await getActivity(ActivityId ?? -1);
        if (![200, 201].includes(response.status))
          throw new Error("Failed to fetch activity");
        setActivity(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (ActivityId) fetchActivity();
  }, [ActivityId]);

  if (loading) return <Skeleton active />;
  if (error) return <Alert type="error" message={error} />;
  if (!activity) return <Alert type="warning" message="Activity not found" />;
// hello
  const averageRating =
      activity.ratings.length > 0
          ? Number(
              (
                  activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                  activity.ratings.length
              ).toFixed(1)
          )
          : 0;

  const handleShareEmail = () => {
    const subject = `Check out this activity: ${activity?.name}`;
    const body = `
      Activity Details:
      - Name: ${activity?.name}
      - Date: ${new Date(activity?.date).toLocaleDateString()}
      - Time: ${activity?.time}
      - Location: ${
        activity?.location
            ? `Latitude: ${activity.location.lat}, Longitude: ${activity.location.lng}`
            : "Location not specified"
    }
      - Price Range: ${
        activity?.price?.min && activity?.price?.max
            ? `$${activity.price.min} - $${activity.price.max}`
            : "Not specified"
    }
      - Category: ${activity?.category?.category || "No category"}
      - Tags: ${
        activity?.preferenceTags.length > 0
            ? activity.preferenceTags.map((tag) => tag.tag).join(", ")
            : "No tags"
    }

      Special Discounts:
      ${
        activity?.specialDiscounts.length > 0
            ? activity.specialDiscounts
                .map(
                    (discount, index) =>
                        `${index + 1}. ${discount.discount}% OFF - ${
                            discount.Description
                        } (${discount.isAvailable ? "Available" : "Not Available"})`
                )
                .join("\n")
            : "No special discounts"
    }

      Ratings:
      - Total Ratings: ${activity?.ratings.length}
      - Average Rating: ${
        activity?.ratings.length
            ? (
                activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                activity.ratings.length
            ).toFixed(1)
            : "No ratings yet"
    }

      More details and booking: ${window.location.origin}/activity/${ActivityId}
    `;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/activity/${ActivityId}`;
    navigator.clipboard.writeText(link).then(
        () => message.success("Link copied to clipboard!"),
        () => message.error("Failed to copy the link")
    );
  };

  return (
      <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", margin: "0 auto", padding: 24 }}
      >
        {/* Header Section */}
        <Card>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>{activity.name}</Title>
              <Space size="small">
                <Badge
                    status={activity.isActive ? "success" : "error"}
                    text={activity.isActive ? "Active" : "Inactive"}
                />
                <Badge
                    status={activity.isBookingOpen ? "processing" : "default"}
                    text={activity.isBookingOpen ? "Booking Open" : "Booking Closed"}
                />
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="end">
                <Rate disabled value={averageRating} allowHalf />
                <Text type="secondary">{activity.ratings.length} ratings</Text>
                <Space>
                  <Button icon={<CopyOutlined />} onClick={handleCopyLink}>
                    Copy Link
                  </Button>
                  <Button
                      icon={<MailOutlined />}
                      onClick={handleShareEmail}
                  >
                    Share via Email
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Location and Basic Info Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Card title="Basic Information">
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Statistic
                        title="Date"
                        value={new Date(activity.date).toLocaleDateString()}
                        prefix={<CalendarOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                        title="Time"
                        value={activity.time}
                        prefix={<ClockCircleOutlined />}
                    />
                  </Col>
                  <Col span={24}>
                    <Statistic
                        title="Price Range"
                        value={
                          activity.price.min && activity.price.max
                              ? `$${activity.price.min} - $${activity.price.max}`
                              : "Price not specified"
                        }
                        prefix={<DollarOutlined />}
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                  title={
                    <Space>
                      <TagOutlined />
                      <span>Category & Tags</span>
                    </Space>
                  }
              >
                <Space direction="vertical">
                  <div>
                    <Text strong>Category: </Text>
                    <Tag color="blue">{activity.category?.category}</Tag>
                  </div>
                  <div>
                    <Text strong>Preference Tags: </Text>
                    <Space wrap>
                      {activity.preferenceTags.map((tag) => (
                          <Tag key={tag._id} color="green">
                            {tag.tag}
                          </Tag>
                      ))}
                    </Space>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>

          {/* Right Column - Map */}
          <Col xs={24} lg={12}>
            <Card
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Location</span>
                  </Space>
                }
                bodyStyle={{ padding: 0, height: "400px" }}
            >
              <StaticMap longitude={activity.location.lng} latitude={activity.location.lat} />
            </Card>
          </Col>
        </Row>

        {/* Special Discounts */}
        {activity.specialDiscounts.length > 0 && (
            <Card
                title={
                  <Space>
                    <PercentageOutlined />
                    <span>Special Discounts</span>
                  </Space>
                }
            >
              <List
                  dataSource={activity.specialDiscounts}
                  renderItem={(discount) => (
                      <List.Item
                          extra={
                            discount.isAvailable ? (
                                <Tag color="success" icon={<CheckCircleOutlined />}>
                                  Available
                                </Tag>
                            ) : (
                                <Tag color="error" icon={<CloseCircleOutlined />}>
                                  Not Available
                                </Tag>
                            )
                          }
                      >
                        <List.Item.Meta
                            title={`${discount.discount}% OFF`}
                            description={discount.Description}
                        />
                      </List.Item>
                  )}
              />
            </Card>
        )}

        {/* Comments */}
        {activity.comments.length > 0 && (
            <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>Comments</span>
                  </Space>
                }
            >
              <List
                  itemLayout="horizontal"
                  dataSource={activity.comments}
                  renderItem={(comment) => (
                      <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={comment.createdBy.mobileNumber}
                            description={comment.comment}
                        />
                      </List.Item>
                  )}
              />
            </Card>
        )}

        {/* Footer Information */}
        <Card size="small">
          <Space direction="vertical" size="small">
            <Text type="secondary">Created by: {activity.createdBy.companyName}</Text>
            <Text type="secondary">
              Created: {new Date(activity.createdAt).toLocaleDateString()}
            </Text>
            <Text type="secondary">
              Last updated: {new Date(activity.updatedAt).toLocaleDateString()}
            </Text>
          </Space>
        </Card>
      </Space>
  );
};

export default ActivityDetails;
