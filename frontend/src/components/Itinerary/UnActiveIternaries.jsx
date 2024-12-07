import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Card,
  notification,
  Badge,
  Tooltip,
  Switch,
} from "antd";
import { FlagFilled } from "@ant-design/icons";
import {
  activateItinerary,
  getFlaggedItineraries,
  getUnActiveItineraries,
  unflagIternaary,
} from "../../api/itinerary.ts";

import "antd";
import { getCurrency } from "../../api/account.ts";

const UnActiveIternaries = ({}) => {
  // setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(null);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await getUnActiveItineraries();
      setItineraries(data);
    } catch (error) {
      message.warning("Failed to fetch itineraries");
    }
    setLoading(false);
  };

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
      console.log("Currency:", response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  };
  useEffect(() => {
    fetchItineraries();
    fetchCurrency();
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
      render: (price) => `${currency?.code}  ${currency?.rate * price}`,
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
        console.log("record", record?.availableDates[0]),
        console.log("user", user?._id),
        (
          // <Badge count={0} offset={[-5, 5]}>
          //     <Tooltip title={"Activate Iternary"}>
          <Switch
            checkedChildren="Active"
            unCheckedChildren="UnActive"
            defaultChecked={record.isActive}
            onChange={async (checked) => {
              try {
                setLoading(true);
                await activateItinerary(record._id);
                message.success("Item Activated");
                await fetchItineraries();
              } catch (error) {
                message.warning("Failed to Activate item ");
              } finally {
                setLoading(false);
              }
            }}
          />
        )
        //     </Tooltip>
        // </Badge>
      ),
    },
  ];
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">UnActive Itineraries</h1>
      <Table
        dataSource={itineraries}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        className="border border-gray-200 rounded-lg"
        rowClassName="hover:bg-[#1C325B]/5"
      />
    </div>
  );
};

export default UnActiveIternaries;
