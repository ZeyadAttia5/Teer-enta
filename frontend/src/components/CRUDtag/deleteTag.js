import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const DeleteTag = () => {
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState('');

  // Fetching tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tag/');
        setTags(response.data);
      } catch (error) {
        setMessage('Error fetching tags: ' + error.response?.data?.message);
      }
    };
    fetchTags();
  }, []);

  // Deleting a tag
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tag/delete/${id}`);
      setMessage('Tag deleted successfully!');
      setTags(tags.filter(tag => tag._id !== id)); // Update the list after deletion
    } catch (error) {
      setMessage('Error deleting tag: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Delete Tag</h2>
      {message && <p className="text-red-500">{message}</p>}

      <ul className="divide-y divide-gray-200">
        {tags.length > 0 ? (
          tags.map(tag => (
            <li key={tag._id} className="flex justify-between items-center p-2">
              <span className="text-gray-700">{tag.name}</span>
              <button
                onClick={() => handleDelete(tag._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </li>
          ))
        ) : (
          <p>No tags found</p>
        )}
      </ul>
    </div>
  );
};

export default DeleteTag;

