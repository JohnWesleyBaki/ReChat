import axios from "axios";

const API_URL = "http://localhost:5050";

export const startChat = async (recipientId) => {
  try {
    const response = await axios.post(
      `${API_URL}/chats/start`,
      { recipientId },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error starting chat:", error);
    throw error;
  }
};
