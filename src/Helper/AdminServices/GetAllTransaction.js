import axios from "axios";

async function fetchAllTransactions() {
  try {
    const response = await axios.get("/api/transactions");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch transactions");
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export default fetchAllTransactions;
