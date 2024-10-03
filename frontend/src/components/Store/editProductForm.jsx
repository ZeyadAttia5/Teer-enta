import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom"; // Import axios

const EditProductForm = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    seller: '',
    imageUrl: '',
    quantity: '', // Ensure you match this with your API response
  });
  
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success message state

  useEffect(() => {
    // Fetch product data by ID
    const fetchProductData = async () => {
      try {
        const backURL = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.get(`${backURL}/product/${productId}`); // Adjust to your API endpoint
        console.log('Product Data:', response.data);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const backURL = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.put(`${backURL}/product/update/${productId}`, product); // Adjust to your API endpoint
      console.log('Updated Product:', response.data);
      setSuccess('Product successfully updated!');

      // Optionally, you can redirect or reset form fields after successful update
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  // Handle loading state
  if (loading) {
    return <div className="text-center mt-24">Loading product data...</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center mt-24">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center py-16 px-5 mt-20">
      <h2 className="text-2xl font-bold text-customGreen mb-6">Edit Product</h2>
      <form className="bg-white border-4 border-customGreen p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
            required
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Enter product price"
            required
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Enter product category"
            required
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Seller Name:</label>
          <input
            type="text"
            name="seller"
            value={product.seller}
            onChange={handleChange}
            placeholder="Enter seller name"
            required
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Available Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            placeholder="Enter available quantity"
            required
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <button
          type="submit"
          className={`bg-customGreen text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-darkerGreen`}
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
