import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getComplaints = async () => {
    return await axios.get(`${API_BASE_URL}/complaint/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    }) ;
}

export const getComplaint = async (complaintId) => {
    return await axios.get(`${API_BASE_URL}/complaint/one/${complaintId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}
// for tourist to get his complaints
export const getMyComplaints = async () => {
    return await axios.get(`${API_BASE_URL}/complaint/my`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const addComplaint = async (complaint) => {
    return await axios.post(`${API_BASE_URL}/complaint/create`, complaint, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

// here for Mark complaint as pending/resolved and Reply to any complaints issued
export const updateComplaint = async (complaint) => {
    return await axios.put(`${API_BASE_URL}/complaint/update/${complaint._id}`, complaint, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}