import React, { useState } from 'react';
import axios from 'axios';

const CreateActivity = () => {
    const [activity, setActivity] = useState({
        name: '',
        date: '',
        time: '',
        location: '',
        priceMin: '',
        priceMax: '',
        category: '',
        tags: '',
        isBookingOpen: true,
        isActive: true,
        specialDiscounts: [],
        createdBy: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setActivity({ ...activity, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/activity/create', activity);
            setMessage('Activity created successfully!');
        } catch (error) {
            setMessage('Error creating activity: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Create Activity</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={activity.name} onChange={handleChange} placeholder="Activity Name" required />
                <input type="date" name="date" value={activity.date} onChange={handleChange} placeholder="Date" required />
                <input type="time" name="time" value={activity.time} onChange={handleChange} placeholder="Time" required />
                <input type="text" name="location" value={activity.location} onChange={handleChange} placeholder="Location" required />
                <input type="number" name="pricemin" value={activity.priceMin} onChange={handleChange} placeholder="Min Price" />
                <input type="number" name="pricemax" value={activity.priceMax} onChange={handleChange} placeholder="Max Price" />
                <input type="text" name="category" value={activity.category} onChange={handleChange} placeholder="Category ID" />
                <input type="text" name="tags" value={activity.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
                <input type="checkbox" name="isBookingOpen" checked={activity.isBookingOpen} onChange={() => setActivity({ ...activity, isBookingOpen: !activity.isBookingOpen })} /> Booking Open
                <input type="checkbox" name="isActive" checked={activity.isActive} onChange={() => setActivity({ ...activity, isActive: !activity.isActive })} /> Is Active
                <button type="submit">Create Activity</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateActivity;
