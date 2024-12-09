import React, { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import { useLocation } from "react-router-dom";
import { getSavedActivities } from "../../../api/profile.ts";
import { getCurrency } from "../../../api/account.ts";
import { Typography, Empty, Spin } from "antd";
import { HeartFilled, LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {getAllMyRequests} from "../../../api/notifications.ts";

const { Title } = Typography;

const TouristActivity = () => {
  const [activities, setActivities] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await getSavedActivities();

        const activitiesWithAvgRating = response?.data?.savedActivities?.map(
            (activity) => {
              const totalRating = activity?.ratings?.reduce(
                  (acc, curr) => acc + curr.rating,
                  0
              );
              const avgRating =
                  activity?.ratings?.length > 0
                      ? (totalRating / activity?.ratings?.length).toFixed(1)
                      : 0;
              return { ...activity, averageRating: parseFloat(avgRating) };
            }
        );

        const [savedResponse, notificationResponse] = await Promise.all([
          getSavedActivities(),
          getAllMyRequests()
        ]);


        const savedActivitiesId = savedResponse?.data?.savedActivities?.map(
            (activity) => activity?._id
        );

        const notificationRequests = notificationResponse?.data?.notificationsRequests || [];
        const notificationLookup = notificationRequests?.reduce((acc, req) => {
          acc[req?.activity] = req?.status === 'Pending';
          return acc;
        }, {});

        // Add saved and notification status
        activitiesWithAvgRating?.forEach((activity) => {
          activity?.isSaved = savedActivitiesId?.includes(activity?._id);
          activity?.hasNotification = notificationLookup[activity?._id] || false;
        });


        setActivities(activitiesWithAvgRating);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
    fetchActivities();
  }, [location?.pathname]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Spin
              indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />}
              tip="Loading your saved activities..."
          />
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 bg-white px-6 py-3 rounded-full shadow-md">
              <HeartFilled className="text-2xl text-red-500" />
              <Title level={2} className="m-0">
                Saved Activities
              </Title>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover and revisit your favorite activities, all in one place.
            </p>
          </div>

          {/* Activities Grid */}
          {activities?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities?.map((place) => (
                    <div
                        key={place?._id}
                        className="transform  transition-transform duration-300"
                    >
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
                          price={place.price}
                          category={place.category ? place.category.category : "N/A"}
                          preferenceTags={
                            place.preferenceTags
                                ? place.preferenceTags.map((tag) => tag.tag)
                                : []
                          }
                          imageUrl={place.imageUrl}
                          averageRating={place.averageRating}
                          currencyCode={currency?.code}
                          currencyRate={currency?.rate}
                          isSaved={true}
                          hasNotification={place.hasNotification}
                          specialDiscounts={place.specialDiscounts}
                      />
                    </div>
                ))}
              </div>
          ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12">
                <Empty
                    image={Empty?.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-gray-800">
                          No Saved Activities Yet
                        </p>
                        <p className="text-gray-500">
                          Start exploring and save activities you're interested in!
                        </p>
                      </div>
                    }
                />
              </div>
          )}
        </div>
      </div>
  );
};

export default TouristActivity;