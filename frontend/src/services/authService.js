import axiosClient from '../api/axiosClient';

// 1. Register User
export const registerUser = async (data) => {
  const res = await axiosClient.post('/auth/register', data);
  return res.data;
};

// 2. Login User
export const loginUser = async (data) => {
  const res = await axiosClient.post('/auth/login', data);
  return res.data;
};

// 3. Logout User
export const logoutUser = async () => {
  const res = await axiosClient.post('/auth/logout');
  return res.data;
};

// 4. Get Current Logged-in User
export const getMe = async () => {
  const res = await axiosClient.get('/auth/me');
  return res.data;
};
