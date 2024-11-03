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
} from "@ant-design/icons";
import StaticMap from "../shared/GoogleMaps/ViewLocation";
import { TActivity } from "../../types/Activity/Activity";
import { getActivity } from "../../api/activity.ts";

const { Title, Text } = Typography;

const ActivityDetails: React.FC = () => {
  const { id: ActivityId } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<TActivity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null); // State to track which card is hovered

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

  const averageRating =
    activity.ratings.length > 0
      ? Number(
          (
            activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
            activity.ratings.length
          ).toFixed(1)
        )
      : 0;

  const cardStyle = {
    borderRadius: "10px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    backgroundColor: "#FFFFFF",
    color: "#496989",
    cursor: "pointer",
  };

  const hoverCardStyle = {
    backgroundColor: "#E2F4C5", // hover color
    transform: "scale(1.05)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
  };

  return (
    <div style={{ backgroundColor: "#496989", minHeight: "100vh", padding: "24px" }}>
      <Space direction="vertical" size="large" style={{ width: "100%", margin: "0 auto" }}>
        {/* Header Section */}
        <Card
          style={{
            ...cardStyle,
            ...(hoveredCard === "header" ? hoverCardStyle : {}),
          }}
          onMouseEnter={() => setHoveredCard("header")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ color: "#496989" }}>{activity.name}</Title>
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
                <Text type="secondary" style={{ color: "#58A399" }}>
                  {activity.ratings.length} ratings
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Location and Basic Info Section */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Basic Information */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Card
                title="Basic Information"
                style={{
                  ...cardStyle,
                  ...(hoveredCard === "basicInfo" ? hoverCardStyle : {}),
                }}
                onMouseEnter={() => setHoveredCard("basicInfo")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Statistic
                      title={<Text style={{ color: "#58A399" }}>Date</Text>}
                      value={new Date(activity.date).toLocaleDateString()}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: "#496989" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={<Text style={{ color: "#58A399" }}>Time</Text>}
                      value={activity.time}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#496989" }}
                    />
                  </Col>
                  <Col span={24}>
                    <Statistic
                      title={<Text style={{ color: "#58A399" }}>Price Range</Text>}
                      value={
                        activity.price.min && activity.price.max
                          ? `$${activity.price.min} - $${activity.price.max}`
                          : "Price not specified"
                      }
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: "#496989" }}
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                title={<Space><TagOutlined style={{ color: "#58A399" }} /><span>Category & Tags</span></Space>}
                style={{
                  ...cardStyle,
                  ...(hoveredCard === "categoryTags" ? hoverCardStyle : {}),
                }}
                onMouseEnter={() => setHoveredCard("categoryTags")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Space direction="vertical">
                  <div>
                    <Text strong style={{ color: "#496989" }}>Category: </Text>
                    <Tag color="blue">{activity.category?.category}</Tag>
                  </div>
                  <div>
                    <Text strong style={{ color: "#496989" }}>Preference Tags: </Text>
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
              title={<Space><EnvironmentOutlined style={{ color: "#58A399" }} /><span>Location</span></Space>}
              bodyStyle={{ padding: 0, height: "400px" }}
              style={{
                ...cardStyle,
                overflow: "hidden",
                ...(hoveredCard === "location" ? hoverCardStyle : {}),
              }}
              onMouseEnter={() => setHoveredCard("location")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <StaticMap longitude={activity.location.lng} latitude={activity.location.lat} />
            </Card>
          </Col>
        </Row>

        {/* Special Discounts */}
        {activity.specialDiscounts.length > 0 && (
          <Card
            title={<Space><PercentageOutlined style={{ color: "#58A399" }} /><span>Special Discounts</span></Space>}
            style={{
              ...cardStyle,
              ...(hoveredCard === "specialDiscounts" ? hoverCardStyle : {}),
            }}
            onMouseEnter={() => setHoveredCard("specialDiscounts")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <List
              dataSource={activity.specialDiscounts}
              renderItem={(discount) => (
                <List.Item
                  extra={discount.isAvailable ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                      Available
                    </Tag>
                  ) : (
                    <Tag color="error" icon={<CloseCircleOutlined />}>
                      Not Available
                    </Tag>
                  )}
                >
                  <List.Item.Meta
                    title={<Text style={{ color: "#58A399" }}>{`${discount.discount}% OFF`}</Text>}
                    description={<Text style={{ color: "#496989" }}>{discount.Description}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Comments */}
        {activity.comments.length > 0 && (
          <Card
            title={<Space><UserOutlined style={{ color: "#58A399" }} /><span>User Comments</span></Space>}
            style={{
              ...cardStyle,
              ...(hoveredCard === "comments" ? hoverCardStyle : {}),
            }}
            onMouseEnter={() => setHoveredCard("comments")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <List
              dataSource={activity.comments}
              renderItem={(comment) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{comment.user[0]}</Avatar>}
                    title={<Text strong style={{ color: "#496989" }}>{comment.user}</Text>}
                    description={<Text>{comment.text}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </Space>
    </div>
  );
};

export default ActivityDetails;
