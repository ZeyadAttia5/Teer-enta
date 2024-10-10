import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getHistoricalPlaces = async () => {
    const response = await axios.get(`${API_BASE_URL}/historicalPlace`);
    return response;
};

export const getMyHistoricalPlaces = async () => {
    const response = await axios.get(`${API_BASE_URL}/historicalPlace/my`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response;
}

export const getHistoricalPlace = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/historicalPlace/one/${id}`);
    return response;
}

export const createHistoricalPlace = async (historicalPlace) => {
    const response = await axios.post(`${API_BASE_URL}/historicalPlace/create`, historicalPlace, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response ;
}

export const updateHistoricalPlace = async (id, historicalPlace) => {
    const response = await axios.put(`${API_BASE_URL}/historicalPlace/update/${id}`, historicalPlace, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response ;
}

export const deleteHistoricalPlace = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/historicalPlace/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
    return response ;
}