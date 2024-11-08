import React, { useEffect, useState } from "react";
import { Card, List, Avatar, Typography, Space, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getProductReviews } from '../../api/products.ts'; 

const { Text } = Typography;

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await getProductReviews(productId);
        
        if (response && response.reviews) {
          setReviews(response.reviews);
        } else {
          console.warn("Unexpected response format:", response);
          setError("No reviews found or data format issue");
        }
      } catch (err) {
        console.error("Error fetching product reviews:", err);
        setError("Failed to fetch product reviews");
        message.error("Failed to fetch product reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchProductReviews();
  }, [productId]);

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
                title={<Text className="text-gray-700 hover:text-white">{review.createdBy.username}</Text>}
                description={
                  <Text className="text-[#58A399] hover:text-white">
                    {review.review}
                  </Text>
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
