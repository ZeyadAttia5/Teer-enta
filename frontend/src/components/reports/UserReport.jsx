import React, { useState, useEffect } from "react";
import { Card, Typography, Select, Button, Row, Col, message } from "antd";
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
import TermsAndConditions from "../WelcomePage/TermsAndConditions/TermsAndConditions.js";

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
    category: "itinerary_sales",
  },
  {
    title: "Activity Sales",
    component: SalesReport,
    api_func: getActivityReport,
    roles: ["advertiser"],
    idKey: "activityId",
    nameKey: "activityName",
    category: "activity_sales",
  },
  {
    title: "Transportation Sales",
    component: SalesReport,
    api_func: getTransportationReport,
    roles: ["advertiser"],
    idKey: "transportationId",
    nameKey: "transportationName",
    category: "transportation_sales",
  },
  {
    title: "Order Report",
    component: SalesReport,
    api_func: getOrderReport,
    roles: ["admin", "seller"],
    idKey: "productId",
    nameKey: "productName",
    category: "order_sales",
  },
];

const UserReport = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredCharts, setFilteredCharts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user role from localStorage with proper error handling
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.userRole?.toLowerCase() || "";
    } catch (error) {
      console.error("Error parsing user data:", error);
      return "";
    }
  };

  const role = getUserRole();

  // Filter charts based on role and category
  const filterCharts = (role, category) => {
    if (!role) return [];

    try {
      let filtered = charts.filter((chart) => chart.roles.includes(role));

      if (category !== "all") {
        filtered = filtered.filter((chart) => chart.category === category);
      }

      return filtered;
    } catch (error) {
      console.error("Error filtering charts:", error);
      message.error("Error filtering reports");
      return [];
    }
  };

  // Update categories based on available charts
  const updateCategories = (availableCharts) => {
    try {
      const uniqueCategories = new Set(availableCharts.map((chart) => chart.category));
      return ["all", ...Array.from(uniqueCategories)];
    } catch (error) {
      console.error("Error updating categories:", error);
      return ["all"];
    }
  };

  useEffect(() => {
    if (!role) {
      setError("User role not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Filter charts based on role
      const roleFilteredCharts = charts.filter((chart) => chart.roles.includes(role));

      // Update categories
      const newCategories = updateCategories(roleFilteredCharts);
      setCategories(newCategories);

      // Apply category filter
      const filtered = filterCharts(role, selectedCategory);
      setFilteredCharts(filtered);
    } catch (error) {
      console.error("Error in useEffect:", error);
      setError("Error loading reports");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, role]);

  // Reset the category selection
  const handleReset = () => {
    try {
      setSelectedCategory("all");
      const filtered = filterCharts(role, "all");
      setFilteredCharts(filtered);
    } catch (error) {
      console.error("Error resetting filters:", error);
      message.error("Error resetting filters");
    }
  };

  // Check terms and conditions
  const user = JSON.parse(localStorage.getItem("user"));
  const [notAccepted, setNotAccepted] = useState(true);
  const needsToAcceptTerms = user &&
      (user.userRole === "TourGuide" || user.userRole === "Advertiser" || user.userRole === "Seller") &&
      !user.isTermsAndConditionsAccepted;

  const formatCategoryLabel = (category) => {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg">Loading reports...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
    );
  }

  return (
      <div className="flex justify-center">
        {notAccepted && needsToAcceptTerms && (
            <TermsAndConditions setNotAccepted={setNotAccepted} />
        )}

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
                            onChange={(value) => {
                              setSelectedCategory(value);
                            }}
                            style={{ width: 180 }}
                            size="large"
                            options={categories.map((category) => ({
                              value: category,
                              label: category === "all" ? "All Reports" : formatCategoryLabel(category)
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
                const colSpan = filteredCharts.length === 1 ? 24 : 12;

                return (
                    <Col
                        xs={24}
                        xl={colSpan}
                        key={index}
                        className={`flex ${filteredCharts.length === 1 ? "justify-center" : ""}`}
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
                          <Component
                              {...chart}
                              key={`${chart.title}-${selectedCategory}`}
                              className=""
                          />
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