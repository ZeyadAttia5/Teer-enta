import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getProfile = async (userId) => {
  return await axios.get(`${API_BASE_URL}/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
};

export const updateProfilee = async (data, userId) => {
  return await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/Profile/update/${userId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const updateProfilePicture = async (data, userId) => {
  return await axios.put(
    `${process.env.REACT_APP_BACKEND_URL}/Profile/update/picture/${userId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const getAllCurrencies = async () => {
  return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/currency`);
};

export const getMyCurrency = async () => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/currency/getMyCurrency`,

    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const chooseMyCurrency = async (id) => {
  return await axios.patch(
    `${process.env.REACT_APP_BACKEND_URL}/account/chooseCurrency/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const saveActivity = async (activityId) => {
  return await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/Profile/save/activity/${activityId}`,
    activityId,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const getSavedActivities = async () => {
  return await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/Profile/saved/activities`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
};

export const getAllAddresses = async () => {
    return await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/Profile/all/addresses`,
        {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        }
    );
}

export const addAddress = async (data) => {
    return await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/Profile/add/address`,
        data,
        {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        }
    );
}