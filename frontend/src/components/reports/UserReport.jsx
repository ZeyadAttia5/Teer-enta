import React from "react";
import NewUsersReport from "./NewUsersReport";
import { Typography } from "antd";
import SalesReport from "./SalesReport";

const UserReport = () => {
  return (
    <main className="grid p-6 grid-cols-[repeat(auto-fill,minmax(400x,1fr))]">
      <Typography.Title className="text-center">User Report</Typography.Title>
      <NewUsersReport />
      <SalesReport />
    </main>
  );
};

export default UserReport;
