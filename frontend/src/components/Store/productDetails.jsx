import React, { useEffect, useState } from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  Skeleton,
  Rate,
  message,
  List,
  Divider,
  Alert,
  Spin, Tabs, Avatar, Modal,
} from "antd";
import {
  ShoppingCartOutlined,
  RollbackOutlined,
  ShopOutlined,
  UserOutlined,
  TagOutlined,
  CheckCircleOutlined, StarOutlined, MessageOutlined,
} from "@ant-design/icons";
import { FaHeart } from "react-icons/fa";
import {
  addToCart,
  addToWishlist,
  deleteWishlistProduct,
  getWishlist,
} from "../../api/cart.ts";
import {
  getProduct,
  getProductRatings,
  getProductReviews,
} from "../../api/products.ts";
import { getMyCurrency } from "../../api/profile.ts";
import ProductReviews from "./productReviews";
import TabPane from "antd/es/tabs/TabPane";
import ConfirmationModal from "../shared/ConfirmationModal";
import LoginConfirmationModal from "../shared/LoginConfirmationModel";

const { Title, Text } = Typography;

const ProductDetails = ({ setFlag }) => {
  setFlag(false);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [isWished, setIsWished] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = React.useState('1');
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleWishToggle = async () => {
    try {
      if (isWished === true) {
        await deleteWishlistProduct(product._id);
        message.success("Product removed from wishlist");
      } else {
        await addToWishlist(product._id);
        message.success("Product added to wishlist");
      }
      setIsWished((prevState) => !prevState);
    } catch (error) {
      console.error("Failed to archive product:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {;
      setIsLoginModalOpen(true);
      return;
    }
    if (isAddingToCart) return;


    try {
      setIsAddingToCart(true);
      await addToCart(product._id);
      message.success({
        content: "Added to cart successfully!",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
      if (isWished === true) {
        await deleteWishlistProduct(product._id);
        setIsWished(false);
      }
      setAddedToCart(true);

      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    } catch (error) {
      message.warning(error.response.data.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);

        if (user && user.userRole === "Tourist") {
          const wishlistResponse = await getWishlist();
          if (
            !wishlistResponse.data.wishlist ||
            wishlistResponse.status === 404
          )
            setIsWished(false);
          else {
            const wishlist = new Set(
              wishlistResponse.data.wishlist.map((product) => product._id)
            );
            setIsWished(wishlist.has(id));
          }
        }
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

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-24 text-red-500">Error: {error}</div>;
  }

  const averageRating = calculateAverageRating(product.ratings);

  return (
    <div className="flex justify-center">
      <LoginConfirmationModal
          open={isLoginModalOpen}
          setOpen={setIsLoginModalOpen}
          content="Please login to add this product to your cart."
      />
      <div className="w-[90%]  py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <Card className="max-w-7xl mx-auto">
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ) : error ? (
          <div className="text-center">
            <Alert message="Error" description={error} type="error" showIcon />
          </div>
        ) : (
          <>
            <Card
              className="max-w-7xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white"
              bodyStyle={{ padding: 0 }}
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 relative">
                  <div className="relative" style={{ paddingTop: "75%" }}>
                    <img
                      src={product.image || product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain hover:object-cover transition-all duration-500"
                      style={{
                        backgroundColor: "#f5f5f5",
                        objectFit: "contain",
                      }}
                    />
                    {user && user.userRole === "Tourist" && (
                      <button
                        onClick={handleWishToggle}
                        className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                          isWished
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        <FaHeart
                          className={`text-xl ${
                            isWished ? "text-white" : "text-gray-400"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:w-1/2 p-8">
                  <div className="space-y-6">
                    <div>
                      <Title level={2} className="text-gray-800 mb-2 font-bold">
                        {product.name}
                      </Title>
                      <div className="flex items-center gap-3">
                        <Rate
                          disabled
                          defaultValue={averageRating}
                          className="text-yellow-400"
                        />
                        <Text className="text-lg text-gray-600">
                          ({averageRating.toFixed(1)})
                        </Text>
                      </div>
                    </div>

                    <Divider className="my-6" />

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                        <TagOutlined className="text-2xl text-green-500" />
                        <Text className="text-3xl font-bold text-green-600">
                          {currency?.code}{" "}
                          {(currency?.rate * product.price).toFixed(2)}
                        </Text>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {product.quantity < 5 && (
                            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                              <ShopOutlined className="text-xl text-blue-500"/>
                              <div>
                                <Text className="text-sm text-blue-400 block">
                                  Available Stock
                                </Text>
                                <Text className="text-lg font-bold text-blue-600">
                                  {product.quantity}
                                </Text>
                              </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
                          <UserOutlined className="text-xl text-purple-500"/>
                          <div>
                            <Text className="text-sm text-purple-400 block">
                              Seller
                            </Text>
                            <Text className="text-lg font-bold text-purple-600">
                              {product.createdBy.userRole === "Admin"
                                  ? "Teer Enta"
                                  : product.createdBy.username}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <Text className="text-gray-700 leading-relaxed text-lg">
                        {product.description}
                      </Text>
                    </div>

                    {/*{user && user.userRole === "Tourist" && (*/}
                      <div className="flex gap-4 mt-8">
                        {product.quantity > 0 && (!user || user === "Tourist") && (
                          <Button
                            type="danger"
                            size="large"
                            icon={<ShoppingCartOutlined />}
                            onClick={handleAddToCart}
                            loading={isAddingToCart}
                            className={`flex-1 h-14 text-lg bg-blue-950 font-semibold transition-all duration-300 transform text-white ${
                              addedToCart
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-blue-500 hover:bg-black"
                            } border-none`}
                          >
                            {isAddingToCart
                              ? "Adding..."
                              : addedToCart
                              ? "Added to Cart!"
                              : "Add to Cart"}
                          </Button>
                        )} 
                        
                        {product.quantity == 0 && (!user || user === "Tourist") &&(
                          <Button
                            type="default"
                            size="large"
                            disabled
                            className="flex-1 h-14 text-lg font-semibold bg-gray-200 hover:bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                          >
                            Out of Stock
                          </Button>
                        )}
                      </div>
                    {/*)}*/}
                  </div>
                </div>
              </div>
            </Card>

            {/*Product Reviews */}
            <div className="mt-8">
              <Card className="shadow-xl rounded-xl bg-gradient-to-br from-gray-50 to-white">
                <Tabs activeKey={activeTab} onChange={setActiveTab} className="fancy-tabs">
                  <TabPane
                      tab={
                        <span className="flex items-center gap-2 px-3 py-2">
                <StarOutlined className="text-blue-500"/>
                <span className="font-medium">Ratings</span>
              </span>
                      }
                      key="1"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
                      <div className="text-center">
                        <Text
                            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                          {averageRating}
                        </Text>
                        <div className="my-3">
                          <Rate disabled value={Number(averageRating)} allowHalf className="text-yellow-400"/>
                        </div>
                        <Text className="text-gray-600">
                          Based on {product.ratings?.length || 0} reviews
                        </Text>
                      </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      <List
                          itemLayout="horizontal"
                          dataSource={product.ratings}
                          renderItem={(rating) => (
                              <List.Item className="rounded-xl transition-all duration-300 p-4 mb-2">
                                <List.Item.Meta
                                    avatar={
                                      <div className="relative">
                                        <Avatar icon={<UserOutlined/>}
                                                className="bg-gradient-to-r from-blue-500 to-indigo-500"/>
                                      </div>
                                    }
                                    title={
                                      <div className="flex justify-between items-center">
                                        <Text strong className="text-gray-800">{rating.createdBy?.username}</Text>
                                        <div className="flex items-center gap-2">
                                          <Rate disabled defaultValue={rating.rating} className="text-sm"/>
                                          <Text className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                            {new Date(rating.createdAt).toLocaleDateString()}
                                          </Text>
                                        </div>
                                      </div>
                                    }
                                />
                              </List.Item>
                          )}
                          locale={{
                            emptyText: (
                                <div className="text-center py-8">
                                  <Text className="block text-gray-400">No reviews yet</Text>
                                </div>
                            )
                          }}
                      />
                    </div>
                  </TabPane>

                  <TabPane
                      tab={
                        <span className="flex items-center gap-2 px-3 py-2">
                <MessageOutlined className="text-green-500"/>
                <span className="font-medium">Comments</span>
              </span>
                      }
                      key="2"
                  >
                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                      <List
                          dataSource={product.reviews}
                          renderItem={(comment) => (
                              <List.Item className="rounded-xl transition-all duration-300 p-4 mb-2">
                                <List.Item.Meta
                                    avatar={
                                      <Avatar icon={<UserOutlined/>}
                                              className="bg-gradient-to-r from-green-500 to-emerald-500"/>
                                    }
                                    title={
                                      <div className="flex justify-between items-center">
                                        <Text strong className="text-gray-800">{comment.createdBy?.username}</Text>
                                        <Text className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                          {new Date(comment.createdAt).toLocaleDateString()}
                                        </Text>
                                      </div>
                                    }
                                    description={
                                      <div className="mt-2 bg-white p-3 rounded-lg shadow-sm">
                                        <Text className="text-gray-600">{comment.review}</Text>
                                      </div>
                                    }
                                />
                              </List.Item>
                          )}
                          locale={{
                            emptyText: (
                                <div className="text-center py-8">
                                  <MessageOutlined className="text-4xl text-gray-300 mb-2"/>
                                  <Text className="block text-gray-400">No comments yet</Text>
                                </div>
                            )
                          }}
                      />
                    </div>
                  </TabPane>
                </Tabs>

                <style jsx>{`
                  .fancy-tabs .ant-tabs-nav {
                    margin-bottom: 1rem;
                    background: #f8fafc;
                    padding: 0.5rem;
                    border-radius: 0.75rem;
                  }

                  .fancy-tabs .ant-tabs-tab {
                    margin: 0 !important;
                    padding: 0.5rem !important;
                    border-radius: 0.5rem;
                    transition: all 0.3s;
                  }

                  .fancy-tabs .ant-tabs-tab:hover {
                    background: white;
                  }

                  .fancy-tabs .ant-tabs-tab-active {
                    background: white !important;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
                  }

                  .fancy-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #4f46e5 !important;
                  }

                  .fancy-tabs .ant-tabs-ink-bar {
                    display: none;
                  }

                  .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                  }

                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                  }

                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 1rem;
                  }

                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                  }
                `}</style>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
