
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL

export const uploadImage = async (data: any): Promise<any> => {
    return axios.post(`${BASE_URL}/upload/file`, data)
}