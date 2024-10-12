import axios  from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const bookTransportation = async (transportationId) => {
    return await axios.post(`${API_BASE_URL}/transportation/book/${transportationId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}