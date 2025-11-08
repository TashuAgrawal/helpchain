import axios from "axios";

async function addTransaction(transactionData, adminToken) {
  try {
    const response = await axios.post("/api/transactions/add", transactionData);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add transaction");
    }
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
}

export default addTransaction;
