import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const compressFile = async (files, type, onProgress) => {
  const formData = new FormData();

  // If 'files' is an array, append each file
  if (Array.isArray(files)) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  } else {
    // If 'files' is a single file, append it under the 'file' key for PDF
    formData.append("file", files);
  }

  const endpoint =
    type === "image"
      ? `${API_URL}/api/compress/image`
      : `${API_URL}/api/compress/pdf`;

  try {
    const response = await axios.post(endpoint, formData, {
      responseType: "blob",
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            reject(new Error(errorData.error || "Error compressing file"));
          } catch (e) {
            reject(new Error("Error compressing file"));
          }
        };
        reader.readAsText(error.response.data);
      });
    }
    throw error;
  }
};
