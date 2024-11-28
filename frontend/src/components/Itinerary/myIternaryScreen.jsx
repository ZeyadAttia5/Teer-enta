import React, { useState, useEffect, useRef } from "react";
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
  Popconfirm
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
  GlobalOutlined,
  DollarCircleOutlined,
  TeamOutlined,
  EnvironmentTwoTone,
  SwapRightOutlined,
} from "@ant-design/icons";
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
import { SearchOutlined } from "@ant-design/icons";
import { getActivities } from "../../api/activity.ts";
import { getPreferenceTags } from "../../api/preferenceTags.ts";
import { Filter, SortAsc, ChevronRight, CheckSquareIcon } from "lucide-react";

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

const Button1 = ({ children, onClick, variant = "default" }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-white";
  const variantClasses =
    variant === "outline"
      ? "hover:bg-gray-100 hover:text-accent-foreground" // Light gray hover background for outline variant
      : "text-gray-700 hover:bg-gray-100"; // Light gray hover background for default variant

  return (
    <button
      className={`${baseClasses} ${variantClasses} h-10 py-2 px-4`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Button2 = ({ children, onClick, variant = "default" }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-white";
  const variantClasses =
    variant === "outline"
      ? "hover:bg-gray-100 hover:text-accent-foreground" // Light gray hover background for outline variant
      : "text-gray-700 hover:bg-gray-100"; // Light gray hover background for default variant

  return (
    <Button
      className={`${baseClasses} ${variantClasses} h-10 py-2 px-4`}
      onClick={onClick}
      type="danger"
      danger
      icon={<ReloadOutlined />}
    >
      {children}
    </Button>
  );
};

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen }) => {
  return React.cloneElement(children, {
    onClick: () => setIsOpen(!isOpen),
    "aria-expanded": isOpen,
    "aria-haspopup": true,
  });
};

const DropdownMenuContent = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute right-0 left-0 mt-2 w-56 rounded-md shadow-lg bg-white text-gray-700 z-50">
      <div className="py-1">{children}</div>
    </div>
  );
};

const DropdownMenuLabel = ({ children }) => (
  <div className="px-3 py-2 text-sm font-semibold">{children}</div>
);
const DropdownMenuSeparator = () => <hr className="my-1 border-border" />;
const DropdownMenuGroup = ({ children }) => <div>{children}</div>;
const DropdownMenuItem = ({ children, onSelect }) => (
  <button
    className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-default"
    onClick={onSelect}
  >
    {children}
  </button>
);

const DropdownMenuPortal = ({ children }) => {
  return <div className="relative cursor-pointer">{children}</div>;
};

const DropdownMenuSub = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <DropdownMenuSubTrigger onClick={() => setIsOpen((prev) => !prev)}>
        {trigger}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent isOpen={isOpen}>
          {children}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </div>
  );
};

const DropdownMenuSubTrigger = ({ children, onClick }) => (
  <button className="w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-accent hover:text-accent-foreground">
    {children}
    <ChevronRight className="h-4 w-4" />
  </button>
);

const DropdownMenuSubContent = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute left-full top-1/2 -translate-y-10 w-56 rounded-md shadow-lg bg-white text-gray-700 z-50">
      <div className="py-1 px-1 bg-white hover:bg-gray-100 hover:border-transparent rounded-md">
        {children}
      </div>
    </div>
  );
};

