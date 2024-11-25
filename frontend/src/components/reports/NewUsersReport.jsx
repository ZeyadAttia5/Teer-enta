import { Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
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
import { getNewUsersPerMonth, getTotalUsers } from "../../api/statistics.ts";

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

const NewUsersReport = ({ title }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsersPerMonth, setNewUsersPerMonth] = useState({});
  const [selectedYear, setSelectedYear] = useState(2024);
  const [loading, setLoading] = useState(true);

  const fetchTotalUsers = async () => {
    setLoading(true);
    try {
      const res = await getTotalUsers();
      setTotalUsers(res?.data?.totalUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchNewUsersPerMonth = async () => {
    setLoading(true);
    try {
      const res = await getNewUsersPerMonth();

      setNewUsersPerMonth(transformNewUsersData(res?.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchNewUsersPerMonth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-1 min-w-[500px] flex flex-col border p-2 border-black shadow-lg hover:scale-105 transition-all ">
      <Typography.Title  className="text-center text-lg">{title}</Typography.Title>
      <Select
        options={Object.keys(newUsersPerMonth).map((year) => ({
          value: year,
          label: year,
        }))}
        value={selectedYear}
        onChange={(value) => setSelectedYear(value)}
        className=" self-end"
      />
      <h1 className="text-center">Total Users: {totalUsers}</h1>
      <ResponsiveContainer width="100%" minHeight={400}>
      <BarChart
        // width={750}
        // height={500}
        className="size-fit"
        data={newUsersPerMonth[selectedYear]}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis dataKey={"totalUsers"} />
        <Tooltip />
        <Legend />
        {/* {/* <Bar dataKey="pv" fill="#8884d8" /> */}
        <Bar dataKey="totalUsers" fill="#82ca9d" />
      </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default NewUsersReport;
