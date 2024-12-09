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
  message, Popover, Space,
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
      setActivities(response??.data);
    } catch (error) {
      message.warning( error??.response??.data??.message);
    } finally {
      setLoading(false);
    }
  };
  const getMActivities = async () => {
    setLoading(true);
    try {
      const response = await getMyActivities();
      setActivities(response??.data);
    } catch (error) {
      if (error??.response??.status === 404) {
        message.info("You didnt create any activities yet");
      } else {
        message.warning( error??.response??.data??.message);
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
      message.warning(error??.response??.data??.message);
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const response = await getPreferenceTags();
      setPreferenceTags(response??.data);
    } catch (error) {
      message.warning(error??.response??.data??.message);
    }
  };

  const handleCreateActivity = () => {
    setIsEditing(false);
    setIsViewing(false);
    setCurrentActivity(null);
    form??.resetFields();
    setIsModalVisible(true);
  };

  const handleEditActivity = (activity) => {
    setIsEditing(true);
    setIsViewing(false);
    setCurrentActivity(activity);
    setSelectedImage(activity.imageUrl);
    form??.setFieldsValue({
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
    setSelectedImage(activity.imageUrl);
    form??.setFieldsValue({
      ...activity,
      date: moment(activity.date),
      time: moment(activity.time, "HH:mm"),
      priceMin: activity.price?.min,
      priceMax: activity.price?.max,
      preferenceTags: activity.preferenceTags??.map((tag) => tag._id),
      category: activity.category?._id,
      specialDiscounts: activity.specialDiscounts,
    });
    setLocation(activity.location);
    setIsModalVisible(true);
  };

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      message.success("Activity deleted successfully");
      fetchActivities();
    } catch (error) {
      message.warning(error??.response??.data??.message);
    }
  };

  const handleFormSubmit = async (values) => {
    const activityData = {
      ...values,
      imageUrl: selectedImage,
      date: values.date??.toISOString(),
      time: values.time??.format("HH:mm"),
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
        message.success("Activity updated successfully" );
      } else {
        await createActivity(activityData);
        message.success("Activity created successfully" );
      }
      fetchActivities();
      setIsModalVisible(false);
    } catch (error) {
      message.warning(error??.response??.data??.message);
    }
  };

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const center = {
    lat: location??.lat || -34.397,
    lng: location??.lng || 150.644,
  };

  const handleMapClick = (event) => {
    setLocation({ lat: event.latLng?.lat(), lng: event.latLng?.lng() });
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
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 80,
      render: (category) => (
          <Tooltip title={category?.category}>
            <Tag className="px-2 py-1 bg-[#1C325B]/10 text-[#1C325B] border-0 rounded-md whitespace-nowrap truncate max-w-[70px]">
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
              <span className="font-medium">{moment(date)?.format("MMM DD, YYYY")}</span>
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
      title: "Discounts",
      dataIndex: "specialDiscounts",
      key: "specialDiscounts",
      width: 150,
      render: (discounts) => (
          <Popover
              content={
                <div className="max-w-xs">
                  {discounts?.map((discount, index) => (
                      <div key={index} className="py-2 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <Badge status={discount.isAvailable ? "success" : "default"} />
                          <span className="font-medium">{discount.discount}% Off</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {discount.Description}
                        </div>
                      </div>
                  ))}
                </div>
              }
              title="Available Discounts"
              trigger="hover"
          >
            <Button type="link" className="p-0">
              {discounts?.length || 0} Discount(s)
            </Button>
          </Popover>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: 'right',
      render: (record) => (
          <Space>
            <Button
                type="primary"
                size="small"
                onClick={() => handleViewActivity(record)}
                icon={<EyeOutlined />}
                className="bg-[#1C325B]"
            />

            {user && user.userRole === "Advertiser" && user._id === record.createdBy && (
                <>
                  <Button
                      type="primary"
                      size="small"
                      onClick={() => handleEditActivity(record)}
                      icon={<EditOutlined />}
                      className="bg-[#1C325B]"
                  />
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
                        type="primary"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                    />
                  </Popconfirm>
                </>
            )}

            {user && user?.userRole === "Admin" && (
                <Tooltip title="Flag as Inappropriate">
                  <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<FlagFilled />}
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await flagActivity(record._id);
                          message.success("Activity flagged as inappropriate");
                          await fetchActivities();
                        } catch (error) {
                          message.warning(error?.response?.data?.message);
                        } finally {
                          setLoading(false);
                        }
                      }}
                  />
                </Tooltip>
            )}
          </Space>
      ),
    },
  ];
