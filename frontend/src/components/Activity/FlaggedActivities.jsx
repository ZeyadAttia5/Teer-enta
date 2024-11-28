import React, { useState, useEffect } from "react";
import { Table, Button, ConfigProvider, Spin, Tooltip, Tag } from "antd";
import {
  Flag,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Tag as TagIcon,
  Percent,
  AlertCircle,
  PackageIcon
} from 'lucide-react';
import { getFlaggedActivities, UnFlagActivity } from "../../api/activity.ts";
import moment from "moment";

const FlaggedActivities = ({ setFlag }) => {
  setFlag(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalFlagged, setTotalFlagged] = useState(0);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await getFlaggedActivities();
      setActivities(data);
      setTotalFlagged(data.length);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleUnflag = async (id) => {
    try {
      await UnFlagActivity(id);
      await fetchActivities();
    } catch (error) {
      console.error("Error unflagging activity:", error);
    }
  };

  const columns = [
    {
      title: "Activity Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
          <div className="flex items-center gap-2">
            <PackageIcon className="w-4 h-4 text-[#1C325B]" />
            <span className="font-medium text-[#1C325B]">{text}</span>
          </div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date, record) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1C325B]" />
              <span>{moment(date).format("MMM DD, YYYY")}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{record.time}</span>
            </div>
          </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) => (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1C325B]" />
            <span>({loc?.lat}, {loc?.lng})</span>
          </div>
      ),
    },
    {
      title: "Category",
      dataIndex: ["category", "category"],
      key: "category",
      render: (text) => (
          <Tag className="px-3 py-1 bg-[#1C325B]/10 text-[#1C325B] border-0 rounded-lg">
            {text || "N/A"}
          </Tag>
      ),
    },
    {
      title: "Preference Tags",
      dataIndex: "preferenceTags",
      key: "preferenceTags",
      render: (tags) => (
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag, index) => (
                <Tag
                    key={index}
                    className="px-2 py-1 bg-emerald-50 text-emerald-600 border-0 rounded-lg flex items-center gap-1"
                >
                  <TagIcon className="w-3 h-3" />
                  {tag.tag}
                </Tag>
            ))}
          </div>
      ),
    },
    {
      title: "Special Discounts",
      dataIndex: "specialDiscounts",
      key: "specialDiscounts",
      render: (discounts) => (
          <div className="space-y-2">
            {discounts?.map((discount, index) => (
                <div
                    key={index}
                    className={`p-2 rounded-lg border ${
                        discount.isAvailable
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-gray-200 bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-2 text-emerald-600 font-medium">
                    <Percent className="w-4 h-4" />
                    {discount.discount}% Off
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {discount.Description}
                  </p>
                </div>
            ))}
          </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
          <Tooltip title="Remove flag from this activity">
            <Button
                onClick={() => handleUnflag(record._id)}
                className="border-none shadow-none hover:bg-red-50 text-red-500 hover:text-red-600"
                icon={<Flag className="w-4 h-4" />}
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
        <div className="min-h-screen bg-gray-50/50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-6 h-6 text-white" />
                  <h1 className="text-2xl font-bold text-white">
                    Flagged Activities
                  </h1>
                </div>
                <p className="text-gray-400">
                  Review and manage reported activities
                </p>
              </div>

              {/* Stats Card */}
              <div className="mb-8">
                <div className="bg-[#1C325B]/5 p-6 rounded-xl border border-[#1C325B]/10">
                  <div className="flex items-center gap-3">
                    <Flag className="w-5 h-5 text-[#1C325B]" />
                    <span className="text-[#1C325B] font-medium">
                                        Total Flagged Activities: {totalFlagged}
                                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Spin size="large" />
                  </div>
              ) : activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <div className="p-4 bg-gray-100/80 rounded-full">
                      <AlertCircle className="w-10 h-10 text-[#1C325B]/30" />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">
                      No flagged activities found
                    </p>
                  </div>
              ) : (
                  <Table
                      columns={columns}
                      dataSource={activities}
                      rowKey="_id"
                      loading={loading}
                      pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Total ${total} activities`
                      }}
                      className="border border-gray-200 rounded-lg"
                      rowClassName="hover:bg-[#1C325B]/5"
                  />
              )}
            </div>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default FlaggedActivities;