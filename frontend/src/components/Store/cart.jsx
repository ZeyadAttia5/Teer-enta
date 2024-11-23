import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterDropdown from "./filterDropdown";
import StarRating from "../shared/starRating";
import { Input, Row, Col, Button } from "antd";
import { FaHeart } from "react-icons/fa";
import { getProducts, getArchivedProducts, archiveProduct, unArchiveProduct } from "../../api/products.ts";
import { getCurrency } from "../../api/account.ts";
import { getCart, addToCart, updateCartProductAmount, deleteCartProduct } from "../../api/cart.ts";
const CartComponent = () => {
const backURL = process.env.REACT_APP_BACKEND_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = localStorage.getItem("accessToken");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await getCart();
      setCartItems(response.data);
    } catch (err) {
      setError("Failed to fetch cart items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newAmount) => {
    try {
      await updateCartProductAmount(productId, { amount: newAmount });
      setFeedbackMessage("Cart updated successfully");
      fetchCartItems(); // Refresh cart items
    } catch (err) {
      setError("Failed to update cart item quantity");
      console.error(err);
    }
  };

  const handleDeleteItem = async (productId) => {
    try {
      await deleteCartProduct(productId);
      setFeedbackMessage("Product removed from cart");
      fetchCartItems(); // Refresh cart items
    } catch (err) {
      setError("Failed to remove product from cart");
      console.error(err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      setFeedbackMessage("Product added to cart");
      fetchCartItems(); // Refresh cart items
    } catch (err) {
      setError("Failed to add product to cart");
      console.error(err);
    }
  };

  if (loading) return <div>Loading cart items...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-5 relative">
      {feedbackMessage && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-first text-white px-4 py-2 rounded shadow-lg">
          {feedbackMessage}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-5">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <Row gutter={[16, 16]}>
          {cartItems.map((item) => (
            <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
              <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                <h2 className="font-bold text-lg">{item.productName}</h2>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="flex gap-2 mt-3">
                  <Input
                    type="number"
                    min="1"
                    defaultValue={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item._id, parseInt(e.target.value, 10))
                    }
                    className="w-20"
                  />
                  <Button
                    type="primary"
                    onClick={() => handleUpdateQuantity(item._id, item.quantity)}
                  >
                    Update
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <div className="mt-5">
        <Link to="/products">
          <Button type="primary" className="bg-first text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartComponent;