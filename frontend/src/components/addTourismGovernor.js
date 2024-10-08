import React, { useState } from 'react';
import axios from 'axios';

const AddTourismGovernor = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

  const handleAddGovernor = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response =  await axios.post('http://localhost:8000/account/create', { username, password },{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
      });
      setMessage(response.data.message); 
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage('Error adding Tourism Governor: ' + error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Add Tourism Governor</h2>
      <form onSubmit={handleAddGovernor}>
        <input 
          type="text" 
          placeholder="Enter username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Add Governor
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>} {/* Display message if it exists */}
    </div>
  );
};

export default AddTourismGovernor; // Export the component


