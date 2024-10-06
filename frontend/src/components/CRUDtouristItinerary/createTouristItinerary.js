// src/components/CreateTouristItinerary.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Optional: For navigation after creation
import { Button, Alert, Spin, message } from "antd"; // Using Ant Design for better UI

const URL = `${process.env.REACT_APP_BACKEND_URL}`;

const CreateTouristItinerary = ({setFlag}) => {
  setFlag(false);
  const [name, setName] = useState("");
  const [activities, setActivities] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // For submission loading state
  const navigate = useNavigate(); // For navigation after creation

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`${URL}/activity/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include auth if required
          },
        });
        setActivities(response.data.filter((activity) => activity.isActive));
      } catch (error) {
        console.error("Error fetching activities:", error);
        message.error("Failed to fetch activities.");
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(`${URL}/preferenceTag/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include auth if required
          },
        });
        setTags(response.data);
        console.log("Tags:", response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
        message.error("Failed to fetch tags.");
      }
    };

    fetchActivities();
    fetchTags();
  }, [URL, accessToken]);

  const handleActivityChange = (activity) => {
    setSelectedActivities((prev) =>
        prev.some((t) => t._id === activity._id)
            ? prev.filter((t) => t._id !== activity._id)
            : [...prev, activity]
    );
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
        prev.some((t) => t._id === tag._id)
            ? prev.filter((t) => t._id !== tag._id)
            : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validation
    if (start < currentDate) {
      setError("Start date must be after the current date.");
      window.scrollTo(0, 0); // Scroll to top of the page
      return;
    }

    if (end < start) {
      setError("End date must be after the start date.");
      window.scrollTo(0, 0); // Scroll to top of the page
      return;
    }

    if (selectedActivities.length === 0) {
      setError("Please select at least one activity.");
      window.scrollTo(0, 0); // Scroll to top of the page
      return;
    }

    // Optional: Uncomment if tags are required
    // if (selectedTags.length === 0) {
    //   setError("Please select at least one tag.");
    //   window.scrollTo(0, 0); // Scroll to top of the page
    //   return;
    // }

    const itinerary = {
      name,
      activities: selectedActivities.map((activity) => activity._id),
      startDate,
      endDate,
      tags: selectedTags.map((tag) => tag._id),
    };

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
          `${URL}/touristItenerary/create`,
          itinerary,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
      );
      console.log("Itinerary created:", response.data);
      message.success("Itinerary created successfully!");
      // Optionally reset the form or navigate to another page
      navigate("/touristItinerary"); // Redirect after creation
    } catch (error) {
      console.error("There was an error creating the itinerary!", error);
      setError(
          error.response?.data?.message ||
          "There was an error creating the itinerary. Please try again."
      );
      window.scrollTo(0, 0); // Scroll to top of the page
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Tourist Itinerary
        </h1>
        {error && (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className="mb-4"
            />
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block mb-2 text-lg">Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border p-2 w-full rounded"
            />
          </div>
          <div className="form-group">
            <label className="block mb-2 text-lg">Start Date:</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="border p-2 w-full rounded"
            />
          </div>

          <div className="form-group">
            <label className="block mb-2 text-lg">End Date:</label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="border p-2 w-full rounded"
            />
          </div>
          <div className="form-group">
            <label className="block mb-2 text-lg">Activities:</label>
            {activities.length === 0 ? (
                <p>No activities available.</p>
            ) : (
                <div className="flex flex-wrap -mx-2">
                  {activities.map((activity) => (
                      <div
                          key={activity._id}
                          className="activity mb-4 p-4 border rounded shadow-sm hover:shadow-md transition-shadow mx-2 w-1/3"
                      >
                        <label className="flex items-center">
                          <input
                              type="checkbox"
                              value={activity._id}
                              onChange={() => handleActivityChange(activity)}
                              className="mr-2"
                              checked={selectedActivities.some(
                                  (act) => act._id === activity._id
                              )}
                          />
                          <div className="inline-block">
                            <strong>Name:</strong> {activity.name}
                            <br />
                            <strong>Date:</strong>{" "}
                            {new Date(activity.date).toLocaleDateString()}
                            <br />
                            <strong>Time:</strong> {activity.time}
                            <br />
                            <strong>Location:</strong>{" "}
                            {`Lat: ${activity.location.lat}, Lng: ${activity.location.lng}`}
                            <br />
                            <strong>Price:</strong> ${activity.price.min} - $
                            {activity.price.max}
                          </div>
                        </label>
                      </div>
                  ))}
                </div>
            )}
          </div>
          <div className="form-group">
            <label className="block mb-2 text-lg">Tags:</label>
            {tags.length === 0 ? (
                <p>No tags available.</p>
            ) : (
                <div className="flex flex-wrap -mx-2">
                  {tags.map((tag) => (
                      <div
                          key={tag._id}
                          className="tag mb-4 p-4 border rounded shadow-sm hover:shadow-md transition-shadow mx-2 w-1/3"
                      >
                        <label className="flex items-center">
                          <input
                              type="checkbox"
                              value={tag._id}
                              onChange={() => handleTagChange(tag)}
                              className="mr-2"
                              checked={selectedTags.some((t) => t._id === tag._id)}
                          />
                          <div className="inline-block">
                            <strong>Tag:</strong> {tag.tag}
                            <br />
                          </div>
                        </label>
                      </div>
                  ))}
                </div>
            )}
          </div>
          <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
          >
            Create Itinerary
          </Button>
        </form>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Selected Activities:</h2>
          {selectedActivities.length === 0 ? (
              <p>No activities selected.</p>
          ) : (
              <div className="flex flex-wrap -mx-2">
                {selectedActivities.map((activity) => (
                    <div
                        key={activity._id}
                        className="selected-activity mb-4 p-4 border rounded shadow-sm mx-2 w-1/3 bg-gray-50"
                    >
                      <div className="inline-block">
                        <strong>Name:</strong> {activity.name}
                        <br />
                        <strong>Date:</strong>{" "}
                        {new Date(activity.date).toLocaleDateString()}
                        <br />
                        <strong>Time:</strong> {activity.time}
                        <br />
                        <strong>Location:</strong>{" "}
                        {`Lat: ${activity.location.lat}, Lng: ${activity.location.lng}`}
                        <br />
                        <strong>Price:</strong> ${activity.price.min} - $
                        {activity.price.max}
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Selected Tags:</h2>
          {selectedTags.length === 0 ? (
              <p>No tags selected.</p>
          ) : (
              <div className="flex flex-wrap -mx-2">
                {selectedTags.map((tag) => (
                    <div
                        key={tag._id}
                        className="selected-tag mb-4 p-4 border rounded shadow-sm mx-2 w-1/3 bg-gray-50"
                    >
                      <div className="inline-block">
                        <strong>Tag:</strong> {tag.tag}
                        <br />
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default CreateTouristItinerary;
