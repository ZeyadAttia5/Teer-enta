import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const login =async (details)=> {
    return await axios.post(`${API_BASE_URL}/auth/login`, details);
}

export const signup = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/signup`, data);
}

export const changePassword = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/changePassword`, data ,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const toggleFirstLoginAndUpdatePrefrences = async ({prefrences,accessToken}) => {
    return await axios.post(`${API_BASE_URL}/auth/toggleFirstLoginAndUpdatePrefrences`, {prefrences}, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export const forgotPassword = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/forgotPassword`, data);
}

export const resetPassword = async (data) => {
    return await axios.post(`${API_BASE_URL}/auth/resetPassword`, data);
}