import {TActivity} from "../types/Activity/Activity";
// import http from "./http";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;
const user = JSON.parse(localStorage.getItem("user") || "{}");
const token = localStorage.getItem("accessToken");

const getActivities = async () =>
    await axios.get<TActivity[]>(`${API_BASE_URL}/activity`);

const getTouristActivities = async () => {
    return await axios.get(`${API_BASE_URL}/activity/`, {
        params: {populate: "category preferenceTags"},
    });
}

const getMyActivities = async () => {
    return await axios.get<TActivity[]>(`${API_BASE_URL}/activity/my`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
};

const getUnActiveActivities = async () => {
    return await axios.get<TActivity[]>(`${API_BASE_URL}/activity/unactive`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
};
const getUpcomingActivities = async () =>
    await axios.get<TActivity[]>(`${API_BASE_URL}/activity/upcoming`);

const getBookedActivities = async () =>
    await axios.get<TActivity[]>(`${API_BASE_URL}/activity/booked`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

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

const bookActivity = async (activityId: string | number, paymentMethod ,promoCode ) =>
    await axios.post<TActivity>(
        `${API_BASE_URL}/activity/book/${activityId}`,
        {paymentMethod: paymentMethod , promoCode: promoCode},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );

const cancleActivityBooking = async (activityId: string | number) =>
    await axios.patch<TActivity>(
        `${API_BASE_URL}/activity/cancel/book/${activityId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

export const getActivityRatings = async (activityId) => {
    const response = await axios.get(`${API_BASE_URL}/activity/${activityId}/ratings`);
    return response.data;
};

export const addRatingToActivity = async (activityId, rating) => {
    const response = await axios.post(`${API_BASE_URL}/activity/${activityId}/rate`,
        {rating},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    return response.data;
};

export const getActivityComments = async (activityId) => {
    const response = await axios.get(`${API_BASE_URL}/activity/${activityId}/comments`);
    return response.data;
};

export const addCommentToActivity = async (activityId, comment) => {
    const response = await axios.post(`${API_BASE_URL}/activity/${activityId}/comment`,
        {comment},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });
    return response.data;
};


export const flagActivity = async (activityId) => {
    const response = await axios.patch(
        `${API_BASE_URL}/activity/flagInappropriate/${activityId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
    return response.data;
}

// getFlaggedActivities
export const getFlaggedActivities = async () => {
    const response = await axios.get(`${API_BASE_URL}/activity/flagged`);
    return response.data;
};

// unFlagActivity
export const UnFlagActivity = async (activityId) => {
    const response = await axios.patch(
        `${API_BASE_URL}/activity/UnFlagInappropriate/${activityId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
    return response.data;
}

// activate activity
export const activateActivity = async (activityId) => {
    const response = await axios.post(
        `${API_BASE_URL}/activity/activate/${activityId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        }
    );
    return response.data;
}


export {
    getActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getUpcomingActivities,
    getMyActivities,
    getBookedActivities,
    getActivity,
    getTouristActivities,
    bookActivity,
    cancleActivityBooking,
    getUnActiveActivities,
};
