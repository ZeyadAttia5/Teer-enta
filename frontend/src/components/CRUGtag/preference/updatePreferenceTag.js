import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePreferenceTag = () => {
    const { id } = useParams();
    const [tag, setTag] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const response = await axios.get(`/api/preferences/${id}`);
                setTag(response.data.tag);
            } catch (error) {
                setMessage('Error fetching preference tag: ' + error.response?.data?.message);
            }
        };

        fetchTag();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/preferences/update/${id}`, { tag });
            setMessage('Preference tag updated successfully!');
        } catch (error) {
            setMessage('Error updating preference tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Update Preference Tag</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        placeholder='new tag name'
                        type="text" 
                        value={tag} 
                        onChange={(e) => setTag(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Update Tag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdatePreferenceTag;
