import React, { useState } from 'react';
import axios from 'axios';

const DeleteActivity = () => {
    const [id, setId] = useState('');
    const [message, setMessage] = useState('');

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/activity/delete/${id}`);
            setMessage('Activity deleted successfully!');
        } catch (error) {
            setMessage('Error deleting Activity: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Delete Activity </h2>
            <input 
                type="text" 
                value={id} 
                onChange={(e) => setId(e.target.value)} 
                placeholder="Enter Activity ID" 
            />
            <button onClick={handleDelete}>Delete Activity</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteActivity;