import React, { useEffect, useState } from 'react';

const EditProductForm = ({ productId }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    seller: '',
    imageUrl: '',
    availableQuantity: '', // Add this field as well
  });

  useEffect(() => {
    // Simulate fetching product data by ID
    const fetchProductData = async () => {
      // Replace this with your actual fetch logic to get product details by ID
      const fetchedProduct = {
        id: productId,
        name: 'Hagia Sophia Magnet',
        description: 'A beautiful magnet of Hagia Sophia.',
        price: 100,
        category: 'magnets',
        seller: 'Turkish Souvenirs',
        imageUrl: 'path_to_image',
        availableQuantity: 50, // Example value
      };

      setProduct(fetchedProduct);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Updated Product:', product);
    // Reset form fields or redirect after submission if necessary
  };

  return (
    <div className="flex flex-col items-center py-16 px-5 mt-20">
      <h2 className="text-2xl font-bold text-customGreen mb-6">Edit Product</h2>
      <form className="bg-white border-4 border-customGreen p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
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
            name="availableQuantity"
            value={product.availableQuantity}
            onChange={handleChange}
            placeholder="Enter available quantity"
            required
            className="w-full p-2 border-2 border-customGreen rounded focus:outline-none focus:border-darkerGreen"
          />
        </div>

        <button type="submit" className="bg-customGreen text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-darkerGreen">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductForm;
