import axios from "axios";
import { getAuthToken } from "../lib/cookies";

export const uploadFiles = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("metadata", "arr");

    // Retrieve auth token
    const token = await getAuthToken();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "File upload failed");
  }
};

// Function to fetch files
export const fetchFiles = async (): Promise<any> => {
  try {
    // Retrieve auth token
    const token = await getAuthToken();

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch files");
  }
};

// Function to delete files
export const deleteFile = async (fileId: string): Promise<any> => {
  try {
    // Retrieve auth token
    const token = await getAuthToken();

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/file/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: fileId },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete file");
  }
};