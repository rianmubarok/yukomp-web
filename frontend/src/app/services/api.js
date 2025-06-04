import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:5000";

export const compressFile = async (files, compressionType, onProgress) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await axios.post(
      `${API_URL}/api/compress/${compressionType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        },
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error compressing file(s)"
    );
  }
};

export const convertJpgToPdf = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await axios.post(
      `${API_URL}/api/convert/jpg-to-pdf`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error converting images to PDF"
    );
  }
};
