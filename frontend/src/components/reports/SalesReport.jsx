import React, { useEffect, useState } from "react";
import {
  getActivityReport,
  getItineraryReport,
  getOrderReport,
  getTransportationReport,
} from "../../api/statistics.ts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Select, Typography } from "antd";

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
// const idKey = "itineraryId";
// const nameKey = "itineraryName";
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
    if (isMonthlyReports)
        return transformDataMarkII()
    transformData();
  }, [data, selectedMonth, selectedItem]);

  const transformData = () => {
    let res = {};
    data.forEach(({ revenueByMonth = [] }) => {
      revenueByMonth.forEach(({ year, month, revenue }) => {
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
    data?.monthlyReports.forEach(({ year, month, revenue }) => {
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
    <div className="flex-1 min-w-[500px] flex flex-col border p-2 border-black shadow-lg hover:scale-105 transition-all ">
      <Typography.Title className="text-center">{title}</Typography.Title>
      <Typography.Title level={5} sx={{ flex: 1 }}>
        Total Revenue for {selectedItem.label} in {selectedMonth.label} months:{" "}
        {modifiedData.reduce((a, b) => a + b.revenue, 0)}
      </Typography.Title>
      <div className="flex self-end gap-2 w-full items-center ">
        <Select
          options={months.map((month, index) => ({
            value: index,
            label: month,
          }))}
          value={selectedMonth}
          onChange={(_, obj) => setSelectedMonth(obj)}
          placeholder="Select Month"
        />
        {!isMonthlyReports && (
            <Select
              options={[
                ...data.map((item, index) => ({
                  value: item[idKey],
                  label: item[nameKey],
                })),
                { value: -1, label: "ALL" },
              ]}
              value={selectedItem}
              onChange={(_, obj) => setSelectedItem(obj)}
              // placeholder="Select Iterna"
            />
        )}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          //   width={730}
          //   height={250}
          data={modifiedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReport;
