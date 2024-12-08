import React, { useState, useEffect } from "react";
import {
  Table,
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
  Card,
  notification,
  Badge,
  Tooltip,
  Switch,
  Tag,
  Popconfirm,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import {
  MinusCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FlagFilled,
} from "@ant-design/icons";
import {
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getMyItineraries,
  getItineraries,
  flagIternaary,
} from "../../api/itinerary.ts";
import { getActivities } from "../../api/activity.ts";
import { getPreferenceTags } from "../../api/preferenceTags.ts";
import {
  ChevronRight,
  MapPin,
  Gift,
  RefreshCw,
  Globe,
  Users,
  Plus,
} from "lucide-react";

import moment from "moment";
import "antd";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
} from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrency } from "../../api/account.ts";

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

const MyItineraryScreen = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // States for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPreference, setSelectedPreference] = useState("");
  const [sortBy, setSortBy] = useState("");

  // New state variables for ActivityList and Preference Tags
  const [activitiesList, setActivitiesList] = useState([]);
  const [preferenceTagsList, setPreferenceTagsList] = useState([]);

  // New state variables for viewing itinerary
  const [viewingItinerary, setViewingItinerary] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  const [currency, setCurrency] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/itinerary/my") {
      fetchMyIternaries();
    } else {
      fetchItineraries();
    }
    fetchCurrency();
    fetchActivities();
    fetchPreferenceTags();
  }, [location.pathname]);

  const resetFilters = () => {
    setSelectedBudget("");
    setSelectedDateFilter("");
    setSelectedLanguage("");
    setSelectedPreference("");
    setSortBy("");
    setSearchTerm("");
  };

  const budgets = [...new Set(itineraries.map((itin) => itin.price))];
  const languages = [...new Set(itineraries.map((itin) => itin.language))];

  const filterByDate = (itin) => {
    return itin.availableDates.some((availableDate) => {
      const date = parseISO(availableDate.Date);

      if (isNaN(date)) {
        console.error("Invalid date format:", availableDate.Date);
        return false;
      }

      if (selectedDateFilter === "today") {
        return isToday(date);
      } else if (selectedDateFilter === "thisWeek") {
        return isThisWeek(date, { weekStartsOn: 1 });
      } else if (selectedDateFilter === "thisMonth") {
        return isThisMonth(date);
      } else if (selectedDateFilter === "thisYear") {
        return isThisYear(date);
      } else if (selectedDateFilter === "allUpcoming") {
        return date >= new Date();
      }

      return true;
    });
  };

  const filteredItineraries = itineraries?.filter(
    (itin) =>
      (selectedBudget ? itin.price <= selectedBudget : true) &&
      filterByDate(itin) &&
      (selectedLanguage ? itin.language === selectedLanguage : true) &&
      (selectedPreference
        ? itin.preferenceTags.some((tag) => tag._id === selectedPreference)
        : true) &&
      ((itin.name &&
        itin.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        itin.preferenceTags.some((tag) =>
          tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const sortedItineraries = filteredItineraries?.sort((a, b) => {
    if (sortBy === "pricingHighToLow") {
      return b.price - a.price;
    } else if (sortBy === "pricingLowToHigh") {
      return a.price - b.price;
    } else if (sortBy === "ratingHighToLow") {
      const avgRatingA =
        a.ratings.reduce((sum, r) => sum + r.rating, 0) / a.ratings.length || 0;
      const avgRatingB =
        b.ratings.reduce((sum, r) => sum + r.rating, 0) / b.ratings.length || 0;
      return avgRatingB - avgRatingA;
    } else if (sortBy === "ratingLowToHigh") {
      const avgRatingA =
        a.ratings.reduce((sum, r) => sum + r.rating, 0) / a.ratings.length || 0;
      const avgRatingB =
        b.ratings.reduce((sum, r) => sum + r.rating, 0) / b.ratings.length || 0;
      return avgRatingA - avgRatingB;
    }
    return 0;
  });

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await getItineraries();
      setItineraries(data);
    } catch (error) {
      message.warning("Failed to fetch itineraries");
    }
    setLoading(false);
  };

  const fetchMyIternaries = async () => {
    setLoading(true);
    try {
      const data = await getMyItineraries();
      setItineraries(data);
    } catch (error) {
      if (error.response.status === 404) {
        notification.info({ message: "You didn't create any itineraries yet" });
      } else {
        notification.error({ message: "Error fetching itineraries" });
      }
    }
    setLoading(false);
  };

  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setActivitiesList(data.data);
    } catch (error) {
      message.warning("Failed to fetch activities");
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const data = await getPreferenceTags();
      setPreferenceTagsList(data.data);
    } catch (error) {
      message.warning("Failed to fetch preference tags");
    }
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

  const showModal = async (itinerary = null) => {
    setEditingItinerary(itinerary);
    setIsModalVisible(true);
    if (itinerary) {
      await fetchActivities();
      await fetchPreferenceTags();

      const formattedAvailableDates = itinerary?.availableDates?.map((date) => [
        moment(date.Date),
        moment(`${date.Date} ${date.Times}`, "YYYY-MM-DD HH:mm"),
      ]);
      console.log("formattedAvailableDates", formattedAvailableDates);

      const formattedTimeline = itinerary?.timeline?.map((tl) => ({
        ...tl,
        activity: tl.activity ? tl.activity.name : "Activity not found",
        startTime: tl.startTime ? moment(tl.startTime, "HH:mm") : null,
      }));

      console.log("formattedTimeline", formattedTimeline);

      const formattedActivities = itinerary?.activities?.map((act) => ({
        activity: act.activity ? act.activity._id : "Activity not found",
        duration: act.duration,
      }));

      const formattedPreferenceTags = itinerary?.preferenceTags?.map(
        (tag) => tag._id
      );

      form.setFieldsValue({
        ...itinerary,
        activities: formattedActivities,
        availableDates: formattedAvailableDates,
        timeline: formattedTimeline,
        preferenceTags: formattedPreferenceTags,
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

  const handleDelete = async (id) => {
    try {
      await deleteItinerary(id);
      message.success("Itinerary deleted successfully");
      fetchItineraries();
    } catch (error) {
      message.warning(
        error.response && error.response.status === 400
          ? "Cannot delete itinerary with existing bookings"
          : "Failed to delete itinerary"
      );
    }
  };
  const handleBookItinerary = (id) => {
    navigate(`/itinerary/book/${id}`);
  };
  const onFinish = async (values) => {
    try {
      const formattedAvailableDates = values.availableDates.map(
        ([start, end]) => ({
          Date: start.format("YYYY-MM-DD"),
          Times: end.format("HH:mm"),
        })
      );

      const formattedActivities = values.activities.map((act) => ({
        activity: act.activity,
        duration: act.duration,
      }));

      const formattedLocations = values.locations
        ? values.locations.map((loc) => ({
            name: loc.name,
          }))
        : [];

      const formattedTimeline = values.timeline
        ? values.timeline.map((tl) => ({
            activity: tl.activity._id,
            startTime: tl.startTime ? tl.startTime.format("HH:mm") : null,
            duration: tl.duration,
          }))
        : [];

      console.log("formattedTimeline", formattedTimeline);

      const formattedPreferenceTags = values.preferenceTags
        ? values.preferenceTags.map((tag) => tag)
        : [];

      const formattedData = {
        ...values,
        availableDates: formattedAvailableDates,
        activities: formattedActivities,
        locations: formattedLocations,
        timeline: formattedTimeline,
        preferenceTags: formattedPreferenceTags,
      };
      console.log("Here", formattedData);

      if (editingItinerary) {
        console.log("Updating itinerary", formattedData);
        await updateItinerary(editingItinerary._id, formattedData);
        message.success("Itinerary updated successfully");
      } else {
        await createItinerary(formattedData);
        message.success("Itinerary created successfully");
      }
      handleCancel();
      location.pathname === "/itinerary/my"
        ? fetchMyIternaries()
        : fetchItineraries();
    } catch (error) {
      message.warning("Failed to save itinerary");
      console.error(error);
    }
  };

  const showViewModal = (itinerary) => {
    console.log("Viewing itinerary", itinerary);
    setViewingItinerary(itinerary);
    setIsViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewingItinerary(null);
  };

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
      render: (price) =>
        `${(price * currency?.rate).toFixed(2)} ${currency?.code}`,
    },
    {
      title: "Booking Open",
      dataIndex: "isBookingOpen",
      key: "isBookingOpen",
      render: (isBookingOpen) =>
        isBookingOpen ? (
          <Tag color="green">Open</Tag>
        ) : (
          <Tag color="red">Closed</Tag>
        ),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showViewModal(record)}
            className="mr-2 bg-first text-white border-none hover:bg-[#025D4C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#025D4C]"
          >
            View
          </Button>

          {user && user._id === record.createdBy && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => showModal(record)}
                className="mr-2 bg-first text-white border-none hover:bg-[#025D4C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#025D4C]"
              >
                Edit
              </Button>

              <Popconfirm
                title="Are you sure you want to delete this item?"
                onConfirm={() => handleDelete(record._id)}
                onCancel={() => message.info("Delete action cancelled")}
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                  className: `
      bg-red-600 text-white hover:bg-red-700 
      focus:ring-2 focus:ring-offset-2 focus:ring-red-600 
      rounded-md px-6 py-2 text-sm font-semibold 
      transition-all duration-200 ease-in-out
    `,
                }}
                cancelButtonProps={{
                  className: `
      bg-gray-200 text-gray-700 hover:bg-gray-300 
      focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 
      rounded-md px-6 py-2 text-sm font-semibold 
      transition-all duration-200 ease-in-out
    `,
                }}
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="mr-2 bg-white text-red-600 border-none 
               hover:bg-red-50 focus:outline-none 
               focus:ring-2 focus:ring-offset-2 
               focus:ring-red-600 rounded-md px-4 py-2 text-sm font-medium"
                  danger
                >
                  Delete
                </Button>
              </Popconfirm>
            </>
          )}
          {user && user.userRole === "Admin" && (
            <Badge count={0} offset={[-5, 5]}>
              <Tooltip title={"Flag this item as Inappropriate"}>
                <Button
                  danger
                  icon={<FlagFilled />}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await flagIternaary(record._id);
                      message.success("Item flagged as inappropriate");
                      await fetchItineraries();
                    } catch (error) {
                      message.warning("Failed to flag item as inappropriate");
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
          )}
        </>
      ),
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="w-[90%] p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-6">
            <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] text-white rounded-t-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Gift className="h-6 w-6" />
                    Itinerary Management
                  </h2>
                  <p className="text-gray-200 mt-1">
                    Manage and monitor your itineraries
                  </p>
                </div>
                {user && user.userRole === "TourGuide" && (
                  <Button
                    type="primary"
                    icon={<Plus />}
                    onClick={() => showModal()}
                    className="bg-[#375894] hover:bg-[#2A4575]/90"
                  >
                    Create Itinerary
                  </Button>
                )}
              </div>
            </div>
            <div className="p-6">
              <div className="filter-container bg-white p-4 rounded-lg shadow-lg mb-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Search
                    placeholder="Search by name, category, or tag..."
                    allowClear
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                  />
                  <Select
                    style={{ width: 200 }}
                    placeholder="Sort by"
                    onChange={(value) => setSortBy(value)}
                  >
                    <Option value="">None</Option>
                    <Option value="pricingHighToLow">
                      Price (High to Low)
                    </Option>
                    <Option value="pricingLowToHigh">
                      Price (Low to High)
                    </Option>
                    <Option value="ratingHighToLow">
                      Rating (High to Low)
                    </Option>
                    <Option value="ratingLowToHigh">
                      Rating (Low to High)
                    </Option>
                  </Select>

                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter by Budget"
                    onChange={(value) => setSelectedBudget(value)}
                  >
                    <Option value="">All Budgets</Option>
                    {budgets?.map((budget, index) => (
                      <Option key={index} value={budget.toString()}>
                        {budget}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter by Date"
                    onChange={(value) => setSelectedDateFilter(value)}
                  >
                    <Option value="">All Dates</Option>
                    <Option value="today">Today</Option>
                    <Option value="thisWeek">This Week</Option>
                    <Option value="thisMonth">This Month</Option>
                    <Option value="thisYear">This Year</Option>
                    <Option value="allUpcoming">All Upcoming</Option>
                  </Select>

                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter by Language"
                    onChange={(value) => setSelectedLanguage(value)}
                  >
                    <Option value="">All Languages</Option>
                    {languages?.map((language, index) => (
                      <Option key={index} value={language}>
                        {language}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    style={{ width: 200 }}
                    placeholder="Filter by Preference"
                    onChange={(value) => setSelectedPreference(value)}
                  >
                    <Option value="">All Preferences</Option>
                    {preferenceTagsList?.map((preference) => (
                      <Option key={preference._id} value={preference._id}>
                        {preference.tag}
                      </Option>
                    ))}
                  </Select>

                  <Button icon={<RefreshCw />} onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>

              {user === null || user?.userRole === "Tourist" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedItineraries?.map((itinerary, index) => (
                    <Card
                      key={index}
                      className="relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                      cover={
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          <Gift className="h-12 w-12 text-gray-400" />
                        </div>
                      }
                      actions={[
                        <Button
                          onClick={() =>
                            navigate(`iternaryDetails/${itinerary._id}`)
                          }
                        >
                          Show Details
                        </Button>,
                        user && user?.userRole === "Tourist" && (
                          <Button
                            onClick={() => handleBookItinerary(itinerary._id)}
                            type="primary"
                          >
                            Book
                          </Button>
                        ),
                      ]}
                    >
                      <Badge.Ribbon
                        text="Book Now"
                        color="blue"
                        className="absolute top-0 left-0"
                      />
                      <Card.Meta
                        title={itinerary.name}
                        description={
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {itinerary.pickupLocation}{" "}
                              <ChevronRight className="mx-1 h-4 w-4" />{" "}
                              {itinerary.dropOffLocation}
                            </div>
                            <div className="flex items-center">
                              <Globe className="mr-2 h-4 w-4" />
                              <span>{itinerary.language}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              <span>{itinerary.accessibility || "N/A"}</span>
                            </div>
                            <div className="text-2xl font-bold text-center mt-4">
                              {currency?.code}{" "}
                              {(itinerary.price * currency?.rate).toFixed(2)}
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  ))}
                </div>
              ) : (
                <Table
                  dataSource={sortedItineraries}
                  columns={columns}
                  rowKey="_id"
                  loading={loading}
                  pagination={{ pageSize: 10 }}
                />
              )}
            </div>
          </Card>
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
            initialValues={{ isActive: true }}
          >
            <Form.Item
              name="name"
              label="Itinerary Name"
              rules={[
                { required: true, message: "Please enter the itinerary name" },
              ]}
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
              </Select>
            </Form.Item>

            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) => `$ ${value}`}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="Enter price"
              />
            </Form.Item>

            <Form.Item name="accessibility" label="Accessibility">
              <Input placeholder="Enter accessibility details" />
            </Form.Item>

            <Form.Item name="pickupLocation" label="Pickup Location">
              <Input placeholder="Enter pickup location" />
            </Form.Item>

            <Form.Item name="dropOffLocation" label="Drop Off Location">
              <Input placeholder="Enter drop off location" />
            </Form.Item>

            <Divider />

            <Form.List name="activities">
              {(fields, { add, remove }) => (
                <>
                  <label className="block font-medium mb-2">Activities</label>
                  {fields?.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "activity"]}
                        rules={[
                          { required: true, message: "Missing activity" },
                        ]}
                      >
                        <Select
                          placeholder="Select activity"
                          style={{ width: 200 }}
                        >
                          {activitiesList?.map((activity) => (
                            <Option key={activity.name} value={activity._id}>
                              {activity.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "duration"]}
                        rules={[
                          { required: true, message: "Missing duration" },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          formatter={(value) => `${value} min`}
                          parser={(value) => value.replace(" min", "")}
                          placeholder="Duration (min)"
                        />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{
                        backgroundColor: "#02735F",
                        borderColor: "#02735F",
                        color: "#fff",
                      }}
                    >
                      Add Activity
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Divider />

            <Form.List name="locations">
              {(fields, { add, remove }) => (
                <>
                  <label className="block font-medium mb-2">Locations</label>
                  {fields?.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        rules={[
                          { required: true, message: "Missing location name" },
                        ]}
                      >
                        <Input placeholder="Location Name" />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{
                        backgroundColor: "#02735F",
                        borderColor: "#02735F",
                        color: "#fff",
                      }}
                    >
                      Add Location
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Divider />

            <Form.List name="timeline">
              {(fields, { add, remove }) => (
                <>
                  <label className="block font-medium mb-2">Timeline</label>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "activity"]}
                        rules={[
                          { required: true, message: "Missing activity" },
                        ]}
                      >
                        <Select
                          placeholder="Select activity"
                          style={{ width: 200 }}
                        >
                          {activitiesList?.map((activity) => (
                            <Option key={activity._id} value={activity._id}>
                              {activity.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "startTime"]}
                        rules={[
                          { required: true, message: "Missing start time" },
                        ]}
                      >
                        <DatePicker
                          showTime
                          format="HH:mm"
                          placeholder="Start Time"
                          style={{ width: 150 }}
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "duration"]}
                        rules={[
                          { required: true, message: "Missing duration" },
                        ]}
                      >
                        <InputNumber
                          min={1}
                          formatter={(value) => `${value} min`}
                          parser={(value) => value.replace(" min", "")}
                          placeholder="Duration (min)"
                        />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{
                        backgroundColor: "#02735F",
                        borderColor: "#02735F",
                        color: "#fff",
                      }}
                    >
                      Add Timeline Entry
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Divider />

            <Form.List name="availableDates">
              {(fields, { add, remove }) => (
                <>
                  <label className="block font-medium mb-2">
                    Available Dates and Times
                  </label>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        rules={[
                          { required: true, message: "Missing date range" },
                        ]}
                      >
                        <RangePicker
                          showTime
                          format="YYYY-MM-DD HH:mm"
                          style={{ width: 300 }}
                          placeholder={["Start Date", "End Date"]}
                        />
                      </Form.Item>

                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{
                        backgroundColor: "#02735F",
                        borderColor: "#02735F",
                        color: "#fff",
                      }}
                    >
                      Add Available Date
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Divider />

            <Form.Item name="preferenceTags" label="Preference Tags">
              <Select
                mode="multiple"
                placeholder="Select preference tags"
                allowClear
              >
                {preferenceTagsList?.map((tag) => (
                  <Option key={tag._id} value={tag._id}>
                    {tag.tag}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Booking Status"
              name="isBookingOpen"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#02735F", borderColor: "#02735F" }}
              >
                {editingItinerary ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="View Itinerary"
          visible={isViewModalVisible}
          onCancel={handleViewCancel}
          footer={[
            <Button key="close" onClick={handleViewCancel}>
              Close
            </Button>,
          ]}
          width={1000}
        >
          {viewingItinerary && (
            <Form layout="vertical">
              <Form.Item label="Itinerary Name">
                <Input value={viewingItinerary.name} disabled />
              </Form.Item>
              <Form.Item label="Language">
                <Input value={viewingItinerary.language} disabled />
              </Form.Item>
              <Form.Item label="Price">
                <InputNumber
                  value={viewingItinerary.price}
                  formatter={(value) => `$ ${value}`}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Accessibility">
                <Input value={viewingItinerary.accessibility} disabled />
              </Form.Item>
              <Form.Item label="Pickup Location">
                <Input value={viewingItinerary.pickupLocation} disabled />
              </Form.Item>
              <Form.Item label="Drop Off Location">
                <Input value={viewingItinerary.dropOffLocation} disabled />
              </Form.Item>

              <Divider />

              <Form.Item label="Activities">
                {viewingItinerary.activities?.map((activity, index) => (
                  <div key={index}>
                    <Input
                      value={`${activity?.activity?.name} - ${activity?.duration} min`}
                      disabled
                    />
                  </div>
                ))}
              </Form.Item>

              <Divider />

              <Form.Item label="Locations">
                {viewingItinerary?.locations?.map((location, index) => (
                  <div key={index}>
                    <Input value={location.name} disabled />
                  </div>
                ))}
              </Form.Item>

              <Divider />

              <Form.Item label="Timeline">
                {viewingItinerary?.timeline?.map(
                  (entry, index) => (
                    console.log("entry", entry),
                    (
                      <div key={index}>
                        <Input
                          value={`${entry.activity.name} - Start: ${entry.startTime}, Duration: ${entry.duration} min`}
                          disabled
                        />
                      </div>
                    )
                  )
                )}
              </Form.Item>

              <Divider />
              <Form.Item label="Available Dates">
                {viewingItinerary?.availableDates?.map(
                  (date, index) => (
                    console.log("date", date),
                    console.log("time", date.Times),
                    (
                      <div key={index}>
                        <Input
                          value={`${moment(date.Date).format(
                            "dddd, MMMM D, YYYY"
                          )} ${moment(
                            `${date.Date} ${date.Times}`,
                            "YYYY-MM-DD HH:mm"
                          ).format("hh:mm A")}`}
                          disabled
                        />
                      </div>
                    )
                  )
                )}
              </Form.Item>

              <Divider />

              <Form.Item label="Preference Tags">
                <Select
                  mode="multiple"
                  value={viewingItinerary?.preferenceTags?.map(
                    (tag) => tag._id
                  )}
                  disabled
                >
                  {preferenceTagsList?.map((tag) => (
                    <Option key={tag._id} value={tag._id}>
                      {tag.tag}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Booking Open"
                name="isBookingOpen"
                valuePropName="checked"
              >
                <Switch
                  disabled={true}
                  value={viewingItinerary?.isBookingOpen}
                />
              </Form.Item>
              <Form.Item label="Active" name="isActive" valuePropName="checked">
                <Switch disabled={true} value={viewingItinerary?.isActive} />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MyItineraryScreen;
