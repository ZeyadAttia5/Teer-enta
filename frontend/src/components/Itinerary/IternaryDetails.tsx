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
  const navigate = useNavigate();

  useEffect(() => {
    getIternary(iternaryId ?? -1)
      .then((res) => {
        setItinerary(res.data);
      })
      .catch((error) => {
        message.error("Failed to fetch itinerary details");
      });
  }, [iternaryId]);

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
    <div className="bg-[#496989] min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <Space
        direction="vertical"
        size="large"
        className="relative w-full max-w-4xl p-8"
      >
        <div className="absolute top-1 left-8 animate-bounce">
          <EnvironmentOutlined className="text-5xl text-white" />
        </div>

        {/* First Card */}
        <Card 
          bordered={false} 
          className="bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105 w-full"
        >
          <Row justify="center" className="text-center mb-1">
            <Title level={2} className="font-extrabold text-[#58A399]">
              {itinerary?.name}
            </Title>
          </Row>
          <Row justify="center" className="text-center">
            <p className="text-[#58A399] text-lg font-medium mb-6">
              {itinerary?.description || "Explore amazing travel experiences!"}
            </p>
          </Row>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col>
              <Space size="small">
                <Tag icon={<GlobalOutlined />} color="magenta">
                  {itinerary?.language}
                </Tag>
                <Tag icon={<DollarOutlined />} color="green">
                  ${itinerary?.price}
                </Tag>
                {itinerary?.isActive && (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    Active
                  </Tag>
                )}
              </Space>
            </Col>
            <Col>
              <Space direction="vertical" align="center">
                <Rate disabled value={averageRating} allowHalf />
                <Text type="secondary" className="text-[#58A399]">
                  {itinerary?.ratings.length} reviews
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Row with Two Cards for Location and Activities */}
        <Row gutter={[16, 16]}>
          {/* Location Card */}
          {(itinerary?.pickupLocation || itinerary?.dropOffLocation) && (
            <Col span={12}>
              <Card
                title={
                  <Space>
                    <EnvironmentOutlined className="text-[#58A399]" />
                    <span>Locations</span>
                  </Space>
                }
                className="bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105"
              >
                {itinerary?.pickupLocation && (
                  <div>
                    <Text strong className="text-[#58A399]">Pickup: </Text>
                    <Text className="text-[#58A399]">{itinerary?.pickupLocation}</Text>
                  </div>
                )}
                {itinerary?.dropOffLocation && (
                  <div>
                    <Text strong className="text-[#58A399]">Drop-off: </Text>
                    <Text className="text-[#58A399]">{itinerary?.dropOffLocation}</Text>
                  </div>
                )}
              </Card>
            </Col>
          )}

          {/* Activities Card */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ClockCircleOutlined className="text-[#58A399]" />
                  <span>Activities</span>
                </Space>
              }
              className="bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105"
            >
              <List
                dataSource={itinerary?.activities}
                renderItem={(item) => (
                  <List.Item
                    className="cursor-pointer hover:bg-indigo-50 transition duration-300 transform hover:scale-105 rounded-md"
                    onClick={() => navigate(`../activityDetails/${item.activity?._id}`)}
                  >
                    <Text className="text-[#58A399] text-lg">{item.activity?.name}</Text>
                    <Tag color="blue">{item.duration} min</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Row with Two Cards for Timeline and Available Dates */}
        <Row gutter={[16, 16]}>
          {/* Timeline Card */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <ClockCircleOutlined className="text-[#58A399]" />
                  <span>Timeline</span>
                </Space>
              }
              className="bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105"
            >
              <Timeline>
                {itinerary?.timeline.map((item, index) => (
                  <Timeline.Item key={index}>
                    <Text strong className="text-[#58A399]">{item.activity?.name}</Text>
                    {item.startTime && (
                      <Text type="secondary" className="text-[#58A399]"> at {item.startTime}</Text>
                    )}
                    {item.duration && <Tag color="blue">{item.duration} min</Tag>}
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>

          {/* Available Dates Card */}
          <Col span={12}>
            <Card
              title={
                <Space>
                  <CalendarOutlined className="text-[#58A399]" />
                  <span>Available Dates</span>
                </Space>
              }
              className="bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105"
            >
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={itinerary?.availableDates}
                renderItem={(date) => (
                  <List.Item>
                    <Card size="small" className="shadow-sm rounded-lg bg-white transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105">
                      <Space className="justify-between w-full">
                        <Text className="text-[#58A399]">{new Date(date.Date).toLocaleDateString()}</Text>
                        <Tag color="cyan">{date.Times}</Tag>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Last Full-Width Card for Comments */}
        {(itinerary?.comments.length ?? 0) > 0 && (
          <Card
            title={
              <Space>
                <UserOutlined className="text-[#58A399]" />
                <span>Comments</span>
              </Space>
            }
            className="bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105 w-full"
          >
            <List
              itemLayout="horizontal"
              dataSource={itinerary?.comments}
              renderItem={(comment) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title="Traveler's feedback"
                    description={
                      <Space className="text-[#58A399]">
                        <Text>{comment.comment}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Footer Information */}
        <Card className="text-center mt-4 bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#E2F4C5] hover:scale-105">
          <Space direction="vertical" size="small">
            <Text type="secondary" className="text-[#58A399]">Created by: Unknown</Text>
            <Text type="secondary" className="text-[#58A399]">
              Created: {new Date(itinerary?.createdAt ?? "").toLocaleDateString()}
            </Text>
            <Text type="secondary" className="text-[#58A399]">
              Last Updated: {new Date(itinerary?.updatedAt ?? "").toLocaleDateString()}
            </Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
};
export default ItineraryDetails;