import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewTags = () => {
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');
    const [showTags, setShowTags] = useState(false);

    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:8000/tags');
            setTags(response.data);
        } catch (error) {
            setMessage('Error fetching tags: ' + error.response?.data?.message);
        }
    };

    const handleButtonClick = () => {
        setShowTags(!showTags);
        if (!showTags) {
            fetchTags();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4">View Tags</h2>
            <button 
                onClick={handleButtonClick} 
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
                {showTags ? 'Hide Tags' : 'View Tags'}
            </button>
            {message && <p className="text-red-500">{message}</p>}
            {showTags && (
                <ul className="mt-4 space-y-4">
                    {tags.map(tag => (
                        <li key={tag._id} className="p-4 border border-gray-300 rounded">
                            <p><strong>Name:</strong> {tag.name}</p>
                            <p><strong>Type:</strong> {tag.type}</p>
                            <p><strong>Historical Period:</strong> {tag.historicalPeriod}</p>
                            <p><strong>Is Active:</strong> {tag.isActive ? 'Yes' : 'No'}</p>
                            <p><strong>Created By:</strong> {tag.createdBy}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewTags; // Export the component

