import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Switch,
  Select,
  notification,
  Popconfirm,
  InputNumber,
    Image,
  Row,
  Col,
  Card,
  Badge,
  Tooltip,
  Tag,
  Spin,
  ConfigProvider,
  message,
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
  ClipboardList, ImageIcon,
} from "lucide-react";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getMyActivities,
  flagActivity,
} from "../../api/activity.ts"; // Replace with actual API path
import { getActivityCategories } from "../../api/activityCategory.ts";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FlagFilled, ExclamationCircleOutlined
} from "@ant-design/icons";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import ImageUploader from "../Images/imageUploader";
import moment from "moment";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { getPreferenceTags } from "../../api/preferenceTags.ts";
import { useLocation } from "react-router-dom";
import MapContainer from "../shared/GoogleMaps/GoogleMaps";

const { Item } = Form;
const { Option } = Select;

const AllActivitiesCRUD = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [preferenceTags, setPreferenceTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 }); // Default location
  const [form] = Form.useForm();
  const locationn = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch activities, categories, and tags on component load
  useEffect(() => {
    if (locationn?.pathname === "/activities/my") {
      // console.log("My Activities");
      getMActivities();
    } else {
      console.log("All Activities");
      fetchActivities(); // Assuming fetchActivities is your function to get all activities
    }
    fetchCategories();
    fetchPreferenceTags();
  }, [locationn?.pathname]);

  const handleImagePathChange = (path: string) => {
    setSelectedImage(path);
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      notification.error({ message: "Error fetching activities" });
    } finally {
      setLoading(false);
    }
  };
  const getMActivities = async () => {
    setLoading(true);
    try {
      const response = await getMyActivities();
      setActivities(response.data);
    } catch (error) {
      if (error.response.status === 404) {
        notification.info({ message: "You didnt create any activities yet" });
      } else {
        notification.error({ message: "Error fetching activities" });
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await getActivityCategories();
      setCategories(response);
    } catch (error) {
      notification.error({ message: "Error fetching categories" });
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const response = await getPreferenceTags();
      setPreferenceTags(response.data);
    } catch (error) {
      notification.error({ message: "Error fetching tags" });
    }
  };

  const handleCreateActivity = () => {
    setIsEditing(false);
    setIsViewing(false);
    setCurrentActivity(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditActivity = (activity) => {
    setIsEditing(true);
    setIsViewing(false);
    setCurrentActivity(activity);
    form.setFieldsValue({
      ...activity,
      date: moment(activity.date),
      time: moment(activity.time, "HH:mm"),
      priceMin: activity.price?.min,
      priceMax: activity.price?.max,
      preferenceTags: activity.preferenceTags.map((tag) => tag._id),
      category: activity.category?._id,
      specialDiscounts: activity.specialDiscounts,
    });
    setLocation(activity.location);
    setIsModalVisible(true);
  };

  const handleViewActivity = (activity) => {
    setIsViewing(true);
    setIsEditing(false);
    setCurrentActivity(activity);
    form.setFieldsValue({
      ...activity,
      date: moment(activity.date),
      time: moment(activity.time, "HH:mm"),
      priceMin: activity.price?.min,
      priceMax: activity.price?.max,
      preferenceTags: activity.preferenceTags.map((tag) => tag._id),
      category: activity.category?._id,
      specialDiscounts: activity.specialDiscounts,
    });
    setLocation(activity.location);
    setIsModalVisible(true);
  };

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      notification.success({ message: "Activity deleted successfully" });
      fetchActivities();
    } catch (error) {
      notification.error({ message: "Error deleting activity" });
    }
  };

  const handleFormSubmit = async (values) => {
    const activityData = {
      ...values,
      imageUrl: selectedImage,
      date: values.date.toISOString(),
      time: values.time.format("HH:mm"),
      location,
      price: {
        min: values.priceMin,
        max: values.priceMax,
      },
      preferenceTags: values.preferenceTags, // Assuming these are tag _ids
      category: values.category, // Assuming this is category _id
    };

    try {
      if (isEditing && currentActivity) {
        // console.log("Updating activity", activityData);
        await updateActivity(activityData, currentActivity?._id);
        notification.success({ message: "Activity updated successfully" });
      } else {
        await createActivity(activityData);
        notification.success({ message: "Activity created successfully" });
      }
      fetchActivities();
      setIsModalVisible(false);
    } catch (error) {
      notification.error({ message: "Error submitting activity" });
    }
  };

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const center = {
    lat: location.lat || -34.397,
    lng: location.lng || 150.644,
  };

  const handleMapClick = (event) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };
  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      width: 100,
      render: (imageUrl) => (
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Activity"
                    width={64}
                    height={64}
                    style={{ objectFit: 'cover' }}
                    preview={{
                      maskClassName: 'w-full h-full',
                      mask: (
                          <div className="flex items-center justify-center w-full h-full bg-black/50 cursor-pointer">
                            <EyeOutlined className="text-white text-lg" />
                          </div>
                      )
                    }}
                />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
            )}
          </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
          <span className="font-medium text-[#1C325B]">{name}</span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      key: "date",
      render: (date, record) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-[#1C325B]" />
              <span>{moment(date).format("MMM DD, YYYY")}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-[#1C325B]" />
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
            <span className="text-gray-700">
            ({loc?.lat.toFixed(4)}, {loc?.lng.toFixed(4)})
          </span>
          </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
          <Tag className="px-3 py-1.5 bg-[#1C325B]/10 text-[#1C325B] border-0 rounded-lg font-medium">
            {category?.category || "N/A"}
          </Tag>
      ),
    },
    {
      title: "Tags",
      dataIndex: "preferenceTags",
      key: "preferenceTags",
      render: (tags) => (
          <div className="flex flex-wrap gap-1.5">
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
      title: "Discounts",
      dataIndex: "specialDiscounts",
      key: "specialDiscounts",
      render: (discounts) => (
          <div className="space-y-2 max-w-xs">
            {discounts?.map((discount, index) => (
                <div
                    key={index}
                    className={`p-2 rounded-lg border ${
                        discount.isAvailable
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-gray-200 bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-2 text-emerald-600 font-medium">
                    <Percent className="w-4 h-4" />
                    {discount.discount}% Off
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">
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
      width: 200,
      render: (record) => (
          <div className="flex space-x-2">
            <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewActivity(record)}
                className="bg-[#1C325B] hover:bg-[#1C325B]/90 flex items-center gap-1"
            >
              View
            </Button>

            {user && user.userRole === "Advertiser" && user._id === record.createdBy && (
                <>
                  <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEditActivity(record)}
                      className="bg-[#1C325B] hover:bg-[#1C325B]/90 flex items-center gap-1"
                  >
                    Edit
                  </Button>
                  <Popconfirm
                      title="Delete Activity"
                      description="Are you sure you want to delete this activity?"
                      icon={<ExclamationCircleOutlined className="text-red-500" />}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{
                        className: "bg-red-500 hover:bg-red-600 border-red-500",
                      }}
                      onConfirm={() => handleDeleteActivity(record._id)}
                  >
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined className="text-lg" />}
                        className="hover:bg-red-50 flex items-center gap-1 px-3 py-1 border border-red-300 rounded-lg
                   transition-all duration-200 hover:border-red-500"
                    >
                      <span className="text-red-500 font-medium">Delete</span>
                    </Button>
                  </Popconfirm>
                </>
            )}

            {user && user?.userRole === "Admin" && (
                <Tooltip title="Flag as Inappropriate">
                  <Badge count={0} offset={[-5, 5]}>
                    <Button
                        type="text"
                        danger
                        icon={<FlagFilled className="text-lg" />}
                        onClick={async () => {
                          try {
                            setLoading(true);
                            await flagActivity(record._id);
                            message.success("Activity flagged as inappropriate");
                            await fetchActivities();
                          } catch (error) {
                            message.error("Failed to flag activity");
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="hover:bg-red-50 flex items-center gap-1 px-3 py-1 border border-red-300 rounded-lg
                   transition-all duration-200 hover:border-red-500"
                    >
                      <span className="text-red-500 font-medium">Flag</span>
                    </Button>
                  </Badge>
                </Tooltip>
            )}
          </div>
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
                <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <ClipboardList className="w-6 h-6 text-white" />
                      <h3
                        className="m-0 text-lg font-semibold"
                        style={{ color: "white" }}
                      >
                        Activity Management
                      </h3>
                    </div>
                    <p className="text-gray-200 mt-2 mb-0 opacity-90">
                      Create, view, and manage activities efficiently
                    </p>
                  </div>

                  {/* Action Button */}
                  {user && user.userRole === "Advertiser" && (
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleCreateActivity}
                      className="bg-[#2A4575] hover:bg-[#2A4575]/90 border-none"
                      size="large"
                    >
                      Create Activity
                    </Button>
                  )}
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

          {/* Modal for Creating or Editing Activities */}
          <Modal
            title={
              isViewing
                ? "View Activity"
                : isEditing
                ? "Edit Activity"
                : "Create Activity"
            }
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleFormSubmit}
              initialValues={{ isActive: false, isBookingOpen: false }}
              layout="vertical"
            >
              {/* Form items */}
              <ImageUploader onImagePathChange={handleImagePathChange} />
              <Item label="Name" name="name" rules={[{ required: true }]}>
                <Input disabled={isViewing} />
              </Item>
              <Item label="Date" name="date" rules={[{ required: true }]}>
                <DatePicker disabled={isViewing} />
              </Item>
              <Item label="Time" name="time" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" disabled={isViewing} />
              </Item>
              <Item label="Price Min" name="priceMin">
                <InputNumber disabled={isViewing} />
              </Item>
              <Item label="Price Max" name="priceMax">
                <InputNumber disabled={isViewing} />
              </Item>
              <Item
                label="Booking Open"
                name="isBookingOpen"
                valuePropName="checked"
              >
                <Switch disabled={isViewing} />
              </Item>
              <Item label="Active" name="isActive" valuePropName="checked">
                <Switch disabled={isViewing} />
              </Item>
              {/* Map Container and Category Dropdown */}
              <Item label="Location">
                <MapContainer
                  longitude={location.lng}
                  latitude={location.lat}
                  outputLocation={(lat, lng) => setLocation({ lat, lng })}
                />
              </Item>
              <Item
                label="Category"
                name="category"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Category" disabled={isViewing}>
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.category}
                    </Option>
                  ))}
                </Select>
              </Item>
              <Item label="Preference Tags" name="preferenceTags">
                <Select
                  mode="multiple"
                  placeholder="Select Tags"
                  disabled={isViewing}
                >
                  {preferenceTags.map((tag) => (
                    <Option key={tag._id} value={tag._id}>
                      {tag.tag}
                    </Option>
                  ))}
                </Select>
              </Item>

              {/* Special Discounts Section */}
              <Item label="Special Discounts">
                <Form.List name="specialDiscounts">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <div
                          key={key}
                          style={{ display: "flex", marginBottom: 8 }}
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "discount"]}
                            fieldKey={[fieldKey, "discount"]}
                            rules={[
                              { required: true, message: "Missing discount" },
                            ]}
                            style={{ flex: 1 }}
                          >
                            <InputNumber
                              placeholder="Discount (%)"
                              disabled={isViewing}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "Description"]}
                            fieldKey={[fieldKey, "Description"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing description",
                              },
                            ]}
                            style={{ flex: 2, marginLeft: 8 }}
                          >
                            <Input
                              placeholder="Description"
                              disabled={isViewing}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "isAvailable"]}
                            fieldKey={[fieldKey, "isAvailable"]}
                            valuePropName="checked"
                            style={{ marginLeft: 8 }}
                          >
                            <Switch disabled={isViewing} />
                          </Form.Item>
                          {!isViewing && (
                            <Button
                              type="link"
                              onClick={() => remove(name)}
                              style={{ marginLeft: 8 }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      {!isViewing && (
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block>
                            Add Discount
                          </Button>
                        </Form.Item>
                      )}
                    </>
                  )}
                </Form.List>
              </Item>

              {/* Submit Button */}
              {!isViewing && (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-green-600"
                >
                  {isEditing ? "Update" : "Create"}
                </Button>
              )}
            </Form>
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AllActivitiesCRUD;
