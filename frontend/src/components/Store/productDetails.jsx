import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StarRating from "../shared/starRating"; // Import StarRating component
import { Button, Typography, Spin, Divider } from "antd";
import { getProduct } from "../../api/products.ts"; // Import Ant Design components
import Reviews from "../Store/reviews.jsx";
import FeedbackForm from "../shared/FeedBackForm/FeedbackForm.jsx";
import { message } from "antd";
import { FaHeart } from "react-icons/fa";
import {
  getProductReviews,
  getProductRatings,
  addReviewToProduct,
  addRatingToProduct,
} from "../../api/products.ts";
import ProductReviews from "../Store/productReviews.jsx";
import { getMyCurrency } from "../../api/profile.ts"; // Import the ProductReviews component
import { addToWishlist, deleteWishlistProduct, getWishlist } from "../../api/cart.ts";
const { Title, Paragraph } = Typography;

const ProductDetails = ({ setFlag }) => {
  setFlag(false);
  const { id } = useParams(); // Get the product ID from the URL parameters
  const backURL = process.env.REACT_APP_BACKEND_URL;
  const [hasReviewedOrRated, setHasReviewedOrRated] = useState(false);
  const [product, setProduct] = useState(null); // State for the product
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currency, setCurrency] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(false); // NEW STATE
  const [isWished, setIsWished] = useState(false); // New state for archive status

  const user = JSON.parse(localStorage.getItem("user"));
  const onSubmit = async (values) => {
    try {
      if (!product?._id) {
        throw new Error("Product ID is missing");
      }
      await addReviewToProduct(product._id, values.comment);
      await addRatingToProduct(product._id, values.rating);
      console.log("Comment added successfully");

      // Hide FeedbackForm after submitting
      setHasReviewedOrRated(true);

      // Toggle refreshReviews to force ProductReviews to reload
      setRefreshReviews((prev) => !prev);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Archive product (wishlist toggle)
  const handleWishToggle = async () => {
    try {
      if (isWished === true) {
        await deleteWishlistProduct(product._id);
        message.success("Product removed from wishlist");

      } else {
        await addToWishlist(product._id);
        message.success("Product added to wishlist");
      }
      setIsWished((prevState) => !prevState); // Toggle the archived state
    } catch (error) {
      console.error("Failed to archive product:", error);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);

        // Get the wishlist and check if the product id exists there
        const wishlistResponse = await getWishlist();
        if (!wishlistResponse.data.wishlist || wishlistResponse.status === 404)
          return;
        else {
          const wishlist = new Set(
            wishlistResponse.data.wishlist.map((product) => product._id)
          );
          setIsWished(wishlist.has(id));
        }

        // other product fetching and state updates here...
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);
        setIsWished(response.data.isWished); // Set archive state based on product data

        const reviewsResponse = await getProductReviews(id);
        const ratingsResponse = await getProductRatings(id);

        // Check if the user has reviewed or rated this product
        const hasReviewed = reviewsResponse.reviews.some(
          (review) => review.createdBy._id === user?._id
        );
        const hasRated = ratingsResponse.ratings.some(
          (rating) => rating.createdBy._id === user?._id
        );
        setHasReviewedOrRated(hasReviewed || hasRated);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrency = async () => {
      try {
        const response = await getMyCurrency();
        setCurrency(response.data);
      } catch (error) {
        console.error("Failed to fetch currency:", error);
      }
    };
    fetchCurrency();
    fetchProductDetails();
  }, [id, user?._id]);

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

  return (
    <div className="w-full min-h-screen bg-[#E0F0EE] py-16 px-5">
      <div className="flex flex-col md:flex-row bg-[#496989] shadow-lg rounded-lg overflow-hidden">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.image || product.imageUrl}
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
              <span className="text-[#58A399] text-lg">
                {averageRating.toFixed(1)} / 5
              </span>
            </div>

            <Divider />

            <Paragraph className="text-lg font-semibold text-[#58A399]">
              Price:{" "}
              <span className="text-xl">
                {currency?.code} {(currency?.rate * product.price).toFixed(2)}
              </span>
            </Paragraph>
            <Paragraph className="text-lg font-semibold">
              Available Quantity:{" "}
              <span className="text-[#58A399]">{product.quantity}</span>
            </Paragraph>
            <Paragraph className="text-lg font-semibold">
              Seller:{" "}
              <span className="text-[#58A399]">
                {product.createdBy.userRole === "Admin"
                  ? "Teer Enta"
                  : product.createdBy.username}
              </span>
            </Paragraph>
            <Paragraph className="mt-4 text-gray-700 text-base">
              {product.description}
            </Paragraph>

            {user && user.userRole === "Tourist" && (
              <div className="flex items-center mt-1 space-x-6">
                {/* Add to Cart Button */}
                <Button
                  type="primary"
                  className="mt-6 bg-[#58A399] text-white hover:bg-[#A8CD9F] w-full text-lg font-bold py-3 rounded-lg transition duration-300 ease-in-out"
                >
                  Add to Cart
                </Button>

                {/* Archive (Add to Wishlist) Button */}
                <button
                  onClick={() => handleWishToggle(product._id)}
                  className={`flex items-center mt-2 ml-2 transition duration-200 ${
                    isWished
                      ? "bg-red-500 text-white"
                      : "bg-white text-black border-black border"
                  } rounded-full p-2 hover:scale-110`}
                  onMouseEnter={(e) => (e.currentTarget.style.width = "auto")}
                  onMouseLeave={(e) => (e.currentTarget.style.width = "36px")}
                >
                  <FaHeart
                    className={`text-lg ${
                      isWished ? "text-white" : "text-black"
                    }`}
                  />
                </button>
              </div>
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

      {!hasReviewedOrRated && (
        <FeedbackForm entity={product} onSubmit={onSubmit} />
      )}
      <ProductReviews productId={id} refresh={refreshReviews} />
    </div>
  );
};

export default ProductDetails;
