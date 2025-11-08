import axios from "axios";

async function upvoteCommunityProblem(problemId, authToken) {
  try {
    const response = await axios.post("/api/community-problems/upvote", { problemId });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to upvote community problem");
    }
  } catch (error) {
    console.error("Error upvoting community problem:", error);
    throw error;
  }
}

export default upvoteCommunityProblem;
