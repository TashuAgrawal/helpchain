

import axios from "axios";

async function toggleFollowNGO(userId, ngoId) {

  console.log(userId, ngoId);

  try {
    const response = axios.post('/api/follow/toggle', { userId, ngoId });

    console.log(response);
    return response;

  } catch (error) {
    console.error("Error in toggle:", error);
    throw error;
  }
}

export default toggleFollowNGO;
