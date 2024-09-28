import {TPreferenceTag} from "../types/Itinerary/PreferenceTag";

import http from './http'

export const getPreferenceTags = async (): Promise<TPreferenceTag[]> => {
    const response = await http.get<TPreferenceTag[]>('/preferenceTag/');
    return response.data;
};