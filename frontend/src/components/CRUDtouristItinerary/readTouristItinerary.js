import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ReadTouristItinerary() {
  const [itinerary, setItinerary] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    if (location.state && location.state.itinerary) {
      setItinerary(location.state.itinerary);
      setIsEmpty(false);
    }
  }, [location]);
  const handleDelete = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch(URL + `/touristItenerary/${itinerary.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItinerary(null); // Clear the itinerary from the state
      } else {
        console.error("Failed to delete the itinerary");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = () => {
    navigate("/update-tourist-itinerary", { state: { itinerary } });
  };

  if (isEmpty) {
    return (
      <div className="font-sans p-5 bg-white text-black flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">No Itinerary Found</h2>
      </div>
    );
  }
  return (
    <div className="font-sans p-5 bg-white text-black flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Tourist Itinerary</h2>
      {itinerary ? (
        <>
          <h3 className="text-xl font-semibold mb-2 text-center my-4">
            {itinerary.name}
          </h3>
          <p className="mb-2 text-center my-4">
            <strong>Start Date:</strong> {itinerary.startDate.split("T")[0]}
          </p>
          <p className="mb-2 text-center my-4">
            <strong>End Date:</strong> {itinerary.endDate.split("T")[0]}
          </p>

          <ul className="list-none w-full max-w-2xl">
            {itinerary.activities.length > 0 ? (
              itinerary.activities?.map((activity) => (
                <li
                  key={activity._id}
                  className="mb-5 border border-gray-300 p-4 rounded-lg bg-gray-100 shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-1 text-center my-4">
                    {activity.name}
                  </h3>
                  <p className="mb-1 text-center my-4">
                    <strong>Date:</strong> {activity.date.split("T")[0]}
                  </p>
                  <p className="mb-1 text-center my-4">
                    <strong>Time:</strong> {activity.time}
                  </p>
                  <p className="mb-1 text-center my-4">
                    <strong>Category:</strong> {activity.category}
                  </p>
                  <p className="mb-1 text-center my-4">
                    <strong>Price:</strong> ${activity.price.min} - $
                    {activity.price.max}
                  </p>
                  <p className="mb-1 text-center my-4">
                    <strong>Tags:</strong> {activity.tags.join(", ")}
                  </p>
                  <p className="mb-1 text-center my-4">
                    <strong>Special Discounts:</strong>{" "}
                    {activity.specialDiscounts
                      .map(
                        (discount) =>
                          `${discount.Description} (${discount.discount}%)`
                      )
                      .join(", ")}
                  </p>
                  <p className="mb-1 text-center my-4">
                    <strong>Rating:</strong>{" "}
                    {activity.ratings
                      .map((rating) => `${rating.rating}`)
                      .join(", ")}
                  </p>
                  <p className="mb-1 text-center my-4">
                    <strong>Comment:</strong>{" "}
                    {activity.comments
                      .map((comment) => `${comment.comment}`)
                      .join(", ")}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-lg text-gray-500 text-center my-4">
                No activities available.
              </p>
            )}
          </ul>

          {itinerary?.tag?.tags && itinerary.tag.tags.length > 0 ? (
            <p className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-md text-center my-4">
              <strong>Tags:</strong> {itinerary.tag.tags.join(", ")}
            </p>
          ) : (
            <p className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100 shadow-md text-center my-4 text-500">
              No tags available.
            </p>
          )}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit Itinerary
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Itinerary
            </button>
          </div>
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

// const hardcodedItinerary = {
//   startDate: "2023-10-01",
//   endDate: "2023-10-10",
//   activities: [
//     {
//       _id: "1",
//       name: "City Tour",
//       date: "2023-10-02",
//       time: "10:00 AM",
//       category: "Sightseeing",
//       price: { min: 20, max: 50 },
//       tags: ["city", "tour"],
//       specialDiscounts: [{ Description: "Student Discount", discount: 10 }],
//       ratings: [{ rating: 4.5 }],
//       comments: [{ comment: "Great tour!" }],
//     },
//     {
//       _id: "2",
//       name: "Museum Visit",
//       date: "2023-10-03",
//       time: "2:00 PM",
//       category: "Culture",
//       price: { min: 15, max: 30 },
//       tags: ["museum", "culture"],
//       specialDiscounts: [{ Description: "Senior Discount", discount: 15 }],
//       ratings: [{ rating: 4.8 }],
//       comments: [{ comment: "Very informative." }],
//     },
//   ],
//   tag: {
//     name: "Historical Tour",
//     type: "History",
//     historicalPeriod: "Medieval",
//   },
// };
