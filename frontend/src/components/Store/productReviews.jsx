import React, { useEffect, useState } from "react";
import { Card, List, Avatar, Typography, Space, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getProductReviews, getProductRatings } from '../../api/products.ts';
import StarRating from '../shared/starRating';
import dayjs from 'dayjs';

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
        message.warning(err.response.data.message||"Failed to fetch product reviews and ratings");
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
            <div className="flex items-center gap-3 text-indigo-900">
              <UserOutlined className="text-xl" />
              <span className="font-semibold">Reviews</span>
            </div>
          }
          className="bg-white  rounded-xl border-0"
      >
        {reviews.length === 0 ? (
            <div className="py-12 text-center">
              <Text className="text-gray-400 text-lg">No reviews yet</Text>
            </div>
        ) : (
            <List
                itemLayout="horizontal"
                dataSource={reviews}
                renderItem={(review) => (
                    <List.Item className="p-4 hover:bg-gray-50 transition-colors duration-200">
                      <List.Item.Meta
                          avatar={
                            <Avatar
                                icon={<UserOutlined />}
                                className="bg-indigo-100 text-indigo-600"
                                size="large"
                            />
                          }
                          title={
                            <div className="flex items-center gap-3">
                              <Text className="font-semibold text-gray-800">
                                {review.username}
                              </Text>
                              <StarRating rating={review.rating} />
                            </div>
                          }
                          description={
                            <div className="mt-2">
                              {review.review && (
                                  <Text className="text-gray-600 text-base">
                                    {review.review}
                                  </Text>
                              )}
                              <div className="mt-2 text-xs text-gray-400">
                                {dayjs(review.createdAt).format('MMM DD, YYYY')}
                              </div>
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
