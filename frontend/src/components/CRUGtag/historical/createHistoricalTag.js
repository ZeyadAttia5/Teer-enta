import React, { useState } from 'react';
import axios from 'axios';

const CreateHistoricalTag = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [historicalPeriod, setHistoricalPeriod] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/tags/create', {
                name,
                type,
                historicalPeriod
            });

            setMessage('Tag created successfully!');
            setName('');
            setType('');
            setHistoricalPeriod('');
        } catch (error) {
            setMessage('Error creating tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Create Tag for Historical Place</h2>
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
                <button type="submit">Create Tag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateHistoricalTag;
