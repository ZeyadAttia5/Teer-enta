import React from "react";
import NewUsersReport from "./NewUsersReport";
import { Typography } from "antd";
import SalesReport from "./SalesReport";
import {
  getActivityReport,
  getItineraryReport,
  getNewUsersPerMonth,
  getTransportationReport,
  getOrderReport,
  getAdminRevenue,
} from "../../api/statistics.ts";

const charts = [
  {
    title: "Admin Revenue Report",
    component: SalesReport,
    api_func: getAdminRevenue,
    roles: ["admin"],
    isMonthlyReports: true,
    idKey: null,
    nameKey: null,
  },
  {
    title: "Newly Registered Users",
    component: NewUsersReport,
    api_func: getNewUsersPerMonth,
    roles: ["admin"],
  },
  {
    title: "Iternary Sales",
    component: SalesReport,
    api_func: getItineraryReport,
    roles: ["tourguide"],
    idKey: "itineraryId",
    nameKey: "itineraryName",
  },
  {
    title: "Activity Sales",
    component: SalesReport,
    api_func: getActivityReport,
    roles: ["advertiser"],
    idKey: "activityId",
    nameKey: "activityName",
  },
  {
    title: "Transportation Sales",
    component: SalesReport,
    api_func: getTransportationReport,
    roles: ["advertiser"],
    idKey: "transportationId",
    nameKey: "transportationName",
  },
  {
    title: "Order Report",
    component: "area",
    api_func: getOrderReport,
    roles: ["admin", "seller"],
    idKey: "productId",
    nameKey: "productName",
  },
];

const UserReport = () => {
  const role = JSON.parse(localStorage.getItem("user"))?.userRole;
  console.log(role);
  return (
    <div>
      <header className="text-center">
        <Typography.Title className="text-center">Dashboard 📈</Typography.Title>
      </header>
      <main className="flex p-6 flex-wrap gap-5">
        {charts.map((chart, index) => {
          let Component = chart.component;
          if (chart.roles.includes(role.toLowerCase())) {
            return <Component key={index} {...chart} />;
          }
        })}
      </main>
    </div>
  );
};

export default UserReport;
