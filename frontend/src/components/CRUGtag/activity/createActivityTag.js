import React, { useState } from 'react';
import axios from 'axios';

const CreateActivityTag = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tags', tag);
            setMessage('Tag created successfully!');
        } catch (error) {
            setMessage('Error creating tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Create Activity Tag</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={tag.name} onChange={handleChange} placeholder="Tag Name" required />
                <input type="date" name="date" value={tag.date} onChange={handleChange} placeholder="Date" required />
                <input type="time" name="time" value={tag.time} onChange={handleChange} placeholder="Time" required />
                <input type="text" name="location" value={tag.location} onChange={handleChange} placeholder="Location" required />
                <input type="number" name="priceMin" value={tag.priceMin} onChange={handleChange} placeholder="Min Price" />
                <input type="number" name="priceMax" value={tag.priceMax} onChange={handleChange} placeholder="Max Price" />
                <input type="text" name="category" value={tag.category} onChange={handleChange} placeholder="Category ID" />
                <input type="text" name="tags" value={tag.tags} onChange={handleChange} placeholder="Tags" />
                
                <input type="checkbox" name="isBookingOpen" checked={tag.isBookingOpen} onChange={() => setTag({ ...tag, isBookingOpen: !tag.isBookingOpen })} /> Booking Open
                <input type="checkbox" name="isActive" checked={tag.isActive} onChange={() => setTag({ ...tag, isActive: !tag.isActive })} /> Is Active
                
                {/* Assuming specialDiscounts is an array of objects */}
                <button type="submit">Create Tag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateActivityTag;

