import axios from "axios";
import { getAuthToken } from "../lib/cookies";

export const sendChatQuery = async (query: string, is_stream = false): Promise<any> => {
  try {
    // Retrieve auth token (if you're using a dynamic token from your cookies)
    const token = await getAuthToken();

    const data = JSON.stringify({
      query: query,
      is_stream: is_stream
    });

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/query`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        maxBodyLength: Infinity, // Allow large request bodies
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Chat request failed");
  }
};
