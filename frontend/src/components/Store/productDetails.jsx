import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  Skeleton,
  Rate,
  message,
  Divider,
  Alert,
  Spin
} from "antd";
import {
  ShoppingCartOutlined,
  RollbackOutlined,
  ShopOutlined,
  UserOutlined,
  TagOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { FaHeart } from "react-icons/fa";
import {addToCart, addToWishlist, deleteWishlistProduct, getWishlist} from "../../api/cart.ts";
import {
  getProduct,
  getProductRatings,
  getProductReviews
} from "../../api/products.ts";
import {getMyCurrency} from "../../api/profile.ts";
import ProductReviews from "./productReviews";

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
    if (isAddingToCart) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product._id);
      message.success({
        content: 'Added to cart successfully!',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
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
      message.error(error.response.data.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);

        if(user && user.userRole === "Tourist") {
          const wishlistResponse = await getWishlist();
          if (!wishlistResponse.data.wishlist || wishlistResponse.status === 404)
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
            <Card className="max-w-7xl mx-auto">
              <Skeleton active paragraph={{ rows: 4 }} />
            </Card>
        ) : error ? (
            <div className="text-center">
              <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
              />
            </div>
        ) : (
            <>
              <Card className="max-w-7xl mx-auto shadow-xl rounded-2xl overflow-hidden bg-white"
                    bodyStyle={{padding: 0}}>
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/2 relative">
                    <div className="relative" style={{paddingTop: '75%'}}>
                      <img
                          src={product.image || product.imageUrl}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-contain hover:object-cover transition-all duration-500"
                          style={{
                            backgroundColor: '#f5f5f5',
                            objectFit: 'contain'
                          }}
                      />
                      {user && user.userRole === "Tourist" && (
                          <button
                              onClick={handleWishToggle}
                              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                                  isWished
                                      ? 'bg-red-500 hover:bg-red-600'
                                      : 'bg-white hover:bg-gray-100'
                              }`}
                          >
                            <FaHeart className={`text-xl ${isWished ? 'text-white' : 'text-gray-400'}`}/>
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
                          <Rate disabled defaultValue={averageRating} className="text-yellow-400"/>
                          <Text className="text-lg text-gray-600">
                            ({averageRating.toFixed(1)})
                          </Text>
                        </div>
                      </div>

                      <Divider className="my-6"/>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                          <TagOutlined className="text-2xl text-green-500"/>
                          <Text className="text-3xl font-bold text-green-600">
                            {currency?.code} {(currency?.rate * product.price).toFixed(2)}
                          </Text>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                            <ShopOutlined className="text-xl text-blue-500"/>
                            <div>
                              <Text className="text-sm text-blue-400 block">Available Stock</Text>
                              <Text className="text-lg font-bold text-blue-600">{product.quantity}</Text>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
                            <UserOutlined className="text-xl text-purple-500"/>
                            <div>
                              <Text className="text-sm text-purple-400 block">Seller</Text>
                              <Text className="text-lg font-bold text-purple-600">
                                {product.createdBy.userRole === "Admin" ? "Teer Enta" : product.createdBy.username}
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

                      {user && user.userRole === "Tourist" && (
                          <div className="flex gap-4 mt-8">
                            {product.quantity > 0 ? (
                                <Button
                                    type="danger"
                                    size="large"
                                    icon={<ShoppingCartOutlined/>}
                                    onClick={handleAddToCart}
                                    loading={isAddingToCart}
                                    className={`flex-1 h-14 text-lg bg-blue-950 font-semibold transition-all duration-300 transform text-white ${
                                        addedToCart
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : 'bg-blue-500 hover:bg-black'
                                    } border-none`}
                                >
                                  {isAddingToCart ? 'Adding...' : addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                                </Button>
                            ) : (
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
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Reviews */}
              <div className="max-w-7xl mx-auto mt-12">
                <Card
                    className="shadow-2xl rounded-xl bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-center gap-4 mb-8 border-l-4 border-indigo-600 pl-4">
                    <Title level={3} className="m-0 text-indigo-900 font-bold">
                      Customer Reviews
                    </Title>
                  </div>

                  <div className="bg-white rounded-xl">
                    <ProductReviews
                        productId={id}
                        className="divide-y divide-gray-100"
                    />
                  </div>

                </Card>
              </div>
            </>
        )}
      </div>
  );
};

export default ProductDetails;