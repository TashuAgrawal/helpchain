// Helper/NgoServices/GetFeedback.js
import axios from 'axios';

export const fetchFeedbackByNgo = async (ngoId) => {
  return axios.get(`/api/ngo/${ngoId}/feedback`);
};
