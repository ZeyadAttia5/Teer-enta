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
        <div>
            <h2>Update Activity</h2>
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Activity ID"
            />
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    name="name"
                    value={activity.name}
                    onChange={handleChange}
                    placeholder="Activity Name"
                />
                <input
                    type="date"
                    name="date"
                    value={activity.date}
                    onChange={handleChange}
                    placeholder="Date"
                />
                <input
                    type="time"
                    name="time"
                    value={activity.time}
                    onChange={handleChange}
                    placeholder="Time"
                />
                <input
                    type="text"
                    name="location"
                    value={activity.location}
                    onChange={handleChange}
                    placeholder="Location"
                />
                <input
                    type="number"
                    name="priceMin"
                    value={activity.priceMin}
                    onChange={handleChange}
                    placeholder="Min Price"
                />
                <input
                    type="number"
                    name="priceMax"
                    value={activity.priceMax}
                    onChange={handleChange}
                    placeholder="Max Price"
                />
                <input
                    type="text"
                    name="category"
                    value={activity.category}
                    onChange={handleChange}
                    placeholder="Category ID"
                />
                <input
                    type="text"
                    name="tags"
                    value={activity.tags}
                    onChange={handleChange}
                    placeholder="Tags"
                />

                <input
                    type="checkbox"
                    name="isBookingOpen"
                    checked={activity.isBookingOpen}
                    onChange={() =>
                        setActivity({ ...activity, isBookingOpen: !activity.isBookingOpen })
                    }
                />{' '}
                Booking Open
                <input
                    type="checkbox"
                    name="isActive"
                    checked={activity.isActive}
                    onChange={() =>
                        setActivity({ ...activity, isActive: !activity.isActive })
                    }
                />{' '}
                Is Active

                <button type="submit">Update Activity</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateActivity;
