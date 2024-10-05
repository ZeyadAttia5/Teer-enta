import axios from 'axios';

import { TActivityCategory } from '../types/Activity/ActivityCategory';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const user = JSON.parse(localStorage.getItem('user') || '{}');

const token = localStorage.getItem('accessToken');

export const getActivityCategories = async () : Promise<TActivityCategory[]> => {
    const response = await axios.get(`${API_BASE_URL}/activityCategory`);
    return response.data;
};

export const createActivityCategory = async (activityCategory: TActivityCategory) : Promise<TActivityCategory> => {
    const response = await axios.post(`${API_BASE_URL}/activityCategory/create`, activityCategory, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const updateActivityCategory = async (activityCategory: TActivityCategory, activityCategoryId: string | Number) : Promise<TActivityCategory> => {
    const response = await axios.put(`${API_BASE_URL}/activityCategory/update/${activityCategoryId}`, activityCategory, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deleteActivityCategory = async (activityCategoryId: string | Number) : Promise<TActivityCategory> => {
    const response = await axios.delete(`${API_BASE_URL}/activityCategory/delete/${activityCategoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}