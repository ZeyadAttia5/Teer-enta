// Reviews.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, List, Spin, Input, Button, message } from 'antd';
import { getProductReviews, addReviewToProduct } from '../../api/products.ts';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Reviews = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState(''); // State for new review input
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(id);
        setReviews(data);
      } catch (err) {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAddReview = async () => {
    if (!newReview.trim()) {
      message.warning("Review cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken"); // Retrieve token from local storage
        console.log("Product ID:", id);
        console.log("Review:", newReview);
      await addReviewToProduct(id, newReview);
      
      setReviews([...reviews, newReview]); // Update local state with the new review
      setNewReview(''); // Clear the input field
      message.success("Review posted successfully!");
    } catch (err) {
      message.error("Failed to post review");
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-6 mt-10 rounded-lg shadow-lg">
      <Title level={3} className="text-[#02735F]">Customer Reviews</Title>

      {reviews.length > 0 ? (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          renderItem={(review, index) => (
            <List.Item key={index}>
              <Paragraph className="text-gray-700">{review}</Paragraph>
            </List.Item>
          )}
        />
      ) : (
        <Paragraph className="text-gray-500">No reviews posted yet for this product</Paragraph>
      )}

      <div className="mt-6">
        <Title level={4} className="text-[#02735F]">Write a Review</Title>
        <TextArea
          rows={4}
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Share your thoughts about this product"
          className="mt-2"
        />
        <Button
          type="primary"
          onClick={handleAddReview}
          className="mt-4 bg-[#02735F] text-white hover:bg-[#039F7B]"
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
};

export default Reviews;
