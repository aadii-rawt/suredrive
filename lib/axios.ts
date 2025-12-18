import axios from "axios";

const api = axios.create({
    baseURL : "/api/v1",
    withCredentials : false
})
export default api