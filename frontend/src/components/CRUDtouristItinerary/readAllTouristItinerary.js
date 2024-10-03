import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ReadAllTouristItinerary() {
  const [itinerary, setItinerary] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "/touristItenerary/"
        );

        if (response.ok) {
          const data = await response.json();
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
        }
      } catch (error) {
        console.error("Error:", error);
        setIsEmpty(true);
      }
    };

    fetchItineraries();
  }, []);

  const handleNavigate = (itineraryItem) => {
    navigate("/read-tourist-itinerary", {
      state: { itinerary: itineraryItem },
    });
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
      <h2 className="text-3xl font-bold mb-6">Tourist Itineraries</h2>
      {itinerary.map((itineraryItem, index) => (
        <div
          key={index}
          className="mb-8 w-full max-w-2xl border border-gray-300 shadow-lg p-6 rounded-lg bg-white cursor-pointer transition-transform transform hover:scale-105"
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

          {itineraryItem.activities.length > 0 ? (
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
                    <strong>Category:</strong> {activity?.category}
                  </p>
                  {/* should change later to category.name */}
                  <p className="text-gray-700 mb-1">
                    <strong>Price:</strong> ${activity?.price?.min} - $
                    {activity?.price?.max}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Tags:</strong> {console.log("hello", activity.tags)}
                    {activity.tags.map((tag) => tag.name).join(", ")}
                    {/* should change later to tag.name */}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Special Discounts:</strong>{" "}
                    {activity?.specialDiscounts
                      .map(
                        (discount) =>
                          `${discount?.Description} (${discount?.discount}%)`
                      )
                      .join(", ")}
                  </p>
                  {/* what if no special discounts */}
                  <p className="text-gray-700 mb-1">
                    <strong>Rating:</strong>{" "}
                    {activity.ratings.length === 0
                      ? "No ratings yet"
                      : activity.ratings.reduce(
                          (sum, rating) => sum + rating.rating,
                          0
                        ) / activity.ratings.length}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <strong>Comment:</strong>{" "}
                    {activity.comments.length === 0
                      ? "No comments "
                      : activity?.comments
                          .map((comment) => `${comment?.comment}`)
                          .join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 mt-4">No activities available.</p>
          )}

          {itineraryItem?.tags.length > 0 ? (
            <p className="mt-4 p-4 border border-gray-200 shadow-sm rounded-lg bg-gray-50">
              <strong>Tag:</strong>
              {itineraryItem.tags.map((tag) => " " + tag?.tag)} <br />
            </p>
          ) : (
            <p className="mt-4 p-4 border border-gray-200 shadow-sm rounded-lg bg-gray-50">
              <strong>No Tags Available</strong>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReadAllTouristItinerary;
// const hardcodedItinerary = [
//   {
//     startDate: "2023-10-01",
//     endDate: "2023-10-10",
//     activities: [
//       {
//         _id: "1",
//         name: "City Tour",
//         date: "2023-10-02",
//         time: "10:00 AM",
//         category: "Sightseeing",
//         price: { min: 20, max: 50 },
//         tags: ["city", "tour"],
//         specialDiscounts: [{ Description: "Student Discount", discount: 10 }],
//         ratings: [{ rating: 4.5 }],
//         comments: [{ comment: "Great tour!" }],
//       },
//       {
//         _id: "2",
//         name: "Museum Visit",
//         date: "2023-10-03",
//         time: "2:00 PM",
//         category: "Culture",
//         price: { min: 15, max: 30 },
//         tags: ["museum", "culture"],
//         specialDiscounts: [{ Description: "Senior Discount", discount: 15 }],
//         ratings: [{ rating: 4.8 }],
//         comments: [{ comment: "Very informative." }],
//       },
//     ],
//     tag: {
//       name: "Historical Tour",
//       type: "History",
//       historicalPeriod: "Medieval",
//     },
//   },
//   // add another 3 itineraries
//   {
//     startDate: "2023-10-01",
//     endDate: "2023-10-10",
//     activities: [
//       {
//         _id: "3",
//         name: "City Tour",
//         date: "2023-10-02",
//         time: "10:00 AM",
//         category: "Sightseeing",
//         price: { min: 20, max: 50 },
//         tags: ["city", "tour"],
//         specialDiscounts: [{ Description: "Student Discount", discount: 10 }],
//         ratings: [{ rating: 4.5 }],
//         comments: [{ comment: "Great tour!" }],
//       },
//       {
//         _id: "4",
//         name: "Museum Visit",
//         date: "2023-10-03",
//         time: "2:00 PM",
//         category: "Culture",
//         price: { min: 15, max: 30 },
//         tags: ["museum", "culture"],
//         specialDiscounts: [{ Description: "Senior Discount", discount: 15 }],
//         ratings: [{ rating: 4.8 }],
//         comments: [{ comment: "Very informative." }],
//       },
//     ],
//     tag: {
//       name: "Historical Tour",
//       type: "History",
//       historicalPeriod: "Medieval",
//     },
//   },
//   {
//     startDate: "2023-10-01",
//     endDate: "2023-10-10",
//     activities: [
//       {
//         _id: "5",
//         name: "City Tour",
//         date: "2023-10-02",
//         time: "10:00 AM",
//         category: "Sightseeing",
//         price: { min: 20, max: 50 },
//         tags: ["city", "tour"],
//         specialDiscounts: [{ Description: "Student Discount", discount: 10 }],
//         ratings: [{ rating: 4.5 }],
//         comments: [{ comment: "Great tour!" }],
//       },
//       {
//         _id: "6",
//         name: "Museum Visit",
//         date: "2023-10-03",
//         time: "2:00 PM",
//         category: "Culture",
//         price: { min: 15, max: 30 },
//         tags: ["museum", "culture"],
//         specialDiscounts: [{ Description: "Senior Discount", discount: 15 }],
//         ratings: [{ rating: 4.8 }],
//         comments: [{ comment: "Very informative." }],
//       },
//     ],
//     tag: {
//       name: "Historical Tour",
//       type: "History",
//       historicalPeriod: "Medieval",
//     },
//   },
// ];
