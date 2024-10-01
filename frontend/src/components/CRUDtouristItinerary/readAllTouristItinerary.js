import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const hardcodedItinerary = [
  {
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
  },
  // add another 3 itineraries
  {
    startDate: "2023-10-01",
    endDate: "2023-10-10",
    activities: [
      {
        _id: "3",
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
        _id: "4",
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
  },
  {
    startDate: "2023-10-01",
    endDate: "2023-10-10",
    activities: [
      {
        _id: "5",
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
        _id: "6",
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
  },
];

function ReadAllTouristItinerary() {
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

  const handleNavigate = (itineraryItem) => {
    navigate("/readItinerary", { state: { itinerary: itineraryItem } });
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
      <h2 className="text-2xl font-bold mb-4">Tourist Itineraries</h2>
      {itinerary.map((itineraryItem, index) => (
        <div
          key={index}
          className="mb-8 w-full max-w-2xl border border-gray-400 p-4 rounded-lg bg-gray-50 cursor-pointer"
          onClick={() => handleNavigate(itineraryItem)}
        >
          <p>
            <strong>Start Date:</strong> {itineraryItem.startDate}
          </p>
          <p>
            <strong>End Date:</strong> {itineraryItem.endDate}
          </p>

          <ul className="list-none w-full">
            {itineraryItem.activities.map((activity) => (
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
                  {activity.ratings
                    .map((rating) => `${rating.rating}`)
                    .join(", ")}
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
            <strong>Tag:</strong> {itineraryItem?.tag?.name} (
            {itineraryItem?.tag?.type}, {itineraryItem?.tag?.historicalPeriod})
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReadAllTouristItinerary;
