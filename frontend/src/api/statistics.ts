import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getTotalUsers = async () =>
  await axios.get(`${API_BASE_URL}/statistics/totalUsers`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

export const getNewUsersPerMonth = async () =>
  await axios.get(`${API_BASE_URL}/statistics/newUsersPerMonth`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

export const getItineraryReport = async () =>
  await axios.get(`${API_BASE_URL}/statistics/report/itinerary`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

// reports/activity
export const getActivityReport = async () =>
  await axios.get(`${API_BASE_URL}/statistics/report/activity`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

// reports/transportation
export const getTransportationReport = async () =>
  await axios.get(`${API_BASE_URL}/statistics/report/transportation`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

// report/order
export const getOrderReport = async () =>
  await axios.get(`${API_BASE_URL}/statistics/report/order`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
