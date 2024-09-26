import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewActivityCategories = () => {
  const [categories, setCategories] = useState([]); // State for categories data
  const [showCategories, setShowCategories] = useState(false); // State for controlling whether categories are displayed or not

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/activityCategories'); // Get the categories from the backend
        setCategories(response.data); // Store the categories in state
      } catch (error) {
        console.error("Error fetching categories: ", error); // Log any errors
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

  return (
    <div>
      <button onClick={handleShowCategories}> {/* Button to show/hide categories */}
        {showCategories ? "Hide Categories" : "Show Categories"}
      </button>

      {showCategories && ( // Conditionally render the list of categories
        <ul>
          {categories.map(category => (
            <li key={category._id}> {/* Displaying each category with a unique key */}
              {category.category} - {category.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewActivityCategories;
