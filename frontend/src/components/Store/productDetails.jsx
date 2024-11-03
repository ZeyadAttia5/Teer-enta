import React, { useEffect, useState } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../shared/starRating'; 
import { Button, Typography, Spin, Divider } from 'antd';
import { getProduct } from "../../api/products.ts"; 

const { Title, Paragraph } = Typography;

const ProductDetails = ({ setFlag }) => {
  setFlag(false);
  const { id } = useParams(); 
  const backURL = process.env.REACT_APP_BACKEND_URL;

  const [product, setProduct] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-24 text-red-500">Error: {error}</div>;
  }

  const averageRating = calculateAverageRating(product.ratings);

  return (
    <div className="w-full min-h-screen bg-[#496989] py-16 px-5">
      <div className="flex flex-col md:flex-row bg-[#E2F4C5] shadow-lg rounded-lg overflow-hidden">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition duration-300 ease-in-out transform hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-white">
          <div>
            <Title level={2} className="text-[#58A399]">
              {product.name}
            </Title>
            <div className="flex items-center space-x-2 mb-4">
              <StarRating rating={averageRating} />
              <span className="text-[#58A399] text-lg">{averageRating.toFixed(1)} / 5</span>
            </div>

            <Divider />

            <Paragraph className="text-lg font-semibold text-[#58A399]">
              Price: <span className="text-xl">${product.price.toFixed(2)}</span>
            </Paragraph>
            <Paragraph className="text-lg font-semibold">
              Available Quantity: <span className="text-[#58A399]">{product.quantity}</span>
            </Paragraph>
            <Paragraph className="text-lg font-semibold">
              Seller: <span className="text-[#58A399]">{product.createdBy.userRole === 'Admin' ? "Teer Enta" : product.createdBy.name}</span>
            </Paragraph>

            <Paragraph className="mt-4 text-gray-700 text-base">
              {product.description}
            </Paragraph>
            {user && user.userRole === "Tourist" && (
              <Button
                type="primary"
                className="mt-6 bg-[#58A399] text-white hover:bg-[#A8CD9F] w-full text-lg font-bold py-3 rounded-lg transition duration-300 ease-in-out"
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
          className="bg-[#E2F4C5] text-[#58A399] hover:bg-[#A8CD9F] hover:text-[#496989] border-none rounded-lg transition duration-300 ease-in-out px-6 py-3"
        >
          Back to Products
        </Button>
      </Link>
    </div>
  );
};

export default ProductDetails;


