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
} from "antd";
import {
  CarOutlined,
  CompassOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  bookTransportation,
  getTransportations,
} from "../../api/transportation.ts";

const { Text } = Typography;

const getVehicleIcon = (type) => {
  const colors = {
    Car: "#1890ff",
    Scooter: "#52c41a",
    Bus: "#722ed1",
  };
  return (
    <Tag color={colors[type]} icon={<CarOutlined />}>
      {type}
    </Tag>
  );
};

const BookTransportation = ({}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchTransportation = async () => {
    setLoading(true);
    try {
      const response = await getTransportations();
      setData(response.data);
    } catch (error) {
      console.error("Fetch transportation error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleClick = async (id) => {
    try {
      await bookTransportation(id);
      message.success("Transportation booked successfully");
    } catch (error) {
      console.error("Book transportation error:", error);
      message.error(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchTransportation();
  }, []);

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
      renderItem={(item,index) => (
        <List.Item key={index} onClick={()=>handleClick(item._id)}>
          <Badge.Ribbon
            text={item.isActive ? "Active" : "Inactive"}
            color={item.isActive ? "green" : "red"}
          >
            <Card
              hoverable
              title={
                <Space>
                  {getVehicleIcon(item.vehicleType)}
                  <Text strong>{`Trip #${item._id.slice(-6)}`}</Text>
                </Space>
              }
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Space>
                  <CompassOutlined />
                  <Text>Pickup: </Text>
                  <Tooltip
                    title={`${item.pickupLocation.lat}, ${item.pickupLocation.lng}`}
                  >
                    <Tag color="blue">View on map</Tag>
                  </Tooltip>
                </Space>

                <Space>
                  <CompassOutlined />
                  <Text>Drop-off: </Text>
                  <Tooltip
                    title={`${item.dropOffLocation.lat}, ${item.dropOffLocation.lng}`}
                  >
                    <Tag color="purple">View on map</Tag>
                  </Tooltip>
                </Space>

                <Space>
                  <DollarOutlined />
                  <Text strong>{`$${item.price.toFixed(2)}`}</Text>
                </Space>

                <Space>
                  <CalendarOutlined />
                  <Text>{dayjs(item.date).format("MMM D, YYYY")}</Text>
                </Space>

                {item.notes && (
                  <Text type="secondary" ellipsis={{ tooltip: item.notes }}>
                    Notes: {item.notes}
                  </Text>
                )}

                <Card size="small" title="Advertiser Info">
                  <Space align="start">
                    <Avatar
                      src={item.createdBy.logoUrl}
                      icon={<UserOutlined />}
                    />
                    <Space direction="vertical" size={0}>
                      <Text strong>{item.createdBy.companyName}</Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {item.createdBy.industry}
                      </Text>
                      {item.createdBy.website && (
                        <Space size={4}>
                          <GlobalOutlined />
                          <a
                            href={item.createdBy.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Website
                          </a>
                        </Space>
                      )}
                    </Space>
                  </Space>
                </Card>

                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Created: {dayjs(item.createdAt).format("MMM D, YYYY")}
                </Text>
              </Space>
            </Card>
          </Badge.Ribbon>
        </List.Item>
      )}
    />
  );
};

export default BookTransportation;
