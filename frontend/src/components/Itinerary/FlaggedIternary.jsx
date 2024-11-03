import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Card,
  notification,
  Badge,
  Tooltip,
} from "antd";
import {
  FlagFilled,
} from "@ant-design/icons";
import {
  getFlaggedItineraries,
  unflagIternaary,
} from "../../api/itinerary.ts";


import "antd";


const FlaggedIternary = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await getFlaggedItineraries();
      setItineraries(data);
    } catch (error) {
      message.error("Failed to fetch itineraries");
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchItineraries();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Accessibility",
      dataIndex: "accessibility",
      key: "accessibility",
    },
    {
      title: "Pickup Location",
      dataIndex: "pickupLocation",
      key: "pickupLocation",
    },
    {
      title: "Drop Off Location",
      dataIndex: "dropOffLocation",
      key: "dropOffLocation",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        console.log("record", record.availableDates[0]),
        console.log("user", user._id),
        (
          <Badge count={0} offset={[-5, 5]}>
            <Tooltip title={"UNFlag this item as Inappropriate"}>
              <Button
                icon={<FlagFilled />}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await unflagIternaary(record._id);
                    message.success("Item Unflagged");
                    await fetchItineraries();
                  } catch (error) {
                    message.error("Failed to Unflag item ");
                  } finally {
                    setLoading(false);
                  }
                }}
                shape="circle"
                style={{
                  button: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              />
            </Tooltip>
          </Badge>
        )
      ),
    },
  ];
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Flagged Itineraries</h1>
      <Table
        dataSource={itineraries}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default FlaggedIternary;
