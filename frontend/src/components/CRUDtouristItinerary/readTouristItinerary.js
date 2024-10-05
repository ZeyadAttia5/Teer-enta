import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const URL = process.env.REACT_APP_BACKEND_URL;

function ReadTouristItinerary() {
  const [itinerary, setItinerary] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const userRole = user.userRole;

  useEffect(() => {
    if (userRole === "Admin") {
      setIsAdmin(true);
    }
  }, [userRole]); // Add userRole as a dependency

  useEffect(() => {
    if (location.state && location.state.itinerary) {
      setItinerary(location.state.itinerary);
      setIsEmpty(false);
    }
  }, [location]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${URL}/touristItenerary/delete/${itinerary._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setItinerary(null); // Clear the itinerary from the state
        navigate("/touristItinerary");
      } else {
        console.error("Failed to delete the itinerary");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = () => {
    navigate("/touristItinerary/update", { state: { itinerary } });
  };

  if (isEmpty) {
    return (
      <div className="font-sans p-5 bg-white text-black flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">No Itinerary Found</h2>
      </div>
    );
  }

  return (
    <div className="font-sans p-5 bg-gray-50 text-black flex flex-col items-center min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Tourist Itinerary</h2>
      {itinerary ? (
        <>
          <h3 className="text-2xl font-semibold mb-4 text-center">
            {itinerary?.name}
          </h3>
          <p className="mb-4 text-center">
            <strong>Start Date:</strong> {itinerary?.startDate.split("T")[0]}
          </p>
          <p className="mb-4 text-center">
            <strong>End Date:</strong> {itinerary?.endDate.split("T")[0]}
          </p>

          <ul className="list-none w-full max-w-2xl">
            {itinerary?.activities?.length > 0 ? (
              itinerary?.activities?.map((activity) => (
                <li
                  key={activity._id}
                  className="mb-6 border border-gray-300 p-6 rounded-lg bg-white shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-2 text-center">
                    {activity?.name}
                  </h3>
                  <p className="mb-2 text-center">
                    <strong>Date:</strong> {activity?.date.split("T")[0]}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Time:</strong> {activity?.time}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Category:</strong> {activity?.category}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Price:</strong> ${activity?.price?.min} - $
                    {activity?.price?.max}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Tags:</strong>{" "}
                    {activity?.tags?.length === 0
                      ? "No tags"
                      : activity?.tags?.map((tag) => tag.name).join(", ")}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Special Discounts:</strong>{" "}
                    {activity.specialDiscounts.length === 0
                      ? " No Special Discount"
                      : activity?.specialDiscounts
                          .map(
                            (discount) =>
                              `${discount?.Description} (${discount?.discount}%)`
                          )
                          .join(", ")}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Rating:</strong>{" "}
                    {activity.ratings.length === 0
                      ? "No ratings yet"
                      : activity.ratings.reduce(
                          (sum, rating) => sum + rating.rating,
                          0
                        ) / activity.ratings.length}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Comment:</strong>{" "}
                    {activity?.comments.length === 0
                      ? "No comments"
                      : activity?.comments
                          .map((comment) => `${comment?.comment}`)
                          .join(", ")}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-lg text-gray-500 text-center">
                No activities available.
              </p>
            )}
          </ul>

          {itinerary?.tags.length > 0 ? (
            <p className="mt-4 p-4 border border-gray-200 shadow-sm rounded-lg bg-gray-50">
              <strong>Tag:</strong>
              {itinerary.tags.map((tag) => " " + tag?.tag)} <br />
            </p>
          ) : (
            <p className="mt-4 p-4 border border-gray-200 shadow-sm rounded-lg bg-gray-50">
              <strong>No Tags Available</strong>
            </p>
          )}
          {isAdmin && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Edit Itinerary
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Delete Itinerary
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-lg text-gray-500 text-center my-4">
          No itinerary data available.
        </p>
      )}
    </div>
  );
}

export default ReadTouristItinerary;
