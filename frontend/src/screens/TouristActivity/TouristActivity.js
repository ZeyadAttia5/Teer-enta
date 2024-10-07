import React, { useEffect, useState } from "react";
import ActivityCard from "../../components/TouristActivity/ActivityCard";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Input, Select, Slider, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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

  const location = useLocation();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${PORT}/activity/`, {
          params: { populate: "category preferenceTags" }, // Ensure backend populates these fields
        });
        console.log("Fetched Activities:", response.data); // Inspect the data structure

        // Filter upcoming activities
        const upcomingActivities = response.data.filter((activity) =>
            dayjs(activity.date).isAfter(dayjs())
        );

        // Calculate average rating for each activity
        const activitiesWithAvgRating = upcomingActivities.map((activity) => {
          const avgRating =
              activity.ratings.length > 0
                  ? activity.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                  activity.ratings.length
                  : 0;
          return { ...activity, averageRating: avgRating };
        });

        setActivities(activitiesWithAvgRating);
        setFilteredActivities(activitiesWithAvgRating);

        // Set dynamic budget range
        if (activitiesWithAvgRating.length > 0) {
          const highestPrice = Math.max(...activitiesWithAvgRating.map(act => act.price.min));
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

    // Filter by budget (using price.min)
    data = data.filter(
        (activity) =>
            activity.price.min >= budget[0] && activity.price.min <= budget[1]
    );

    // Filter by category using _id
    if (category) {
      data = data.filter(
          (activity) =>
              activity.category && activity.category._id === category
      );
    }

    // Filter by rating using averageRating
    if (rating > 0) {
      data = data.filter((activity) => activity.averageRating >= rating);
    }

    // Sorting
    if (sortBy === "price") {
      data.sort((a, b) => a.price.min - b.price.min);
    } else if (sortBy === "rating") {
      data.sort((a, b) => b.averageRating - a.averageRating);
    }

    setFilteredActivities(data);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, budget, category, rating, sortBy, activities]);

  // Extract unique categories based on _id
  const uniqueCategories = activities.reduce((acc, act) => {
    if (act.category && !acc.find(cat => cat.id === act.category._id)) {
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
              <Option value="rating">Rating (High to Low)</Option>
            </Select>
          </Col>
        </Row>

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
                        specialDiscounts={place.specialDiscounts}
                        ratings={place.averageRating.toFixed(1)} // Displaying average rating
                        comments={place.comments}
                        createdBy={place.createdBy}
                    />
                  </Link>
              ))
          ) : (
              <p className="col-span-full text-center text-gray-500">No activities found.</p>
          )}
        </div>
      </div>
  );
};

export default TouristActivity;
