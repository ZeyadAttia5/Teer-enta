import React, { useState } from 'react';
import axios from 'axios';

const UpdateActivityTag = () => {
    const [id, setId] = useState('');
    const [tag, setTag] = useState({
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
        specialDiscounts: [],
        ratings: [],
        comments: [],
        createdBy: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setTag({ ...tag, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/tags/update/${id}`, tag);
            setMessage('Tag updated successfully!');
        } catch (error) {
            setMessage('Error updating tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Update Activity Tag</h2>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter Tag ID" />
            <form onSubmit={handleUpdate}>
                <input type="text" name="name" value={tag.name} onChange={handleChange} placeholder="Tag Name" />
                <input type="date" name="date" value={tag.date} onChange={handleChange} placeholder="Date" />
                <input type="time" name="time" value={tag.time} onChange={handleChange} placeholder="Time" />
                <input type="text" name="location" value={tag.location} onChange={handleChange} placeholder="Location" />
                <input type="number" name="priceMin" value={tag.priceMin} onChange={handleChange} placeholder="Min Price" />
                <input type="number" name="priceMax" value={tag.priceMax} onChange={handleChange} placeholder="Max Price" />
                <input type="text" name="category" value={tag.category} onChange={handleChange} placeholder="Category ID" />
                <input type="text" name="tags" value={tag.tags} onChange={handleChange} placeholder="Tags" />

                <input type="checkbox" name="isBookingOpen" checked={tag.isBookingOpen} onChange={() => setTag({ ...tag, isBookingOpen: !tag.isBookingOpen })} /> Booking Open
                <input type="checkbox" name="isActive" checked={tag.isActive} onChange={() => setTag({ ...tag, isActive: !tag.isActive })} /> Is Active
                
                <button type="submit">Update Tag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateActivityTag;
