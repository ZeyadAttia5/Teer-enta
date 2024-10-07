import React, { useState } from 'react';
import axios from 'axios'; // Import axios

const AdminProductForm = ({setFlag}) => {
  setFlag(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    seller: '',
    imageUrl: '',
    quantity: '',
  });

  const user  = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success message state

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
      // Replace with your API endpoint
      const response = await axios.post(`${backURL}/product/create`, product ,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Product submitted:', response.data);
      setSuccess('Product successfully created!');

      // Reset form fields after successful submission
      setProduct({
        name: '',
        description: '',
        price: '',
        // seller: '',
        imageUrl: '',
        quantity: '',
      });
    } catch (err) {
      setError('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-16 px-5 mt-20">
      <h2 className="text-2xl font-bold text-customGreen mb-6">Add New Product</h2>
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

        {/*<div className="mb-4">*/}
        {/*  <label className="block text-lg text-customGreen mb-2">Seller Name:</label>*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    name="seller"*/}
        {/*    value={product.seller}*/}
        {/*    onChange={handleChange}*/}
        {/*    placeholder="Enter seller name"*/}
        {/*    required*/}
        {/*    className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"*/}
        {/*  />*/}
        {/*</div>*/}

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
          className={`bg-customGreen text-white px-4 py-2 rounded-lg transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-darkerGreen'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add product'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
