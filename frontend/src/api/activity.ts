import { TActivity } from "../types/Activity/Activity";
// import http from "./http";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const user = JSON.parse(localStorage.getItem("user") || "{}");
const token = localStorage.getItem("accessToken");

const getActivities = async () =>
  await axios.get<TActivity[]>(`${API_BASE_URL}/activity`);

const getTouristActivities = async () =>{
   return await axios.get(`${API_BASE_URL}/activity/`, {
        params: { populate: "category preferenceTags" },
    });
}

const getMyActivities = async () => {
  return await axios.get<TActivity[]>(`${API_BASE_URL}/activity/my`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
};
const getUpcomingActivities = async () =>
  await axios.get<TActivity[]>(`${API_BASE_URL}/activity/upcoming`);

const createActivity = async (activity: TActivity) =>
  // console.log(activity)
  await axios.post<TActivity>(`${API_BASE_URL}/activity/create`, activity, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

const updateActivity = async (
  activity: TActivity,
  activityId: string | Number
) =>
  await axios.put<TActivity>(
    `${API_BASE_URL}/activity/update/${activityId}`,
    activity,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

const deleteActivity = async (activityId: string | Number) =>
  await axios.delete<TActivity>(
    `${API_BASE_URL}/activity/delete/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

// use the endpoint /activity/one/:id to get a single activity by its id
const getActivity = async (id: string | number) =>
  await axios.get<TActivity>(`${API_BASE_URL}/activity/one/${id}`);

export {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getUpcomingActivities,
  getMyActivities,
  getActivity,
    getTouristActivities
};
