import axios from "axios";

async function toggleProblemUpvote(userId, problemId) {
  try {
    const response = await axios.post("/api/community-problems/upvote/toggle", {
      userId,
      problemId,
    });
    return response.data; 
  } catch (error) {
    console.error("Failed to toggle upvote:", error);
    throw error;
  }
}

export default toggleProblemUpvote;
