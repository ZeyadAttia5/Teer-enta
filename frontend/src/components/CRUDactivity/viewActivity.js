import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewActivities = () => {
    const [activities, setActivities] = useState([]);
    const [message, setMessage] = useState('');
    const [showActivities, setShowActivities] = useState(false); // To toggle the view

    const fetchActivities = async () => {
        try {
            const response = await axios.get('http://localhost:8000/activity');
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

    return (
        <div>
            <h2>View Activities</h2>
            <button onClick={handleButtonClick}>{showActivities ? 'Hide Activities' : 'View Activities'}</button>
            {message && <p>{message}</p>}
            {showActivities && (
                <ul>
                    {activities.map(activity => (
                        <li key={activity._id}>
                            <p><strong>Name:</strong> {activity.name}</p>
                            <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {activity.time}</p>
                            <p><strong>Booking Open:</strong> {activity.isBookingOpen ? 'Yes' : 'No'}</p>
                            <p><strong>Location:</strong> {activity.location}</p>
                            <p><strong>Price Range:</strong> {activity.price?.min} - {activity.price?.max}</p>
                            <p><strong>Is Active:</strong> {activity.isActive ? 'Yes' : 'No'}</p>
                            <p><strong>Category:</strong> {activity.category?.name || 'N/A'}</p>
                            <p><strong>Tags:</strong> {activity.tags?.map(tag => tag.name).join(', ') || 'No tags'}</p>
                            <p><strong>Special Discounts:</strong></p>
                            {activity.specialDiscounts.length > 0 ? (
                                <ul>
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
                                <ul>
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
                                <ul>
                                    {activity.comments.map((comment, index) => (
                                        <li key={index}>
                                            User: {comment.user?.name || 'Anonymous'} - Comment: {comment.rating}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No comments available.</p>
                            )}

                            <p><strong>Created By:</strong> {activity.createdBy?.name || 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewActivities;