// Add this to your Table component props
  const tableProps = {
    columns,
    scroll: { x: 1300 }, // Enable horizontal scrolling
    size: "middle",
    className: "border border-gray-200 rounded-lg",
    rowClassName: "hover:bg-[#1C325B]/5",
  };

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
                <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-6 h-6 text-white" />
                      <h3 className="m-0 text-xl font-semibold text-white">
                        Activity Management
                      </h3>
                    </div>
                    <p className="text-gray-200 mt-2 mb-0 text-sm">
                      Create, view, and manage activities efficiently
                    </p>
                  </div>

                  {/* Action Button */}
                  {user && user.userRole === "Advertiser" && (
                      <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={handleCreateActivity}
                          className="bg-white text-[#1C325B] hover:bg-gray-100 border-none shadow-sm"
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
                                  <p className="text-base font-medium">No activities found</p>
                                  <p className="text-sm text-gray-400">
                                    Create a new activity to get started
                                  </p>
                                </div>
                            ),
                          }}
                      />
                    </div>
                )}
              </div>
            </div>

            {/* Modal for Creating or Editing Activities */}
            <Modal
                title={
                  <div className="flex items-center gap-2">
                    {isViewing ? (
                        <EyeOutlined className="text-[#1C325B]" />
                    ) : isEditing ? (
                        <EditOutlined className="text-[#1C325B]" />
                    ) : (
                        <PlusOutlined className="text-[#1C325B]" />
                    )}
                    <span>
            {isViewing
                ? "View Activity"
                : isEditing
                    ? "Edit Activity"
                    : "Create Activity"}
          </span>
                  </div>
                }
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
                bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
                className="activity-modal"
            >
              <Form
                  form={form}
                  onFinish={handleFormSubmit}
                  initialValues={{ isActive: false, isBookingOpen: false }}
                  layout="vertical"
                  className="space-y-4"
              >
                {isViewing ? (
                    <Item
                        label="Activity Image"
                        name="imageUrl"
                        // rules={[{ required: true, message: 'Please upload an image' }]}
                    >
                      <div className="p-4 bg-gray-50 rounded-lg">
                        {selectedImage ? (
                            <div className="space-y-3">
                              <div className="text-sm text-gray-600 font-medium">Current Image:</div>
                              <div className="flex h-full rounded-lg border-gray-200">
                                <Image
                                    src={selectedImage}
                                    alt="Activity"
                                    className="object-cover justify-items-center"
                                    preview={{
                                      maskClassName: 'w-full h-full',
                                      mask: (
                                          <div className="flex items-center justify-center w-full h-full bg-black/50">
                                            <EyeOutlined className="text-white text-lg" />
                                          </div>
                                      )
                                    }}
                                />
                              </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <div className="text-sm">No image uploaded</div>
                            </div>
                        )}
                      </div>
                    </Item>
                ) : (
                    <Item
                        label="Upload Image"
                        name="imageUrl"
                        // rules={[{ required: true}]}
                    >
                      <ImageUploader
                          onImagePathChange={handleImagePathChange}
                      />
                    </Item>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Item
                      label="Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter activity name' }]}
                  >
                    <Input disabled={isViewing} />
                  </Item>

                  <Item
                      label="Category"
                      name="category"
                      rules={[{ required: true, message: 'Please select a category' }]}
                  >
                    <Select placeholder="Select Category" disabled={isViewing}>
                      {categories?.map((category) => (
                          <Option key={category._id} value={category._id}>
                            {category.category}
                          </Option>
                      ))}
                    </Select>
                  </Item>

                  <Item
                      label="Date"
                      name="date"
                      rules={[{ required: true, message: 'Please select a date' }]}
                  >
                    <DatePicker className="w-full" disabled={isViewing} />
                  </Item>

                  <Item
                      label="Time"
                      name="time"
                      rules={[{ required: true, message: 'Please select a time' }]}
                  >
                    <TimePicker format="HH:mm" className="w-full" disabled={isViewing} />
                  </Item>

                  <Item
                      label="Price Min"
                      name="priceMin"
                      rules={[{ required: true, message: 'Please enter minimum price' }]}
                  >
                    <InputNumber className="w-full" disabled={isViewing} />
                  </Item>

                  <Item
                      label="Price Max"
                      name="priceMax"
                      rules={[{ required: true, message: 'Please enter maximum price' }]}
                  >
                    <InputNumber className="w-full" disabled={isViewing} />
                  </Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Item
                      label="Booking Open"
                      name="isBookingOpen"
                      valuePropName="checked"
                      rules={[{ required: true, message: 'Please specify if booking is open' }]}
                  >
                    <Switch disabled={isViewing} />
                  </Item>

                  <Item
                      label="Active"
                      name="isActive"
                      valuePropName="checked"
                      rules={[{ required: true, message: 'Please specify if activity is active' }]}
                  >
                    <Switch disabled={isViewing} />
                  </Item>
                </div>

                <Item
                    label="Location"
                    name="location"
                    rules={[{ required: true, message: 'Please select a location' }]}
                >
                  <MapContainer
                      longitude={location?.lng}
                      latitude={location?.lat}
                      outputLocation={(lat, lng) => setLocation({ lat, lng })}
                  />
                </Item>

                <Item
                    label="Preference Tags"
                    name="preferenceTags"
                    rules={[{ required: true, message: 'Please select at least one preference tag' }]}
                >
                  <Select
                      mode="multiple"
                      placeholder="Select Tags"
                      disabled={isViewing}
                      className="w-full"
                  >
                    {preferenceTags.map((tag) => (
                        <Option key={tag._id} value={tag._id}>
                          {tag.tag}
                        </Option>
                    ))}
                  </Select>
                </Item>

                <Item
                    label="Special Discounts"
                    className="mb-0"
                    name="specialDiscounts"

                >
                  <Form.List name="specialDiscounts">
                    {(fields, { add, remove }) => (
                        <div className="space-y-4">
                          {fields.map(({ key, name, fieldKey, ...restField }) => (
                              <div
                                  key={key}
                                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                              >
                                <Form.Item
                                    {...restField}
                                    name={[name, "discount"]}
                                    fieldKey={[fieldKey, "discount"]}
                                    rules={[{ required: true, message: "Missing discount" }]}
                                    className="mb-0 flex-1"
                                >
                                  <InputNumber
                                      placeholder="Discount (%)"
                                      disabled={isViewing}
                                      className="w-full"
                                  />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, "Description"]}
                                    fieldKey={[fieldKey, "Description"]}
                                    rules={[{ required: true, message: "Missing description" }]}
                                    className="mb-0 flex-[2]"
                                >
                                  <Input placeholder="Description" disabled={isViewing} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, "isAvailable"]}
                                    fieldKey={[fieldKey, "isAvailable"]}
                                    valuePropName="checked"
                                    rules={[{ required: true, message: "Please specify if discount is available" }]}
                                    className="mb-0"
                                >
                                  <Switch disabled={isViewing} />
                                </Form.Item>
                                {!isViewing && (
                                    <Button
                                        type="text"
                                        onClick={() => remove(name)}
                                        icon={<DeleteOutlined className="text-red-500" />}
                                    />
                                )}
                              </div>
                          ))}
                          {!isViewing && (
                              <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  block
                                  icon={<PlusOutlined />}
                                  className="mt-4"
                              >
                                Add Discount
                              </Button>
                          )}
                        </div>
                    )}
                  </Form.List>
                </Item>

                {!isViewing && (
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                          type="default"
                          onClick={() => setIsModalVisible(false)}
                          className="mr-2"
                      >
                        Cancel
                      </Button>
                      <Button
                          type="primary"
                          htmlType="submit"
                          className="bg-[#1C325B]"
                      >
                        {isEditing ? "Update Activity" : "Create Activity"}
                      </Button>
                    </div>
                )}
              </Form>
            </Modal>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default AllActivitiesCRUD;
