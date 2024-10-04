import { TActivity } from "../types/Activity/Activity";
import http from "./http.ts";

const getActivities = async () => await http.get<TActivity[]>("/activity");
const getUpcomingActivities = async () =>
  await http.get<TActivity[]>("/activity/upcoming");
const createActivity = async (activity: TActivity) =>
  await http.post<TActivity>("/activity", activity);
const updateActivity = async (
  activity: TActivity,
  activityId: string | Number
) => await http.put<TActivity>(`/activity/${activityId}`, activity);
const deleteActivity = async (activityId: string | Number) =>
  await http.delete<TActivity>(`/activity/${activityId}`);

export {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getUpcomingActivities,
};
