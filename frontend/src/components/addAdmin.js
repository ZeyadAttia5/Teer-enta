import React, { useState } from 'react';
import axios from 'axios';

const AddAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAddAdmin = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await axios.post('/addAdmin', { username, password });
      setMessage(response.data.message);
      setUsername('');
      setPassword('');
    } catch (error) {
      setMessage('Error adding Admin: ' + error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div>
      <form onSubmit={handleAddAdmin}>
        <input 
          type="text" 
          placeholder="Enter username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Enter password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Add Admin</button>
      </form>
      {message && <p>{message}</p>} {/* Display message if it exists */}
    </div>
  );
};

export default AddAdmin; // Exporting the AddAdmin component
