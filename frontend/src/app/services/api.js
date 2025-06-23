import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const handleApiError = (error, defaultMessage) => {
  const errorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    defaultMessage;
  throw new Error(errorMessage);
};

const createFormData = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return formData;
};

export const compressFile = async (
  files,
  feature,
  onProgress,
  customSettings = {}
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (Object.keys(customSettings).length > 0) {
    formData.append("settings", JSON.stringify(customSettings));
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/compress/${feature}`,
      formData,
      {
        responseType: "blob",
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percent);
          }
        },
      }
    );

    const blob = response.data;
    if (blob.size === 0) {
      throw new Error("Received empty response from server");
    }

    // For single file, use the blob size directly
    if (files.length === 1) {
      return { blob, compressedSizes: { [files[0].name + "0"]: blob.size } };
    }

    // For multiple files, try to get individual sizes from response headers
    const compressedSizes = {};
    let hasIndividualSizes = false;

    files.forEach((file, index) => {
      const sizeHeader = response.headers[`x-compressed-size-${index}`];
      if (sizeHeader) {
        compressedSizes[file.name + index] = parseInt(sizeHeader);
        hasIndividualSizes = true;
      }
    });

    // If no individual sizes available, calculate based on original file sizes
    if (!hasIndividualSizes) {
      const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
      const compressionRatio = blob.size / totalOriginalSize;
      files.forEach((file, index) => {
        compressedSizes[file.name + index] = Math.floor(
          file.size * compressionRatio
        );
      });
    }

    return { blob, compressedSizes };
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
};

export const convertJpgToPdf = async (files, customSettings = {}) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided for conversion");
  }

  const formData = new FormData();

  // Add files
  files.forEach((file) => {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file object provided");
    }
    formData.append("files", file);
  });

  // Add custom settings if provided
  if (Object.keys(customSettings).length > 0) {
    formData.append("settings", JSON.stringify(customSettings));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/convert/jpg-to-pdf`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to convert images to PDF");
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error("Received empty response from server");
    }

    return blob;
  } catch (error) {
    console.error("Conversion error:", error);
    throw error;
  }
};
