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
import { Select, Typography } from "antd";
import {CalendarOutlined, FilterOutlined, FundOutlined} from "@ant-design/icons";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "ALL",
];

const SalesReport = ({
  api_func,
  title,
  idKey = "itineraryId",
  nameKey = "itineraryName",
  isMonthlyReports = false,
}) => {
  const [data, setData] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState({
    value: 12,
    label: "ALL",
  });
  const [selectedItem, setSelectedItem] = useState({
    value: -1,
    label: "ALL",
  });
  useEffect(() => {
    api_func().then((res) => {
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    if (isMonthlyReports) return transformDataMarkII();
    transformData();
  }, [data, selectedMonth, selectedItem]);

  const transformData = () => {
    let res = {};
    data.forEach(({ revenueByMonth = [] }) => {
      revenueByMonth.forEach(({ year, month, revenue }) => {
        if (!year || !month) return;
        if (year in res) {
          if (month in res[year]) res[year][month] += revenue;
          else res[year][month] = revenue;
        } else res[year] = { [month]: revenue };
      });
    });
    let finalAnswer = [];
    Object.keys(res).forEach((year) => {
      year = parseInt(year);
      Object.keys(res[year]).forEach((month) => {
        month = parseInt(month);
        finalAnswer.push({
          year,
          month,
          label: `${months[month]} ${year}`,
          revenue: res[year][month],
        });
      });
    });

    finalAnswer.sort((a, b) => a.year - b.year || a.month - b.month);
    if (selectedMonth.value === 12 && selectedItem.value === -1)
      setModifiedData(finalAnswer);
    else if (selectedMonth.value !== 12 && selectedItem.value !== -1)
      // both month and item is selected
      setModifiedData(
        data
          .find((item) => item[idKey] === selectedItem.value)
          ?.revenueByMonth.filter((item) => item.month === selectedMonth.value)
          .map(({ year, month, revenue }) => ({
            year,
            month,
            revenue,
            label: `${months[month]} ${year}`,
          }))
          .sort((a, b) => a.year - b.year || a.month - b.month)
      );
    else if (selectedItem.value === -1)
      setModifiedData(
        finalAnswer.filter((item) => item.month === selectedMonth.value)
      );
    else if (selectedMonth.value === 12) {
      // only one item is selected
      finalAnswer = data
        .find((item) => item[idKey] === selectedItem.value)
        .revenueByMonth.map(({ year, month, revenue }) => ({
          year,
          month,
          revenue,
          label: `${months[month]} ${year}`,
        }))
        .sort((a, b) => a.year - b.year || a.month - b.month);
      setModifiedData(finalAnswer);
    }
  };
  const transformDataMarkII = () => {
    let finalAnswer = [];
    data?.monthlyReports?.forEach(({ year, month, revenue }) => {
      if (year && month) {
        finalAnswer.push({
          year,
          month,
          label: `${months[month]} ${year}`,
          revenue,
        });
      }
    });
    finalAnswer.sort((a, b) => a.year - b.year || a.month - b.month);

    if (selectedMonth.value === 12) setModifiedData(finalAnswer);
    else
      setModifiedData(
        finalAnswer.filter((item) => item.month === selectedMonth.value)
      );
  };

  return (
      <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[500px] flex flex-col transition-all duration-300 border border-gray-100 hover:shadow-2xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <Typography.Title
              level={3}
              className="text-[#1C325B] m-0 flex items-center justify-center gap-2"
          >
            <FundOutlined className="text-emerald-500" />
            {title}
          </Typography.Title>
          <p className="text-gray-500 mt-2">Track and analyze your revenue metrics</p>
        </div>

        {/* Revenue Summary Card */}
        <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
          <p className="text-gray-200 mb-2 font-medium">
            Total Revenue for {selectedItem.label} in {selectedMonth.label}
          </p>
          <div className="text-2xl font-bold">
            ${modifiedData.reduce((a, b) => a + b.revenue, 0).toLocaleString()}
          </div>
        </div>

        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Select
              options={months.map((month, index) => ({
                value: index,
                label: month,
              }))}
              value={selectedMonth}
              onChange={(_, obj) => setSelectedMonth(obj)}
              placeholder="Select Month"
              className="w-full"
              size="large"
              suffixIcon={<CalendarOutlined />}
              dropdownStyle={{ padding: '8px', borderRadius: '8px' }}
          />
          {!isMonthlyReports && (
              <Select
                  options={[
                    ...data.map((item) => ({
                      value: item[idKey],
                      label: item[nameKey],
                    })),
                    { value: -1, label: "ALL" },
                  ]}
                  value={selectedItem}
                  onChange={(_, obj) => setSelectedItem(obj)}
                  className="w-full"
                  size="large"
                  suffixIcon={<FilterOutlined />}
                  dropdownStyle={{ padding: '8px', borderRadius: '8px' }}
              />
          )}
        </div>

        {/* Chart Section */}
        {modifiedData && (
            <div className="bg-white rounded-xl flex-1 p-4">
              <ResponsiveContainer width="100%" minHeight={400}>
                <AreaChart
                    data={modifiedData}
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
                      padding={{ left: 20, right: 20 }}
                  />
                  <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                      width={80}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                  />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 8px 16px -4px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#1C325B' }}
                      formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Legend
                      verticalAlign='bottom'
                      height={36}
                      wrapperStyle={{
                        paddingTop: '24px',
                        fontSize: '14px'
                      }}
                  />
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
        )}
      </div>
  );
};

export default SalesReport;
