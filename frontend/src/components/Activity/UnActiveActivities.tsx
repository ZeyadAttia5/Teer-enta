import React, { useEffect, useState } from "react";
import {
  Switch,
  Table,
  Tag,
  Form,
  Input,
  ConfigProvider,
  Spin,
  Button,
  Tooltip,
  Select,
  Badge,
  Image
} from "antd";
import {
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  ImageIcon
} from "lucide-react";
import Filter from "../shared/Filter";
import { TActivity } from "../../types/Activity/Activity.ts";
import { TActivityCategory } from "../../types/Activity/ActivityCategory.ts";
import { TPreferenceTag } from "../../types/Itinerary/PreferenceTag";
import { activateActivity, getUnActiveActivities } from "../../api/activity.ts";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";

const { Option } = Select;

const UnActiveActivities = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await getUnActiveActivities();
      setActivities(res.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

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
                    alt="Activity"
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
      width: 200,
      render: (name) => (
          <span className="font-medium text-[#1C325B]">{name}</span>
      ),
      ...Filter({
        dataIndex: "name",
        filterFunction: (value, record) =>
            record.name.toLowerCase().startsWith(value.toLowerCase()),
        type: "text",
      }),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category) => (
          <Tooltip title={category?.category}>
            <Tag className="px-2 py-1 bg-[#1C325B]/10 text-[#1C325B] border-0 rounded-md whitespace-nowrap truncate max-w-[100px]">
              {category?.category || "N/A"}
            </Tag>
          </Tooltip>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      width: 250,
      render: (date, record) => (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{moment(date).format("MMM DD, YYYY")}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{record.time}</span>
            </div>
          </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 120,
      render: (loc) => (
          <Button
              type="link"
              className="flex items-center gap-2 text-[#1C325B] hover:text-[#2A4575] p-0"
              onClick={() => window.open(`https://www.google.com/maps?q=${loc?.lat},${loc?.lng}`, '_blank')}
          >
            <MapPin className="w-4 h-4" />
            View Map
          </Button>
      ),
    },
    {
      title: "Tags",
      dataIndex: "preferenceTags",
      key: "preferenceTags",
      width: 200,
      render: (tags) => (
          <Select
              mode="multiple"
              style={{ width: '100%' }}
              defaultValue={tags?.map(tag => tag.tag)}
              disabled={true}
              maxTagCount={2}
              bordered={false}
          >
            {tags?.map(tag => (
                <Option key={tag._id} value={tag.tag}>
                  {tag.tag}
                </Option>
            ))}
          </Select>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 120,
      render: (isActive) => (
          <Badge
              status={isActive ? "success" : "error"}
              text={isActive ? "Active" : "Inactive"}
              className="px-2 py-1 bg-gray-50 rounded-md inline-flex items-center gap-2"
          />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (record) => (
          <Switch
              checkedChildren="Activate"
              unCheckedChildren="Inactive"
              defaultChecked={record.isActive}
              onChange={async (checked) => {
                await activateActivity(record._id);
                fetchActivities();
              }}
          />
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
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-white" />
                    <h3 className="m-0 text-xl font-semibold text-white">
                      Inactive Activities Management
                    </h3>
                  </div>
                  <p className="text-gray-200 mt-2 mb-0 text-sm">
                    View and manage inactive activities efficiently
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
                    <div className="overflow-hidden">
                      <Table
                          columns={columns}
                          dataSource={activities}
                          rowKey="_id"
                          pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} activities`,
                            className: "px-6",
                            showSizeChanger: true,
                            showQuickJumper: true,
                          }}
                          scroll={{ x: true }}
                          className="ant-table-with-actions"
                          rowClassName="hover:bg-[#1C325B]/5"
                          locale={{
                            emptyText: (
                                <div className="py-12 text-center text-gray-500">
                                  <ClipboardList className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                  <p className="text-base font-medium">No inactive activities found</p>
                                  <p className="text-sm text-gray-400">
                                    All activities are currently active
                                  </p>
                                </div>
                            ),
                          }}
                      />
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default UnActiveActivities;