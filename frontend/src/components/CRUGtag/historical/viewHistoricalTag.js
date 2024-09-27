import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewHistoricalTag= () => {
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');
    const [showTags, setShowTags] = useState(false); 

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get('/api/tags');
                setTags(response.data);
            } catch (error) {
                setMessage('Error fetching tags: ' + error.response?.data?.message);
            }
        };

        fetchTags();
    }, []);

    const handleToggleTags = () => {
        setShowTags(!showTags); // Toggle the visibility of the tags list
    };

    return (
        <div>
            <h2>Tags</h2>
            <button onClick={handleToggleTags}>
                {showTags ? 'Hide Tags' : 'Show Tags'} {/* Button text changes based on visibility */}
            </button>
            {message && <p>{message}</p>}
            {showTags && ( // Conditionally render the list of tags
                <ul>
                    {tags.map(tag => (
                        <li key={tag._id}>
                            {tag.name} - {tag.type} ({tag.historicalPeriod}) {/* Display tag information */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default ViewHistoricalTag;
