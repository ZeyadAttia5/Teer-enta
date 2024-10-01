import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const hardcodedItinerary = {
  startDate: "2023-10-01",
  endDate: "2023-10-10",
  activities: [
    {
      _id: "1",
      name: "City Tour",
      date: "2023-10-02",
      time: "10:00 AM",
      category: "Sightseeing",
      price: { min: 20, max: 50 },
      tags: ["city", "tour"],
      specialDiscounts: [{ Description: "Student Discount", discount: 10 }],
      ratings: [{ rating: 4.5 }],
      comments: [{ comment: "Great tour!" }],
    },
    {
      _id: "2",
      name: "Museum Visit",
      date: "2023-10-03",
      time: "2:00 PM",
      category: "Culture",
      price: { min: 15, max: 30 },
      tags: ["museum", "culture"],
      specialDiscounts: [{ Description: "Senior Discount", discount: 15 }],
      ratings: [{ rating: 4.8 }],
      comments: [{ comment: "Very informative." }],
    },
  ],
  tag: {
    name: "Historical Tour",
    type: "History",
    historicalPeriod: "Medieval",
  },
};

function ReadTouristItinerary() {
  const [itinerary, setItinerary] = useState([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        // Replace with your API endpoint
        const response = hardcodedItinerary;
        console.log(response);
        setItinerary(response);
        // await fetch(URL + "/touristItenerary");

        if (response.ok) {
          const data = await response.json();
          if (data.length === 0) {
            setIsEmpty((e) => true);
          } else {
            setItinerary(data);
          }
        } else {
          console.error("Failed to fetch itineraries");
          setIsEmpty((e) => false);
          // setItinerary([]);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchItineraries();
  }, []);

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
      <p>
        <strong>Start Date:</strong> {itinerary.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {itinerary.endDate}
      </p>

      <ul className="list-none w-full max-w-2xl">
        {itinerary?.activities?.map((activity) => (
          <li
            key={activity._id}
            className="mb-5 border border-gray-300 p-4 rounded-lg bg-gray-100"
          >
            <h3 className="text-xl font-semibold">{activity.name}</h3>
            <p>
              <strong>Date:</strong> {activity.date}
            </p>
            <p>
              <strong>Time:</strong> {activity.time}
            </p>
            <p>
              <strong>Category:</strong> {activity.category}
            </p>
            <p>
              <strong>Price:</strong> ${activity.price.min} - $
              {activity.price.max}
            </p>
            <p>
              <strong>Tags:</strong> {activity.tags.join(", ")}
            </p>
            <p>
              <strong>Special Discounts:</strong>{" "}
              {activity.specialDiscounts
                .map(
                  (discount) =>
                    `${discount.Description} (${discount.discount}%)`
                )
                .join(", ")}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {activity.ratings.map((rating) => `${rating.rating}`).join(", ")}
            </p>
            <p>
              <strong>Comment:</strong>{" "}
              {activity.comments
                .map((comment) => `${comment.comment}`)
                .join(", ")}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
        <strong>Tag:</strong> {itinerary?.tag?.name} ({itinerary?.tag?.type},{" "}
        {itinerary?.tag?.historicalPeriod})
      </p>
      <button
        onClick={handleEdit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Edit Itinerary
      </button>
      <button
        onClick={handleDelete}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete Itinerary
      </button>
    </div>
  );
}

export default ReadTouristItinerary;
