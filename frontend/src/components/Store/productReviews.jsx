import React, { useEffect, useState } from "react";
import { Card, List, Avatar, Typography, Space, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getProductReviews, getProductRatings } from '../../api/products.ts';
import StarRating from '../shared/starRating';

const { Text } = Typography;

const ProductReviews = ({ productId, refresh }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewsAndRatings = async () => {
      setLoading(true);
      try {
        const reviewsResponse = await getProductReviews(productId);
        const ratingsResponse = await getProductRatings(productId);

        const reviewsData = reviewsResponse.reviews || [];
        const ratingsData = ratingsResponse.ratings || [];
        console.log("Reviews Data:", reviewsData);
        console.log("Ratings Data:", ratingsData);

        const combinedData = [];

        // Map reviews with matching ratings by `createdBy._id`
        reviewsData.forEach((review) => {
          const matchingRating = ratingsData.find(
            (rating) => rating.createdBy._id === review.createdBy._id
          );

          combinedData.push({
            username: review.createdBy.username,
            review: review.review,
            rating: matchingRating ? matchingRating.rating : 0,
          });
        });

        // Add standalone ratings without reviews
        ratingsData.forEach((rating) => {
          const hasReview = combinedData.some(
            (entry) => entry.username === rating.createdBy.username
          );
          if (!hasReview) {
            combinedData.push({
              username: rating.createdBy.username,
              review: null,
              rating: rating.rating,
            });
          }
        });

        setReviews(combinedData);
      } catch (err) {
        setError("Failed to fetch product reviews and ratings");
        message.error("Failed to fetch product reviews and ratings");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndRatings();
  }, [productId, refresh]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Card
      title={
        <Space>
          <UserOutlined className="text-[#58A399]" />
          <span>Reviews</span>
        </Space>
      }
      className="bg-white shadow-lg rounded-lg transition-transform duration-300 hover:bg-[#ffffff] hover:scale-105 w-full"
    >
      {reviews.length === 0 ? (
        <Text className="text-gray-500 text-center">No Reviews yet</Text>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={reviews}
          renderItem={(review) => (
            <List.Item className="transition-transform duration-300 hover:bg-[#496989] hover:scale-105 hover:text-white">
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<Text className="text-gray-700 hover:text-white">{review.username}</Text>}
                description={
                  <div>
                    <StarRating rating={review.rating} />
                    {review.review && (
                      <Text className="text-[#58A399] hover:text-white">
                        {review.review}
                      </Text>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default ProductReviews;
