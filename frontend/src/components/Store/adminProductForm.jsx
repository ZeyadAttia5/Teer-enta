import React, { useState } from "react";
import {Form, Input, InputNumber, Button, ConfigProvider, notification, message} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PackageIcon,
  DollarSign,
  ImageIcon,
  ClipboardList,
  ArchiveIcon
} from 'lucide-react';
import { addProduct } from "../../api/products.ts";
import ImageUpload from "./ImageUpload";

const AdminProductForm = ({ setFlag }) => {
  setFlag(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    seller: "",
    imageUrl: "",
    quantity: "",
  });

  const navigate = useNavigate();

  const setImageUrl = (url) => {
    setProduct(prev => ({
      ...prev,
      imageUrl: url,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await addProduct(product);
      message.success("Product successfully created!");
      form.resetFields();
      navigate('/products');
    } catch (err) {
      message.warning(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1C325B",
            },
          }}
      >
        <div className=" p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <PackageIcon className="w-6 h-6" />
                  <h3 className="text-lg font-semibold m-0">
                    Add New Product
                  </h3>
                </div>
                <p className="text-gray-200 mt-2 mb-0 opacity-90">
                  Create a new product listing
                </p>
              </div>

              {/* Form */}
              <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="mt-6"
              >
                <Form.Item
                    label={<span className="text-gray-700 font-medium">Product Name</span>}
                    name="name"
                    rules={[{ required: true, message: "Please enter product name" }]}
                >
                  <Input
                      prefix={<PackageIcon className="w-4 h-4 text-gray-400" />}
                      placeholder="Enter product name"
                      size="large"
                      className="rounded-lg"
                      onChange={e => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Form.Item>

                <Form.Item
                    label={<span className="text-gray-700 font-medium">Description</span>}
                    name="description"
                    rules={[{ required: true, message: "Please enter product description" }]}
                >
                  <Input.TextArea
                      prefix={<ClipboardList className="w-4 h-4 text-gray-400" />}
                      placeholder="Enter product description"
                      size="large"
                      className="rounded-lg"
                      rows={4}
                      onChange={e => setProduct(prev => ({ ...prev, description: e.target.value }))}
                  />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                      label={<span className="text-gray-700 font-medium">Price</span>}
                      name="price"
                      rules={[{ required: true, message: "Please enter price" }]}
                  >
                    <InputNumber
                        prefix={<DollarSign className="w-4 h-4 text-gray-400" />}
                        placeholder="Enter price"
                        size="large"
                        className="w-full rounded-lg"
                        min={0}
                        onChange={value => setProduct(prev => ({ ...prev, price: value }))}
                    />
                  </Form.Item>

                  <Form.Item
                      label={<span className="text-gray-700 font-medium">Quantity</span>}
                      name="quantity"
                      rules={[{ required: true, message: "Please enter quantity" }]}
                  >
                    <InputNumber
                        prefix={<ArchiveIcon className="w-4 h-4 text-gray-400" />}
                        placeholder="Enter quantity"
                        size="large"
                        className="w-full rounded-lg"
                        min={0}
                        onChange={value => setProduct(prev => ({ ...prev, quantity: value }))}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                    label={<span className="text-gray-700 font-medium">Product Image</span>}
                    name="imageUrl"
                    className="mb-8"
                >
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                    <ImageUpload setImageUrl={setImageUrl} />
                  </div>
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="w-full h-12 bg-[#1C325B] hover:bg-[#1C325B]/90 rounded-lg
                                         text-base font-medium"
                >
                  {loading ? "Creating Product..." : "Create Product"}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default AdminProductForm;