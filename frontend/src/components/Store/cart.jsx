import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Input,
  Row,
  Col,
  Button,
  Card,
  Typography,
  Badge,
  message,
  Spin,
  Empty,
  Space,
  Divider,
  Alert,
  Image,
  Tooltip,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import {
  getCart,
  updateCartProductAmount,
  deleteCartProduct,
} from "../../api/cart.ts";
import { getMyCurrency } from "../../api/profile.ts";

const { Title, Text } = Typography;

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [cartResponse, currencyResponse] = await Promise.all([
        getCart(),
        getMyCurrency(),
      ]);
      setCartItems(cartResponse.data.cart);
      setCurrency(currencyResponse.data);
    } catch (err) {
      setError("Failed to fetch cart items");
      message.warning(error.response.data.message||"Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newAmount) => {
    try {
      await updateCartProductAmount(productId, newAmount);
      message.success("Cart updated successfully");
      fetchInitialData();
    } catch (err) {
      message.warning(err.response.data.message);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      await deleteCartProduct(productId);
      message.success("Product removed from cart");
      fetchInitialData();
    } catch (err) {
      message.warning("Failed to remove item");
    }
  };

  const getPriceDisplay = (price) => {
    if (!price) return "0.00";
    const convertedPrice = price * (currency?.rate || 1);
    return `${currency?.code || "$"} ${convertedPrice.toFixed(2)}`;
  };

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return getPriceDisplay(total);
  };

  const calculateItemTotal = (price, quantity) => {
    return getPriceDisplay(price * quantity);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" tip="Loading cart..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-[90%]">
        <Card
          className="shadow-lg rounded-lg"
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCartOutlined className="text-2xl mr-2" />
                <Title level={2} className="m-0">
                  Your Shopping Cart
                </Title>
              </div>
              {currency && (
                <Text className="text-gray-500">
                  Prices shown in {currency.code} (1 USD = {currency.rate}{" "}
                  {currency.code})
                </Text>
              )}
            </div>
          }
        >
          {cartItems.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text className="text-gray-500">Your cart is empty</Text>
              }
            >
              <Link to="/products">
                <Button
                  type="danger"
                  className="bg-blue-950 hover:bg-black text-white"
                  icon={<ShoppingOutlined />}
                  size="large"
                >
                  Start Shopping
                </Button>
              </Link>
            </Empty>
          ) : (
            <>
              <Row gutter={[24, 24]}>
                {cartItems.map((item) => (
                  <Col key={item._id} xs={24}>
                    <Card
                      className="hover:shadow-md transition-shadow duration-300"
                      bodyStyle={{ padding: "16px" }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                            {item.product.imageUrl ? (
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                preview={false}
                                width={96}
                                height={96}
                                className="object-cover"
                                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADA"
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            ) : (
                              <ShoppingCartOutlined className="text-3xl text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <Title level={4} className="m-0">
                              {item.product.name}
                            </Title>

                            <div className="flex items-center space-x-4 mt-2">
                              <Tooltip title="Unit Price">
                                <div className="flex items-center">
                                  <Text className="text-lg font-semibold text-blue-600">
                                    {getPriceDisplay(item.product.price)}
                                  </Text>
                                </div>
                              </Tooltip>

                              <Text className="text-gray-400">×</Text>

                              <Tooltip title="Quantity">
                                <Text className="text-gray-600 font-medium">
                                  {item.quantity}{" "}
                                  {item.quantity > 1 ? "items" : "item"}
                                </Text>
                              </Tooltip>

                              <Text className="text-gray-400">=</Text>

                              <Tooltip title="Total for this item">
                                <div className="flex items-center">
                                  <Text className="text-lg font-semibold text-green-600">
                                    {calculateItemTotal(
                                      item.product.price,
                                      item.quantity
                                    )}
                                  </Text>
                                </div>
                              </Tooltip>
                            </div>
                          </div>
                        </div>

                        <Space size="middle">
                          <div className="flex items-center">
                            <Button
                              icon={<MinusOutlined />}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            />
                            <Input
                              className="w-16 mx-2 text-center"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                handleUpdateQuantity(
                                  item.product._id,
                                  Math.max(1, value)
                                );
                              }}
                            />
                            <Button
                              icon={<PlusOutlined />}
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.quantity + 1
                                )
                              }
                            />
                          </div>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteItem(item.product._id)}
                          >
                            Remove
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Divider />

              <div className="flex justify-between items-center mt-8">
                <div>
                  <Title level={3} className="m-0 flex items-center">
                    <DollarOutlined className="mr-2" />
                    Total: {calculateTotal()}
                  </Title>
                  <Text className="text-gray-500">
                    {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}{" "}
                    in cart
                  </Text>
                </div>
                <Space size="middle">
                  <Link to="/products">
                    <Button size="large">Continue Shopping</Button>
                  </Link>
                  <Link to="/checkOutOrder">
                    <Button
                      type="danger"
                      size="large"
                      className="bg-first text-white hover:bg-black"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                </Space>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CartComponent;
