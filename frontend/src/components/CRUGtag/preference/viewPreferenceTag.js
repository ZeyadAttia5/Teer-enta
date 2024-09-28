import React, { useEffect, useState } from 'react';
import axios from 'axios';

const http = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

const ViewPreferenceTags = () => {
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');
    const [showTags, setShowTags] = useState(false); // State to manage visibility of tags

    // Function to fetch preference tags
    const fetchTags = async () => {
        try {
            const response = await http.get('/preferenceTag/');
            console.log("Fetched tags:", response.data); // Log the response data
            setTags(response.data); // Set tags state
            console.log("Tags:", tags); // Log the tags state
        } catch (error) {
            if (error.response) {
                setMessage('Error fetching preference tags: ' + error.response.data.message);
            } else if (error.request) {
                setMessage('No response received from the server.');
            } else {
                setMessage('Error: ' + error.message);
            }
        }
    };

    // Fetch tags when the component mounts
    useEffect(() => {
        fetchTags();
    }, []);

    // Function to toggle the visibility of tags
    const toggleTags = () => {
        setShowTags(!showTags);
    };

    return (
        <div>
            <h2>Preference Tags</h2>
            <button onClick={toggleTags}>{showTags ? 'Hide Preference Tags' : 'Show Preference Tags'}</button>
            {message && <p>{message}</p>}
            {Array.isArray(tags.preferenceTags)  && ( // Check if tags is an array
                <ul>
                    {tags.preferenceTags.map(tag => (
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
