import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterDropdown from "./filterDropdown";
import StarRating from "../shared/starRating";
import {
  Input,
  Row,
  Col,
  Button,
  message,
  Card,
  Typography,
  Empty,
  Spin,
  Badge
} from "antd";
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaEye
} from "react-icons/fa";
import {
  ShoppingCartOutlined,
  HeartFilled,
  SearchOutlined
} from "@ant-design/icons";
import {addToCartFromWishlist, addToWishlist, deleteWishlistProduct, getWishlist} from "../../api/cart.ts";
import {getCurrency} from "../../api/account.ts";

const { Title, Text } = Typography;

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
        setLoading(true);
        const response = await getWishlist();

        if (!response.data.wishlist || response.data.wishlist.length === 0) {
          setError("Your wishlist is empty");
          setProducts([]);
        } else {
          setProducts(response.data.wishlist);
          setWishlist(new Set(response.data.wishlist.map((product) => product._id)));
        }
      } catch (err) {
        setError(err.response?.status === 404 ? "Your wishlist is empty" : "Failed to load wishlist");
        setProducts([]);
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <Title level={2} className="text-center mb-4">
            My Wishlist
            <HeartFilled className="text-red-500 ml-2" />
          </Title>

          {/* Search and Filter Bar */}
          <Card className="shadow-md mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Search wishlist items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                  size="large"
              />
              <FilterDropdown
                  filters={filters}
                  onFilterChange={handleFilterChange}
              />
            </div>
          </Card>
        </div>

        {/* Feedback Message */}
        {feedbackMessage && (
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                {feedbackMessage}
              </div>
            </div>
        )}

        {/* Content Section */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
          ) : error ? (
              <Card className="text-center py-12">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                      <div className="space-y-4">
                        <Text className="text-lg text-gray-500">{error}</Text>
                        <Link to="/products">
                          <Button
                              type="primary"
                              size="large"
                              icon={<ShoppingCartOutlined />}
                              className="mt-4 bg-blue-500 hover:bg-blue-600"
                          >
                            Continue Shopping
                          </Button>
                        </Link>
                      </div>
                    }
                />
              </Card>
          ) : (
              <Row gutter={[24, 24]}>
                {filteredProducts.map((product) => (
                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                          hoverable
                          className="h-full overflow-hidden"
                          cover={
                            <div className="relative pt-[100%] overflow-hidden">
                              <img
                                  src={product.image || product.imageUrl}
                                  alt={product.name}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              />
                              <button
                                  onClick={() => handleWishlistToggle(product._id)}
                                  className="absolute top-4 right-4 p-3 rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-110"
                              >
                                <FaHeart className="text-xl text-red-500" />
                              </button>
                            </div>
                          }
                      >
                        <div className="space-y-4">
                          <Link to={`/products/${product._id}`}>
                            <Title level={4} className="mb-2 line-clamp-2 hover:text-blue-500">
                              {product.name}
                            </Title>
                          </Link>

                          <div className="flex items-center justify-between">
                            <Text className="text-2xl font-bold text-green-600">
                              {currency?.code} {(currency?.rate * product.price).toFixed(2)}
                            </Text>
                            <StarRating rating={calculateAverageRating(product.ratings)} />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Link to={`/products/${product._id}`} className="flex-1">
                              <Button
                                  icon={<FaEye />}
                                  className="w-full bg-gray-100 hover:bg-gray-200 border-none"
                              >
                                View
                              </Button>
                            </Link>
                            <Button
                                icon={<FaShoppingCart />}
                                onClick={() => addToCart(product._id)}
                                className="flex-1 bg-blue-500 text-white hover:bg-blue-600 border-none"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                ))}
              </Row>
          )}
        </div>
      </div>
  );
};

export default WishlistedProductGrid;
