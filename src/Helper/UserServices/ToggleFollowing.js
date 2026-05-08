

import axios from "axios";

async function toggleFollowNGO(userId, ngoId) {


  try {
    const response = axios.post('/api/follow/toggle', { userId, ngoId });

    return response;

  } catch (error) {
    console.error("Error in toggle:", error);
    throw error;
  }
}

export default toggleFollowNGO;
