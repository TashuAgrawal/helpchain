import axios from "axios";

async function postCommunityProblem(problemData, authToken) {
  try {
    const response = await axios.post("/api/community-problems/add", problemData);

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to post community problem");
    }
  } catch (error) {
    console.error("Error posting community problem:", error);
    throw error;
  }
}

export default postCommunityProblem;
