import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation

const ViewActivities = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [showActivities, setShowActivities] = useState(false); // To toggle the view
    const navigate = useNavigate();

    const fetchActivities = async () => {
        try {
            const response = await axios.get('http://localhost:8000/activity');
            console.log(response.data);
            setActivities(response.data);
        } catch (error) {
            setMessage('Error fetching activities: ' + error.response?.data?.message);
        }
    };

    const handleButtonClick = () => {
        setShowActivities(!showActivities);
        if (!showActivities) {
            fetchActivities();
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/activity/delete/${id}`);
            setMessage('Activity deleted successfully!');
            fetchActivities(); // Refresh the list after deletion
        } catch (error) {
            setMessage('Error deleting activity: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6"></h2>
            <button
                onClick={handleButtonClick}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600 transition duration-200"
            >
                {showActivities ? 'Hide Activities' : 'View Activities'}
            </button>
            {message && <p className="text-red-500">{message}</p>}
            {showActivities && (
                <ul className="space-y-4">
                    {activities.map(activity => (
                        <li key={activity._id} className="bg-white shadow-md p-4 rounded-lg">
                            <p><strong>Name:</strong> {activity.name}</p>
                            <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {activity.time}</p>
                            <p><strong>Booking Open:</strong> {activity.isBookingOpen ? 'Yes' : 'No'}</p>
                            <p><strong>Location:</strong> {activity.location}</p>
                            <p><strong>Price Range:</strong> {activity.price ? `${activity.price.min} - ${activity.price.max}` : 'Price not set'}</p>
                    
                            <p><strong>Tags:</strong> {activity.tags?.map(tag => tag.name).join(', ') || 'No tags'}</p>
                            
                            <p><strong>Special Discounts:</strong></p>
                            {activity.specialDiscounts.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {activity.specialDiscounts.map((discount, index) => (
                                        <li key={index}>
                                            {discount.discount}% - {discount.Description} - Available: {discount.isAvailable ? 'Yes' : 'No'}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No special discounts available.</p>
                            )}

                            <p><strong>Ratings:</strong></p>
                            {activity.ratings.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {activity.ratings.map((rating, index) => (
                                        <li key={index}>
                                            User: {rating.user?.name || 'Anonymous'} - Rating: {rating.rating}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No ratings available.</p>
                            )}

                            <p><strong>Comments:</strong></p>
                            {activity.comments.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {activity.comments.map((comment, index) => (
                                        <li key={index}>
                                            User: {comment.user?.name || 'Anonymous'} - Comment: {comment.comment}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No comments available.</p>
                            )}

                            

                            {/* CRUD Buttons */}
                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={() => navigate(`/update-activity/${activity._id}`)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(activity._id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <button
                onClick={() => navigate('/create-activity')}
                className="px-4 py-2 bg-green-500 text-white rounded mt-6 hover:bg-green-600 transition duration-200"
            >
                Create New Activity
            </button>
        </div>
    );
};

export default ViewActivities;

