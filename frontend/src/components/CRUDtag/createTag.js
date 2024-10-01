import React, { useState } from 'react';
import axios from 'axios';

const CreateTag = () => {
    const [tag, setTag] = useState({
        name: '',
        type: '',
        historicalPeriod: '',
        isActive: true,
        createdBy: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setTag({ ...tag, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/tags/create', tag);
            setMessage('Tag created successfully!');
            // Reset form
            setTag({
                name: '',
                type: '',
                historicalPeriod: '',
                isActive: true,
                createdBy: ''
            });
        } catch (error) {
            setMessage('Error creating tag: ' + error.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Create Tag</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={tag.name}
                        onChange={handleChange}
                        placeholder="Tag Name"
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="type" className="block text-gray-700">Tag Type</label>
                    <select
                        name="type"
                        value={tag.type}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select Tag Type</option>
                        <option value="Monuments">Monuments</option>
                        <option value="Museums">Museums</option>
                        <option value="Religious Sites">Religious Sites</option>
                        <option value="Palaces">Palaces</option>
                        <option value="Castles">Castles</option>
                    </select>

                    <label htmlFor="historicalPeriod" className="block text-gray-700">Historical Period</label>
                    <select
                        name="historicalPeriod"
                        value={tag.historicalPeriod}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Select Historical Period</option>
                        <option value="Ancient">Ancient</option>
                        <option value="Medieval">Medieval</option>
                        <option value="Modern">Modern</option>
                    </select>

                    <label className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={tag.isActive}
                            onChange={() => setTag({ ...tag, isActive: !tag.isActive })}
                            className="mr-2"
                        />
                        <span className="text-gray-700">Is Active</span>
                    </label>

                    <input
                    type="text"
                    name="createdBy"
                    value={tag.createdBy}
                    placeholder='created by you'
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded mb-4 bg-gray-200 cursor-not-allowed"
                />
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Create Tag
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-red-500">{message}</p>}
            </div>
        </div>
    );
};

export default CreateTag;


