import { TActivity } from "../types/Activity/Activity";
import http from "./http";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const getActivities = async () => await axios.get<TActivity[]>(`${API_BASE_URL}/activity`);
const getUpcomingActivities = async () =>
  await axios.get<TActivity[]>(`${API_BASE_URL}/activity/upcoming`);
const createActivity = async (activity: TActivity) =>
  await axios.post<TActivity>(`${API_BASE_URL}/activity`, activity);
const updateActivity = async (
  activity: TActivity,
  activityId: string | Number
) => await axios.put<TActivity>(`${API_BASE_URL}/activity/${activityId}`, activity);
const deleteActivity = async (activityId: string | Number) =>
  await axios.delete<TActivity>(`${API_BASE_URL}/activity/${activityId}`);

export {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getUpcomingActivities,
};
