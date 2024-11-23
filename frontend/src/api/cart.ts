import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("accessToken");

export const getWishlist = async () => {
    return await axios.get(`${API_BASE_URL}/cart/wishlist`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
};

export const getCart = async () => {
    return await axios.get(`${API_BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
}
export const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/cart/add/wishlist/product/${productId}`,
        {}, // Request body (empty here)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data; // Adjust based on backend response
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      throw error; // Throw the error to handle it in the UI
    }
  };
export const addToCartFromWishlist = async (productId) => {
  try{  
    const response = await axios.post(`${API_BASE_URL}/cart/add/cartFromWishlist/product/${productId}`,
      {}, // Request body (empty here)
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data; // Adjust based on backend response
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    throw error; // Throw the error to handle it in the UI
  }
}
export const addToCart = async (productId) => {
    return await axios.post(`${API_BASE_URL}/add/cart/product/${productId}`)
}
export const updateCartProductAmount = async (productId) => {
    return await axios.put(`${API_BASE_URL}/cart/update/cart/productAmount/${productId}`)
}
export const deleteWishlistProduct = async (productId) => {
    return await axios.delete(`${API_BASE_URL}/cart/delete/wishlist/product/${productId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}
export const deleteCartProduct = async (productId) => {
    return await axios.delete(`${API_BASE_URL}/cart/delete/cart/product/${productId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}