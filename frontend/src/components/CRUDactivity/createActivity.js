import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateActivity = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isBookingOpen, setIsBookingOpen] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validation for min and max price
        if (parseFloat(minPrice) > parseFloat(maxPrice)) {
            setError('Minimum price cannot be greater than maximum price.');
            return; // Stop form submission
        }

        setError(''); // Clear any previous error messages

        try {
            const newActivity = {
                name,
                date,
                time,
                location,
                price: {
                    min: parseFloat(minPrice),
                    max: parseFloat(maxPrice),
                },
                isBookingOpen,
                createdBy: localStorage.getItem('userId'), // Assuming you store the user ID in localStorage
            };

            await axios.post('http://localhost:8000/activity/create', newActivity);
            setMessage('Activity created successfully!'); // Set success message

            // Optionally, navigate to another page after a delay
            setTimeout(() => {
                navigate('/view-activities'); // Redirect to the view activities page
            }, 2000); // Adjust the delay time as needed
        } catch (error) {
            setMessage('Error creating activity: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold mb-6">Create Activity</h2>
            {message && <p className="text-green-500">{message}</p>} {/* Display success message */}
            {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Activity Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="time"
                    placeholder="Time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isBookingOpen}
                        onChange={() => setIsBookingOpen(!isBookingOpen)}
                    />
                    Booking Open
                </label>
                
                
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Create Activity
                </button>
            </form>
        </div>
    );
};

export default CreateActivity;


