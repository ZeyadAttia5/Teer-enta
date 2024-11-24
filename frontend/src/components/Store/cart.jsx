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
  Divider, Alert, Image
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ShoppingOutlined
} from "@ant-design/icons";
import { getCart, updateCartProductAmount, deleteCartProduct } from "../../api/cart.ts";

const { Title, Text } = Typography;

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await getCart();
      setCartItems(response.data.cart);
    } catch (err) {
      setError("Failed to fetch cart items");
      message.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newAmount) => {
    try {
      await updateCartProductAmount(productId, newAmount);
      message.success("Cart updated successfully");
      fetchCartItems();
    } catch (err) {
      message.error("Failed to update quantity");
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      await deleteCartProduct(productId);
      message.success("Product removed from cart");
      fetchCartItems();
    } catch (err) {
      message.error("Failed to remove item");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card
            className="shadow-lg rounded-lg"
            title={
              <div className="flex items-center">
                <ShoppingCartOutlined className="text-2xl mr-2" />
                <Title level={2} className="m-0">Your Shopping Cart</Title>
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
                  <Button type="primary" icon={<ShoppingOutlined />} size="large">
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
                            bodyStyle={{ padding: '16px' }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div
                                  className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
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
                                          objectFit: 'cover',
                                          width: '100%',
                                          height: '100%'
                                        }}
                                    />
                                ) : (
                                    <ShoppingCartOutlined className="text-3xl text-gray-400"/>
                                )}
                              </div>
                              <div className="ml-4">
                                <Title level={4} className="m-0">
                                  {item.product.name}
                                </Title>
                                <Text className="text-lg font-semibold text-blue-600">
                                  ${item.product.price.toFixed(2)}
                                </Text>
                              </div>
                            </div>

                            <Space size="middle">
                              <div className="flex items-center">
                                <Button
                                    icon={<MinusOutlined/>}
                                    onClick={() => handleUpdateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                                />
                                <Input
                                    className="w-16 mx-2 text-center"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value) || 1;
                                      handleUpdateQuantity(item.product._id, Math.max(1, value));
                                    }}
                                />
                                <Button
                                    icon={<PlusOutlined/>}
                                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
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
                    <Title level={3} className="m-0">
                      Total: ${calculateTotal().toFixed(2)}
                    </Title>
                    <Text className="text-gray-500">
                      {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
                    </Text>
                  </div>
                  <Space size="middle">
                    <Link to="/products">
                      <Button size="large">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Button type="primary" size="large">
                      Proceed to Checkout
                    </Button>
                  </Space>
                </div>
              </>
          )}
        </Card>
      </div>
  );
};

export default CartComponent;