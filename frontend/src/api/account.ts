import axios from "axios";


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getUsers = async () => {
    return await axios.get(`${API_BASE_URL}/account/all`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const getPendingAccounts = async () => {
    return await axios.get(`${API_BASE_URL}/account/pending`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}
export const addUser = async (user) => {
    // console.log(localStorage.getItem("accessToken"));
    return await axios.post(`${API_BASE_URL}/account/create`, user, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    })

}

export const getSuggestedActivites = async () => {
    return await axios.get(`${API_BASE_URL}/account/suggestedActivites`, {
        headers:{
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    }) ;
}

export const getSuggestedItinerary = async ()  => {
    return await axios.get(`${API_BASE_URL}/account/suggestedItinerary`, {
        headers:{
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    })
}

export const acceptUser = async (userId) => {
    return await axios.patch(`${API_BASE_URL}/account/accept/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}

export const getAllAccountsDeletionRequests = async () => {
    return await axios.get(`${API_BASE_URL}/account/requestedAccountsDeletion`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const approveAccountDeletion = async (id) => {
    return await axios.delete(`${API_BASE_URL}/account/approveDeleteRequest/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
};

export const rejectAccountDeletion = async (id) => {
    return await axios.delete(`${API_BASE_URL}/account/rejectDeleteRequest/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
};

export const rejectUser = async (userId) => {
    return await axios.patch(`${API_BASE_URL}/account/reject/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const deleteUser = async (userId) => {
    return await axios.delete(`${API_BASE_URL}/account/delete/${userId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

// body here should look like this
// preferences:{
//     preferenceTags: [id1, id2, id3],
//     activityCategories: [id1, id2, id3]
// }
export const chooseMyPreferences = async (preferences) => {
    return await axios.post(`${API_BASE_URL}/account/choosePreferences`, preferences, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const redeemPoints = async (userId: number) => {
    return await axios.patch(`${API_BASE_URL}/account/redeemPoints`, userId, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

// will return two Arrays, one for preferenceTags and one for activityCategories
export const getAllPreferences = async () => {
    return await axios.get(`${API_BASE_URL}/account/preferences`);
}

export const requestAccountDeletion = async () => {
    return await axios.post(`${API_BASE_URL}/account/requestAccountDeletion`,{},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            }
        }
    );
}

export const getCurrency = async () => {
    return await axios.get(`${API_BASE_URL}/currency/getMyCurrency`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return await axios.post(`${API_BASE_URL}/upload/file`, formData);
}

export const uploadFiles = async (files) => {
    const formData = new FormData();
    formData.append('files', files);
    files.forEach((file) => formData.append('files', file));
    return await axios.post(`${API_BASE_URL}/upload/files`, formData);
}

