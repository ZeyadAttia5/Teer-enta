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
        <div>
            <h2>View Tags</h2>
            <button onClick={handleButtonClick}>{showTags ? 'Hide Tags' : 'View Tags'}</button>
            {message && <p>{message}</p>}
            {showTags && (
                <ul>
                    {tags.map(tag => (
                        <li key={tag._id}>
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

export default ViewTags;
