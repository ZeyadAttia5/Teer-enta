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
  Badge, Tooltip , Tag
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
  SearchOutlined, StarOutlined, EyeOutlined
} from "@ant-design/icons";
import {addToCartFromWishlist, addToWishlist, deleteWishlistProduct, getWishlist} from "../../api/cart.ts";
import {getCurrency} from "../../api/account.ts";

const { Title, Text } = Typography;
const { Search } = Input;

const WishlistedProductGrid = ({ setFlag }) => {
  setFlag(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: "rating",
    sortOrder: "desc",
  });
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState();
  const [changeWislist, setChangeWishlist] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

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
      message.warning(err.response.data.message);
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 bg-white px-6 py-3 rounded-full shadow-md">
              <HeartFilled className="text-2xl text-red-500"/>
              <Title level={2} className="m-0">
                Wishlist
              </Title>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All your favorite products in one place.
            </p>
          </div>


          {/* Search and Filter Section */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col gap-4">
              <Search
                  enterButton={<SearchOutlined/>}
                  placeholder="Search by name, location, or tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-2 rounded-md w-[400px]"
              />
              <div className="flex justify-center">
                <FilterDropdown
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          </div>

          {/* Feedback Message */}
          {feedbackMessage && (
              <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
                  {feedbackMessage}
                </div>
              </div>
          )}

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Spin size="large"/>
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
                                icon={<ShoppingCartOutlined/>}
                                className="mt-4 bg-first hover:bg-customGreen"
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
                            className="h-full overflow-hidden rounded-lg border-0 shadow-sm transition-all duration-300 hover:shadow-lg"
                            bodyStyle={{padding: 0}}
                            cover={
                              <div className="group relative pt-[100%]">
                                {/* Product Image */}
                                <img
                                    src={product.image || product.imageUrl}
                                    alt={product.name}
                                    className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-300"
                                />

                                {/* Overlay with Actions */}
                                <div
                                    className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20">
                                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                                    <Tooltip title="Remove from Wishlist">
                                      <Button
                                          shape="circle"
                                          className={`transition-all duration-300 bg-red-500 border-red-500 hover:bg-red-600`}
                                          icon={
                                            <FaHeart
                                                className="text-white"
                                            />
                                          }
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleWishlistToggle(product._id);
                                          }}
                                      />
                                    </Tooltip>

                                    <Link to={`/products/${product._id}`}>
                                      <Tooltip title="View Details">
                                        <Button
                                            shape="circle"
                                            className="bg-white hover:bg-first hover:border-first"
                                            icon={<FaEye className="text-gray-400 hover:text-white"/>}
                                        />
                                      </Tooltip>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            }
                        >
                          <div className="p-4">
                            {/* Product Info */}
                            <Link to={`/products/${product._id}`}>
                              <div className="mb-3">
                                <Text strong
                                      className="text-lg text-gray-800 hover:text-first transition-colors duration-300">
                                  {product.name}
                                </Text>
                              </div>

                              <div className="space-y-3">
                                {/* Price and Rating */}
                                <div className="flex items-center justify-between">
                                  <Text className="text-xl font-semibold text-first">
                                    {currency?.code} {(currency?.rate * product.price).toFixed(2)}
                                  </Text>
                                  <div className="flex items-center gap-1">
                                    <StarOutlined className="text-yellow-400"/>
                                    <Text className="text-gray-600">
                                      {calculateAverageRating(product.ratings).toFixed(1)}
                                    </Text>
                                  </div>
                                </div>

                                {/* Additional Info Tags */}
                                <div className="flex flex-wrap gap-2">
                                  {product.ratings.length > 0 && (
                                      <Tag color="blue">{product.ratings.length} Reviews</Tag>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-2">
                                  {
                                      user && user.userRole === "Tourist" && (
                                          <Button
                                              type="primary"
                                              icon={<ShoppingCartOutlined/>}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product._id);
                                              }}
                                              className="flex-1 bg-first hover:bg-customGreen"
                                          >
                                            Add to Cart
                                          </Button>
                                      )}

                                  <Link to={`/products/${product._id}`}>
                                    <Tooltip title="View Details">
                                      <Button
                                          icon={<EyeOutlined/>}
                                          className="border-first text-first hover:bg-first hover:text-white"
                                      />
                                    </Tooltip>
                                  </Link>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </Card>
                      </Col>
                  ))}
                </Row>
            )}

            {!loading && filteredProducts.length === 0 && !error && (
                <Empty
                    description={
                      <div className="space-y-4">
                        <Text className="text-lg text-gray-500">No items in your wishlist</Text>
                        <Link to="/products">
                          <Button
                              type="primary"
                              size="large"
                              icon={<ShoppingCartOutlined/>}
                              className="mt-4 bg-first hover:bg-customGreen"
                          >
                            Browse Products
                          </Button>
                        </Link>
                      </div>
                    }
                />
            )}
          </div>
        </div>
      </div>
  );
};

export default WishlistedProductGrid;