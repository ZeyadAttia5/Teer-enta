import axios  from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getTransportations = async () => {
    return await axios.get(`${API_BASE_URL}/transportation`);
}

export const getTransportation = async (transportationId) => {
    return await axios.get(`${API_BASE_URL}/transportation/${transportationId}`);
}

export const createTransportation = async (transportation) => {
    return await axios.post(
      `${API_BASE_URL}/transportation/create`,
      transportation,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
}

export const bookTransportation = async ({id ,promoCode}) => {
    return await axios.post(`${API_BASE_URL}/transportation/book/${id}`, {promoCode:promoCode}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const getBookedTransportations = async () => {
    return await axios.get(`${API_BASE_URL}/transportation/booked/all`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}