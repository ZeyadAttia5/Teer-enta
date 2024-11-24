import axios, { AxiosResponse } from "axios";


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getAllMyNotifications = async () => {
    return await axios.get(
      `${API_BASE_URL}/notification/my`,
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
}

export const createNotificationRequest = async (activityId) => {
    return await axios.post(
      `${API_BASE_URL}/notification/createRequest`,
        activityId,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
}

export const markAllAsReadd = async () => {
    return await axios.post(
      `${API_BASE_URL}/notification/markAllAsRead`,
      {},
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
}
export const markAsReadd = async (notificationId) => {
    return await axios.post(
      `${API_BASE_URL}/notification/markAsRead/${notificationId}`,
      {},
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
}
// for test
export const sendNotifications = async ({title , body ,tokens}) => {
    return await axios.post(
      `${API_BASE_URL}/notification/send`,
        {title:title , body:body , tokens:tokens},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
}

export const saveFCMTokenToServer = async (token) => {
    return await axios.post(
      `${API_BASE_URL}/notification/saveFCMToken`,
        {token},
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
      }
      );
}

export const deleteNotification = async (notificationId) => {
    return await axios.delete(
      `${API_BASE_URL}/notification/delete/${notificationId}`,
      {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
}
