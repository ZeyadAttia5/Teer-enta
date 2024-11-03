import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, archiveProduct, unArchiveProduct } from "../../api/products.ts";
import ImageUpload from "./ImageUpload"; // Import the image upload component
import { message } from 'antd';

const EditProductForm = ({ setFlag }) => {
  setFlag(false);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '', 
    quantity: '', 
    isActive: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await getProduct(productId);
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

  const setImageUrl = (url) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      imageUrl: url,
    }));
  };

  const handleArchiveToggle = async () => {
    try {
      if (product.isActive) {
        await archiveProduct(productId);
        setSuccess('Product archived successfully!');
      } else {
        await unArchiveProduct(productId);
        setSuccess('Product unarchived successfully!');
      }
      setProduct((prevProduct) => ({
        ...prevProduct,
        isActive: !prevProduct.isActive,
      }));
    } catch (err) {
      setError('Failed to update archive status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await updateProduct(product, productId);
      setSuccess('Product successfully updated!');
      // message.success('Product successfully updated!');
      message.loading('loading') ;
      setTimeout(() => navigate('/products'), 1000);
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-24">Loading product data...</div>;
  if (error) return <div className="text-center mt-24">Error: {error}</div>;

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
            required
            className="w-full p-2 border-2 border-customGreen rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full p-2 border-2 border-customGreen rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="w-full p-2 border-2 border-customGreen rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Upload Product Image:</label>
          <ImageUpload setImageUrl={setImageUrl} />
        </div>

        <div className="mb-4">
          <label className="block text-lg text-customGreen mb-2">Available Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            required
            className="w-full p-2 border-2 border-customGreen rounded"
          />
        </div>

        <button
          type="submit"
          className={`bg-customGreen text-white px-4 py-2 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-darkerGreen'}`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Product"}
        </button>

        <button
          type="button"
          onClick={handleArchiveToggle}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-4 hover:bg-gray-700"
        >
          {product.isActive ? 'Archive' : 'Unarchive'}
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
