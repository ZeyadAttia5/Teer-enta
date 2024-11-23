import React, { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import { useLocation } from "react-router-dom";
import { getSavedActivities } from "../../../api/profile.ts";
import dayjs from "dayjs";
import { getCurrency } from "../../../api/account.ts";

const TouristActivity = () => {
  const [activities, setActivities] = useState([]);
  const [currency, setCurrency] = useState(null);

  const location = useLocation();

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
    const fetchActivities = async () => {
      try {
        const response = await getSavedActivities();
        console.log("Fetched Activities:", response.data.savedActivities);

        const activitiesWithAvgRating = response.data.savedActivities.map(
          (activity) => {
            const totalRating = activity.ratings.reduce(
              (acc, curr) => acc + curr.rating,
              0
            );
            const avgRating =
              activity.ratings.length > 0
                ? (totalRating / activity.ratings.length).toFixed(1)
                : 0;
            return { ...activity, averageRating: parseFloat(avgRating) };
          }
        );

        setActivities(activitiesWithAvgRating);
        console.log("Activities with avg rating:", activitiesWithAvgRating);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchCurrency();
    fetchActivities();
  }, [location?.pathname]);

  return (
    <div className="p-16 bg-fourth">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600 p-2 rounded-lg shadow-md">
        My Activities
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {activities.length > 0 ? (
          activities.map((place) => (
            <ActivityCard
              key={place._id}
              id={place._id}
              name={place.name}
              date={dayjs(place.date).format("MMM DD, YYYY")}
              time={place.time}
              isBookingOpen={place.isBookingOpen}
              location={{
                lat: place.location.lat,
                lng: place.location.lng,
              }}
              price={place.price}
              category={place.category ? place.category.category : "N/A"}
              preferenceTags={
                place.preferenceTags
                  ? place.preferenceTags.map((tag) => tag.tag)
                  : []
              }
              image={place.imagePath}
              averageRating={place.averageRating}
              currencyCode={currency?.code}
              currencyRate={currency?.rate}
              isSaved={true}
            />
          ))
        ) : (
          <p>No activities found.</p>
        )}
      </div>
    </div>
  );
};

export default TouristActivity;
