import React, { useState } from "react";
import { addProduct } from "../../api/products.ts";
import ImageUpload from "./ImageUpload";
import { Form, Input, InputNumber, Button } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { message } from "antd"; // Import Ant Design's message component

const AdminProductForm = ({ setFlag }) => {
  setFlag(false);
  const [form] = Form.useForm(); // Create a form instance using Ant Design's useForm
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    seller: "",
    imageUrl: "",
    quantity: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate function

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

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await addProduct(product);
      message.success('Product successfully created!', 2); // Show success message without background
      form.resetFields(); // Clear form using Ant Design's resetFields
      navigate('/products'); // Navigate to the products page after successful form submission
    } catch (err) {
      message.error('Failed to create product. Please try again.', 2); // Show error message without background
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col items-center py-12 px-6 mt-20">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Add New Product</h2>
        <Form
            form={form} // Pass the form instance to the Form
            layout="vertical"
            className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200 w-full max-w-md"
            onFinish={handleSubmit}
        >
          {/* Form fields */}
          <Form.Item
              label={<span className="text-gray-700 font-medium">Product Name</span>}
              name="name"
              rules={[{ required: true, message: "Please enter the product name" }]}
          >
            <Input
                name="name"
                value={product.name}
                onChange={handleChange}
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
              label={<span className="text-gray-700 font-medium">Description</span>}
              name="description"
              rules={[{ required: true, message: "Please enter the product description" }]}
          >
            <Input.TextArea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={4}
                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
              label={<span className="text-gray-700 font-medium">Price</span>}
              name="price"
              rules={[{ required: true, message: "Please enter the product price" }]}
          >
            <InputNumber
                name="price"
                value={product.price}
                onChange={(value) => setProduct((prevProduct) => ({ ...prevProduct, price: value }))}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item label={<span className="text-gray-700 font-medium">Upload Product Image</span>} name="imageUrl">
            <ImageUpload setImageUrl={setImageUrl} />
          </Form.Item>

          <Form.Item
              label={<span className="text-gray-700 font-medium">Available Quantity</span>}
              name="quantity"
              rules={[{ required: true, message: "Please enter the quantity available" }]}
          >
            <InputNumber
                name="quantity"
                value={product.quantity}
                onChange={(value) => setProduct((prevProduct) => ({ ...prevProduct, quantity: value }))}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold py-2 rounded-xl mt-4 hover:from-blue-600 hover:to-teal-500"
          >
            {loading ? "Submitting..." : "Add Product"}
          </Button>
        </Form>
      </div>
  );
};

export default AdminProductForm;
