import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  
  message,
  Card,
  notification,
  Badge,
  Tooltip,
  Row,
  Col,
} from "antd";
import {
  FlagFilled,
} from "@ant-design/icons";

import { getActivities, getFlaggedActivities, UnFlagActivity } from "../../api/activity.ts";

import moment from "moment";
import "antd";


const FlaggedActivities = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await getFlaggedActivities();
      setActivities(data);
    } catch (error) {
      message.error("Failed to fetch itineraries");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <span>{name}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <span>{moment(date).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time) => <span>{time}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) => (
        <span>
          ({loc?.lat}, {loc?.lng})
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => <span>{category?.category || "N/A"}</span>,
    },
    {
      title: "Preference Tags",
      dataIndex: "preferenceTags",
      key: "preferenceTags",
      render: (preferenceTags) => (
        <span>{preferenceTags?.map((tag) => tag.tag).join(", ")}</span>
      ),
    },
    {
      title: "Special Discounts",
      dataIndex: "specialDiscounts",
      key: "specialDiscounts",
      width: "20%",
      render: (discounts) => (
        <Row className="w-full">
          {discounts?.map((discount, index) => (
            <Col key={index} md={10} lg={10}>
              <Card
                className="w-full"
                style={{ width: "100%" }}
                title={`${discount.discount}%`}
              >
                <p>{discount.Description}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {discount.isAvailable ? "Available" : "Not Available"}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
    {
      title: user ? "Actions" : "",
      key: "actions",
      render: (record) => (
         
          <Badge count={0} offset={[-5, 5]}>
            <Tooltip title={"UnFlag this item as Inappropriate"}>
              <Button
                // danger
                icon={<FlagFilled />}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await UnFlagActivity(record?._id);
                    message.success("Item Unflagged");
                    await fetchActivities();
                  } catch (error) {
                    message.error("Failed to Unflag item");
                  } finally {
                    setLoading(false);
                  }
                }}
                shape="circle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "5px",
                }}
              />
            </Tooltip>
          </Badge>
      ),
    },
  ];
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Flagged Activities</h1>
      <Table
        dataSource={activities}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FlaggedActivities;
