import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateTag = () => {
    const { id } = useParams(); // Get the tag ID from the URL
    const [tag, setTag] = useState({
        name: '',
        type: '',
        historicalPeriod: '',
        isActive: true,
        createdBy: '',
    }); // State for the selected tag
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loading state for async fetch
    const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    // Fetch tag details
    useEffect(() => {
        const fetchTag = async () => {
            try {
                const tagRes = await axios.get(`http://localhost:8000/tag/${id}`);
                setTag(tagRes.data); // Set the selected tag
                setLoading(false); // Done loading
            } catch (error) {
                setMessage('Error fetching tag data: ' + error.message);
                setLoading(false);
            }
        };
        fetchTag();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setTag({
            ...tag,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle the tag update
    const handleUpdate = async (e) => {
        e.preventDefault();
    
        try {
            await axios.put(`http://localhost:8000/tag/update/${tag._id}`, tag ,
                {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setMessage('Tag updated successfully!');
        } catch (error) {
            const errorMsg = error.response ? error.response.data.message : error.message;
            if (error.response?.status === 409) {
                setMessage(`Error: ${errorMsg}`); // Display 'Tag name must be unique' if conflict
            } else {
                setMessage(`Error updating tag: ${errorMsg}`);
            }
        }
    };

    if (loading) return <div>Loading...</div>; // Loading indicator

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">Edit Tag</h2>

            {/* Message Display */}
            {message && (
                <div className={`mb-4 p-3 text-center rounded ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* Tag Update Form */}
            <form onSubmit={handleUpdate} className="bg-white shadow-md p-6 rounded-lg max-w-lg mx-auto">
                <input
                    type="text"
                    name="name"
                    value={tag.name}
                    onChange={handleChange}
                    placeholder="Tag Name"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />

                {/* Tag Type Dropdown */}
                <select
                    name="type"
                    value={tag.type}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                >
                    <option value="">Select Type</option>
                    <option value="Monuments">Monuments</option>
                    <option value="Museums">Museums</option>
                    <option value="Religious Sites">Religious Sites</option>
                    <option value="Palaces">Palaces</option>
                    <option value="Castles">Castles</option>
                </select>

                {/* Historical Period Dropdown */}
                <select
                    name="historicalPeriod"
                    value={tag.historicalPeriod}
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                >
                    <option value="">Select Historical Period</option>
                    <option value="Ancient">Ancient</option>
                    <option value="Medieval">Medieval</option>
                    <option value="Modern">Modern</option>
                </select>

                {/* Active Checkbox */}
                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={tag.isActive}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    Is Active
                </label>

            
            

                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Update Tag
                </button>
            </form>
        </div>
    );
};

export default UpdateTag;


