import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRating from './starRating'; // Import StarRating component
import { Button, Typography, Spin } from 'antd'; // Import Ant Design components

const { Title, Paragraph } = Typography;

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
    if (!ratings || ratings.length === 0) return 0; // If no ratings, return 0
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0); // Sum all ratings
    return total / ratings.length; // Calculate average
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-24">Error: {error}</div>;
  }

  // Calculate the average rating for the product
  const averageRating = calculateAverageRating(product.ratings);

  // Render product details
  return (
    <div className="container mx-auto py-16 px-5">
      <div className="flex flex-col md:flex-row md:space-x-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-auto object-cover mb-6 md:mb-0 rounded-lg shadow-md"
        />
        <div className="flex flex-col md:w-1/2">
          <Title level={2} className="text-customGreen">{product.name}</Title>
          <StarRating rating={averageRating} /> {/* Display average rating */}
          <Paragraph className="mt-4 text-lg font-semibold text-customGreen">
            Price: ${product.price.toFixed(2)}
          </Paragraph>
          <Paragraph className="text-lg">
            Available Quantity: {product.quantity}
          </Paragraph>
          <Paragraph className="text-gray-600">{product.description}</Paragraph>
          <Button
            type="primary"
            className="bg-[#02735F] text-white hover:bg-[#039F7B] w-full mt-6 border-none"
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <Link to="/products" className="inline-block mt-6">
        <Button
          type="default"
          className="bg-[#02735F] text-white hover:bg-[#039F7B] border-none"
        >
          Back to Products
        </Button>
      </Link>
    </div>
  );
};

export default ProductDetails;
