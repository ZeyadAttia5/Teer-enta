import axios  from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const getUsers = async () => {
    return  await axios.get(`${API_BASE_URL}/account/all`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const getPendingAccounts = async () =>{
   return  await axios.get(`${API_BASE_URL}/account/pending`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });
}
export const addUser = async (user) =>{
    console.log(localStorage.getItem("accessToken"));
    return await axios.post(`${API_BASE_URL}/account/create`, user,        {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    })

}

export const acceptUser = async (userId) =>{
   return await axios.patch(`${API_BASE_URL}/account/accept/${userId}`, {},        {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
    });

}

export const rejectUser = async (userId) =>{
    return await axios.patch(`${API_BASE_URL}/account/reject/${userId}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}

export const deleteUser = async (userId) =>{
    return await axios.delete(`${API_BASE_URL}/account/delete/${userId}`,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        }
    });
}


