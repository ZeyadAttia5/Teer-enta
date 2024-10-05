import axios, { AxiosResponse } from "axios";
import { TPreferenceTag } from "../types/Itinerary/PreferenceTag";
import http from "./http.ts";


const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const token = localStorage.getItem("accessToken");

export const getPreferenceTags = async () =>
  await axios.get<TPreferenceTag[]>(`${BASE_URL}/preferenceTag/`,);

export const createPreferenceTag = async (preferenceTag: TPreferenceTag) =>
    await http.post<TPreferenceTag>(`${BASE_URL}/preferenceTag/create`, preferenceTag);

