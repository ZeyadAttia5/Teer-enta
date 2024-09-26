import axios from 'axios';



const https = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});



export default https;