import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Space,
  List,
  Rate,
  Timeline,
  Avatar,
  Row,
  Col,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  GlobalOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getIternary } from "../../api/itinerary.ts";
import { TItinerary } from "../../types/Itinerary/Itinerary";

const { Title, Text } = Typography;

const ItineraryDetails: React.FC = () => {
  const { id: iternaryId } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<TItinerary>();
  const navigate=useNavigate()
  useEffect(() => {
    getIternary(iternaryId ?? -1)
      .then((res) => {
        console.log(res.data);
        setItinerary(res.data);
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to fetch itinerary details");
      });
  }, []);

  const averageRating = React.useMemo(() => {
    if (itinerary?.ratings.length === 0) return 0;
    return Number(
      (
        (itinerary?.ratings ?? []).reduce((acc, curr) => acc + curr.rating, 0) /
        (itinerary?.ratings?.length || 1)
      ).toFixed(1)
    );
  }, [itinerary?.ratings]);

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", margin: "0 auto", padding: 24 }}
    >
      {/* Header Section */}
      <Card>
        <Row justify="space-between" align="top">
          <Col>
            <Title level={2} style={{ marginBottom: 8 }}>
              {itinerary?.name}
            </Title>
            <Space size="small">
              <Tag icon={<GlobalOutlined />}>{itinerary?.language}</Tag>
              <Tag icon={<DollarOutlined />}>${itinerary?.price}</Tag>
              {itinerary?.isActive && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Active
                </Tag>
              )}
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" align="end">
              <Rate disabled value={averageRating} allowHalf />
              <Text type="secondary">{itinerary?.ratings.length} ratings</Text>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Location Information */}
      {(itinerary?.pickupLocation || itinerary?.dropOffLocation) && (
        <Card
          title={
            <Space>
              <EnvironmentOutlined />
              <span>Locations</span>
            </Space>
          }
        >
          {itinerary?.pickupLocation && (
            <div>
              <Text strong>Pickup: </Text>
              <Text>{itinerary?.pickupLocation}</Text>
            </div>
          )}
          {itinerary?.dropOffLocation && (
            <div>
              <Text strong>Drop-off: </Text>
              <Text>{itinerary?.dropOffLocation}</Text>
            </div>
          )}
        </Card>
      )}

      {/* Activities */}
      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            <span>Activities</span>
          </Space>
        }
      >
        <List
          dataSource={itinerary?.activities}
          renderItem={(item) => (
            <List.Item
              extra={
                <Tag icon={<ClockCircleOutlined />}>{item.duration} min</Tag>
              }
              className="cursor-pointer hover:shadow hover:scale-105 transition-all"
              onClick={() => navigate(`../activityDetails/${item.activity?._id}`)}
            >
              {/*{console.log(item)}*/}
              <Text>{item.activity?.name}</Text>
            </List.Item>
          )}
        />
      </Card>

      {/* Timeline */}
      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            <span>Timeline</span>
          </Space>
        }
      >
        <Timeline>
          {itinerary?.timeline.map((item, index) => (
            <Timeline.Item key={index}>
              <Text strong>{item.activity?.name}</Text>
              <br />
              {item.startTime && (
                <Text type="secondary">Starts at {item.startTime}</Text>
              )}
              {item.duration && (
                <Tag style={{ marginLeft: 8 }}>{item.duration} min</Tag>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Available Dates */}
      <Card
        title={
          <Space>
            <CalendarOutlined />
            <span>Available Dates</span>
          </Space>
        }
      >
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={itinerary?.availableDates}
          renderItem={(date) => (
            <List.Item>
              <Card size="small">
                <Space
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Text>{new Date(date.Date).toLocaleDateString()}</Text>
                  <Tag>{date.Times}</Tag>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      </Card>

      {/* Comments */}
      {(itinerary?.comments.length ?? 0) > 0 && (
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
            dataSource={itinerary?.comments}
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={"Tour Guide"}
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
          <Text type="secondary">Created by: Unknonw</Text>
          <Text type="secondary">
            Created: {new Date(itinerary?.createdAt ?? "").toLocaleDateString()}
          </Text>
          <Text type="secondary">
            Last updated:{" "}
            {new Date(itinerary?.updatedAt ?? "").toLocaleDateString()}
          </Text>
        </Space>
      </Card>
    </Space>
  );
};

export default ItineraryDetails;
