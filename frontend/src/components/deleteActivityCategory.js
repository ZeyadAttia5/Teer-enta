import React, { useState } from 'react'; 
import axios from 'axios'; 


const DeleteActivityCategory = () => {
  const [categoryId, setCategoryId] = useState(''); 
  const [message, setMessage] = useState(''); 

  
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/delete-activityCategory/${categoryId}`);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error deleting Activity Category: ' + error.response?.data?.message);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Enter Category ID" 
        value={categoryId} 
        onChange={(e) => setCategoryId(e.target.value)} 
      />
      <button onClick={handleDelete}>Delete Category</button>
      {message && <p>{message}</p>} 
    </div>
  );
};

export default DeleteActivityCategory; 
