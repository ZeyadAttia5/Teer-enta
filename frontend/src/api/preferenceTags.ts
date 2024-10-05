import axios, { AxiosResponse } from "axios";
import { TPreferenceTag } from "../types/Itinerary/PreferenceTag";

// import http from "./http";
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getPreferenceTags = async (): Promise<TPreferenceTag[]> => {
    const response = await axios.get<TPreferenceTag[]>(`${API_BASE_URL}/preferenceTag/`);
    return response.data;
};