const MyItineraryScreen = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
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
      message.error(
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
      location.pathname === "/itinerary/my" ? fetchMyIternaries() : fetchItineraries();
    } catch (error) {
      message.error("Failed to save itinerary");
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
            className="mr-2"
            style={{
              backgroundColor: "#02735F",
              color: "#fff",
              border: "none",
            }}
          >
            View
          </Button>

          {user && user._id === record.createdBy && (
            <>
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

              <Popconfirm
              title="Are you sure you want to delete this item?"
              onConfirm={() => handleDelete(record._id)}
              onCancel={() => message.info("Delete action cancelled")}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: {
                  backgroundColor: "#f00",
                  borderColor: "#f00",
                  color: "#fff",
                },
              }}
            >
              <Button
                icon={<DeleteOutlined />}
                style={{
                  backgroundColor: "#f00",
                  color: "#fff",
                  border: "none",
                }}
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
                      message.error("Failed to flag item as inappropriate");
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
    <div className="p-6 min-h-screen">
      {/* <h1 className="text-9xl font-bold mb-4 text-[#496989]">Itineraries</h1> */}
      {user && user.userRole === "TourGuide" && (
        <div className="flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            className="mb-4"
            style={{
              backgroundColor: "#02735F",
              borderColor: "#02735F",
              float: "",
            }}
          >
            Add Itinerary
          </Button>
        </div>
      )}
      <div className="p-8 bg-fourth">
        <div className="mb-6 flex flex-col items-center space-y-4">
          {/* Centered, smaller search bar */}
          <Search
            enterButton={<SearchOutlined />}
            placeholder="Search by name, category, or tag..."
            value={searchTerm}
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded-md w-[400px]" // Reduced width for smaller size
          />

          <div className="flex space-x-4">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button1 variant="outline">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Sort
                </Button1>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <div>
                      <select
                        id="sortFilter"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                      >
                        <option value="">None</option>
                        <option value="pricingHighToLow">
                          Price (High to Low)
                        </option>
                        <option value="pricingLowToHigh">
                          Price (Low to High)
                        </option>
                        <option value="ratingHighToLow">
                          Rating (High to Low)
                        </option>
                        <option value="ratingLowToHigh">
                          Rating (Low to High)
                        </option>
                      </select>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button1 variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button1>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub trigger="Budget">
                    <div className="w-full">
                      <select
                        id="budgetFilter"
                        value={selectedBudget}
                        onChange={(e) => setSelectedBudget(e.target.value)}
                        className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                      >
                        <option value="">All Budgets</option>
                        {budgets?.map((budget, index) => (
                          <option key={index} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                    </div>
                  </DropdownMenuSub>

                  <DropdownMenuSub trigger="Date">
                    <div>
                      <select
                        id="dateFilter"
                        value={selectedDateFilter}
                        onChange={(e) => setSelectedDateFilter(e.target.value)}
                        className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                      >
                        <option value="">All Dates</option>
                        <option value="today">Today</option>
                        <option value="thisWeek">This Week</option>
                        <option value="thisMonth">This Month</option>
                        <option value="thisYear">This Year</option>
                        <option value="allUpcoming">All Upcoming</option>
                      </select>
                    </div>
                  </DropdownMenuSub>

                  <DropdownMenuSub trigger="Language">
                    <div>
                      <select
                        id="languageFilter"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                      >
                        <option value="">All Languages</option>
                        {languages?.map((language, index) => (
                          <option key={index} value={language}>
                            {language}
                          </option>
                        ))}
                      </select>
                    </div>
                  </DropdownMenuSub>

                  <DropdownMenuSub trigger="Preference">
                    <div>
                      <select
                        id="preferenceFilter"
                        value={selectedPreference}
                        onChange={(e) => setSelectedPreference(e.target.value)}
                        className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                      >
                        <option value="">All Preferences</option>
                        {preferenceTagsList?.map((preference) => (
                          <option key={preference._id} value={preference._id}>
                            {preference.tag}
                          </option>
                        ))}
                      </select>
                    </div>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset Button */}
            <Button2
              type="primary"
              danger
              icon={<ReloadOutlined />}
              onClick={resetFilters}
              className="ml-4 h-9"
            >
              Reset Filters
            </Button2>
          </div>
        </div>
      </div>
      {user === null || user?.userRole === "Tourist" ? (
        <main className="flex flex-wrap justify-center items-center min-h-screen py-10">
          {sortedItineraries?.map((itinerary, index) => (
            <div
              key={index}
              className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-white transform transition-all duration-300 ease-in-out m-4 cursor-pointer hover:border-2 hover:border-third" // Thicker border on hover
            >
              {/* Book Now Circle */}
              <div className="absolute top-4 left-4 bg-second text-white rounded-full w-12 h-12 flex justify-center items-center text-xs font-semibold shadow-lg">
                <span>Book Now</span>
              </div>

              <Card
                className="rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out hover:text-white"
                style={{ backgroundColor: "#ffffff" }} // Default background color
              >
                <Card.Meta
                  title={
                    <>
                      <span
                        className="font-bold text-6xl mb-2 transition-transform duration-500 ease-out"
                        style={{ color: "#333333" }}
                      >
                        <Tooltip title={itinerary?.name}>
                          {itinerary?.name}
                        </Tooltip>
                        <hr className="my-4 border-t-2 border-second" />
                      </span>
                      {/* Travel Route */}

                      <Tooltip title="Travel Route">
                        <span className="font-semibold text-xl hover:text-third flex items-center mt-2">
                          <EnvironmentTwoTone
                            twoToneColor="#000000"
                            style={{ marginRight: 8 }}
                          />
                          {itinerary?.pickupLocation}
                          <span className="mx-2 text-[#333333]">⇢</span>
                          {itinerary?.dropOffLocation}
                        </span>
                      </Tooltip>
                    </>
                  }
                  description={
                    <div
                      className="flex flex-col space-y-1"
                      style={{ color: "#333333" }}
                    >
                      {/* Horizontal Line to Split the Card */}

                      <Tooltip title="Language">
                        <span className="font-semibold text-lg hover:text-third">
                          <GlobalOutlined style={{ marginRight: 8 }} />
                          {itinerary?.language}
                        </span>
                      </Tooltip>
                      <Tooltip title="Accessibility">
                        <span className="font-semibold text-lg hover:text-third">
                          <TeamOutlined style={{ marginRight: 8 }} />
                          {itinerary?.accessibility || "N/A"}
                        </span>
                      </Tooltip>
                      {/* Price Tooltip at the End */}
                      <div className="flex justify-center items-center mt-4">
                        <Tooltip title="Price">
                          <span className="font-semibold text-4xl hover:text-third flex items-center">
                            {currency?.code}{" "}
                            {(itinerary?.price * currency?.rate).toFixed(2)}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  }
                />
              </Card>

              <div className="flex justify-center items-center gap-4 p-4">
                <Button
                  onClick={() => navigate(`iternaryDetails/${itinerary?._id}`)}
                  className="text-white bg-second hover:bg-[#4a8f7a] transition-all duration-300"
                >
                  Show Details
                </Button>
                {user && user?.userRole === "Tourist" && (
                  <Button
                    onClick={() => handleBookItinerary(itinerary?._id)}
                    className="text-white bg-[#496989] hover:bg-[#3b5b68] transition-all duration-300"
                  >
                    Book
                  </Button>
                )}
              </div>
            </div>
          ))}
        </main>
      ) : (
        <Table
          dataSource={sortedItineraries}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      )}
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
                      rules={[{ required: true, message: "Missing activity" }]}
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
                      rules={[{ required: true, message: "Missing duration" }]}
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
                      rules={[{ required: true, message: "Missing activity" }]}
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
                      rules={[{ required: true, message: "Missing duration" }]}
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
            label="Booking Open"
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
                value={viewingItinerary?.preferenceTags?.map((tag) => tag._id)}
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
              <Switch disabled={true} value={viewingItinerary?.isBookingOpen} />
            </Form.Item>
            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <Switch disabled={true} value={viewingItinerary?.isActive} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default MyItineraryScreen;
