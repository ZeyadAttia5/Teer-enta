import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterDropdown from "./filterDropdown";
import StarRating from "../shared/starRating";
import { Input, Row, Col, Button, Card, Typography, Badge, Spin, Empty, message } from "antd";
import { FaHeart } from "react-icons/fa";
import {
  ShoppingCartOutlined,
  EditOutlined,
  PlusOutlined,
  BarChartOutlined,
  InboxOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { getProducts, getArchivedProducts, archiveProduct, unArchiveProduct } from "../../api/products.ts";
import { getCurrency } from "../../api/account.ts";
import {
  addToWishlist,
  deleteWishlistProduct,
  getWishlist,
  addToCart,
} from "../../api/cart.ts";
import cartIconPlus from './sampleImages/cartIcon.png';
import cartIcon from './sampleImages/cartwithout.png';
import addSign from './sampleImages/addsign.png';

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
    maxPrice: 1000,
    sortBy: "rating",
    sortOrder: "desc",
  });
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState();

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
      await addToCart(productId);
      message.success("Product added to cart successfully")
      // remove the product from wishlist if it exists
        if (wishlist.has(productId)) {
            const updatedWishlist = new Set(wishlist);
            updatedWishlist.delete(productId);
            setWishlist(updatedWishlist);
            await deleteWishlistProduct(productId);
        }
    } catch (error) {
      message.error("Failed to add product to cart");
      console.error("Add to cart error:", error);
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Top Action Bar */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <Title level={2} className="mb-0 text-gray-800">
              {showArchived ? "Archived Products" : "Product Catalog"}
            </Title>

            <div className="flex flex-wrap gap-3">
              {user && (user.userRole === "Admin" || user.userRole === "Seller") && (
                  <>
                    <Link to="/products/create">
                      <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          className="bg-first hover:bg-customGreen flex items-center"
                      >
                        Add Product
                      </Button>
                    </Link>

                    <Link to="/products/quantity&Sales">
                      <Button
                          type="default"
                          icon={<BarChartOutlined />}
                          className="border-first text-first hover:bg-first hover:text-white"
                      >
                        Reports
                      </Button>
                    </Link>

                    <Button
                        type={showArchived ? "default" : "primary"}
                        icon={<InboxOutlined />}
                        onClick={() => setShowArchived(!showArchived)}
                        className={showArchived ? "border-first text-first" : "bg-first"}
                    >
                      {showArchived ? "View Active" : "View Archived"}
                    </Button>
                  </>
              )}

              <Link to="/products/cart">
                <Badge count={0} className="cursor-pointer">
                  <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      className="bg-first hover:bg-customGreen"
                  >
                    Cart
                  </Button>
                </Badge>
              </Link>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-8 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Search products..."
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

          {/* Products Grid */}
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
                          className="h-full transform hover:scale-105 transition-all duration-300"
                          cover={
                            <div className="relative pt-[100%]">
                              <img
                                  src={product.image || product.imageUrl}
                                  alt={product.name}
                                  className="absolute top-0 left-0 w-full h-full object-cover"
                              />
                              <Button
                                  shape="circle"
                                  className={`absolute top-4 right-4 ${
                                      wishlist.has(product._id)
                                          ? "bg-red-500 border-red-500"
                                          : "bg-white"
                                  }`}
                                  icon={
                                    <FaHeart
                                        className={wishlist.has(product._id) ? "text-white" : "text-gray-400"}
                                    />
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleWishlistToggle(product._id, !wishlist.has(product._id));
                                  }}
                              />
                            </div>
                          }
                          actions={[
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddToCartRequest(product._id);
                                }}
                                className="bg-first hover:bg-customGreen"
                            >
                              Add to Cart
                            </Button>,
                            user && user._id === product.createdBy && (
                                <Link to={`/products/edit/${product._id}`}>
                                  <Button icon={<EditOutlined />}>Edit</Button>
                                </Link>
                            )
                          ]}
                      >
                        <Link to={`/products/${product._id}`}>
                          <Card.Meta
                              title={<Text strong className="text-lg">{product.name}</Text>}
                              description={
                                <div className="space-y-2">
                                  <Text className="text-lg font-medium text-first">
                                    {currency?.code} {(currency?.rate * product.price).toFixed(2)}
                                  </Text>
                                  <div>
                                    <StarRating rating={calculateAverageRating(product.ratings)} />
                                  </div>
                                </div>
                              }
                          />
                        </Link>
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
