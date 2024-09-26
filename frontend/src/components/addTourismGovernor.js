import React, { useState } from 'react';
import axios from 'axios';

const AddTourismGovernor = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAddGovernor = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.post('/addTourismGovernor', {
        username,
        password,
      });
      setMessage(response.data.message); // Success message
    } catch (error) {
      setMessage('Error adding Tourism Governor: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Add Tourism Governor</h2>
      <form onSubmit={handleAddGovernor}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Add Governor</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddTourismGovernor; // Export the component

