import React, { useState } from "react";
import { addProduct } from "../../api/products.ts";
import ImageUpload from "./ImageUpload"; // Import the image upload component

const AdminProductForm = ({ setFlag }) => {
  setFlag(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    seller: "",
    imageUrl: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Update product's image URL with uploaded URL
  const setImageUrl = (url) => {
    console.log("URL: ",url);
    setProduct((prevProduct) => ({
      ...prevProduct,
      imageUrl: url,
      
    }
  ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await addProduct(product);
      console.log("Product submitted:", response.data);
      setSuccess("Product successfully created!");

      setProduct({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        quantity: "",
      });
    } catch (err) {
      setError("Failed to create product. Please try again.");
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
          {loading ? "Submitting..." : "Add product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductForm;
