import React, { useEffect, useState } from "react";
import ActivityCard from "../../components/TouristActivity/ActivityCard";
import { getActivities } from "../../api/activity.ts"; // Assuming this is an async function that fetches activities

import { MdOutlineAddBox } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const PORT = process.env.REACT_APP_BACKEND_URL;

const TouristActivity = ({ setFlag }) => {
  setFlag(false);

  const [historicalPlacesData, setHistoricalPlacesData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const userRole = user?.userRole;
  const location = useLocation();
  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axios.get(`${PORT}/activity/`);
        setHistoricalPlacesData(response.data);
        
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchHistoricalPlaces();
  }, [location.pathname]);

  return (
    <div className="p-16 bg-gray-100">
      <p className="font-bold text-4xl mb-8">Activities</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {historicalPlacesData.map((place, index) => (
          <Link to={`/itinerary/activityDetails/${place._id}`}>
            <ActivityCard
              key={index}
              name={place.name}
              date={place.date}
              time={place.time}
              isBookingOpen={place.isBookingOpen}
              location={{
                lat: place.location.lat,
                lng: place.location.lng,
              }}
              price={place.price}
              category={place.category} // Assuming place.category is populated with category name
              preferenceTags={place.preferenceTags} // Assuming place.preferenceTags are populated with tag names
              specialDiscounts={place.specialDiscounts} // Passing the whole specialDiscounts array
              ratings={place.ratings}
              comments={place.comments}
              createdBy={place.createdBy} // If you want to pass the user who created the activity
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TouristActivity;
