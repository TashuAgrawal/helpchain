// Helper/UserServices/GetUserById.js
import axios from 'axios';

export const getUserById = async (userId) => {
  return axios.get(`/api/user/${userId}`);
};
