import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  Divider,
  message,
  notification,
  Tooltip,
  Switch,
  ConfigProvider,
  Spin,
  Badge,
  Table,
  Tag, Popconfirm, Image, TimePicker
} from "antd";
import {
  GlobalOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  EnvironmentTwoTone,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FlagFilled,
  SearchOutlined, ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Calendar,
  Clock,
  MapPin,
    Type,
  Tag as TagIcon,
  ClipboardList, ImageIcon,
} from "lucide-react";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getMyItineraries,
  flagIternaary,
} from "../../api/itinerary.ts";
import { getCurrency } from "../../api/account.ts";
import { getActivities } from "../../api/activity.ts";
import { getPreferenceTags } from "../../api/preferenceTags.ts";
import ImageUploader from "../../components/Images/imageUploader";

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const TourguideItineraryScreen = ({ setFlag }) => {
  setFlag(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [itineraries, setItineraries] = useState([]);
  const [myItineraries, setMyItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedimage, setSelectedimage] = useState(null);
  const [activitiesList, setActivitiesList] = useState([]);
  const [preferenceTagsList, setPreferenceTagsList] = useState([]);
  const [refreshItineraries, setRefreshItineraries] = useState(false);
  const [currency, setCurrency] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itinerariesData, myItinerariesData] = await Promise.all([
          getItineraries(),
          getMyItineraries(),
        ]);
        const itineraryMap = new Map();
        itinerariesData.forEach(itinerary => {
          itineraryMap.set(itinerary._id, itinerary);
        });
        console.log("dasd1",itinerariesData);
        myItinerariesData.forEach(itinerary => {
          if (itinerary.isActive) {
            itineraryMap.set(itinerary._id, itinerary);
          }
        });
        const combinedItineraries = Array.from(itineraryMap.values());
        console.log("dasd",combinedItineraries);
        setItineraries(combinedItineraries);
        setMyItineraries(myItinerariesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.warning(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchCurrency();
    fetchActivities();
    fetchPreferenceTags();
  }, [location.pathname, refreshItineraries]);

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setActivitiesList(data.data);
    } catch (error) {
      message.warning(error.response.data.message||"Failed to fetch activities");
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const data = await getPreferenceTags();
      setPreferenceTagsList(data.data);
    } catch (error) {
      message.warning(error.response.data.message||"Failed to fetch preference tags");
    }
  };

  const handlePathChange = (path) => {
    setSelectedimage(path);
  };

  const showModal = (itinerary = null) => {
    setEditingItinerary(itinerary);
    setIsModalVisible(true);
    setSelectedimage(itinerary?.imageUrl);
    if (itinerary) {
      const formattedAvailableDates = itinerary.availableDates?.map((date) => {
        const startDate = moment(date.Date);
        const endTime = moment(date.Times, "HH:mm");
        const endDate = moment(date.Date).set({
          hour: endTime.get('hour'),
          minute: endTime.get('minute')
        });

        return [startDate, endDate];
      });

      const formattedTimeline = itinerary.timeline?.map(item => ({
        activity: item.activity?._id || item.activity,
        startTime: moment(item.startTime, "HH:mm"),
        duration: item.duration
      }));

      const formattedActivities = itinerary.activities?.map(item => ({
        activity: item.activity._id || item.activity,
        duration: item.duration
      }));

      form.setFieldsValue({
        ...itinerary,
        availableDates: formattedAvailableDates,
        timeline: formattedTimeline,
        activities: formattedActivities,
        preferenceTags: itinerary.preferenceTags.map((tag) => tag._id),
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItinerary(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const formattedAvailableDates = values.availableDates.map(([startDate, endDate]) => ({
        Date: startDate.format("YYYY-MM-DD"),
        Times: endDate.format("HH:mm"),
      }));

      const formattedActivities = values.activities.map(activity => ({
        activity: activity.activity,
        duration: parseInt(activity.duration),
      }));

      const formattedTimeline = values.timeline.map(item => ({
        activity: item.activity,
        startTime: item.startTime.format("HH:mm"),
        duration: parseInt(item.duration),
      }));

      const formattedData = {
        ...values,
        imageUrl: selectedimage,
        availableDates: formattedAvailableDates,
        activities: formattedActivities,
        timeline: formattedTimeline,
      };

      if (editingItinerary) {
        await updateItinerary(editingItinerary._id, formattedData);
        message.success("Itinerary updated successfully");
      } else {
        await createItinerary(formattedData);
        message.success("Itinerary created successfully");
      }
      setRefreshItineraries((prev) => !prev);
      handleCancel();

    } catch (error) {
      message.warning(error.response.data.message||"Failed to save itinerary");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id);
      message.success("Itinerary deleted successfully");
      setRefreshItineraries((prev) => !prev);
    } catch (error) {
      message.warning(error.response.data.message||"Failed to delete itinerary");
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
                    `${moment(date.Date).format("MMM DD, YYYY")} at ${date.Date.Times}`).join('\n')
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
      title: "Actions",
      key: "actions",
      width: 200,
      fixed: 'right',
      render: (record) => (
          <Space>
            <Button
                type="primary"
                size="small"
                onClick={() => navigate(`/itinerary/iternaryDetails/${record._id}`)}
                icon={<EyeOutlined />}
                className="bg-[#1C325B]"
            />

            {myItineraries?.some((myItinerary) => myItinerary._id === record._id) && (
                <>
                  <Button
                      type="primary"
                      size="small"
                      onClick={() => showModal(record)}
                      icon={<EditOutlined />}
                      className="bg-[#1C325B]"
                  />
                  <Popconfirm
                      title="Delete Itinerary"
                      description="Are you sure you want to delete this itinerary?"
                      icon={<ExclamationCircleOutlined className="text-red-500" />}
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{
                        className: "bg-red-500 hover:bg-red-600 border-red-500",
                      }}
                      onConfirm={() => handleDelete(record._id)}
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

            {user?.userRole === "Admin" && (
                <Tooltip title="Flag as Inappropriate">
                  <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<FlagFilled />}
                      onClick={async () => {
                        try {
                          await flagIternaary(record._id);
                          message.success("Itinerary flagged as inappropriate");
                          setRefreshItineraries((prev) => !prev);
                        } catch (error) {
                          message.warning(error.response.data.message||"Failed to flag itinerary");
                        }
                      }}
                  />
                </Tooltip>
            )}
          </Space>
      ),
    },
  ];

  const filteredItineraries = itineraries?.filter((itin) =>
      itin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                        <h3 className="m-0 text-lg font-semibold text-white">
                          Itinerary Management
                        </h3>
                      </div>
                      <p className="text-gray-200 mt-2 mb-0 opacity-90">
                        Create, view, and manage your itineraries efficiently
                      </p>
                    </div>

                    {user?.userRole === "TourGuide" && (
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                            className="bg-[#2A4575] hover:bg-[#2A4575]/90 border-none"
                            size="large"
                        >
                          Add Itinerary
                        </Button>
                    )}
                  </div>
                </div>

                {/* Search Section */}
                <div className="p-6">
                  {/* Table Section */}
                  {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <Spin size="large" />
                      </div>
                  ) : (
                      <Table
                          columns={columns}
                          dataSource={filteredItineraries}
                          rowKey="_id"
                          pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} itineraries`,
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

        <Modal
            title={editingItinerary ? "Edit Itinerary" : "Add Itinerary"}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            width={1000}
        >
          <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                isActive: true,
                isBookingOpen: true,
                locations: [{ name: '' }],
                activities: [{ activity: undefined, duration: undefined }],
                timeline: [{ activity: undefined, startTime: undefined, duration: undefined }]
              }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <ImageUploader onImagePathChange={handlePathChange} />
              </div>

              <Form.Item
                  name="name"
                  label="Itinerary Name"
                  rules={[{ required: true, message: "Please enter the itinerary name" }]}
              >
                <Input placeholder="Enter itinerary name" />
              </Form.Item>

              <Form.Item
                  name="language"
                  label="Language"
                  rules={[{ required: true }]}
              >
                <Select placeholder="Select language">
                  <Option value="English">English</Option>
                  <Option value="Spanish">Spanish</Option>
                  <Option value="Arabic">Arabic</Option>
                  <Option value="French">French</Option>
                </Select>
              </Form.Item>

              <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true }]}
              >
                <InputNumber
                    min={0}
                    className="w-full"
                    formatter={value => `$ ${value}`}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>

              <Form.Item name="accessibility" label="Accessibility" rules={[{required : true}]}>
                <Input placeholder="Enter accessibility details" />
              </Form.Item>

              <Form.Item name="pickupLocation" label="Pickup Location" rules={[{required : true}]}>
                <Input placeholder="Enter pickup location" />
              </Form.Item>

              <Form.Item name="dropOffLocation" label="Drop Off Location" rules={[{required : true}]}>
                <Input placeholder="Enter drop off location" />
              </Form.Item>

              {/* Activities Section */}
              <div className="md:col-span-2">
                <Divider orientation="left">Activities</Divider>
                <Form.List name="activities" rules={[{required : true}]}>
                  {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className="flex gap-4 mb-4">
                              <Form.Item
                                  {...restField}
                                  name={[name, "activity"]}
                                  className="flex-1"
                                  rules={[{ required: true, message: "Please select an activity" }]}
                              >
                                <Select placeholder="Select activity">
                                  {activitiesList?.map((activity) => (

                                      <Option key={activity._id} value={activity._id}>
                                        {activity?.name}
                                      </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                  {...restField}
                                  name={[name, "duration"]}
                                  className="w-32"
                                  rules={[{ required: true, message: "Duration required" }]}
                              >
                                <InputNumber
                                    placeholder="Minutes"
                                    min={1}
                                    addonAfter="min"
                                />
                              </Form.Item>
                              <Button type="text" onClick={() => remove(name)} icon={<DeleteOutlined />} />
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            className="mt-2"
                        >
                          Add Activity
                        </Button>
                      </>
                  )}
                </Form.List>
              </div>

              {/* Locations Section */}
              <div className="md:col-span-2">
                <Divider orientation="left">Locations</Divider>
                <Form.List name="locations" rules={[{required : true}]}>
                  {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className="flex gap-4 mb-4">
                              <Form.Item
                                  {...restField}
                                  name={[name, "name"]}
                                  className="flex-1"
                                  rules={[{ required: true, message: "Location name required" }]}
                              >
                                <Input placeholder="Enter location name" />
                              </Form.Item>
                              <Button type="text" onClick={() => remove(name)} icon={<DeleteOutlined />} />
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            className="mt-2"
                        >
                          Add Location
                        </Button>
                      </>
                  )}
                </Form.List>
              </div>

              {/* Timeline Section */}
              <div className="md:col-span-2">
                <Divider orientation="left">Timeline</Divider>
                <Form.List name="timeline" rules={[{required : true}]}>
                  {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className="flex gap-4 mb-4">
                              <Form.Item
                                  {...restField}
                                  name={[name, "activity"]}
                                  className="flex-1"
                                  rules={[{ required: true, message: "Please select an activity" }]}
                              >
                                <Select placeholder="Select activity">
                                  {activitiesList?.map((activity) => (
                                      <Option key={activity._id} value={activity._id}>
                                        {activity?.name}
                                      </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                  {...restField}
                                  name={[name, "startTime"]}
                                  className="w-32"
                                  rules={[{ required: true, message: "Start time required" }]}
                              >
                                <TimePicker format="HH:mm" className="w-full" />
                              </Form.Item>
                              <Form.Item
                                  {...restField}
                                  name={[name, "duration"]}
                                  className="w-32"
                                  rules={[{ required: true, message: "Duration required" }]}
                              >
                                <InputNumber
                                    placeholder="Minutes"
                                    min={1}
                                    addonAfter="min"
                                />
                              </Form.Item>
                              <Button type="text" onClick={() => remove(name)} icon={<DeleteOutlined />} />
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            className="mt-2"
                        >
                          Add Timeline Entry
                        </Button>
                      </>
                  )}
                </Form.List>
              </div>

              {/* Available Dates Section */}
              <div className="md:col-span-2">
                <Divider orientation="left">Available Dates</Divider>
                <Form.List name="availableDates" rules={[{required : true}]}>
                  {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className="flex gap-4 mb-4">
                              <Form.Item
                                  {...restField}
                                  name={[name]}
                                  className="flex-1"
                                  rules={[{ required: true, message: "Please select date and time" }]}
                              >
                                <DatePicker.RangePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full"
                                />
                              </Form.Item>
                              <Button type="text" onClick={() => remove(name)} icon={<DeleteOutlined />} />
                            </div>
                        ))}
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                            className="mt-2"
                        >
                          Add Available Date
                        </Button>
                      </>
                  )}
                </Form.List>
              </div>

              {/* Preference Tags */}
              <div className="md:col-span-2">
                <Form.Item name="preferenceTags" label="Preference Tags" rules={[{required : true}]}>
                  <Select
                      mode="multiple"
                      placeholder="Select preference tags"
                      allowClear
                      className="w-full"
                  >
                    {preferenceTagsList?.map((tag) => (
                        <Option key={tag._id} value={tag._id}>
                          {tag.tag}
                        </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              {/* Status Toggles */}
              <Form.Item label="Booking Status" name="isBookingOpen" valuePropName="checked">
                <Switch checkedChildren="Open" unCheckedChildren="Closed" />
              </Form.Item>

              <Form.Item label="Active Status" name="isActive" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>

              {/* Form Actions */}
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-[#1C325B]"
                    loading={loading}
                >
                  {editingItinerary ? "Update Itinerary" : "Create Itinerary"}
                </Button>
              </div>
            </div>
          </Form>
        </Modal>

        {/* View Modal */}
        <Modal
            title="View Itinerary Details"
            visible={isEditFormVisible}
            onCancel={() => setIsEditFormVisible(false)}
            footer={[
              <Button key="back" onClick={() => setIsEditFormVisible(false)}>
                Close
              </Button>,
            ]}
        >
          {selectedItinerary && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="mt-1">{selectedItinerary.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Language</h4>
                  <p className="mt-1">{selectedItinerary.language}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Price</h4>
                  <p className="mt-1">
                    {currency?.code} {(selectedItinerary.price * currency?.rate).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Route</h4>
                  <p className="mt-1">
                    {selectedItinerary.pickupLocation} → {selectedItinerary.dropOffLocation}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Available Dates</h4>
                  <div className="mt-1 space-y-1">
                    {selectedItinerary.availableDates?.map((date, index) => (
                        <p key={index}>
                          {moment(date.Date).format("MMM DD, YYYY")} at {date.Times}
                        </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Preference Tags</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedItinerary.preferenceTags?.map((tag) => (
                        <Tag key={tag._id} className="bg-[#1C325B]/10 text-[#1C325B] border-0">
                          {tag.tag}
                        </Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1 space-x-4">
                    <Tag color={selectedItinerary.isActive ? "success" : "error"}>
                      {selectedItinerary.isActive ? "Active" : "Inactive"}
                    </Tag>
                    <Tag color={selectedItinerary.isBookingOpen ? "success" : "error"}>
                      Booking {selectedItinerary.isBookingOpen ? "Open" : "Closed"}
                    </Tag>
                  </div>
                </div>
              </div>
          )}
        </Modal>
      </ConfigProvider>
  );
};

export default TourguideItineraryScreen;