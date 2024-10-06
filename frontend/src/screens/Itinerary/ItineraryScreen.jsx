// frontend/screens/ItineraryScreen.js
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
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getMyItineraries,
} from "../../api/itinerary.ts";
import { getActivities } from "../../api/activity.ts";
import { getPreferenceTags } from "../../api/preferenceTags.ts";

import moment from "moment";
import "antd";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
} from "date-fns";
import { useLocation } from "react-router-dom";
// import { format } from "path";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ItineraryScreen = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [form] = Form.useForm();

  //states for filters
  const [searchTerm, setSearchTerm] = useState(""); //search term
  const [selectedBudget, setSelectedBudget] = useState(""); //filter
  const [selectedDateFilter, setSelectedDateFilter] = useState(""); //filter
  const [selectedLanguage, setSelectedLanguage] = useState(""); //filter fx
  const [selectedPreference, setSelectedPreference] = useState(""); //filter fx
  const [sortBy, setSortBy] = useState(""); //sort by price and rating

  const budgets = [...new Set(itineraries.map((itin) => itin.price))];
  const languages = [...new Set(itineraries.map((itin) => itin.language))];

  // New State Variables for ActivityList and Preference Tags
  const [activitiesList, setActivitiesList] = useState([]);
  const [preferenceTagsList, setPreferenceTagsList] = useState([]);
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/itinerary/my") {
      fetchMyIternaries();
    } else {
      fetchItineraries();
    }
    fetchActivities();
    fetchPreferenceTags();
  }, [location.pathname]);

  //filter fx

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
      }

      return true;
    });
  };

  const filteredItinerareis = itineraries.filter(
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

  const sortedItineraries = filteredItinerareis.sort((a, b) => {
    if (sortBy === "pricing") {
      return a.price - b.price;
    } else if (sortBy === "rating") {
      return a.rating - b.rating;
    }
    return 0;
  });

  const fetchItineraries = async () => {
    setLoading(true);
    try {
      const data = await getItineraries();
      setItineraries(data);
    } catch (error) {
      message.error("Failed to fetch itineraries");
    }
    setLoading(false);
  };
  const fetchMyIternaries = async () => {
    setLoading(true);
    try {
      const data = await getMyItineraries();
      setItineraries(data);
    } catch (error) {
      message.error("Failed to fetch itineraries");
    }
    setLoading(false);
  };

  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setActivitiesList(data.data);
    } catch (error) {
      message.error("Failed to fetch activities");
    }
  };

  const fetchPreferenceTags = async () => {
    try {
      const data = await getPreferenceTags();
      setPreferenceTagsList(data.data);
    } catch (error) {
      message.error("Failed to fetch preference tags");
    }
  };

  const showModal = async (itinerary = null) => {
    setEditingItinerary(itinerary);
    setIsModalVisible(true);
    if (itinerary) {
      await fetchActivities();
      await fetchPreferenceTags();

      // console.log("The Itinerary is: " + JSON.stringify(itinerary));
      // Format availableDates for RangePicker
      const formattedAvailableDates = itinerary.availableDates.map((date) => [
        moment(date.Date),
        moment(`${date.Date} ${date.Times}`, "YYYY-MM-DD HH:mm"),
      ]);

      // Format timeline's startTime
      const formattedTimeline = itinerary.timeline.map((tl) => ({
        ...tl,
        activity: tl.activity.name ? tl.activity.name : tl.activity,
        startTime: tl.startTime ? moment(tl.startTime, "HH:mm") : null,
      }));

      // console.log("The first ActivityList is: " + itinerary.activities[0].duration);
      const formattedActivities = itinerary.activities.map((act) => ({
        activity: act.activity ? act.activity._id : "ActivityList not found",
        duration: act.duration,
      }));

      const formattedPreferenceTags = itinerary.preferenceTags.map(
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
      message.error(
        error.response && error.response.status === 400
          ? "Cannot delete itinerary with existing bookings"
          : "Failed to delete itinerary"
      );
    }
  };

  const onFinish = async (values) => {
    try {
      // console.log("The values are: " + JSON.stringify(values));

      // Format availableDates
      const formattedAvailableDates = values.availableDates.map(
        ([start, end]) => ({
          Date: start.format("YYYY-MM-DD"),
          Times: end.format("HH:mm"),
        })
      );

      // Format activities
      // const formattedActivities = values.activities
      //   ? values.activities.map((act) => ({
      //       ...act,
      //       duration: act.duration,
      //     }))
      //   : [];

      // get the activity from the activitiesList
      // get the duration from the values
      const formattedActivities = values.activities.map((act) => ({
        activity: act.activity,
        duration: act.duration,
      }));
      // console.log("The first ActivityList is: " + JSON.stringify(formattedActivities[0]));

      // formattedActivities.forEach((act, index) => {
      //   act.activity = activitiesList.find((activity) => activity._id === values.activities[index].activity);
      // });

      // console.log("The first ActivityList is: " + JSON.stringify(formattedActivities[0]));

      // Format locations
      const formattedLocations = values.locations
        ? values.locations.map((loc) => ({
            name: loc.name,
          }))
        : [];

      // Format timeline
      const formattedTimeline = values.timeline
        ? values.timeline.map((tl) => ({
            activity: tl.activity,
            startTime: tl.startTime ? tl.startTime.format("HH:mm") : null,
            duration: tl.duration,
          }))
        : [];

      // format prefrence tags
      // console.log("The preference tags are: " + values.preferenceTags);

      const formattedPreferenceTags = values.preferenceTags
        ? values.preferenceTags.map((tag) => tag)
        : [];
      // console.log("The formatted preference tags are: " + formattedPreferenceTags);
      // const formattedPreferenceTags = values.preferenceTags || [];

      // Prepare final data
      const formattedData = {
        ...values,
        availableDates: formattedAvailableDates,
        activities: formattedActivities,
        locations: formattedLocations,
        timeline: formattedTimeline,
        preferenceTags: formattedPreferenceTags,
        // Exclude Ratings and Comments from Form Data
      };
      // console.log("The formatted data is: " + JSON.stringify(formattedData));

      if (editingItinerary) {
        await updateItinerary(editingItinerary._id, formattedData);
        message.success("Itinerary updated successfully");
      } else {
        await createItinerary(formattedData);
        message.success("Itinerary created successfully");
      }
      handleCancel();
      fetchItineraries();
    } catch (error) {
      message.error("Failed to save itinerary");
      console.error(error);
    }
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
      title: user && user.userRole === "Admin" ? "Actions" : "",
      key: "actions",
      render: (text, record) => (
        <>
          {user && user.userRole === "Admin" && (
            <div>
              <Button
                icon={<EditOutlined />}
                onClick={() => showModal(record)}
                className="mr-2"
                style={{
                  backgroundColor: "#02735F",
                  color: "#fff",
                  border: "none",
                }}
              >
                Edit
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record._id)}
                style={{
                  backgroundColor: "#02735F",
                  color: "#fff",
                  border: "none",
                }}
              >
                Delete
              </Button>
            </div>
          )}
        </>
      ),
    },
  ];
  return (
    <div className="p-6 bg-white min-h-screen">
      {" "}
      <h1 className="text-2xl font-bold mb-4">Itineraries</h1>
      {user && user.userRole === "Admin" && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          className="mb-4"
          style={{ backgroundColor: "#02735F", borderColor: "#02735F" }}
        >
          Add Itinerary
        </Button>
      )}
      <div className="p-8 bg-gray-100">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, category, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border border-slate-700 rounded-md w-[600px] mx-auto block"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <label htmlFor="budgetFilter" className="font-semibold mb-1">
              Filter by Budget:
            </label>
            <select
              id="budgetFilter"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="p-2 border border-slate-700 rounded-md"
            >
              <option value="">All Budgets</option>
              {budgets.map((budget, index) => (
                <option key={index} value={budget}>
                  {budget}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="dateFilter" className="font-semibold mb-1">
              Filter by Date:
            </label>
            <select
              id="dateFilter"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="p-2 border border-slate-700 rounded-md"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="languageFilter" className="font-semibold mb-1">
              Filter by Language:
            </label>
            <select
              id="languageFilter"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="p-2 border border-slate-700 rounded-md"
            >
              <option value="">All Languages</option>
              {languages.map((language, index) => (
                <option key={index} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="preferenceFilter" className="font-semibold mb-1">
              Filter by Preference:
            </label>
            <select
              id="preferenceFilter"
              value={selectedPreference}
              onChange={(e) => setSelectedPreference(e.target.value)}
              className="p-2 border border-slate-700 rounded-md"
            >
              <option value="">All Preferences</option>
              {preferenceTagsList.map((preference) => (
                <option key={preference._id} value={preference._id}>
                  {preference.tag}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="sortFilter" className="font-semibold mb-1">
              Sort by:
            </label>
            <select
              id="sortFilter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-slate-700 rounded-md"
            >
              <option value="">None</option>
              <option value="pricing">Price</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>
      <Table
        dataSource={sortedItineraries}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
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
          {/* Itinerary Name */}
          <Form.Item
            name="name"
            label="Itinerary Name"
            rules={[
              { required: true, message: "Please enter the itinerary name" },
            ]}
          >
            <Input placeholder="Enter itinerary name" />
          </Form.Item>

          {/* Language */}
          <Form.Item
            name="language"
            label="Language"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select language">
              <Option value="English">English</Option>
              <Option value="Spanish">Spanish</Option>
              <Option value="Arabic">Arabic</Option>
              {/* Add more languages as needed */}
            </Select>
          </Form.Item>

          {/* Price */}
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `$ ${value}`}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Enter price"
            />
          </Form.Item>

          {/* Accessibility */}
          <Form.Item name="accessibility" label="Accessibility">
            <Input placeholder="Enter accessibility details" />
          </Form.Item>

          {/* Pickup Location */}
          <Form.Item name="pickupLocation" label="Pickup Location">
            <Input placeholder="Enter pickup location" />
          </Form.Item>

          {/* Drop Off Location */}
          <Form.Item name="dropOffLocation" label="Drop Off Location">
            <Input placeholder="Enter drop off location" />
          </Form.Item>

          <Divider />

          {/* ActivityList */}
          <Form.List name="activities">
            {(fields, { add, remove }) => (
              <>
                <label className="block font-medium mb-2">Activities</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    {/* ActivityList Dropdown */}
                    <Form.Item
                      {...restField}
                      name={[name, "activity"]}
                      rules={[{ required: true, message: "Missing activity" }]}
                    >
                      <Select
                        placeholder="Select activity"
                        style={{ width: 200 }}
                      >
                        {activitiesList.map((activity) => (
                          <Option key={activity.name} value={activity._id}>
                            {activity.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Duration */}
                    <Form.Item
                      {...restField}
                      name={[name, "duration"]}
                      rules={[{ required: true, message: "Missing duration" }]}
                    >
                      <InputNumber
                        min={1}
                        formatter={(value) => `${value} min`}
                        parser={(value) => value.replace(" min", "")}
                        placeholder="Duration (min)"
                      />
                    </Form.Item>

                    {/* Remove Button */}
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

          {/* Locations */}
          <Form.List name="locations">
            {(fields, { add, remove }) => (
              <>
                <label className="block font-medium mb-2">Locations</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="start"
                  >
                    {/* Location Name */}
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[
                        { required: true, message: "Missing location name" },
                      ]}
                    >
                      <Input placeholder="Location Name" />
                    </Form.Item>

                    {/* Remove Button */}
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

          {/* Timeline */}
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
                    {/* ActivityList Dropdown */}
                    <Form.Item
                      {...restField}
                      name={[name, "activity"]}
                      rules={[{ required: true, message: "Missing activity" }]}
                    >
                      <Select
                        placeholder="Select activity"
                        style={{ width: 200 }}
                      >
                        {activitiesList.map((activity) => (
                          <Option key={activity._id} value={activity._id}>
                            {activity.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    {/* Start Time */}
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

                    {/* Duration */}
                    <Form.Item
                      {...restField}
                      name={[name, "duration"]}
                      rules={[{ required: true, message: "Missing duration" }]}
                    >
                      <InputNumber
                        min={1}
                        formatter={(value) => `${value} min`}
                        parser={(value) => value.replace(" min", "")}
                        placeholder="Duration (min)"
                      />
                    </Form.Item>

                    {/* Remove Button */}
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

          {/* Available Dates */}
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
                    {/* RangePicker */}
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

                    {/* Remove Button */}
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

          {/* Preference Tags */}
          <Form.Item name="preferenceTags" label="Preference Tags">
            <Select
              mode="multiple"
              placeholder="Select preference tags"
              allowClear
            >
              {preferenceTagsList.map((tag) => (
                <Option key={tag._id} value={tag._id}>
                  {tag.tag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Submit Button */}
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
    </div>
  );
};

export default ItineraryScreen;
