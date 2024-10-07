import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRating from './starRating'; // Import StarRating component
import { Button, Typography, Spin, Divider } from 'antd'; // Import Ant Design components

const { Title, Paragraph } = Typography;

const ProductDetails = ({setFlag}) => {
  setFlag(false);
  const { id } = useParams(); // Get the product ID from the URL parameters
  const backURL = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState(null); // State for the product
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const user = JSON.parse(localStorage.getItem("user"));
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
    return <div className="text-center mt-24 text-red-500">Error: {error}</div>;
  }

  // Calculate the average rating for the product
  const averageRating = calculateAverageRating(product.ratings);

  // Render product details
  return (
      <div className="container mx-auto py-16 px-5 max-w-7xl">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition duration-300 ease-in-out transform hover:scale-105"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <Title level={2} className="text-[#02735F]">
                {product.name}
              </Title>
              <div className="flex items-center space-x-2 mb-4">
                <StarRating rating={averageRating} /> {/* Display average rating */}
                <span className="text-gray-600 text-lg">{averageRating.toFixed(1)} / 5</span>
              </div>

              <Divider />

              <Paragraph className="text-lg font-semibold text-[#02735F]">
                Price: <span className="text-xl">${product.price.toFixed(2)}</span>
              </Paragraph>
              <Paragraph className="text-lg font-semibold">
                Available Quantity: <span className="text-[#02735F]">{product.quantity}</span>
              </Paragraph>

              <Paragraph className="mt-4 text-gray-700 text-base">
                {product.description}
              </Paragraph>
              {user && user.userRole === "Tourist" && (
              <Button
                  type="primary"
                  className="mt-6 bg-[#02735F] text-white hover:bg-[#039F7B] w-full text-lg font-bold py-3 rounded-lg transition duration-300 ease-in-out"
              >
                Add to Cart
              </Button>
              )}
            </div>
          </div>
        </div>

        {/* Back to Products Button */}
        <Link to="/products" className="block mt-8 text-center">

            <Button
                type="default"
                className="bg-[#F0F4F8] text-[#02735F] hover:bg-[#E0E8F0] hover:text-[#039F7B] border-none rounded-lg transition duration-300 ease-in-out px-6 py-3"
            >
              Back to Products
            </Button>

        </Link>
      </div>
  );
};

export default ProductDetails;
