import React, { useState } from 'react';
import axios from 'axios';

const UpdateActivityCategory = () => {
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/edit-activity/${categoryId}`, {
        category: categoryName,
        description,
        isActive,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating category: ' + error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Update Activity Category</h2>
      <input 
        type="text" 
        placeholder="Enter Category ID" 
        value={categoryId} 
        onChange={(e) => setCategoryId(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Enter Category Name" 
        value={categoryName} 
        onChange={(e) => setCategoryName(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Enter Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />
      
      <button onClick={handleUpdate}>Update Category</button>
      <p>{message}</p>
    </div>
  );
};

export default UpdateActivityCategory;
