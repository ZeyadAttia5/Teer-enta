import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const URL = `${process.env.REACT_APP_BACKEND_URL}`;

const UpdateTouristItinerary = () => {
  const location = useLocation();
  const itineraryData = location.state?.itinerary || {};

  const [name, setName] = useState(itineraryData.name || "");
  const [activities, setActivities] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState(
    itineraryData.activities || []
  );
  const [selectedTags, setSelectedTags] = useState(itineraryData.tags || []);
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(
    formatDate(itineraryData.startDate)
  );
  const [endDate, setEndDate] = useState(formatDate(itineraryData.endDate));
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(URL + "/activity/");
        setActivities(response.data.filter((activity) => activity.isActive));
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get(URL + "/tag");
        setTags(response.data.filter((tag) => tag.isActive));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchActivities();
    fetchTags();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

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

    const itinerary = {
      name,
      activities: selectedActivities.map((activity) => activity._id),
      startDate,
      endDate,
      tags: selectedTags.map((tag) => tag._id),
    };

    axios
      .put(URL + "/touristItenerary/update/" + itineraryData._id, {
        ...itinerary,
      })
      .then((response) => {
        console.log("Itinerary updated:", response.data);
        setError(""); // Clear any previous errors
        // Show success message
        const successMessage = document.createElement("div");
        successMessage.textContent = "Itinerary updated successfully!";
        successMessage.className = "text-green-500 mb-4";
        document.querySelector(".container").prepend(successMessage);
        window.scrollTo(0, 0); // Scroll to top of the page
        // Redirect to read-all-tourist-itinerary
        // setTimeout(() => {
        //   window.location.href = "/read-all-tourist-itinerary";
        // }, 5000);
      })
      .catch((error) => {
        console.error("There was an error creating the itinerary!", error);
        setError(
          "There was an error creating the itinerary. Please try again."
        );
        window.scrollTo(0, 0); // Scroll to top of the page
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Update Tourist Itinerary
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
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
                  <input
                    type="checkbox"
                    value={activity._id}
                    onChange={() => handleActivityChange(activity)}
                    className="mr-2"
                    checked={selectedActivities.some(
                      (a) => a._id === activity._id
                    )}
                  />
                  <div className="inline-block">
                    <strong>Name:</strong> {activity?.name}
                    <br />
                    <strong>Date:</strong> {activity?.date}
                    <br />
                    <strong>Time:</strong> {activity?.time}
                    <br />
                    <strong>Location:</strong> {activity?.location}
                    <br />
                    <strong>Price:</strong> ${activity?.price.min} - $
                    {activity?.price.max}
                  </div>
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
                  key={tag?._id}
                  className="tag mb-4 p-4 border rounded shadow-sm hover:shadow-md transition-shadow mx-2 w-1/3"
                >
                  <input
                    type="checkbox"
                    value={tag?._id}
                    onChange={() => handleTagChange(tag)}
                    className="mr-2"
                    checked={selectedTags.some((t) => t._id === tag._id)}
                  />
                  <div className="inline-block">
                    <strong>Name:</strong> {tag?.name}
                    <br />
                    <strong>Type:</strong> {tag?.type}
                    <br />
                    <strong>Historical Period:</strong> {tag?.historicalPeriod}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          onClick={handleSubmit}
        >
          Update Itinerary
        </button>
      </form>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Selected Activities:</h2>
        <div className="flex flex-wrap -mx-2">
          {selectedActivities.map((activity) => {
            return (
              <div
                key={activity._id}
                className="selected-activity mb-4 p-4 border rounded shadow-sm mx-2 w-1/3"
              >
                <div className="inline-block">
                  <strong>Name:</strong> {activity?.name}
                  <br />
                  <strong>Date:</strong> {activity?.date}
                  <br />
                  <strong>Time:</strong> {activity?.time}
                  <br />
                  <strong>Location:</strong> {activity?.location}
                  <br />
                  <strong>Price:</strong> ${activity?.price?.min} - $
                  {activity?.price?.max}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Selected Tags:</h2>
        <div className="flex flex-wrap -mx-2">
          {selectedTags.map((tag) => (
            <div
              key={tag._id}
              className="selected-tag mb-4 p-4 border rounded shadow-sm mx-2 w-1/3"
            >
              <div className="inline-block">
                <strong>Name:</strong> {tag.name}
                <br />
                <strong>Type:</strong> {tag.type}
                <br />
                <strong>Historical Period:</strong> {tag.historicalPeriod}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateTouristItinerary;
