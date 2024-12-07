import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterDropdown from "./filterDropdown";
import StarRating from "../shared/starRating";
import {
  Input,
  Row,
  Col,
  Button,
  Card,
  Typography,
  Badge,
  Spin,
  Empty,
  message,
  Tooltip,
  Tag,
} from "antd";
import { FaEye, FaHeart } from "react-icons/fa";
import {
  ShoppingCartOutlined,
  EditOutlined,
  PlusOutlined,
  BarChartOutlined,
  InboxOutlined,
  SearchOutlined,
  StarOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import {
  getProducts,
  getArchivedProducts,
  archiveProduct,
  unArchiveProduct,
} from "../../api/products.ts";
import { getCurrency } from "../../api/account.ts";
import {
  addToWishlist,
  deleteWishlistProduct,
  getWishlist,
  addToCart,
  getCart,
} from "../../api/cart.ts";
import LoginConfirmationModal from "../shared/LoginConfirmationModel";
const { Search } = Input;

const { Title, Text } = Typography;
const AdminProductGrid = ({ setFlag }) => {
  setFlag(false);
  const backURL = process.env.REACT_APP_BACKEND_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showArchived, setShowArchived] = useState(false);
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
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = showArchived
          ? await getArchivedProducts()
          : await getProducts();
        setProducts(response.data);

        try {
          const wishlistResponse = await getWishlist();
          if (
            !wishlistResponse.data.wishlist ||
            wishlistResponse.status === 404
          )
            return;

          setWishlist(
            new Set(
              wishlistResponse.data.wishlist.map((product) => product._id)
            )
          );
        } catch (err) {
          console.error("Fetch wishlist error: ", err);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchCounts = async () => {
      try {
        // Fetch cart count
        const cartResponse = await getCart();
        setCartCount(cartResponse.data.cart.length);

        // Fetch wishlist count
        const wishlistResponse = await getWishlist();
        setWishlistCount(wishlistResponse.data.wishlist.length);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    if (user && user.userRole === "Tourist") {
      fetchCounts();
    }
    fetchCurrency();
    fetchProducts();
  }, [showArchived]);

  const fetchCurrency = async () => {
    try {
      const response = await getCurrency();
      setCurrency(response.data);
    } catch (error) {
      console.error("Fetch currency error:", error);
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
      setTimeout(() => setFeedbackMessage(""), 3000);
    } catch (err) {
      console.error("Wishlist toggle error: ", err);
    }
  };
  const handleAddToCartRequest = async (productId) => {
    try {
      if (!user) {;
        setIsLoginModalOpen(true);
        return;
      }
      await addToCart(productId);
      message.success("Product added to cart successfully");
      // remove the product from wishlist if it exists
      if (wishlist.has(productId)) {
        const updatedWishlist = new Set(wishlist);
        updatedWishlist.delete(productId);
        setWishlist(updatedWishlist);
        await deleteWishlistProduct(productId);
      }
    } catch (error) {
      message.warning(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  };
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
  };

  if (loading)
    return <div className="text-center mt-24">Loading products...</div>;
  if (error) return <div className="text-center mt-24">Error: {error}</div>;

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
  const handleArchiveToggle = async (productId, isActive) => {
    try {
      if (isActive) {
        await archiveProduct(productId);
        setFeedbackMessage("Product Successfully Archived");
      } else {
        await unArchiveProduct(productId);
        setFeedbackMessage("Product Successfully Unarchived");
      }

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: !isActive }
            : product
        )
      );

      // Clear the message after 3 seconds
      setTimeout(() => setFeedbackMessage(""), 3000);
    } catch (err) {
      setError("Failed to update archive status");
    }
  };
  return (
    <div className="py-8">
      <LoginConfirmationModal
          open={isLoginModalOpen}
          setOpen={setIsLoginModalOpen}
          content="Please login to add this product to your cart."
      />
      <div className="container mx-auto px-4">
        {/* Top Action Bar */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Title level={2} className="mb-0 text-gray-800">
            {showArchived ? "Archived Products" : "Product Catalog"}
          </Title>
        </div>

        {/* Search and Filter Section */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col gap-4">
            <Search
              enterButton={<SearchOutlined />}
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
        <div className="flex justify-end mb-8">
          <div className="flex flex-wrap gap-3">
            {user &&
              (user.userRole === "Admin" || user.userRole === "Seller") && (
                <>
                  <Link to="/products/create">
                    <Button
                      type="danger"
                      icon={<PlusOutlined />}
                      className="hover:bg-gray-200 flex items-center"
                    >
                      Add Product
                    </Button>
                  </Link>

                  <Link to="/products/quantity&Sales">
                    <Button
                      type="danger"
                      icon={<BarChartOutlined />}
                      className="border-first text-first hover:bg-gray-50"
                    >
                      Reports
                    </Button>
                  </Link>

                  <Button
                    type="danger"
                    icon={<InboxOutlined />}
                    onClick={() => setShowArchived(!showArchived)}
                    className="bg-third hover:bg-second text-white"
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </Button>
                </>
              )}
            {user && user.userRole === "Tourist" && (
              <div className="flex items-center gap-3">
                <Link to="/products/cart">
                  <Badge count={cartCount} className="cursor-pointer">
                    <Button
                      type="danger"
                      icon={<ShoppingCartOutlined />}
                      className="bg-fourth text-black hover:bg-third flex items-center"
                    >
                      Cart
                    </Button>
                  </Badge>
                </Link>

                <Link to="/wishlisted_products">
                  <Badge count={wishlistCount} className="cursor-pointer">
                    <Button
                      type="danger"
                      icon={<HeartOutlined />}
                      className="bg-fourth text-black hover:bg-third flex items-center"
                    >
                      Wishlist
                    </Button>
                  </Badge>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <Empty
            description={
              <span className="text-gray-500">No products found</span>
            }
          />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredProducts.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="h-full overflow-hidden rounded-lg border-0 shadow-sm transition-all duration-300 hover:shadow-lg"
                  bodyStyle={{ padding: 0 }}
                  cover={
                    <div className="group relative pt-[100%]">
                      {/* Product Image */}
                      <img
                        src={product.image || product.imageUrl}
                        alt={product.name}
                        className="absolute top-0 left-0 h-full w-full object-cover transition-transform duration-300"
                      />

                      {/* Overlay with Actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-20">
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          {user && user.userRole === "Tourist" && (
                            <Tooltip
                              title={
                                wishlist.has(product._id)
                                  ? "Remove from Wishlist"
                                  : "Add to Wishlist"
                              }
                            >
                              <Button
                                shape="circle"
                                className={`transition-all duration-300 ${
                                  wishlist.has(product._id)
                                    ? "bg-red-500 border-red-500 hover:bg-red-600"
                                    : "bg-white hover:bg-red-500 hover:border-red-500"
                                }`}
                                icon={
                                  <FaHeart
                                    className={`transition-colors duration-300 ${
                                      wishlist.has(product._id)
                                        ? "text-white"
                                        : "text-gray-400 group-hover:text-white"
                                    }`}
                                  />
                                }
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleWishlistToggle(product._id);
                                }}
                              />
                            </Tooltip>
                          )}

                          <Link to={`/products/${product._id}`}>
                            <Tooltip title="View Details">
                              <Button
                                shape="circle"
                                className="bg-white hover:bg-first hover:border-first"
                                icon={
                                  <FaEye className="text-gray-400 hover:text-white" />
                                }
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
                        <Text
                          strong
                          className="text-lg text-gray-800 hover:text-first transition-colors duration-300"
                        >
                          {product.name}
                        </Text>
                      </div>

                      <div className="space-y-3">
                        {/* Price and Rating */}
                        <div className="flex items-center justify-between">
                          <Text className="text-xl font-semibold text-first">
                            {currency?.code}{" "}
                            {(currency?.rate * product.price).toFixed(2)}
                          </Text>
                          <div className="flex items-center gap-1">
                            <StarOutlined className="text-yellow-400" />
                            <Text className="text-gray-600">
                              {calculateAverageRating(product.ratings).toFixed(
                                1
                              )}
                            </Text>
                          </div>
                        </div>

                        {/* Additional Info Tags */}
                        <div className="flex flex-wrap gap-2">
                          {product.isActive ? (
                            <Tag color="success">Active</Tag>
                          ) : (
                            <Tag color="error">Archived</Tag>
                          )}
                          {product.ratings.length > 0 && (
                            <Tag color="blue">
                              {product.ratings.length} Reviews
                            </Tag>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {/*{user && user.userRole === "Tourist" && (*/}
                          {product.quantity > 0 ? (
                                  <Button
                                      type="danger"
                                      icon={<ShoppingCartOutlined />}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCartRequest(product._id);
                                      }}
                                      className="flex-1 bg-first text-white hover:bg-black"
                                  >
                                    Add to Cart
                                  </Button>
                              ) : (
                                  <Button
                                      type="default"
                                      disabled
                                      className="flex-1 bg-gray-200 text-gray-500 hover:bg-gray-200 cursor-not-allowed border-gray-300"
                                  >
                                    Out of Stock
                                  </Button>
                              )
                          }
                          {/*)}*/}
                          {user && user._id === product.createdBy && (
                            <Link to={`/products/edit/${product._id}`}>
                              <Tooltip title="Edit Product">
                                <Button
                                  icon={<EditOutlined />}
                                  className="border-first text-first hover:bg-first hover:text-white"
                                />
                              </Tooltip>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Link>
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
export default AdminProductGrid;
