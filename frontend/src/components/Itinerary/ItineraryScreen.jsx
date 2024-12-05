import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  message,
  notification, Rate,
  Tooltip,
} from "antd";
import {BellOutlined, EnvironmentOutlined, HeartOutlined, ReloadOutlined} from "@ant-design/icons";
import {
  GlobalOutlined,
  TeamOutlined,
  EnvironmentTwoTone,
} from "@ant-design/icons";
import {
  getItineraries,
  getMyItineraries,
} from "../../api/itinerary.ts";
import { SearchOutlined } from "@ant-design/icons";
import { getActivities } from "../../api/activity.ts";
import { getPreferenceTags } from "../../api/preferenceTags.ts";
import { Filter, SortAsc, ChevronRight } from "lucide-react";
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
import ItineraryCard from "./ItineraryCard";

const { Search } = Input;

const Button1 = ({ children, onClick, variant = "default" }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none  bg-fourth text-black";
  const variantClasses =
    variant === "outline"
      ? "hover:bg-third hover:text-accent-foreground" // Light gray hover background for outline variant
      : "text-gray-700 hover:bg-third"; // Light gray hover background for default variant

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
    "inline-flex font-playfair-display items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-fourth text-black";
  const variantClasses =
    variant === "outline"
      ? "hover:bg-third hover:text-accent-foreground" // Light gray hover background for outline variant
      : "text-gray-700 hover:bg-third"; // Light gray hover background for default variant

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

const ItineraryScreen = ({ setFlag }) => {
  setFlag(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedPreference, setSelectedPreference] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [activitiesList, setActivitiesList] = useState([]);
  const [preferenceTagsList, setPreferenceTagsList] = useState([]);
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
      // console.log("Currency:", response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  };


  const handleBookItinerary = (id) => {
    navigate(`/itinerary/book/${id}`);
  };

  return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        {/* Search and Filters Section */}
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Bar Section */}
          <div className="flex flex-col items-center space-y-6">
            <Search
                enterButton={<SearchOutlined />}
                placeholder="Search by name, category, or tag..."
                value={searchTerm}
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md w-full"
            />

            {/* Filters Row */}
            <div className="flex flex-wrap justify-center space-x-4 items-center">
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
                          <option value="pricingHighToLow">Price (High to Low)</option>
                          <option value="pricingLowToHigh">Price (Low to High)</option>
                          <option value="ratingHighToLow">Rating (High to Low)</option>
                          <option value="ratingLowToHigh">Rating (Low to High)</option>
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
                    {/* Keep your existing filter options */}
                    {/* ... */}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Button */}
              <Button2
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={resetFilters}
                  className="h-9"
              >
                Reset filters
              </Button2>
            </div>
          </div>
        </div>

        {/* Itineraries Grid Section */}
        {user === null || user?.userRole === "Tourist" && (
            <div className="max-w-7xl mx-auto mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedItineraries?.map((itinerary, index) => (
                    <ItineraryCard
                        key={index}
                        itinerary={itinerary}
                        currency={currency}
                        handleBookItinerary={handleBookItinerary}
                        navigate={navigate}
                        user={user}
                    />
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default ItineraryScreen;
