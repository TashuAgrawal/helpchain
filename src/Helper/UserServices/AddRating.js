// src/Helper/NgoServices/AddRating.js
import axios from "axios";

async function addRating(ratingData) {
  try {
    const response = await axios.post(`/api/ratings/add`, ratingData);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Failed to add rating");
    }
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error;
  }
}

export default addRating;
