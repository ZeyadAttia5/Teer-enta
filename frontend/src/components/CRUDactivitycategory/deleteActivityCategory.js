import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteActivityCategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const accessToken = localStorage.getItem('accessToken');

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/activityCategory');
        setCategories(response.data); // Assuming response.data contains the list of categories
      } catch (error) {
        setMessage('Error fetching categories: ' + error.message);
      }
    };
    fetchCategories();
  }, []);

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(category => category._id === e.target.value);
    setSelectedCategoryId(selectedCategory._id); // Set the selected category's ID
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
          `http://localhost:8000/activityCategory/delete/${selectedCategoryId}` ,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
          );
      setMessage(response.data.message); // Show success message
    } catch (error) {
      setMessage('Error deleting category: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Delete Activity Category</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
          Select Category to Delete
        </label>
        <select
          id="category"
          onChange={handleCategoryChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.category}
            </option>
          ))}
        </select>
      </div>

      {/* Delete Button */}
      <div className="mb-6">
        <button
          onClick={handleDelete}
          disabled={!selectedCategoryId}
          className={`w-full p-2 rounded-lg text-white ${
            selectedCategoryId
              ? 'bg-red-600 hover:bg-red-700 transition duration-200'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Delete Category
        </button>
      </div>

      {/* Extra Margin for UI Clarity */}
      <div className="mt-4"></div>
    </div>
  );
};

export default DeleteActivityCategory;
