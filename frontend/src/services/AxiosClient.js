import axios from 'axios';
import {toast} from "react-toastify";
const axiosClient = axios.create();
axiosClient.defaults.baseURL = '/';
axiosClient.defaults.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
};

const requestHandler = request => {
    const token = localStorage.getItem('access_token');
    if (token){
        request.headers.Authorization = 'Bearer ' + token ;
    }
    return request;
};
const responseHandler = request => {
    return request;
};
const errorHandler = error => {
    toast.error("Error while fetching ", JSON.stringify(error));
    return Promise.reject(error);
};
axiosClient.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);

axiosClient.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
);
export default axiosClient;