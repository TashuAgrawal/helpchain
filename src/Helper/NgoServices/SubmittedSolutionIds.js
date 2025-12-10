// Helper/NgoServices/GetFeedback.js
import axios from 'axios';

export const fetchSubmittedIds = async (ngoId) => {
  return axios.get(`/api/solutions/ngo/${ngoId}`);
};
