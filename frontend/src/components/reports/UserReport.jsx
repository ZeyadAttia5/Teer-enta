import React, { useState, useEffect } from "react";
import { Card, Typography, Select, Button, Row, Col } from "antd";
import { FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import NewUsersReport from "./NewUsersReport";
import SalesReport from "./SalesReport";
import {
  getActivityReport,
  getItineraryReport,
  getNewUsersPerMonth,
  getTransportationReport,
  getOrderReport,
  getAdminRevenue,
} from "../../api/statistics.ts";

const { Title } = Typography;

const charts = [
  {
    title: "Admin Revenue Report",
    component: SalesReport,
    api_func: getAdminRevenue,
    roles: ["admin"],
    isMonthlyReports: true,
    idKey: null,
    nameKey: null,
    category: "revenue",
  },
  {
    title: "Newly Registered Users",
    component: NewUsersReport,
    api_func: getNewUsersPerMonth,
    roles: ["admin"],
    category: "users",
  },
  {
    title: "Itinerary Sales",
    component: SalesReport,
    api_func: getItineraryReport,
    roles: ["tourguide"],
    idKey: "itineraryId",
    nameKey: "itineraryName",
    category: "Itinerary Sales",
  },
  {
    title: "Activity Sales",
    component: SalesReport,
    api_func: getActivityReport,
    roles: ["advertiser"],
    idKey: "activityId",
    nameKey: "activityName",
    category: "Activity Sales",
  },
  {
    title: "Transportation Sales",
    component: SalesReport,
    api_func: getTransportationReport,
    roles: ["advertiser"],
    idKey: "transportationId",
    nameKey: "transportationName",
    category: "Transportation Sales",
  },
  {
    title: "Order Report",
    component: SalesReport,
    api_func: getOrderReport,
    roles: ["admin", "seller"],
    idKey: "productId",
    nameKey: "productName",
    category: "Order sales",
  },
];

const UserReport = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [categories, setCategories] = useState([]);
  const role =
    JSON.parse(localStorage.getItem("user"))?.userRole?.toLowerCase() || "";

  useEffect(() => {
    if (!role) return;

    let filtered = charts.filter((chart) => chart.roles.includes(role));

    const newCategories = [
      "all",
      ...new Set(filtered.map((chart) => chart.category)),
    ];
    setCategories(newCategories);

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (chart) => chart.category === selectedCategory
      );
    }

    setFilteredCharts(filtered);
  }, [selectedCategory, role]);

  // Reset the category selection
  const handleReset = () => {
    setSelectedCategory("all");
  };

  return (
    <div className="flex justify-center">
      <div className="w-[90%] p-6">
        {/* Header Card */}
        <div className="max-w-[1200px] mx-auto mb-6">
          <Card bordered={false} className="shadow-sm bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
              <Title level={2} className="!mb-0">
                📈 Analytics Dashboard
              </Title>
              {(role === "admin" || role === "advertiser") && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <FilterOutlined className="text-gray-500 text-lg" />
                    <Select
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      style={{ width: 180 }}
                      size="large"
                      options={categories.map((category) => ({
                        value: category,
                        label:
                          category.charAt(0).toUpperCase() + category.slice(1),
                      }))}
                    />
                  </div>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    size="large"
                    className="flex items-center"
                  >
                    Reset
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="max-w-[1200px] mx-auto">
          <Row gutter={[16, 16]} justify="center" className="items-stretch">
            {filteredCharts.map((chart, index) => {
              const Component = chart.component;
              // If there's only one chart, make it full width
              // If there are 2 charts, each takes half width
              // If there are 3 or more, they take up half width each in two columns
              const colSpan = filteredCharts.length === 1 ? 24 : 12;

              return (
                <Col
                  xs={24}
                  xl={colSpan}
                  key={index}
                  className={`flex ${
                    filteredCharts.length === 1 ? "justify-center" : ""
                  }`}
                >
                  <Card
                    bordered={false}
                    className={`shadow-sm hover:shadow-md transition-all duration-300 bg-white
                  ${filteredCharts.length === 1 ? "w-2/3" : "w-full"}`}
                    title={
                      <span className="text-lg font-medium text-gray-800">
                        {chart.title}
                      </span>
                    }
                    bodyStyle={{
                      padding: 24,
                      minHeight: 400,
                    }}
                    headStyle={{
                      borderBottom: "1px solid #f0f0f0",
                      padding: "16px 24px",
                    }}
                  >
                    <div className="">
                      <Component {...chart} className="" />
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default UserReport;
