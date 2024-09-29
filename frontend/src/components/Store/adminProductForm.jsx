import React, { useState } from 'react';
import './adminProductForm.css'; // Custom styling for the form

const AdminProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    seller: '',
    imageUrl: '',
    quantity: '', // Added quantity field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Product submitted:', product);
    // Reset form fields
    setProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      seller: '',
      imageUrl: '',
      quantity: '', // Reset quantity field
    });
  };

  return (
    <div className="admin-product-form-container">
      <h2>Add New Product</h2>
      <form className="admin-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Enter product price"
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Enter product category"
            required
          />
        </div>

        <div className="form-group">
          <label>Seller Name:</label>
          <input
            type="text"
            name="seller"
            value={product.seller}
            onChange={handleChange}
            placeholder="Enter seller name"
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={product.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
          />
        </div>

        <div className="form-group">
          <label>Available Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            placeholder="Enter available quantity"
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit Product</button>
      </form>
    </div>
  );
};

export default AdminProductForm;
