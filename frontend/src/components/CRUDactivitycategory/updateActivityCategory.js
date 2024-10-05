import React, { useState } from 'react';
import axios from 'axios';

const UpdateActivityCategory = () => {
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem('accessToken');

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/activityCategory/update/:id`, {
        category: categoryName,
        description,
        isActive,
      } ,{
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating category: ' + error.response?.data?.message);
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
