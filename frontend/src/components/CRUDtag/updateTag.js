import React, { useState } from 'react';
import axios from 'axios';

const UpdateTag = () => {
    const [id, setId] = useState('');
    const [tag, setTag] = useState({
        name: '',
        type: '',
        historicalPeriod: '',
        isActive: true,
        createdBy: '', 
    });
    const [message, setMessage] = useState(''); 

    // Function to handle input changes
    const handleChange = (e) => {
        setTag({ ...tag, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            await axios.put(`http://localhost:8000/tag/update/${id}`, tag); // Update tag API call
            setMessage('Tag updated successfully!'); // Success message
        } catch (error) {
            setMessage('Error updating tag: ' + error.response?.data?.message); // Error message
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Update Tag</h2>
            <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter Tag ID"
                className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    name="name"
                    value={tag.name}
                    onChange={handleChange}
                    placeholder="Tag Name"
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <select 
                    name="type" 
                    value={tag.type} 
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                >
                    <option value="" disabled>Select Type</option>
                    <option value="Monuments">Monuments</option>
                    <option value="Museums">Museums</option>
                    <option value="Religious Sites">Religious Sites</option>
                    <option value="Palaces">Palaces</option>
                    <option value="Castles">Castles</option>
                </select>
                <select 
                    name="historicalPeriod" 
                    value={tag.historicalPeriod} 
                    onChange={handleChange}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                >
                    <option value="" disabled >Select Historical Period</option>
                    <option value="Ancient">Ancient</option>
                    <option value="Medieval">Medieval</option>
                    <option value="Modern">Modern</option>
                </select>
                <label className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={tag.isActive}
                        onChange={() => setTag({ ...tag, isActive: !tag.isActive })}
                        className="mr-2"
                    />
                    Is Active
                </label>
                <button 
                    type="submit" 
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                    Update Tag
                </button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>} {/* Display feedback message */}
        </div>
    );
};

export default UpdateTag; // Export the component


