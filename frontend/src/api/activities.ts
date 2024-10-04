// Fetch Activities

import axios from 'axios';
import { TActivity } from '../types/Activity/Activity';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getActivities = async () : Promise<TActivity[]> => {
    const response = await axios.get(`${API_BASE_URL}/activity`);
    return response.data;
  };
  
