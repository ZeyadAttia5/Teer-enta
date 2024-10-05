import React, { useEffect, useState } from 'react'; 
import axios from 'axios';

const ViewTags = () => {
    const [tags, setTags] = useState([]);
    const [message, setMessage] = useState('');
    const [showTags, setShowTags] = useState(true); // Default to show tags
    const [showAddTagFields, setShowAddTagFields] = useState(false); // State for showing add tag fields

    // New tag state
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('');
    const [newHistoricalPeriod, setNewHistoricalPeriod] = useState('');

    // State for editing a tag
    const [editTagId, setEditTagId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editType, setEditType] = useState('');
    const [editHistoricalPeriod, setEditHistoricalPeriod] = useState('');

    const tagTypes = ["Monuments", "Museums", "Religious Sites", "Palaces", "Castles"];
    const historicalPeriods = ["Ancient", "Medieval", "Modern"];

    // Fetch tags function
    const fetchTags = async () => {
        try {
            const response = await axios.get('http://localhost:8000/tag');
            setTags(response.data);
        } catch (error) {
            setMessage('Error fetching tags: ' + error.response?.data?.message);
        }
    };

    useEffect(() => {
        fetchTags(); // Fetch tags when the component mounts
    }, []);

    // Handle adding a new tag
    const handleAddTag = async () => {
        try {
            const response = await axios.post('http://localhost:8000/tag/create', {
                name: newName,
                type: newType,
                historicalPeriod: newHistoricalPeriod,
            });
            setTags([...tags, response.data.tag]); // Update tags list with new tag
            setNewName('');
            setNewType('');
            setNewHistoricalPeriod('');
            setMessage('Tag added successfully!');

            // Clear message after a short delay
            setTimeout(() => {
                setMessage('');
            }, 3000); // Clear message after 3 seconds
        } catch (error) {
            setMessage('Error adding tag: ' + error.response?.data?.message);
        }
    };

    // Handle updating an existing tag
    const handleEditTag = async (id) => {
        try {
            // Optimistically update the tag in the frontend
            const updatedTagIndex = tags.findIndex(tag => tag._id === id);
            const updatedTag = { ...tags[updatedTagIndex], name: editName, type: editType, historicalPeriod: editHistoricalPeriod };
            const updatedTags = [...tags];
            updatedTags[updatedTagIndex] = updatedTag;
            setTags(updatedTags);

            // Send update request to the backend
            const response = await axios.put(`http://localhost:8000/tag/update/${id}`, {
                name: editName,
                type: editType,
                historicalPeriod: editHistoricalPeriod,
            });

            // Refresh tags list from backend after successful update
            fetchTags();

            setMessage('Tag updated successfully!');
            setEditTagId(null); // Close edit mode
        } catch (error) {
            setMessage('Error updating tag: ' + error.response?.data?.message);
        }
    };

    // Handle deleting a tag
    const handleDeleteTag = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/tag/delete/${id}`);
            setTags(tags.filter(tag => tag._id !== id)); // Remove the deleted tag from the list
            setMessage('Tag deleted successfully!');
        } catch (error) {
            setMessage('Error deleting tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-md">
            <h2 className="text-lg font-semibold mb-4">View and Manage Tags</h2>
            
            {/* Success or error messages */}
            {message && <p className="text-red-500">{message}</p>}

            {/* Button to toggle view of add tag fields */}
            <button 
                onClick={() => setShowAddTagFields(!showAddTagFields)} 
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
                {showAddTagFields ? 'Hide ' : 'Add Tag'}
            </button>

            {/* Form to add a new tag */}
            {showAddTagFields && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold">Add New Tag</h3>
                    <input
                        type="text"
                        placeholder="Tag Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="border p-2 rounded mb-2 w-full"
                    />
                    
                    {/* Dropdown for Type */}
                    <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="border p-2 rounded mb-2 w-full"
                    >
                        <option value="" disabled>Select Tag Type</option>
                        {tagTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* Dropdown for Historical Period */}
                    <select
                        value={newHistoricalPeriod}
                        onChange={(e) => setNewHistoricalPeriod(e.target.value)}
                        className="border p-2 rounded mb-2 w-full"
                    >
                        <option value="" disabled>Select Historical Period</option>
                        {historicalPeriods.map((period) => (
                            <option key={period} value={period}>{period}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleAddTag}
                        className="bg-green-500 text-white p-2 rounded w-full"
                    >
                        Add Tag
                    </button>
                </div>
            )}

            {/* Display tags list with edit and delete buttons */}
            {showTags && (
                <ul className="mt-4 space-y-4">
                    {tags.filter(tag => tag).map((tag) => ( // Filter out any undefined tags
                        <li key={tag._id} className="p-4 border border-gray-300 rounded">
                            {editTagId === tag._id ? (
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Tag Name"
                                        className="border p-2 rounded mb-2 w-full"
                                    />
                                    <select
                                        value={editType}
                                        onChange={(e) => setEditType(e.target.value)}
                                        className="border p-2 rounded mb-2 w-full"
                                    >
                                        <option value="" disabled>Select Tag Type</option>
                                        {tagTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={editHistoricalPeriod}
                                        onChange={(e) => setEditHistoricalPeriod(e.target.value)}
                                        className="border p-2 rounded mb-2 w-full"
                                    >
                                        <option value="" disabled>Select Historical Period</option>
                                        {historicalPeriods.map((period) => (
                                            <option key={period} value={period}>{period}</option>
                                        ))}
                                    </select>
                                    
                                    <button
                                        onClick={() => handleEditTag(tag._id)}
                                        className="bg-blue-500 text-white p-2 rounded w-full"
                                    >
                                        Update Tag
                                    </button>
                                    <button
                                        onClick={() => setEditTagId(null)} // Cancel edit
                                        className="bg-gray-500 text-white p-2 rounded w-full mt-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p><strong>Name:</strong> {tag.name}</p>
                                    <p><strong>Type:</strong> {tag.type}</p>
                                    <p><strong>Historical Period:</strong> {tag.historicalPeriod}</p>
                                    
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditTagId(tag._id);
                                                setEditName(tag.name);
                                                setEditType(tag.type);
                                                setEditHistoricalPeriod(tag.historicalPeriod);
                                            }}
                                            className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTag(tag._id)}
                                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewTags;

