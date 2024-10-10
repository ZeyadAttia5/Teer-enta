import React, { useEffect, useState } from "react";
import ActivityCard from "../../components/TouristActivity/ActivityCard";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Input, Select, Slider, Row, Col, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getTouristActivities } from "../../api/activity.ts";
import dayjs from "dayjs";

const PORT = process.env.REACT_APP_BACKEND_URL;
const { Search } = Input;
const { Option } = Select;

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

  const location = useLocation();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getTouristActivities();
        console.log("Fetched Activities:", response.data); // Inspect the data structure

        // Calculate average rating for each activity
        const activitiesWithAvgRating = response.data.map((activity) => {
          const totalRating = activity.ratings.reduce((acc, curr) => acc + curr.rating, 0);
          const avgRating =
              activity.ratings.length > 0 ? (totalRating / activity.ratings.length).toFixed(1) : 0;
          console.log( {...activity, averageRating: parseFloat(avgRating)})
          return { ...activity, averageRating: parseFloat(avgRating) }; // Ensure averageRating is a number
        });

        setActivities(activitiesWithAvgRating);
        setFilteredActivities(activitiesWithAvgRating);

        // Set dynamic budget range
        if (activitiesWithAvgRating.length > 0) {
          const highestPrice = Math.max(
              ...activitiesWithAvgRating.map((act) => act.price.max)
          );
          setMaxBudget(highestPrice);
          setBudget([0, highestPrice]);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, [location.pathname]);

  // Search Function
  const handleSearch = (value) => {
    setSearchQuery(value.trim().toLowerCase());
  };

  // Apply Filters
  const applyFilters = () => {
    let data = [...activities];

    // Search by name, category, or tags
    if (searchQuery) {
      data = data.filter((activity) => {
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
    data = data.filter(
        (activity) =>
            activity.price.min >= budget[0] && activity.price.max <= budget[1]
    );

    // Filter by category using _id
    if (category) {
      data = data.filter(
          (activity) => activity.category && activity.category._id === category
      );
    }

    // Filter by rating using averageRating
    if (rating > 0) {
      data = data.filter((activity) => activity.averageRating >= rating);
    }

    // Filter for upcoming activities if the checkbox is checked
    if (showUpcoming) {
      data = data.filter((activity) => dayjs(activity.date).isAfter(dayjs()));
    }

    // Sorting
    if (sortBy === "price") {
      data.sort((a, b) => a.price.min - b.price.min);
    } else if (sortBy === "price_desc") {
      data.sort((a, b) => b.price.max - a.price.max);
    } else if (sortBy === "rating") {
      data.sort((a, b) => b.averageRating - a.averageRating);
    } else if (sortBy === "rating_asc") {
      data.sort((a, b) => a.averageRating - b.averageRating);
    }

    setFilteredActivities(data);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, budget, category, rating, sortBy, activities, showUpcoming]);

  // Extract unique categories based on _id
  const uniqueCategories = activities.reduce((acc, act) => {
    if (act.category && !acc.find((cat) => cat.id === act.category._id)) {
      acc.push({ id: act.category._id, name: act.category.category });
    }
    return acc;
  }, []);

  return (
      <div className="p-16 bg-gray-100">
        <p className="font-bold text-4xl mb-8">Activities</p>

        {/* Search Input */}
        <Search
            placeholder="Search by name, category, or tag"
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            size="large"
            className="mb-8"
            allowClear
        />

        {/* Filters and Sorting */}
        <Row gutter={[16, 16]} className="mb-8">
          {/* Budget Filter */}
          <Col xs={24} md={12} lg={6}>
            <p className="mb-2">Budget: ${budget[0]} - ${budget[1]}</p>
            <Slider
                range
                value={budget}
                max={maxBudget}
                onChange={(value) => setBudget(value)}
                tooltipVisible
                tooltipPlacement="bottom"
            />
          </Col>

          {/* Category Filter */}
          <Col xs={24} md={12} lg={6}>
            <Select
                placeholder="Select category"
                onChange={(value) => setCategory(value)}
                className="w-full"
                allowClear
                value={category || undefined}
            >
              <Option value="">All Categories</Option>
              {uniqueCategories.map((cat) => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Option>
              ))}
            </Select>
          </Col>

          {/* Rating Filter */}
          <Col xs={24} md={12} lg={6}>
            <Select
                placeholder="Select minimum rating"
                onChange={(value) => setRating(value)}
                className="w-full"
                allowClear
                value={rating || undefined}
            >
              <Option value={0}>All Ratings</Option>
              <Option value={4}>4 Stars & Above</Option>
              <Option value={3}>3 Stars & Above</Option>
              <Option value={2}>2 Stars & Above</Option>
              <Option value={1}>1 Star & Above</Option>
            </Select>
          </Col>

          {/* Sorting */}
          <Col xs={24} md={12} lg={6}>
            <Select
                placeholder="Sort by"
                onChange={(value) => setSortBy(value)}
                className="w-full"
                allowClear
                value={sortBy || undefined}
            >
              <Option value="">No Sorting</Option>
              <Option value="price">Price (Low to High)</Option>
              <Option value="price_desc">Price (High to Low)</Option>
              <Option value="rating">Rating (High to Low)</Option>
              <Option value="rating_asc">Rating (Low to High)</Option>
            </Select>
          </Col>
        </Row>

        {/* Checkbox for Upcoming Activities */}
        <Checkbox
            checked={showUpcoming}
            onChange={(e) => setShowUpcoming(e.target.checked)}
        >
          Show Upcoming Activities
        </Checkbox>

        {/* Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.length > 0 ? (
              filteredActivities.map((place) => (
                  <Link key={place._id} to={`/itinerary/activityDetails/${place._id}`}>
                    <ActivityCard
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
                        image={place.imagePath}
                        averageRating={place.averageRating} // Pass average rating to ActivityCard
                    />
                  </Link>
              ))
          ) : (
              <p>No activities found based on the applied filters.</p>
          )}
        </div>
      </div>
  );
};

export default TouristActivity;
