import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, ConfigProvider, notification, InputNumber } from 'antd';
import {
  PackageIcon,
  DollarSign,
  ImageIcon,
  ClipboardList,
  ArchiveIcon,
  Edit3Icon,
  Loader2
} from 'lucide-react';
import { getProduct, updateProduct, addProduct, archiveProduct, unArchiveProduct } from "../../api/products.ts";
import ImageUpload from './ImageUpload';

const EditProductForm = ({ setFlag }) => {
  setFlag(false);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    quantity: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) {
        setFetching(false);
        return;
      }
      try {
        const response = await getProduct(productId);
        setProduct(response.data);
        form.setFieldsValue(response.data);
      } catch (err) {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch product data',
          className: 'bg-white shadow-lg',
        });
      } finally {
        setFetching(false);
      }
    };

    fetchProductData();
  }, [productId, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (productId) {
        await updateProduct({ ...values, imageUrl: product.imageUrl }, productId);
        notification.success({
          message: 'Success',
          description: 'Product updated successfully',
          className: 'bg-white shadow-lg',
        });
      } else {
        await addProduct({ ...values, imageUrl: product.imageUrl });
        notification.success({
          message: 'Success',
          description: 'Product created successfully',
          className: 'bg-white shadow-lg',
        });
      }
      navigate('/products');
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Failed to save product',
        className: 'bg-white shadow-lg',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      if (product.isActive) {
        await archiveProduct(productId);
        notification.success({
          message: 'Success',
          description: 'Product archived successfully',
        });
      } else {
        await unArchiveProduct(productId);
        notification.success({
          message: 'Success',
          description: 'Product unarchived successfully',
        });
      }
      setProduct(prev => ({
        ...prev,
        isActive: !prev.isActive,
      }));
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Failed to update archive status',
      });
    }
  };

  if (fetching) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#1C325B]" />
            <span className="text-gray-600">Loading product data...</span>
          </div>
        </div>
    );
  }

  return (
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1C325B",
            },
          }}
      >
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 text-white mb-8">
                <div className="flex items-center gap-3 mb-2">
                  {productId ? (
                      <Edit3Icon className="w-6 h-6" />
                  ) : (
                      <PackageIcon className="w-6 h-6" />
                  )}
                  <h3 className="text-lg font-semibold m-0">
                    {productId ? 'Edit Product' : 'Add New Product'}
                  </h3>
                </div>
                <p className="text-gray-200 mt-2 mb-0 opacity-90">
                  {productId ? 'Update product information' : 'Create a new product listing'}
                </p>
              </div>

              {/* Form */}
              <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={product}
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
                  />
                </Form.Item>

                <Form.Item
                    label={<span className="text-gray-700 font-medium">Description</span>}
                    name="description"
                    rules={[{ required: true, message: "Please enter product description" }]}
                >
                  <Input.TextArea
                      placeholder="Enter product description"
                      size="large"
                      className="rounded-lg"
                      rows={4}
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
                    />
                  </Form.Item>
                </div>

                {/* Current Image */}
                {product.imageUrl && (
                    <div className="mb-6">
                      <label className="text-gray-700 font-medium mb-2 block">
                        Current Image
                      </label>
                      <div className="border rounded-lg p-2">
                        <img
                            src={product.imageUrl}
                            alt="Current product"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                )}

                {/* Image Upload */}
                <Form.Item
                    label={<span className="text-gray-700 font-medium">Product Image</span>}
                    className="mb-8"
                >
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                    <ImageUpload setImageUrl={url => setProduct(prev => ({ ...prev, imageUrl: url }))} />
                  </div>
                </Form.Item>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      className="bg-[#1C325B] hover:bg-[#1C325B]/90"
                  >
                    {productId ? 'Update Product' : 'Create Product'}
                  </Button>

                  {productId && (
                      <Button
                          onClick={handleArchiveToggle}
                          size="large"
                          className={`border border-gray-200 ${
                              product.isActive
                                  ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                  : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                          }`}
                      >
                        {product.isActive ? 'Archive Product' : 'Unarchive Product'}
                      </Button>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default EditProductForm;