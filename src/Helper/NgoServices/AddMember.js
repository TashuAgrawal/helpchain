import axios from "axios";

async function addMember(data) {
  try {
    const response = await axios.post("/api/ngo/addmember", data);

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add member");
    }
  } catch (error) {
    console.error("Error adding campaign:", error);
    throw error;
  }
}

export default addMember;
