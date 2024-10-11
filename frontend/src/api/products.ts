import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getProducts = async () => {
    return await axios.get(`${API_BASE_URL}/product/`);
}

export const getProduct = async (productId) => {
    return await axios.get(`${API_BASE_URL}/product/one/${productId}`);
}

export const addProduct = async (product) => {
    return await axios.post(`${API_BASE_URL}/product/create`, product ,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const updateProduct = async (product, productId) => {
   return await axios.put(`${API_BASE_URL}/product/update/${productId}`, product ,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const archiveProduct = async (productId) => {
    return await axios.put(`${API_BASE_URL}/product/archive/${productId}`, null ,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const unArchiveProduct = async (productId) => {
    return await axios.put(`${API_BASE_URL}/product/unArchive/${productId}`, null ,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const viewAvailableQuantityAndSales = async () => {
    return await axios.get(`${API_BASE_URL}/product/salesAndQuantity`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}