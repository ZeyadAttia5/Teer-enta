import React, { useState, useEffect, useRef } from "react";
import ActivityCard from "./ActivityCard";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Input, Select, Slider, Row, Col, Checkbox, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getTouristActivities } from "../../../api/activity.ts";
import dayjs from "dayjs";
import { Filter, SortAsc, ChevronRight, Star } from "lucide-react";
import { ReloadOutlined } from "@ant-design/icons";
import { FaLayerGroup } from "react-icons/fa";
import { getCurrency } from "../../../api/account.ts";
import { getSavedActivities } from "../../../api/profile.ts";
import {getAllMyRequests} from "../../../api/notifications.ts";

const PORT = process.env.REACT_APP_BACKEND_URL;
const { Search } = Input;
const { Option } = Select;

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
      if (
        dropdownRef?.current &&
        !dropdownRef?.current?.contains(event.target)
      ) {
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

const TouristActivity = ({ setFlag }) => {
  setFlag(false);

  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState([0, 1000]); // Default budget range
  const [maxBudget, setMaxBudget] = useState(1000); // Dynamic maximum budget
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState(""); // To track sorting preference
  const [showUpcoming, setShowUpcoming] = useState(false); // State for upcoming activities
  const [currency, setCurrency] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const resetFilters = () => {
    setBudget([0, 1000]);
    setCategory("");
    setRating("");
    setSortBy("");
    setShowUpcoming(false);
    setSearchQuery("");
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

  useEffect(() => {
    let mounted = true; // For cleanup

    const fetchInitialData = async () => {
      try {
        // Fetch both currency and activities in parallel
        const [currencyResponse, activitiesResponse] = await Promise.all([
          getCurrency(),
          getTouristActivities()
        ]);

        if (!mounted) return;

        // Set currency
        setCurrency(currencyResponse.data);

        // Calculate average rating for each activity
        const activitiesWithAvgRating = activitiesResponse.data.map((activity) => {
          const totalRating = activity.ratings.reduce(
              (acc, curr) => acc + curr.rating,
              0
          );
          const avgRating = activity.ratings.length > 0
              ? (totalRating / activity.ratings.length).toFixed(1)
              : 0;
          return { ...activity, averageRating: parseFloat(avgRating) };
        });

        // If user is logged in, fetch additional data
        if (user) {
          const [savedResponse, notificationResponse] = await Promise.all([
            getSavedActivities(),
            getAllMyRequests()
          ]);

          if (!mounted) return;

          const savedActivitiesId = savedResponse.data.savedActivities.map(
              (activity) => activity._id
          );

          const notificationRequests = notificationResponse.data.notificationsRequests || [];
          const notificationLookup = notificationRequests.reduce((acc, req) => {
            acc[req.activity] = req.status === 'Pending';
            return acc;
          }, {});

          // Add saved and notification status
          activitiesWithAvgRating.forEach((activity) => {
            activity.isSaved = savedActivitiesId.includes(activity._id);
            activity.hasNotification = notificationLookup[activity._id] || false;
          });
        }

        if (!mounted) return;

        // Set activities and budget range
        setActivities(activitiesWithAvgRating);
        setFilteredActivities(activitiesWithAvgRating);

        if (activitiesWithAvgRating.length > 0) {
          const highestPrice = Math.max(
              ...activitiesWithAvgRating.map((act) => act.price.max)
          );
          setMaxBudget(highestPrice);
          setBudget([0, highestPrice]);
        }
      } catch (error) {
        console.log("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array as we only want this to run once on mount

  // Search Function
  const handleSearch = (value) => {
    setSearchQuery(value.trim().toLowerCase());
  };

  // Apply Filters
  const applyFilters = () => {
    let data = [...activities];

    // Search by name, category, or tags
    if (searchQuery) {
      data = data?.filter((activity) => {
        const nameMatch = activity.name.toLowerCase().includes(searchQuery);
        const categoryMatch =
          activity.category &&
          activity.category.category.toLowerCase().includes(searchQuery);
        const tagsMatch =
          activity.preferenceTags &&
          activity.preferenceTags.some((tag) =>
            tag.tag.toLowerCase().includes(searchQuery)
          );
        return nameMatch || categoryMatch || tagsMatch;
      });
    }

    // Filter by budget (using price.min and price.max)
    data = data?.filter(
      (activity) =>
        activity?.price?.min >= budget[0] && activity?.price?.max <= budget[1]
    );

    // Filter by category using _id
    if (category) {
      data = data?.filter(
        (activity) => activity?.category && activity?.category?._id === category
      );
    }

    // Filter by rating using averageRating
    if (rating > 0) {
      data = data?.filter((activity) => activity?.averageRating >= rating);
    }

    // Filter for upcoming activities if the checkbox is checked
    if (showUpcoming) {
      data = data?.filter((activity) => dayjs(activity.date).isAfter(dayjs()));
    }

    // Sorting
    if (sortBy === "price") {
      data?.sort((a, b) => a.price.min - b.price.min);
    } else if (sortBy === "price_desc") {
      data?.sort((a, b) => b.price.max - a.price.max);
    } else if (sortBy === "rating") {
      data?.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === "rating_asc") {
      data?.sort((a, b) => a.averageRating - b.averageRating);
    }

    setFilteredActivities(data);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, budget, category, rating, sortBy, activities, showUpcoming]);

  // Extract unique categories based on _id
  const uniqueCategories = activities?.reduce((acc, act) => {
    if (act.category && !acc.find((cat) => cat.id === act.category._id)) {
      acc.push({ id: act.category._id, name: act.category.category });
    }
    return acc;
  }, []);
  return (
    <div className="p-0 bg-fourth">
      {/* <p className="font-bold text-8xl mb-8 " style={{ color: "#496989" }}>Activities</p> */}

      <div className="flex flex-col items-center space-y-4">
        {/* Centered Search Bar */}
        <Search
          placeholder="Search by name, category, or tag"
          onSearch={handleSearch}
          // enterButton={<SearchOutlined />}
          className="p-2 rounded-md w-[400px]"
          allowClear
        />

        {/* Centered Filters and Reset Button */}
        <div className="flex flex-wrap justify-center space-x-4 items-center">
          {/* Budget Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button1 variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                  />
                </svg>
                <span className="ml-1">Budget</span>
              </Button1>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Budget Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4">
                <p className="mb-2">
                  Budget: ${budget[0]} - ${budget[1]}
                </p>
                <Slider
                  range
                  value={budget}
                  max={maxBudget}
                  onChange={(value) => setBudget(value)}
                  tooltipVisible
                  tooltipPlacement="bottom"
                  className="mt-2"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Category Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button1 variant="outline">
                <FaLayerGroup className="mr-2 h-4 w-4" />
                Category
              </Button1>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4">
                <select
                  id="categoryFilter"
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                  value={category || undefined}
                >
                  <option value="">All Categories</option>
                  {uniqueCategories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rating Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button1 variant="outline">
                <Star className="mr-2 h-4 w-4" />
                Rating
              </Button1>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Minimum Rating</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4">
                <select
                  id="ratingFilter"
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                  value={rating || undefined}
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4 Stars & Above</option>
                  <option value={3}>3 Stars & Above</option>
                  <option value={2}>2 Stars & Above</option>
                  <option value={1}>1 Star & Above</option>
                </select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sorting Dropdown */}
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
              <div className="p-4">
                <select
                  id="sortFilter"
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                  value={sortBy || undefined}
                >
                  <option value="">No Sorting</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="rating_asc">Rating (Low to High)</option>
                </select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reset Button */}
          <Button2
            type="danger"
            icon={<ReloadOutlined />}
            onClick={resetFilters}
            className="h-9"
          >
            Reset
          </Button2>
        </div>
      </div>

      <div className="mt-8">
        {/* Activity Cards */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"> */}
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-between w-[80%]">
            <Checkbox
              checked={showUpcoming}
              onChange={(e) => setShowUpcoming(e.target.checked)}
            >
              Show Upcoming Activities
            </Checkbox>
            {filteredActivities?.length > 0 ? (
              filteredActivities?.map((place) => (
                
                // <Link key={place._id} to={`/itinerary/activityDetails/${place._id}`}>
                <ActivityCard
                  id={place._id}
                  name={place.name}
                  date={dayjs(place.date).format("MMM DD, YYYY")}
                  time={place.time}
                  isBookingOpen={place.isBookingOpen}
                  location={{
                    lat: place.location.lat,
                    lng: place.location.lng,
                  }}
                  price={place.price} // Using price.min for display and filtering
                  category={place.category ? place.category.category : "N/A"}
                  preferenceTags={
                    place.preferenceTags
                      ? place.preferenceTags.map((tag) => tag.tag)
                      : []
                  }
                  
                  averageRating={place.averageRating} // Pass average rating to ActivityCard
                  isSaved={place.isSaved} // Pass isSaved to ActivityCard
                  hasNotification={place.hasNotification}
                  currencyCode={currency?.code}
                  currencyRate={currency?.rate}
                />
                // </Link>
              ))
            ) : (
              <p>No activities found based on the applied filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristActivity;
