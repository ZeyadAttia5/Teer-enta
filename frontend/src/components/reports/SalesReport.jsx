import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Select, Typography, Spin } from "antd";
import { CalendarOutlined, FilterOutlined, FundOutlined } from "@ant-design/icons";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December", "ALL"
];

const SalesReport = ({
                       api_func,
                       title,
                       idKey = "itineraryId",
                       nameKey = "itineraryName",
                       isMonthlyReports = false,
                     }) => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState({ value: 12, label: "ALL" });
  const [selectedItem, setSelectedItem] = useState({ value: -1, label: "ALL" });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [itemOptions, setItemOptions] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api_func();
      setRawData(response.data);

      if (!isMonthlyReports) {
        const options = response.data.map(item => ({
          value: item[idKey],
          label: item[nameKey]
        }));
        setItemOptions([...options, { value: -1, label: "ALL" }]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyReports = () => {
    if (!rawData?.monthlyReports) return [];

    let filteredData = rawData.monthlyReports;
    if (selectedMonth.value !== 12) {
      // Add 1 to match with actual month numbers (since months array is 0-based)
      filteredData = filteredData.filter(item => item.month === selectedMonth.value + 1);
    }

    return filteredData.map(({ year, month, revenue }) => ({
      year,
      month,
      revenue,
      label: `${months[month - 1]} ${year}`
    })).sort((a, b) => a.year - b.year || a.month - b.month);
  };

  const processItemizedReports = () => {
    if (!rawData.length) return [];

    let processedData = [];
    if (selectedItem.value === -1) {
      // Aggregate all items
      const revenueMap = new Map();

      rawData.forEach(item => {
        item.revenueByMonth.forEach(({ year, month, revenue }) => {
          const key = `${year}-${month}`;
          revenueMap.set(key, (revenueMap.get(key) || 0) + revenue);
        });
      });

      processedData = Array.from(revenueMap.entries()).map(([key, revenue]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          year,
          month,
          revenue,
          label: `${months[month - 1]} ${year}`
        };
      });
    } else {
      // Single item data
      const selectedItemData = rawData.find(item => item[idKey] === selectedItem.value);
      if (selectedItemData) {
        processedData = selectedItemData.revenueByMonth.map(({ year, month, revenue }) => ({
          year,
          month,
          revenue,
          label: `${months[month - 1]} ${year}`
        }));
      }
    }

    // Filter by month if specific month selected
    if (selectedMonth.value !== 12) {
      // Add 1 to match with actual month numbers (since months array is 0-based)
      processedData = processedData.filter(item => item.month === selectedMonth.value + 1);
    }

    return processedData.sort((a, b) => a.year - b.year || a.month - b.month);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newData = isMonthlyReports ? processMonthlyReports() : processItemizedReports();
    setChartData(newData);
    setTotalRevenue(newData.reduce((sum, item) => sum + item.revenue, 0));
  }, [rawData, selectedMonth, selectedItem]);

  const handleMonthChange = (_, obj) => {
    setSelectedMonth(obj);
  };

  const handleItemChange = (_, obj) => {
    setSelectedItem(obj);
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
    );
  }

  // Create month options with correct mapping
  const monthOptions = months.map((month, index) => ({
    value: index,
    label: month,
  }));

  return (
      <div className="bg-white rounded-2xl p-8 flex flex-col">
        <div className="mb-8 text-center">
          <Typography.Title level={3} className="text-[#1C325B] m-0 flex items-center justify-center gap-2">
            <FundOutlined className="text-emerald-500" />
            {title}
          </Typography.Title>
          <p className="text-gray-500 mt-2">Track and analyze your revenue metrics</p>
        </div>

        <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
          <p className="text-gray-200 mb-2 font-medium">
            Total Revenue for {selectedItem.label} in {selectedMonth.label}
          </p>
          <div className="text-2xl font-bold">
            ${totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Select
              suffixIcon={<CalendarOutlined />}
              options={monthOptions}
              value={selectedMonth.value}
              onChange={handleMonthChange}
              placeholder="Select Month"
              className="w-full"
              size="large"
          />
          {!isMonthlyReports && (
              <Select
                  suffixIcon={<FilterOutlined />}
                  options={itemOptions}
                  value={selectedItem.value}
                  onChange={handleItemChange}
                  className="w-full"
                  size="large"
              />
          )}
        </div>

        {chartData.length > 0 ? (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1C325B" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1C325B" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                      width={80}
                      tickFormatter={value => `$${value.toLocaleString()}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                      formatter={value => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                  <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1C325B"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No data available for the selected filters
            </div>
        )}
      </div>
  );
};

export default SalesReport;