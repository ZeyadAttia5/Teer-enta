import { useEffect, useState } from "react";
import { TActivity } from "../../types/Activity/Activity.ts";
import {
  activateActivity,
  getActivities,
  getUnActiveActivities,
  getUpcomingActivities,
} from "../../api/activity.ts";
import React from "react";
import { Switch, Table, Tag, Form, Input } from "antd";
import { TActivityCategory } from "../../types/Activity/ActivityCategory.ts";
import { TTag } from "../../types/Tag.ts";
import Filter from "../shared/Filter.jsx";
import { TPreferenceTag } from "../../types/Itinerary/PreferenceTag";
import {
  Button,
  Modal,
  DatePicker,
  TimePicker,
  Select,
  notification,
  Popconfirm,
  InputNumber,
  Row,
  Col,
  Card,
  Badge,
  Tooltip,
  Spin,
  ConfigProvider,
  message
} from "antd";
import {
  Flag,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  Tag as TagIcon,
  Percent,
  AlertCircle,
  PackageIcon,
  ClipboardList
} from 'lucide-react';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  TagOutlined,
  CommentOutlined,
  StarOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FlagFilled,
} from "@ant-design/icons";

// Tactivity keys are the dataIndex of each object in the data array

const UnActiveActivities = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [activities, setActivities] = useState<TActivity[]>([]);
  const [loading, setLoading] = useState(false)
  const fetchActivities = async () => {
    setLoading(true)
    let res=await getUnActiveActivities()
      setActivities(res.data);
   setLoading(false)
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...Filter({
        dataIndex: "name",
        filterFunction: (value, record) =>
          record.name.toLowerCase().startsWith(value.toLowerCase()),
        type: "text",
      }),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      ...Filter({
        dataIndex: "date",
        filterFunction: (value, record) =>
          new Date(value).getTime() === new Date(record.date).getTime(),
        type: "date",
      }),
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "isBookingOpen",
      dataIndex: "isBookingOpen",
      key: "isBookingOpen",
      render: (value: boolean) => (value ? "Yes" : "No"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: { min: Number; max: Number }) =>
        `${value.min}-${value.max}`,
      sorter: (a: TActivity, b: TActivity) =>
        (a.price.min ?? 0 + (a.price.max ?? 0)) -
        ((b.price.min ?? 0) + (b.price.max ?? 0)),
      ...Filter({
        dataIndex: "price",
        filterFunction: (value, record) => {
          let v = Number.parseInt(value);
          return record.price.min <= v && record.price.max >= v;
        },
        type: "number",
      }),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      ...Filter({
        dataIndex: "category",
        filterFunction: (value, record) =>
          record.category?.category
            .toLowerCase()
            .startsWith(value.toLowerCase()),
        type: "text",
      }),
      render: (value: TActivityCategory) => value?.category,
    },
    {
      title: "Tags",
      dataIndex: "preferenceTags",
      key: "preferenceTags",
      filters: [],
      onFilter: (value, record) =>
        record.tags?.some((tag) => tag._id === value),
      render: (preferenceTags: TPreferenceTag[]) => (
        <>
          {preferenceTags?.map((tag, index) => {
            let color = index % 2 ? "geekblue" : "green";
            return (
              <Tag color={color} key={tag._id}>
                {tag.tag && tag.tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Discounts",
      dataIndex: "specialDiscounts",
      key: "specialDiscounts",
      render: (
        discounts: {
          discount: number;
          Description: string;
          isAvailable: boolean;
        }[]
      ) => (
        <>
          {discounts?.map((discount, index) => {
            return (
              <Tag color={discount.isAvailable ? "green" : "red"} key={index}>
                {discount.Description?.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Ratings",
      dataIndex: "ratings",
      key: "ratings",
      ...Filter({
        dataIndex: "ratings",
        filterFunction: (value, record) =>
          record.ratings.some(
            (rating) => rating.rating === Number.parseFloat(value)
          ),
        type: "number",
      }),
      render: (ratings: { createdBy: string; rating: number }[]) => (
        <>
          {ratings.map((rating) => {
            return (
              <Tag
                color={rating.rating > 2.5 ? "blue" : "warning"}
                key={rating.createdBy}
              >
                {rating.rating}
              </Tag>
            );
          })}
        </>
      ),
      sorter: (a: TActivity, b: TActivity) =>
        a.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
          (a.ratings.length || 1) -
        b.ratings.reduce((acc, cur) => acc + cur.rating, 0) /
          (b.ratings.length || 1),
    },
    
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (value, record) => {
        return (
          <Switch
            checkedChildren="Activate"
            unCheckedChildren="Deactivate"
            defaultChecked={record.isActive}
            onChange={(checked) => {
              console.log(checked);

              activateActivity(record._id);
              fetchActivities();
            }}
          />
        );
      },
    },
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    columns.forEach((column) => {
      if (column.key === "preferenceTags")
        column["filters"] = activities?.map((activity) => activity.preferenceTags)
          .flat()
          .map((tag) => ({ text: tag.tag, value: tag._id }));
    });
  }, [activities]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-x: auto;" >
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-x: auto;">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 mb-2">
                <ClipboardList className="w-6 h-6 text-white" />
                <h3 className="m-0 text-lg font-semibold" style={{ color: "white" }}>
                  Unactive Activity Management
                </h3>
              </div>
              <p className="text-gray-200 mt-2 mb-0 opacity-90">
                View and manage unactive activities efficiently
              </p>
            </div>

           
            
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
              dataSource={activities}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total ${total} activities`,
              }}
              className="border border-gray-200 rounded-lg"
              rowClassName="hover:bg-[#1C325B]/5"
              locale={{
                emptyText: (
                  <div className="py-8 text-center text-gray-500">
                    No activities found
                  </div>
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UnActiveActivities;
