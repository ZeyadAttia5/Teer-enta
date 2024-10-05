import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteActivity = () => {
    const [activities, setActivities] = useState([]); // To hold the list of activities
    const [message, setMessage] = useState(''); // For displaying success/error messages

    // Fetch activities on component load
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:8000/activity');
                setActivities(response.data); // Assuming response.data contains the activities array
            } catch (error) {
                setMessage('Error fetching activities: ' + (error.response?.data?.message || error.message));
            }
        };

        fetchActivities();
    }, []);

    // Handle delete activity
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/activity/delete/${id}`);
            setMessage('Activity deleted successfully!');
            // Remove the deleted activity from the list
            setActivities(activities.filter(activity => activity._id !== id));
        } catch (error) {
            setMessage('Error deleting activity: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Delete Activity</h2>

            {/* Message Display */}
            {message && (
                <div
                    className={`mb-4 text-center p-3 rounded ${
                        message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {message}
                </div>
            )}

            {/* Activities List */}
            <ul className="space-y-4">
                {activities.map(activity => (
                    <li key={activity._id} className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-700">{activity.name}</p>
                            <p className="text-gray-500 text-sm">{activity.location}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(activity._id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            {/* <TrashIcon className="h-6 w-6" /> */}
                            <DeleteOutlined />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeleteActivity;
