import axios from "axios";

async function addSolution(solutiondata) {
  try {
    const response = await axios.post("/api/solutions",solutiondata);

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add solution");
    }
  } catch (error) {
    console.error("Error adding campaign:", error);
    throw error;
  }
}

export default addSolution;
