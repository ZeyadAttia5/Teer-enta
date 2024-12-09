import React, { useEffect, useState } from "react";
import { Select, Typography, Spin, ConfigProvider, Badge, message } from "antd";
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
    if (!Array.isArray(data)) {
        console.error("Invalid data format received");
        return {};
    }

    let res = {};
    data.forEach((item) => {
        // Validate item structure
        if (!item?._id?.year || !item?._id?.month || !item.totalUsers) {
            console.warn("Skipping invalid data item:", item);
            return;
        }

        const year = item._id.year.toString();
        const month = parseInt(item._id.month);

        // Validate month number
        if (isNaN(month) || month < 1 || month > 12) {
            console.warn("Invalid month value:", month);
            return;
        }

        if (year in res) {
            res[year].push({
                month,
                totalUsers: item.totalUsers,
                label: months[month - 1]
            });
        } else {
            res[year] = [{
                month,
                label: months[month - 1],
                totalUsers: item.totalUsers
            }];
        }
    });

    // Sort data for each year
    Object.keys(res).forEach((year) => {
        res[year].sort((a, b) => a.month - b.month);
    });

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
        {trend !== undefined && (
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
    const [selectedYear, setSelectedYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const [growthRate, setGrowthRate] = useState(0);
    const [error, setError] = useState(null);

    const fetchTotalUsers = async () => {
        try {
            const res = await getTotalUsers();
            if (res?.data?.totalUsers) {
                setTotalUsers(res.data.totalUsers);
            } else {
                throw new Error("Invalid total users data");
            }
        } catch (error) {
            console.error("Error fetching total users:", error);
            message.error("Failed to fetch total users data");
            setError("Failed to load total users");
        }
    };

    const fetchNewUsersPerMonth = async () => {
        try {
            const res = await getNewUsersPerMonth();
            const transformedData = transformNewUsersData(res?.data || []);

            // Validate if we have any data
            if (Object.keys(transformedData).length === 0) {
                throw new Error("No valid user data available");
            }

            setNewUsersPerMonth(transformedData);

            // Set initial selected year if not set
            if (!selectedYear) {
                const years = Object.keys(transformedData);
                const currentYear = new Date().getFullYear().toString();
                setSelectedYear(years.includes(currentYear) ? currentYear : years[years.length - 1]);
            }

            // Calculate growth rate only if we have data
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
            message.error("Failed to fetch monthly user data");
            setError("Failed to load monthly data");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                await Promise.all([fetchTotalUsers(), fetchNewUsersPerMonth()]);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
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

    if (error) {
        return (
            <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-sm">
                <div className="text-red-500 text-center">
                    <p className="text-lg font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const yearOptions = Object.keys(newUsersPerMonth)
        .sort((a, b) => b - a) // Sort years in descending order
        .map((year) => ({
            value: year,
            label: `Year ${year}`,
        }));

    const hasData = selectedYear && newUsersPerMonth[selectedYear]?.length > 0;

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
            {hasData && (
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
            )}

            {/* Controls Section */}
            <div className="mb-8">
                <Select
                    suffixIcon={<CalendarOutlined />}
                    options={yearOptions}
                    value={selectedYear}
                    onChange={(value) => setSelectedYear(value)}
                    className="w-full"
                    size="large"
                    dropdownStyle={{ padding: '8px', borderRadius: '8px' }}
                />
            </div>

            {/* Chart Section */}
            {hasData ? (
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
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
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
            ) : (
                <div className="flex justify-center items-center h-64 text-gray-500">
                    No data available for the selected year
                </div>
            )}
        </div>
    );
};

export default NewUsersReport;