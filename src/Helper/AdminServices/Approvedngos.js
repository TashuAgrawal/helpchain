import axios from "axios";

async function fetchApprovedNgos() {
  try {
    const response = await axios.get("/api/admin/approved-ngos", {});

    if (response.status === 200) {
      return response.data; // Array of approved NGOs
    } else {
      throw new Error("Failed to fetch approved NGOs");
    }
  } catch (error) {
    console.error("Error fetching approved NGOs:", error);
    throw error;
  }
}

export default fetchApprovedNgos;
