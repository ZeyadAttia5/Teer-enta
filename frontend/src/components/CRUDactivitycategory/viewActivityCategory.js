import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewActivityCategory = () => {
  const [categories, setCategories] = useState([]); // State for categories data
  const [showCategories, setShowCategories] = useState(false); // State for controlling visibility of categories
  const [newCategory, setNewCategory] = useState(''); // State for new category name
  const [newDescription, setNewDescription] = useState(''); // State for new category description
  const [message, setMessage] = useState(''); // State for displaying messages
  const [editCategoryId, setEditCategoryId] = useState(null); // State for the category being edited
  const [editCategory, setEditCategory] = useState(''); // State for editing category name
  const [editDescription, setEditDescription] = useState(''); // State for editing category description

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/activityCategory/'); // Get categories from backend
        setCategories(response.data); // Store categories in state
      } catch (error) {
        setMessage('Error fetching categories: ' + error.message); // Display error message
      }
    };

    if (showCategories) { // Only fetch categories if showCategories is true
      fetchCategories();
    }
  }, [showCategories]); // This effect depends on the showCategories state

  // Function to toggle the visibility of the categories list
  const handleShowCategories = () => {
    setShowCategories(prevState => !prevState); // Toggle showCategories state
  };

  // Function to handle adding a new category
  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://localhost:8000/activityCategory/create', {
        category: newCategory,
        description: newDescription,
      });
      if (response.data && response.data.activityCategory) {
        setCategories([...categories, response.data.activityCategory]); // Update category list
        setNewCategory(''); // Reset newCategory input
        setNewDescription(''); // Reset newDescription input
        setMessage('Category added successfully'); // Display success message
      } else {
        setMessage('Error: Invalid response data.');
      }
    } catch (error) {
      setMessage('Error adding category: ' + error.response?.data?.message); // Display error message
    }
  };

  // Function to handle deleting a category
  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/activityCategory/delete/${categoryId}`);
      setCategories(categories.filter(category => category._id !== categoryId)); // Remove deleted category from the list
      setMessage('Category deleted successfully'); // Display success message
    } catch (error) {
      setMessage('Error deleting category: ' + error.response?.data?.message); // Display error message
    }
  };

  // Function to handle editing a category
  const handleEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/activityCategory/update/${editCategoryId}`, {
        category: editCategory,
        description: editDescription,
      });
      setCategories(categories.map(category =>
        category._id === editCategoryId ? response.data.data : category
      )); // Update the category in the list
      setMessage('Category updated successfully');
      setEditCategoryId(null); // Reset edit mode
      setEditCategory(''); // Reset edit category input
      setEditDescription(''); // Reset edit description input
    } catch (error) {
      setMessage('Error updating category: ' + error.response?.data?.message); // Display error message
    }
  };

  // Function to start editing a category
  const startEditing = (category) => {
    setEditCategoryId(category._id); // Set category ID to edit
    setEditCategory(category.category); // Set category name to edit
    setEditDescription(category.description); // Set category description to edit
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Activity Categories</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-center ${
            message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}

      {/* Button to show or hide categories */}
      <button onClick={handleShowCategories} className="bg-blue-500 text-white p-2 rounded mb-4">
        {showCategories ? "Hide Categories" : "Show Categories"}
      </button>

      {/* Form to add a new category */}
      {showCategories && (
        <div className="mb-4">
          <button
            onClick={handleAddCategory}
            className="bg-green-500 text-white p-2 rounded w-full mb-2"
          >
            Add New Category
          </button>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
          </div>
        </div>
      )}

      {/* Display categories with buttons for editing and deleting */}
      {showCategories && (
        <ul>
          {categories.length > 0 ? (
            categories.map((category) => (
              <li key={category._id} className="mb-4">
                <div className="flex items-center justify-between">
                  <span>{category.category} - {category.description}</span>
                  <div className="flex space-x-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => startEditing(category)}
                      className="bg-yellow-500 text-white p-2 rounded"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>No categories available</li> // Show this if categories array is empty
          )}
        </ul>
      )}

      {/* Edit category form */}
      {editCategoryId && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Edit Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewActivityCategory;


