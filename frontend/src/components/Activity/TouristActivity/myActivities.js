import React, { useEffect, useState } from "react";
import ActivityCard from "../TouristActivity/ActivityCard"; // Adjust the import path as necessary
import { getSavedActivities } from "../../../api/profile.ts"; // Adjust the import path as necessary
import { getCurrency } from "../../../api/account.ts";

const MyActivities = () => {
  const [activities, setActivities] = useState([]);
  const [currency, setCurrency] = useState({});

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const savedActivities = await getSavedActivities();
        console.log(savedActivities.data.savedActivities); // Make sure the response is as expected
        setActivities(savedActivities.data.savedActivities);
      } catch (error) {
        console.error("Error fetching saved activities:", error);
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

    fetchActivities();
    fetchCurrency();
  }, []);

  console.log(activities);
  return (
    <div>
      <h1>My Activities</h1>
      <div className="activities-list">
        {activities.map((activity) => {
          console.log(activity);
          return (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              name={activity.name}
              date={activity.date}
              time={activity.time}
              isBookingOpen={activity.isBookingOpen}
              location={activity.location}
              price={activity.price}
              category={activity.category}
              specialDiscounts={activity.specialDiscounts}
              ratings={activity.ratings}
              currencyCode={currency.currencyCode}
              currencyRate={currency.currencyRate}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MyActivities;
