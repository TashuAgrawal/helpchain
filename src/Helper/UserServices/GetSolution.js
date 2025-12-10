// Helper/NgoServices/GetFeedback.js
import axios from 'axios';

export const fetchSubmittedSolution = async () => {
  return axios.get(`/api/solutions/`);
};
