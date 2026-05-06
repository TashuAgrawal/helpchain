import axios from "axios";

export const checkIfVolunteer = async (userId) => {
  try {
    const { data } = await axios.post("/api/volunteer/check", {
      userId,
    });

    return data.exists; // true / false

  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    return null;
  }
};