import { AxiosResponse } from "axios";
import { TPreferenceTag } from "../types/Itinerary/PreferenceTag";

import http from "./http.ts";

export const getPreferenceTags = async () =>
  await http.get<TPreferenceTag[]>("/preferenceTag/");
