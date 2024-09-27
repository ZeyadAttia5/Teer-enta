import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewPreferenceTags = () => {
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');
    const [showTags, setShowTags] = useState(false); // State to manage visibility of tags

    // Function to fetch preference tags
    const fetchTags = async () => {
        try {
            const response = await axios.get('/api/preferences'); // Adjust API endpoint as necessary
            setTags(response.data);
            setMessage(''); // Clear message on successful fetch
        } catch (error) {
            setMessage('Error fetching preference tags: ' + error.response?.data?.message);
        }
    };

    // Function to toggle the visibility of tags
    const toggleTags = () => {
        setShowTags(!showTags);
        if (!showTags) {
            fetchTags(); // Fetch tags when showing them
        }
    };

    return (
        <div>
            <h2>Preference Tags</h2>
            <button onClick={toggleTags}>{showTags ? 'Hide Preference Tags' : 'Show Preference Tags'}</button>
            {message && <p>{message}</p>}
            {showTags && ( // Render tags only if showTags is true
                <ul>
                    {tags.map(tag => (
                        <li key={tag._id}>
                            {tag.tag} {/* Assuming the tag's property is 'tag' */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewPreferenceTags;
