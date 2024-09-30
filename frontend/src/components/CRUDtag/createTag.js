import React, { useState } from 'react';
import axios from 'axios';

const CreateTag = () => {
    const [tag, setTag] = useState({
        name: '',
        type: '',
        historicalPeriod: '',
        isActive: true,
        createdBy: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setTag({ ...tag, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/tags/create', tag);
            setMessage('Tag created successfully!');
            // Reset form
            setTag({
                name: '',
                type: '',
                historicalPeriod: '',
                isActive: true,
                createdBy: ''
            });
        } catch (error) {
            setMessage('Error creating tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Create Tag</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={tag.name} onChange={handleChange} placeholder="Tag Name" required />
                <input type="text" name="type" value={tag.type} onChange={handleChange} placeholder="Tag Type" />
                <input type="text" name="historicalPeriod" value={tag.historicalPeriod} onChange={handleChange} placeholder="Historical Period" />
                
                <label>
                    <input type="checkbox" name="isActive" checked={tag.isActive} onChange={() => setTag({ ...tag, isActive: !tag.isActive })} /> Is Active
                </label>
                
                <input type="text" name="createdBy" value={tag.createdBy} onChange={handleChange} placeholder="Created By (User ID)" required />
                <button type="submit">Create Tag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreateTag;

