import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterDropdown from "./filterDropdown";
import StarRating from "../shared/starRating";
import { Input, Row, Col, Button, message } from "antd";
import { FaHeart } from "react-icons/fa";
import { getCurrency } from "../../api/account.ts";
import {
  addToCartFromWishlist,
  addToWishlist,
  deleteWishlistProduct,
  getWishlist,
} from "../../api/cart.ts";

const WishlistedProductGrid = ({ setFlag }) => {
  setFlag(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    sortBy: "rating",
    sortOrder: "desc",
  });
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState();
  const [changeWislist, setChangeWishlist] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getWishlist();
        setProducts(response.data.wishlist);
        setWishlist(
          new Set(response.data.wishlist.map((product) => product._id))
        );
      } catch (err) {
        if (err.response.status === 404) setError("Your wishlist is empty.");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrency();
    fetchProducts();
  }, [changeWislist]);

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await addToCartFromWishlist(productId);
      message.success("Product added to cart");
      
      const updatedWishlist = new Set(wishlist);
      setChangeWishlist(!changeWislist);
      updatedWishlist.delete(productId);
      setWishlist(updatedWishlist);

    } catch (err) {
      console.error("Add to cart error: ", err);
    }
  };

  const handleWishlistToggle = async (productId) => {
    try {
      // Toggle wishlist state locally
      const updatedWishlist = new Set(wishlist);
      if (wishlist.has(productId)) {
        updatedWishlist.delete(productId);
        await deleteWishlistProduct(productId);
        setFeedbackMessage("Product removed from wishlist");
      } else {
        updatedWishlist.add(productId);
        await addToWishlist(productId);
        setFeedbackMessage("Product added to wishlist");
      }
      setWishlist(updatedWishlist);
      setChangeWishlist(!changeWislist);
      setTimeout(() => setFeedbackMessage(""), 3000);
    } catch (err) {
      console.error("Wishlist toggle error: ", err);
    }
  };

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
  };

  if (loading)
    return <div className="text-center mt-24">Loading products...</div>;
  if (error)
    return (
      <div className="text-center mt-24 text-gray-500 text-2xl opacity-75">
        {error}
      </div>
    );

  let filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      product.price >= filters.minPrice && product.price <= filters.maxPrice;
    return matchesSearch && matchesPrice;
  });

  filteredProducts = filteredProducts.sort((a, b) => {
    let comparison = 0;
    if (filters.sortBy === "rating") {
      const avgRatingA = calculateAverageRating(a.ratings);
      const avgRatingB = calculateAverageRating(b.ratings);
      comparison = avgRatingA - avgRatingB;
    } else if (filters.sortBy === "price") {
      comparison = a.price - b.price;
    } else if (filters.sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    }
    return filters.sortOrder === "asc" ? comparison : -comparison;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-5 relative">
      {feedbackMessage && (
        <div
          className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-first text-white px-4 py-2 rounded shadow-lg"
          style={{ transition: "opacity 0.5s ease-in-out", zIndex: 9999 }}
        >
          {feedbackMessage}
        </div>
      )}
      <div className="flex justify-between items-center mt-24 mb-5">
        <div className="flex justify-center items-center gap-4 mx-auto">
          <Input
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 border-first rounded-full border-2 focus:border-customGreen transition-colors duration-300"
          />
          <FilterDropdown
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <Row gutter={[16, 16]} className="mt-5">
        {filteredProducts.map((product) => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
            <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-lg bg-third transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out m-4">
              <img
                className="w-full h-48 object-cover"
                src={product.image || product.imageUrl}
                alt={product.name}
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="font-bold text-xl">{product.name}</h2>
                <p className="text-gray-700">
                  <span className="font-semibold">{currency?.code}</span>{" "}
                  {(currency?.rate * product.price).toFixed(2)}
                </p>
                <StarRating rating={calculateAverageRating(product.ratings)} />
                <div className="flex justify-evenly items-center w-full">
                  <Link to={`/products/${product._id}`}>
                    <Button className="bg-first hover:bg-darkerGreen text-white mt-3 mr-[10px] py-4 px-5 text-lg rounded-lg">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    className="bg-first hover:bg-darkerGreen text-white mt-3 mr-[10px] py-4 px-5 text-lg rounded-lg"
                    onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </Button>
                  <button
                    onClick={() => handleWishlistToggle(product._id)}
                    className={`flex items-center mt-2 ml-2 transition duration-200 ${
                      wishlist.has(product._id)
                        ? "bg-red-500 text-white"
                        : "bg-white text-black border-black border"
                    } rounded-full p-2 hover:scale-110`}
                    onMouseEnter={(e) => (e.currentTarget.style.width = "auto")}
                    onMouseLeave={(e) => (e.currentTarget.style.width = "36px")}
                  >
                    <FaHeart
                      className={`text-lg ${
                        wishlist.has(product._id) ? "text-white" : "text-black"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default WishlistedProductGrid;
