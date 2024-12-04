import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getPromoCodes = async () => {
    return axios.get(`${API_BASE_URL}/promoCode`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    });
}


export const createPromoCode = async (promoCodeData) => {
    return axios.post(`${API_BASE_URL}/promoCode/create`, promoCodeData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }
        );
};

export const applyPromoCode = async (code) => {
    return axios.post(`${API_BASE_URL}/promoCode/apply`, { promoCode: code },         {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }
    );
};

export const latestPromoCode = async () => {
    return await axios.get(`${API_BASE_URL}/promoCode/latestPromoCode`, {})
}
