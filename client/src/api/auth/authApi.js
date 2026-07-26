import api from "../axios.js"

export const registerUser = async (userData) =>{

    const res = await api.post("/auth/register" , userData);
    return res.data
}


export const verifyOtp = async (otpData)=>{
    const res = await api.post("/auth/otp" , otpData);
    return res.data;
}

export const loginUser = async (loginData)=>{
    const res = await api.post("/auth/login" , loginData)
}

export const refreshToken = async () => {
  const res = await axiosInstance.post("/auth/refresh");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};