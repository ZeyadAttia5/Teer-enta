import React, { useState } from 'react';
import axios from 'axios';

const UpdateTag = () => {
    const [id, setId] = useState('');
    const [tag, setTag] = useState({
        name: '',
        type: '',
        historicalPeriod: '',
        isActive: true,
        createdBy: '', 
    });
    const [message, setMessage] = useState(''); 

    // Function to handle input changes
    const handleChange = (e) => {
        setTag({ ...tag, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            await axios.put(`http://localhost:8000/tag/update/${id}`, tag); // Update tag API call
            setMessage('Tag updated successfully!'); // Success message
        } catch (error) {
            setMessage('Error updating tag: ' + error.response?.data?.message); // Error message
        }
    };

    return (
        <div>
            <h2>Update Tag</h2>
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Tag ID"
            />
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    name="name"
                    value={tag.name}
                    onChange={handleChange}
                    placeholder="Tag Name"
                />
                <select name="type" value={tag.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option value="Monuments">Monuments</option>
                    <option value="Museums">Museums</option>
                    <option value="Religious">Religious</option>
                    <option value="Sites">Sites</option>
                    <option value="Palaces">Palaces</option>
                    <option value="Castles">Castles</option>
                </select>
                <select name="historicalPeriod" value={tag.historicalPeriod} onChange={handleChange}>
                    <option value="">Select Historical Period</option>
                    <option value="Ancient">Ancient</option>
                    <option value="Medieval">Medieval</option>
                    <option value="Modern">Modern</option>
                </select>
                <input
                    type="checkbox"
                    name="isActive"
                    checked={tag.isActive}
                    onChange={() => setTag({ ...tag, isActive: !tag.isActive })}
                /> Is Active
                <button type="submit">Update Tag</button>
            </form>
            {message && <p>{message}</p>} {/* Display feedback message */}
        </div>
    );
};

export default UpdateTag;

