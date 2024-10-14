import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const user = JSON.parse(localStorage.getItem("user") || "{}");

const token = localStorage.getItem("accessToken");

export const getTags = async () => await axios.get(`${API_BASE_URL}/tag`);

export const createTag = async (tag) =>
    await axios.post(`${API_BASE_URL}/tag/create`, tag, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

export const updateTag = async (tag, tagId) =>
    await axios.put(`${API_BASE_URL}/tag/update/${tagId}`, tag, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

export const deleteTag = async (tagId) =>
    await axios.delete(`${API_BASE_URL}/tag/delete/${tagId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });