import React, { useEffect, useState } from "react";
import { viewAvailableQuantityAndSales } from "../../api/products.ts"; // Adjust path if needed
import { Table } from "antd";

const QuantityAndSales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await viewAvailableQuantityAndSales();
        setData(response.data);
        console.log(response.data)
      } catch (err) {
        setError("Failed to load data");
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
    },
    {
      title: "Available Quantity",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
    },
  ];

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Table 
      dataSource={data} 
      columns={columns} 
      rowKey={(record) => record._id} 
      pagination={{ pageSize: 10 }} 
      className="mt-4"
    />
  );
};

export default QuantityAndSales;
