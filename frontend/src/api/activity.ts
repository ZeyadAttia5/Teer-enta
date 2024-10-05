import { TActivity } from "../types/Activity/Activity";
// import http from "./http";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const user = JSON.parse(localStorage.getItem("user") || "{}");
const token = localStorage.getItem("accessToken");

const getActivities = async () =>
    await axios.get<TActivity[]>(`${API_BASE_URL}/activity`);
const getUpcomingActivities = async () =>
   await axios.get<TActivity[]>(`${API_BASE_URL}/activity/upcoming`);
const createActivity = async (activity: TActivity) =>
    // console.log(activity)
  await axios.post<TActivity>(`${API_BASE_URL}/activity/create`, activity ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
const updateActivity = async (
  activity: TActivity,
  activityId: string | Number
) => await axios.put<TActivity>(`${API_BASE_URL}/activity/update/${activityId}`, activity,{
    headers:
    {
      Authorization: `Bearer ${token}`,
    },
});
const deleteActivity = async (activityId: string | Number) =>
  await axios.delete<TActivity>(`${API_BASE_URL}/activity/delete/${activityId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getUpcomingActivities,
};
