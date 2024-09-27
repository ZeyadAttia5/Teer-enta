import React, { useState } from 'react';
import axios from 'axios';

const DeletePreferenceTag = () => {
    const [id, setId] = useState(''); // State to hold the ID input
    const [message, setMessage] = useState(''); // State for success/error messages

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/preferences/delete/${id}`); // Send DELETE request to API
            setMessage('Preference tag deleted successfully!'); // Success message
            setId(''); // Clear the input field
        } catch (error) {
            setMessage('Error deleting tag: ' + error.response?.data?.message); // Error handling
        }
    };

    return (
        <div>
            <h2>Delete Preference Tag</h2>
            <input 
                type="text" 
                value={id} 
                onChange={(e) => setId(e.target.value)} 
                placeholder="Enter Tag ID" // Placeholder for the input field
            />
            <button onClick={handleDelete}>Delete Tag</button>
            {message && <p>{message}</p>} // Display message if it exists
        </div>
    );
};

export default DeletePreferenceTag;

