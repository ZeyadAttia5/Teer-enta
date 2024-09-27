import React, { useState } from 'react';
import axios from 'axios';

const CreatePreferenceTag = () => {
    const [tag, setTag] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/preferences/create', { tag });
            setMessage('Preference tag created successfully!');
            setTag('');
        } catch (error) {
            setMessage('Error creating preference tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div>
            <h2>Create Preference Tag</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        type="text" 
                        value={tag} 
                        placeholder='Enter tag name'
                        onChange={(e) => setTag(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Create Tag</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreatePreferenceTag;
