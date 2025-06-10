import axios from "axios"

const apiService = () => {
    return axios.create({
        baseURL: "http://localhost:5000/api",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("socialzone-user-token")
        }
    })
}

export default apiService