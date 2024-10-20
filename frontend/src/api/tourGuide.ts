import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const token = localStorage.getItem('accessToken');

export const rateTourGuide = async (tourGuideId, rating) => {
    const response = await axios.post(`${API_BASE_URL}/tourGuides/${tourGuideId}/rate`, 
    { rating }, 
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getRatingsForTourGuide = async (tourGuideId) => {
    const response = await axios.get(`${API_BASE_URL}/tourGuides/${tourGuideId}/ratings`);
    return response.data;
};

export const commentOnTourGuide = async (tourGuideId, comment) => {
    const response = await axios.post(`${API_BASE_URL}/tourGuides/${tourGuideId}/comment`, 
    { comment }, 
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const getCommentsForTourGuide = async (tourGuideId) => {
    const response = await axios.get(`${API_BASE_URL}/tourGuides/${tourGuideId}/comments`);
    return response.data;
};
