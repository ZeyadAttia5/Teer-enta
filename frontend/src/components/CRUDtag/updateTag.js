import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa'; // Importing edit icon from react-icons

const UpdateTag = () => {
    const [tags, setTags] = useState([]); // To hold the list of tags
    const [selectedTag, setSelectedTag] = useState(null); // To hold the selected tag's data
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch tags from the backend when the component is mounted
        const fetchTags = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tag/');
                setTags(response.data);
            } catch (error) {
                setMessage('Error fetching tags: ' + (error.response?.data?.message || error.message));
            }
        };
        fetchTags();
    }, []);

    const handleTagSelect = (tag) => {
        setSelectedTag(tag); // Populate form with selected tag
    };

    const handleChange = (e) => {
        setSelectedTag({ ...selectedTag, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedTag?._id) {
            setMessage('No tag selected.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await axios.put(`http://localhost:8000/tag/update/${selectedTag._id}`, selectedTag);
            setMessage('Tag updated successfully!');
        } catch (error) {
            setMessage('Error updating tag: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Update Tag</h2>

            {/* List of tags */}
            <div className="mb-4">
                <h3 className="font-medium">Select a Tag to Update:</h3>
                <ul className="list-none">
                    {tags.map((tag) => (
                        <li
                            key={tag._id}
                            className="flex justify-between items-center mb-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                            onClick={() => handleTagSelect(tag)}
                        >
                            <span>{tag.name}</span>
                            <FaEdit className="text-blue-500" />
                        </li>
                    ))}
                </ul>
            </div>

            {/* Form to update selected tag */}
            {selectedTag && (
                <form onSubmit={handleUpdate}>
                    <input
                        type="text"
                        name="name"
                        value={selectedTag.name}
                        onChange={handleChange}
                        placeholder="Tag Name"
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    />

                    <select
                        name="type"
                        value={selectedTag.type}
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
                        value={selectedTag.historicalPeriod}
                        onChange={handleChange}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                    >
                        <option value="" disabled>Select Historical Period</option>
                        <option value="Ancient">Ancient</option>
                        <option value="Medieval">Medieval</option>
                        <option value="Modern">Modern</option>
                    </select>

                    <label className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={selectedTag.isActive}
                            onChange={() => setSelectedTag({ ...selectedTag, isActive: !selectedTag.isActive })}
                            className="mr-2"
                        />
                        Is Active
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full p-2 text-white rounded transition duration-200 ${
                            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Updating...' : 'Update Tag'}
                    </button>
                </form>
            )}

            {/* Display feedback message */}
            {message && <p className={`mt-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
        </div>
    );
};

export default UpdateTag;
