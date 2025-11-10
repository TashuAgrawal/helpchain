import axios from "axios";

async function fetchUpvotedProblems(userId) {
  try {
    const response = await axios.get(`/api/community-problems/upvote/user/${userId}`);
    if (response.status === 200) {
      return response.data; 
    } else {
      throw new Error("Failed to fetch upvoted problems");
    }
  } catch (error) {
    console.error("Error fetching upvoted problems:", error);
    throw error;
  }
}

export default fetchUpvotedProblems;
