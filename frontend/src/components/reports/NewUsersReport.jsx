import React, { useEffect, useState } from "react";
import { Select, Typography, Spin, ConfigProvider, Badge } from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  UserOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  UsergroupAddOutlined,
  RiseOutlined
} from "@ant-design/icons";
import { getNewUsersPerMonth, getTotalUsers } from "../../api/statistics.ts";

const { Title } = Typography;

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const transformNewUsersData = (data) => {
  let res = {};
  data.forEach(({ _id: { year, month }, totalUsers }) => {
    if (year in res)
      res[year].push({ month, totalUsers, label: months[month - 1] });
    else res[year] = [{ month, label: months[month - 1], totalUsers }];
  });

  Object.keys(res).forEach((year) =>
      res[year].sort((a, b) => a.month - b.month)
  );

  return res;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="text-[#1C325B] font-bold mb-2">{label}</p>
          <div className="flex items-center gap-2">
            <Badge color="#1C325B" />
            <span className="text-emerald-600 font-semibold">
            {payload[0].value.toLocaleString()} New Users
          </span>
          </div>
        </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, prefix, suffix, trend, className }) => (
    <div className={`bg-white p-6 rounded-lg border border-gray-100 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {prefix}
        <span className="text-gray-600 font-medium">{title}</span>
      </div>
      <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-[#1C325B]">
        {value.toLocaleString()}
      </span>
        {suffix && (
            <span className="text-sm font-medium text-gray-500">
          {suffix}
        </span>
        )}
      </div>
      {trend && (
          <div className={`mt-2 text-sm font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span className="ml-1">{Math.abs(trend).toFixed(1)}% from last month</span>
          </div>
      )}
    </div>
);

const NewUsersReport = ({ title }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersPerMonth, setNewUsersPerMonth] = useState({});
  const [selectedYear, setSelectedYear] = useState(2024);
  const [loading, setLoading] = useState(true);
  const [growthRate, setGrowthRate] = useState(0);

  const fetchTotalUsers = async () => {
    try {
      const res = await getTotalUsers();
      setTotalUsers(res?.data?.totalUsers);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  const fetchNewUsersPerMonth = async () => {
    try {
      const res = await getNewUsersPerMonth();
      const transformedData = transformNewUsersData(res?.data);
      setNewUsersPerMonth(transformedData);

      // Calculate growth rate
      if (transformedData[selectedYear]) {
        const currentMonth = transformedData[selectedYear].slice(-1)[0];
        const previousMonth = transformedData[selectedYear].slice(-2)[0];
        if (currentMonth && previousMonth) {
          const growth = ((currentMonth.totalUsers - previousMonth.totalUsers) / previousMonth.totalUsers) * 100;
          setGrowthRate(growth);
        }
      }
    } catch (error) {
      console.error("Error fetching monthly users:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTotalUsers(), fetchNewUsersPerMonth()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-sm">
          <Spin size="large" />
        </div>
    );
  }

  return (
      <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[500px] flex flex-col transition-all duration-300 border border-gray-100 hover:shadow-2xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <Typography.Title
              level={3}
              className="text-[#1C325B] m-0 flex items-center justify-center gap-2"
          >
            <UsergroupAddOutlined className="text-emerald-500" />
            {title}
          </Typography.Title>
          <p className="text-gray-500 mt-2">Track and analyze user growth metrics</p>
        </div>

        {/* Users Summary Card */}
        <div className="bg-gradient-to-r from-[#1C325B] to-[#2A4575] rounded-xl p-6 mb-8 text-white">
          <p className="text-gray-200 mb-2 font-medium">Total Users Growth</p>
          <div className="text-2xl font-bold">
            {totalUsers.toLocaleString()} Users
          </div>
          <div className="mt-2 text-sm font-medium flex items-center gap-1">
            {growthRate >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span>{Math.abs(growthRate).toFixed(1)}% from last month</span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="mb-8">
          <Select
              suffixIcon={<CalendarOutlined />}
              options={Object.keys(newUsersPerMonth).map((year) => ({
                value: year,
                label: `Year ${year}`,
              }))}
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              className="w-full"
              size="large"
              dropdownStyle={{ padding: '8px', borderRadius: '8px' }}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl flex-1 p-4">
          <ResponsiveContainer width="100%" minHeight={400}>
            <BarChart
                data={newUsersPerMonth[selectedYear]}
                margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
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
                  tickFormatter={(value) => value.toLocaleString()}
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
                  formatter={(value) => [value.toLocaleString(), "Users"]}
              />
              <Legend
                  verticalAlign='bottom'
                  height={36}
                  wrapperStyle={{
                    paddingTop: '24px',
                    fontSize: '14px'
                  }}
              />
              <Bar
                  dataKey="totalUsers"
                  name="New Users"
                  fill="url(#colorUsers)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
};

export default NewUsersReport;