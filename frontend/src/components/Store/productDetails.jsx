import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL parameters
  const backURL = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState(null); // State for the product
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch product details from the API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`${backURL}/product/${id}`); // Replace with your API endpoint
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Function to calculate average rating
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0; // If no ratings, return 0
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0); // Sum all ratings
    return total / ratings.length; // Calculate average
  };

  // Handle loading state
  if (loading) {
    return <div className="text-center mt-24">Loading product details...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-24">Error: {error}</div>;
  }

  // Calculate the average rating for the product
  const averageRating = calculateAverageRating(product.ratings);

  // Render product details
  return (
    <div className="flex flex-col items-center py-16 px-5 mt-20">
      <h2 className="text-2xl font-bold text-customGreen mb-6">{product.name}</h2>
      <img src={product.image} alt={product.name} className="w-64 h-64 object-cover mb-4" />
      <p className="text-lg text-gray-700 mb-2">{product.description}</p>
      <p className="text-lg font-semibold text-customGreen mb-2">Price: ${product.price.toFixed(2)}</p>
      <p className="text-lg mb-2">Available Quantity: {product.quantity}</p>
      {/* Display average rating */}
      <p className="text-lg font-semibold text-yellow-500 mb-4">Average Rating: {averageRating.toFixed(1)} / 5</p>
      <button className="bg-customGreen text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-darkerGreen">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
