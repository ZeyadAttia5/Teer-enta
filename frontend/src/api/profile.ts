import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getProfile = async (userId) => {
    return await axios.get(`${API_BASE_URL}/profile/${userId}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const updateProfilee = async (data, userId) => {
    return await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/profile/update/${userId}`,
        data ,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
        }
    );
}