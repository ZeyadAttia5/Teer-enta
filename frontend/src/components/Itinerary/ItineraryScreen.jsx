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
  const navigate = useNavigate();
  const location = useLocation();

  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preferenceTagsList, setPreferenceTagsList] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    budget: '',
    dateFilter: '',
    language: '',
    preferenceTag: '',
    sortBy: ''
  });

  // Computed values
  const budgets = [...new Set(itineraries.map(itin => itin.price))];
  const languages = [...new Set(itineraries.map(itin => itin.language))];

  useEffect(() => {
    const initData = async () => {
      if (location.pathname === "/itinerary/my") {
        await fetchMyItineraries();
      } else {
        await fetchItineraries();
      }
      await Promise.all([
        fetchCurrency(),
        fetchPreferenceTags()
      ]);
    };
    initData();
  }, [location.pathname]);

  const calculateAverageRating = (ratings) => {
    if (!ratings?.length) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    // Return fixed decimal number
    return Number((sum / ratings.length).toFixed(1));
  };


  const filterByDate = (itin) => {
    if (!filters.dateFilter) return true;

    return itin.availableDates.some(availableDate => {
      const date = parseISO(availableDate.Date);
      if (isNaN(date)) return false;

      switch(filters.dateFilter) {
        case "today": return isToday(date);
        case "thisWeek": return isThisWeek(date);
        case "thisMonth": return isThisMonth(date);
        case "thisYear": return isThisYear(date);
        case "allUpcoming": return date >= new Date();
        default: return true;
      }
    });
  };

  const getFilteredAndSortedItineraries = () => {
    let filtered = itineraries?.filter(itin =>
        (filters.budget ? itin.price <= filters.budget : true) &&
        filterByDate(itin) &&
        (filters.language ? itin.language === filters.language : true) &&
        (filters.preferenceTag
            ? itin.preferenceTags.some(tag => tag._id === filters.preferenceTag)
            : true) &&
        (filters.searchQuery
            ? itin.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            itin.preferenceTags.some(tag =>
                tag.tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))
            : true)
    );

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const avgRatingA = calculateAverageRating(a.ratings);
        const avgRatingB = calculateAverageRating(b.ratings);

        switch(filters.sortBy) {
          case 'pricingHighToLow': return b.price - a.price;
          case 'pricingLowToHigh': return a.price - b.price;
          case 'ratingHighToLow': return avgRatingB - avgRatingA;
          case 'ratingLowToHigh': return avgRatingA - avgRatingB;
          default: return 0;
        }
      });
    }

    return filtered;
  };

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

  const fetchMyItineraries = async () => {
    setLoading(true);
    try {
      const data = await getMyItineraries();
      setItineraries(data);
    } catch (error) {
      if (error.response?.status === 404) {
        notification.info({ message: "You didn't create any itineraries yet" });
      } else {
        notification.error({ message: "Error fetching itineraries" });
      }
    }
    setLoading(false);
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
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      budget: '',
      dateFilter: '',
      language: '',
      preferenceTag: '',
      sortBy: ''
    });
  };

  const handleBookItinerary = (id) => {
    navigate(`/itinerary/book/${id}`);
  };

  const filteredItineraries = getFilteredAndSortedItineraries();



  return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search and Filters Section */}
          <div className="flex flex-col items-center space-y-6">
            <Search
                enterButton={<SearchOutlined/>}
                placeholder="Search by name, category, or tag..."
                value={filters.searchQuery}
                allowClear
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="max-w-md w-full"
            />

            {/* Filters Row */}
            <div className="flex space-x-4">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button1 variant="outline">
                    <SortAsc className="mr-2 h-4 w-4"/>
                    Sort
                  </Button1>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <select
                          id="sortFilter"
                          value={filters.sortBy}
                          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                          className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                      >
                        <option value="">None</option>
                        <option value="pricingHighToLow">Price (High to Low)</option>
                        <option value="pricingLowToHigh">Price (Low to High)</option>
                        <option value="ratingHighToLow">Rating (High to Low)</option>
                        <option value="ratingLowToHigh">Rating (Low to High)</option>
                      </select>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button1 variant="outline">
                    <Filter className="mr-2 h-4 w-4"/>
                    Filter
                  </Button1>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuGroup>
                    <DropdownMenuSub trigger="Budget">
                      <div className="w-full">
                        <select
                            id="budgetFilter"
                            value={filters.budget}
                            onChange={(e) => handleFilterChange('budget', e.target.value)}
                            className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                        >
                          <option value="">All Budgets</option>
                          {budgets?.map((budget, index) => (
                              <option key={index} value={budget}>{budget}</option>
                          ))}
                        </select>
                      </div>
                    </DropdownMenuSub>

                    <DropdownMenuSub trigger="Date">
                      <div>
                        <select
                            id="dateFilter"
                            value={filters.dateFilter}
                            onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
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
                            value={filters.language}
                            onChange={(e) => handleFilterChange('language', e.target.value)}
                            className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                        >
                          <option value="">All Languages</option>
                          {languages?.map((language, index) => (
                              <option key={index} value={language}>{language}</option>
                          ))}
                        </select>
                      </div>
                    </DropdownMenuSub>

                    <DropdownMenuSub trigger="Preference">
                      <div>
                        <select
                            id="preferenceFilter"
                            value={filters.preferenceTag}
                            onChange={(e) => handleFilterChange('preferenceTag', e.target.value)}
                            className="w-full p-2 border rounded-md cursor-pointer bg-white hover:bg-gray-100 hover:border-transparent"
                        >
                          <option value="">All Preferences</option>
                          {preferenceTagsList?.map((preference) => (
                              <option key={preference._id} value={preference._id}>{preference.tag}</option>
                          ))}
                        </select>
                      </div>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Button */}
              <Button2
                  type="danger"
                  icon={<ReloadOutlined/>}
                  onClick={resetFilters}
                  className="ml-4 h-9"
              >
                Reset
              </Button2>
            </div>
          </div>

          {/* Itineraries Grid */}
          {user === null || user?.userRole === "Tourist" ? (
              filteredItineraries?.length > 0 ? (
                  <div className="max-w-7xl mx-auto mt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredItineraries.map((itinerary, index) => (
                          <ItineraryCard
                              key={itinerary._id}
                              itinerary={itinerary}
                              currency={currency}
                              handleBookItinerary={handleBookItinerary}
                              navigate={navigate}
                              user={user}
                              avgRating={calculateAverageRating(itinerary.ratings)}
                          />
                      ))}
                    </div>
                  </div>
              ) : (
                  <div className="max-w-7xl mx-auto mt-8 text-center">
                    <p className="text-lg text-gray-500">No itineraries available at the moment.</p>
                  </div>
              )
          ) : null}
        </div>
      </div>
  );
};

export default ItineraryScreen;
