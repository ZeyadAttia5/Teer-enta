const React = require('react'); 
const { useState } = require('react'); 
const axios = require('axios'); 

const DeleteUser = () => {
  const [userId, setUserId] = useState('');
  const user= JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem

  const handleDelete = async () => {
    try {
        const response = await axios.delete(`/deleteUser/${userId}` ,{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        alert(response.data.message);
    } catch (error) {
        console.error(error); // Log the entire error object
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
        alert('Error deleting user: ' + errorMessage);
    }
};

  return (
    <>
      <input 
        type="text" 
        placeholder="Enter user ID" 
        value={userId} 
        onChange={(e) => setUserId(e.target.value)} 
      />
      <button onClick={handleDelete}>Delete User</button>
    </>
  );
};

export default DeleteUser;

