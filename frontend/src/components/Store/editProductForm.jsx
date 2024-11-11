import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct, addProduct, archiveProduct, unArchiveProduct } from "../../api/products.ts";
import { Input, Button, Alert, message } from 'antd'; // Import message from Ant Design
import ImageUpload from './ImageUpload';

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
    isActive: true, // Default to true if it's a new product
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch product data for editing
  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        try {
          const response = await getProduct(productId);
          setProduct(response.data);
        } catch (err) {
          setError('Failed to fetch product data');
        }
      };

      fetchProductData();
    }
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
        message.success('Product archived successfully!');
      } else {
        await unArchiveProduct(productId);
        message.success( 'Product unarchived successfully!');
      }
      setProduct((prevProduct) => ({
        ...prevProduct,
        isActive: !prevProduct.isActive,
      }));
    } catch (err) {
      message.error( 'Failed to update archive status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (productId) {
        // Update product
        response = await updateProduct(product, productId);
        message.success('Product successfully updated!');
      } else {
        // Create new product
        response = await addProduct(product);
        message.success('Product successfully created!');
      }

      setTimeout(() => navigate('/products'), 1000); // Redirect to products page after success
    } catch (err) {
      message.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-24">Loading product data...</div>;
  if (error) return <div className="text-center mt-24">Error: {error}</div>;

  return (
      <div className="flex flex-col items-center py-16 px-5 mt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{productId ? "Edit Product" : "Add New Product"}</h2>
        <form className="bg-white border-2 border-gray-300 p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>

          {error && <Alert message={error} type="error" showIcon className="mb-4" />}
          {success && <Alert message={success} type="success" showIcon className="mb-4" />}

          <div className="mb-4">
            <label className="block text-lg text-gray-700 mb-2">Product Name:</label>
            <Input
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg text-gray-700 mb-2">Description:</label>
            <Input.TextArea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg text-gray-700 mb-2">Price:</label>
            <Input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                className="w-full"
            />
          </div>

          {/* Display existing image */}
          <div className="mb-4">
            <label className="block text-lg text-gray-700 mb-2">Current Image:</label>
            {product.imageUrl ? (
                <img src={product.imageUrl} alt="Current product" className="w-full h-auto max-h-40 object-cover rounded mb-2" />
            ) : (
                <p>No image available</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-lg text-gray-700 mb-2">Upload New Product Image:</label>
            <ImageUpload setImageUrl={setImageUrl} />
          </div>

          <div className="mb-4">
            <label className="block text-lg text-gray-700 mb-2">Available Quantity:</label>
            <Input
                type="number"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                required
                className="w-full"
            />
          </div>

          <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 text-white mt-4 hover:bg-blue-600"
              loading={loading}
              disabled={loading}
          >
            {loading ? (productId ? "Updating..." : "Creating...") : (productId ? "Update Product" : "Add Product")}
          </Button>

          {productId && (
              <Button
                  type="default"
                  onClick={handleArchiveToggle}
                  className="w-full mt-4 bg-gray-400 text-white hover:bg-gray-500"
              >
                {product.isActive ? 'Archive' : 'Unarchive'}
              </Button>
          )}
        </form>
      </div>
  );
};

export default EditProductForm;
