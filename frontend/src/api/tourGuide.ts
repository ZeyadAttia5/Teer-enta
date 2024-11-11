import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const token = localStorage.getItem('accessToken');

export const rateTourGuide = async (tourGuideId, rating) => {
    const response = await axios.post(`${API_BASE_URL}/tourGuide/${tourGuideId}/rate`,
    { rating }, 
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getRatingsForTourGuide = async (tourGuideId) => {
    const response = await axios.get(`${API_BASE_URL}/tourGuide/${tourGuideId}/ratings`);
    return response.data;
};

export const commentOnTourGuide = async (tourGuideId, comment) => {
    const response = await axios.post(`${API_BASE_URL}/tourGuide/${tourGuideId}/comment`,
    { comment }, 
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getCommentsForTourGuide = async (tourGuideId) => {
    const response = await axios.get(`${API_BASE_URL}/tourGuide/${tourGuideId}/comments`);
    return response.data;
};
