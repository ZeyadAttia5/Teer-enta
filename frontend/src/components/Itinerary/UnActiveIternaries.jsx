import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  notification,
  Badge,
  Tooltip,
  Switch,
  ConfigProvider,
  Spin,
  Image,
  Tag,
} from "antd";
import {
  GlobalOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Calendar,
  Clock,
  MapPin,
  ClipboardList,
  ImageIcon,
  Power ,
} from "lucide-react";
import moment from "moment";
import {
  activateItinerary,
  getUnActiveItineraries,
} from "../../api/itinerary.ts";
import { getCurrency } from "../../api/account.ts";

const UnActiveIternaries = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await getUnActiveItineraries();
      setItineraries(data);
    } catch (error) {
      message.warning(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
    } catch (error) {
      message.warning(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchItineraries();
    fetchCurrency();
  }, [refreshTrigger]); // Added refreshTrigger dependency

  const handleStatusChange = async (record, checked) => {
    try {
      setLoading(true);
      await activateItinerary(record._id);
      message.success("Itinerary activation status updated successfully");

      // Update the local state immediately
      setItineraries(prevItineraries =>
          prevItineraries.filter(item => item._id !== record._id)
      );

      // Trigger a refresh to ensure data consistency
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      message.error("Failed to update activation status");
      console.error("Status update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      width: 80,
      render: (imageUrl) => (
          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Itinerary"
                    width={48}
                    height={48}
                    style={{ objectFit: 'cover' }}
                    preview={{
                      maskClassName: 'w-full h-full',
                      mask: (
                          <div className="flex items-center justify-center w-full h-full bg-black/50">
                            <EyeOutlined className="text-white text-lg" />
                          </div>
                      )
                    }}
                />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                </div>
            )}
          </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 100,
      render: (name) => (
          <Tooltip title={name}>
            <div className="flex items-center gap-2 max-w-[130px]">
              <span className="truncate">{name || "N/A"}</span>
            </div>
          </Tooltip>
      ),
    },
    {
      title: "Dates",
      dataIndex: "availableDates",
      key: "dates",
      width: 250,
      render: (dates) => (
          <div className="space-y-2">
            {dates?.slice(0, 2).map((date, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
                  <Calendar className="w-4 h-4 text-[#1C325B]" />
                  <span className="text-gray-600">
                {moment(date.Date).format("MMM DD, YYYY")} at {date.Times}
              </span>
                </div>
            ))}
            {dates?.length > 2 && (
                <Tooltip title={dates.slice(2).map((date, i) =>
                    `${moment(date.Date).format("MMM DD, YYYY")} at ${date.Times}`).join('\n')
                }>
                  <div className="text-sm text-gray-500 pl-6">
                    +{dates.length - 2} more dates
                  </div>
                </Tooltip>
            )}
          </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      width: 200,
      render: (record) => (
          <Tooltip title={`${record.pickupLocation} → ${record.dropOffLocation}`}>
            <div className="flex items-center gap-2 max-w-[180px]">
              <MapPin className="w-4 h-4 text-[#1C325B] flex-shrink-0" />
              <span className="truncate">
              {record.pickupLocation} → {record.dropOffLocation}
            </span>
            </div>
          </Tooltip>
      ),
    },
    {
      title: "Language",
      dataIndex: "language",
      key: "language",
      width: 120,
      render: (language) => (
          <Tag className="px-2 py-1 bg-[#1C325B]/10 text-[#1C325B] border-0 rounded-md whitespace-nowrap">
            {language}
          </Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price) => (
          <div className="flex items-center gap-2">
            <DollarCircleOutlined className="text-[#1C325B]" />
            <span className="font-medium">
            {currency?.code} {(price * currency?.rate).toFixed(2)}
          </span>
          </div>
      ),
    },
    {
      title: "Accessibility",
      dataIndex: "accessibility",
      key: "accessibility",
      width: 150,
      render: (accessibility) => (
          <Tooltip title={accessibility}>
            <div className="flex items-center gap-2 max-w-[130px]">
              <TeamOutlined className="text-[#1C325B] flex-shrink-0" />
              <span className="truncate">{accessibility || "N/A"}</span>
            </div>
          </Tooltip>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      fixed: 'right',
      render: (record) => (
          <Tooltip title="Toggle activation status">
            <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                checked={record.isActive}
                onChange={(checked) => handleStatusChange(record, checked)}
            />
          </Tooltip>
      ),
    },
  ];

  return (
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1C325B",
            },
          }}
      >
        <div className="flex justify-center">
          <div className="w-[90%] p-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white">
                    <div className="flex items-center gap-1 mb-2">
                      <Power className="w-6 h-6 text-white" />
                      <h3 className="m-0 text-lg font-semibold text-white">
                        Inactive Itineraries
                      </h3>
                    </div>
                    <p className="text-gray-200 mt-2 mb-0 opacity-90">
                      Manage and activate pending itineraries
                    </p>
                  </div>
                </div>

                {/* Table Section */}
                <div className="p-6">
                  {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Spin size="large" />
                      </div>
                  ) : (
                      <Table
                          columns={columns}
                          dataSource={itineraries}
                          rowKey="_id"
                          pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} inactive itineraries`,
                          }}
                          className="border border-gray-200 rounded-lg"
                          rowClassName="hover:bg-[#1C325B]/5"
                      />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default UnActiveIternaries;