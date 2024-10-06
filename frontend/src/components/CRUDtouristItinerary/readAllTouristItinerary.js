// src/components/ReadAllTouristItinerary.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Alert, Spin } from "antd"; // Import Ant Design components

function ReadAllTouristItinerary({setFlag}) {
  setFlag(false);
  const [itinerary, setItinerary] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Optional: To handle and display errors

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/touristItenerary/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include auth if required
              },
            }
        );

        if (response.status === 200) {
          const data = response.data;
          if (data.length === 0) {
            setIsEmpty(true);
          } else {
            setItinerary(data);
            setIsEmpty(false);
            console.log("Itineraries:", data);
          }
        } else {
          console.error("Failed to fetch itineraries");
          setIsEmpty(true);
          setError("Failed to fetch itineraries.");
        }
      } catch (error) {
        console.error("Error:", error);
        setIsEmpty(true);
        setError("An error occurred while fetching itineraries.");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  const handleNavigate = (itineraryItem) => {
    navigate("/touristItinerary/view", {
      state: { itinerary: itineraryItem },
    });
  };

  const handleAddItinerary = () => {
    navigate("/touristItinerary/create");
  };

  if (loading) {
    return (
        <div className="font-sans p-5 bg-white text-black flex flex-col items-center justify-center min-h-screen">
          <Spin size="large" className="mb-4" /> {/* Ant Design Spin */}
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
    );
  }

  return (
      <div className="font-sans p-5 bg-white text-black flex flex-col items-center">
        {/* Header with Title and Add Button */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Tourist Itineraries</h2>
          <Button type="primary" onClick={handleAddItinerary}>
            Add Tourist Itinerary
          </Button>
        </div>

        {/* Error Message */}
        {error && (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className="mb-4 w-full max-w-4xl"
            />
        )}

        {/* No Itinerary Found */}
        {isEmpty && !loading && !error && (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">No Itinerary Found</h2>
            </div>
        )}

        {/* Itineraries List */}
        {!isEmpty && !loading && !error && (
            <div className="w-full max-w-4xl">
              {itinerary.map((itineraryItem) => (
                  <div
                      key={itineraryItem._id} // Use unique identifier
                      className="mb-8 w-full border border-gray-300 shadow-lg p-6 rounded-lg bg-white cursor-pointer transition-transform transform hover:scale-105"
                      onClick={() => handleNavigate(itineraryItem)}
                  >
                    <h2 className="text-2xl font-semibold mb-2">{itineraryItem.name}</h2>
                    <p className="text-gray-700 mb-1">
                      <strong>Start Date:</strong>{" "}
                      {new Date(itineraryItem.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-1">
                      <strong>End Date:</strong>{" "}
                      {new Date(itineraryItem.endDate).toLocaleDateString()}
                    </p>

                    {itineraryItem.activities?.length > 0 ? (
                        <ul className="list-none w-full mt-4">
                          {itineraryItem.activities.map((activity) => (
                              <li
                                  key={activity._id}
                                  className="mb-5 border border-gray-200 shadow-sm p-4 rounded-lg bg-gray-50"
                              >
                                <h3 className="text-xl font-semibold mb-1">
                                  {activity.name}
                                </h3>
                                <p className="text-gray-700 mb-1">
                                  <strong>Date:</strong>{" "}
                                  {new Date(activity.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-700 mb-1">
                                  <strong>Time:</strong> {activity.time}
                                </p>
                                <p className="text-gray-700 mb-1">
                                  <strong>Category:</strong>{" "}
                                  {activity?.category?.name || "N/A"}
                                </p>
                                <p className="text-gray-700 mb-1">
                                  <strong>Price:</strong> ${activity?.price?.min} - $
                                  {activity?.price?.max}
                                </p>
                                <p className="text-gray-700 mb-1">
                                  <strong>Tags:</strong>{" "}
                                  {activity.tags?.map((tag) => tag.name || tag.tag).join(", ") || "N/A"}
                                </p>
                                <p className="text-gray-700 mb-1">
                                  <strong>Special Discounts:</strong>{" "}
                                  {activity?.specialDiscounts && activity.specialDiscounts.length > 0
                                      ? activity.specialDiscounts
                                          .map(
                                              (discount) =>
                                                  `${discount?.Description} (${discount?.discount}%)`
                                          )
                                          .join(", ")
                                      : "No special discounts"}
                                </p>
                                <p className="text-gray-700 mb-1">
                                  <strong>Rating:</strong>{" "}
                                  {activity.ratings?.length === 0
                                      ? "No ratings yet"
                                      : (
                                          activity.ratings.reduce(
                                              (sum, rating) => sum + rating.rating,
                                              0
                                          ) / activity.ratings.length
                                      ).toFixed(1)}
                                </p>
                                <p className="text-gray-700 mb-1">
                                  <strong>Comment:</strong>{" "}
                                  {activity.comments?.length === 0
                                      ? "No comments"
                                      : activity.comments
                                          .map((comment) => `${comment?.comment}`)
                                          .join(", ")}
                                </p>
                              </li>
                          ))}
                        </ul>
                    ) : (
                        <p className="text-gray-700 mt-4">No activities available.</p>
                    )}

                    {/* Tags Section */}
                    {itineraryItem.tags?.length > 0 ? (
                        <div className="mt-4 p-4 border border-gray-200 shadow-sm rounded-lg bg-gray-50">
                          <strong>Tags:</strong>
                          {itineraryItem.tags.map((tag) => ` ${tag?.tag || tag.name}`).join(", ")}
                        </div>
                    ) : (
                        <div className="mt-4 p-4 border border-gray-200 shadow-sm rounded-lg bg-gray-50">
                          <strong>No Tags Available</strong>
                        </div>
                    )}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

export default ReadAllTouristItinerary;
