import React, { useState } from 'react';
import axios from 'axios';

const UpdateActivity = () => {
    const [id, setId] = useState('');
    const [activity, setActivity] = useState({
        name: '',
        date: '',
        time: '',
        isBookingOpen: true,
        location: '',
        isActive: true,
        priceMin: '',
        priceMax: '',
        category: '',
        tags: '', // Assuming you have a way to fetch or input tags
        specialDiscounts: [], // Assuming special discounts are handled as an array
        ratings: [], // Assuming ratings are handled as an array
        comments: [], // Assuming comments are handled as an array
        createdBy: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setActivity({ ...activity, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/activity/update/${id}`, activity);
            setMessage('Activity updated successfully!');
        } catch (error) {
            setMessage('Error updating activity: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Update Activity</h2>
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Activity ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    name="name"
                    value={activity.name}
                    onChange={handleChange}
                    placeholder="Activity Name"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    name="date"
                    value={activity.date}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="time"
                    name="time"
                    value={activity.time}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="location"
                    value={activity.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="number"
                    name="priceMin"
                    value={activity.priceMin}
                    onChange={handleChange}
                    placeholder="Min Price"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="number"
                    name="priceMax"
                    value={activity.priceMax}
                    onChange={handleChange}
                    placeholder="Max Price"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="category"
                    value={activity.category}
                    onChange={handleChange}
                    placeholder="Category ID"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="tags"
                    value={activity.tags}
                    onChange={handleChange}
                    placeholder="Tags"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />

                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="isBookingOpen"
                        checked={activity.isBookingOpen}
                        onChange={() =>
                            setActivity({ ...activity, isBookingOpen: !activity.isBookingOpen })
                        }
                        className="mr-2"
                    />
                    Booking Open
                </label>
                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={activity.isActive}
                        onChange={() =>
                            setActivity({ ...activity, isActive: !activity.isActive })
                        }
                        className="mr-2"
                    />
                    Is Active
                </label>

                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Update Activity
                </button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>} {/* Display feedback message */}
        </div>
    );
};

export default UpdateActivity; // Export the component

