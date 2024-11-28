import React, { useEffect, useState } from "react";
import { Table, Spin, ConfigProvider } from "antd";
import { viewAvailableQuantityAndSales } from "../../api/products.ts";
import {
  PackageIcon,
  ShoppingCart,
  BarChart2,
  AlertCircle,
  ArrowUpOutlined,
  ArrowDownOutlined
} from 'lucide-react';

const QuantityAndSales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewAvailableQuantityAndSales();
        setData(response.data);

        // Calculate totals
        const sales = response.data.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);
        const quantity = response.data.reduce((acc, curr) => acc + (curr.availableQuantity || 0), 0);
        setTotalSales(sales);
        setTotalQuantity(quantity);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
          <div className="flex items-center gap-2">
            <PackageIcon className="w-4 h-4 text-[#1C325B]" />
            <span className="font-medium">{text}</span>
          </div>
      ),
    },
    {
      title: "Available Quantity",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      render: (value) => (
          <div className="font-medium">
            {value.toLocaleString()}
          </div>
      ),
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (value) => (
          <div className="font-medium text-emerald-600">
            ${value.toLocaleString()}
          </div>
      ),
    },
  ];

  return (
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1C325B",
              borderRadius: 8,
            },
          }}
      >
        <div className="min-h-screen bg-gray-50/50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center gap-1 mb-2">
                  <BarChart2 className="w-6 h-6 text-white" />
                  <h1 className="text-2xl font-bold text-white">
                    Quantity and Sales Report
                  </h1>
                </div>
                <p className="text-gray-400">
                  Track your product inventory and sales performance
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <PackageIcon className="w-5 h-5 text-[#1C325B]" />
                    <span className="text-gray-600 font-medium">Total Quantity</span>
                  </div>
                  <div className="text-3xl font-bold text-[#1C325B]">
                    {totalQuantity.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-500" />
                    <span className="text-gray-600 font-medium">Total Sales</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    ${totalSales.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Table */}
              {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Spin size="large" />
                  </div>
              ) : error ? (
                  <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-3">
                    <AlertCircle className="w-12 h-12" />
                    <p className="font-medium text-lg">{error}</p>
                  </div>
              ) : (
                  <Table
                      dataSource={data}
                      columns={columns}
                      rowKey={(record) => record._id}
                      pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Total ${total} products`
                      }}
                      className="border border-gray-200 rounded-lg"
                      rowClassName="hover:bg-[#1C325B]/5"
                  />
              )}
            </div>
          </div>
        </div>
      </ConfigProvider>
  );
};

export default QuantityAndSales;