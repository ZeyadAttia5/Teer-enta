import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateHistoricalTag = () => {
    const { id } = useParams(); // Retrieve the ID from the URL parameters
    const [name, setName] = useState(''); // State for tag name
    const [type, setType] = useState(''); // State for tag type
    const [historicalPeriod, setHistoricalPeriod] = useState(''); // State for historical period
    const [message, setMessage] = useState(''); // State for messages

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const response = await axios.get(`/api/tags/${id}`); // Fetch the tag data by ID
                setName(response.data.name); // Set the name state
                setType(response.data.type); // Set the type state
                setHistoricalPeriod(response.data.historicalPeriod); // Set the historical period state
            } catch (error) {
                setMessage('Error fetching tag: ' + error.response?.data?.message || error.message);
            }
        };

        fetchTag(); // Call the fetch function
    }, [id]); // Dependency array includes ID

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.put(`/api/tags/update/${id}`, { name, type, historicalPeriod }); // Update the tag
            setMessage('Tag updated successfully!'); // Set success message
        } catch (error) {
            setMessage('Error updating tag: ' + error.response?.data?.message || error.message);
        }
    };

    return (
        <div>
            <h2>Update Tag</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tag Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Tag Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Monuments">Monuments</option>
                        <option value="Museums">Museums</option>
                        <option value="Religious">Religious</option>
                        <option value="Sites">Sites</option>
                        <option value="Palaces">Palaces</option>
                        <option value="Castles">Castles</option>
                    </select>
                </div>
                <div>
                    <label>Historical Period:</label>
                    <select value={historicalPeriod} onChange={(e) => setHistoricalPeriod(e.target.value)}>
                        <option value="Ancient">Ancient</option>
                        <option value="Medieval">Medieval</option>
                        <option value="Modern">Modern</option>
                    </select>
                </div>
                <button type="submit">Update Tag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateHistoricalTag;
