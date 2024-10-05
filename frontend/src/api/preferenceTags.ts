import axios, { AxiosResponse } from "axios";
import { TPreferenceTag } from "../types/Itinerary/PreferenceTag";


const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("accessToken");

export const getPreferenceTags = async () =>
  await axios.get<TPreferenceTag[]>(`${BASE_URL}/preferenceTag/`);

export const createPreferenceTag = async (preferenceTag: TPreferenceTag) =>
    await axios.post<TPreferenceTag>(`${BASE_URL}/preferenceTag/create`, preferenceTag,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

export const updatePreferenceTag = async (preferenceTag: TPreferenceTag) =>
    await axios.put<TPreferenceTag>(`${BASE_URL}/preferenceTag/update/`+preferenceTag._id, preferenceTag,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

export const deletePreferenceTag = async (id: number) =>
    await axios.delete<TPreferenceTag>(`${BASE_URL}/preferenceTag/delete/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

