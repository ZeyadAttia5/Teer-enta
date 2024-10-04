import React, { useState } from 'react';
import axios from 'axios';

const DeleteTag = ({ tagId, onDelete }) => {
    const [message, setMessage] = useState('');

    // Deleting the tag by its ID
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8000/tag/delete/${tagId}`);
            setMessage('Tag deleted successfully!');
            onDelete(tagId); // Notify parent component to remove the tag from the list
        } catch (error) {
            setMessage('Error deleting tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                Delete
            </button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteTag;
