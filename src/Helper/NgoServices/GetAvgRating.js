import axios from "axios";

async function fetchAvgRating(ngoid) {
  try {
    const response = await axios.get(`/api/ngo/${ngoid}/avg-rating`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch fetchAvgRating");
    }
  } catch (error) {
    console.error("Error fetching fetchAvgRating:", error);
    throw error;
  }
}

export default fetchAvgRating;
