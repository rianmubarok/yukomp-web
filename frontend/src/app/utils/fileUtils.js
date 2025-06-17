const FILE_TYPES = {
  IMAGE: ["jpg", "jpeg", "png"],
  PDF: ["pdf"],
};

export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes) || bytes < 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const downloadFile = (data, filename) => {
  if (!data || !filename) {
    throw new Error("Invalid data or filename");
  }

  try {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("Failed to download file: " + error.message);
  }
};

export const getFileType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png"].includes(extension)) {
    return "image";
  } else if (extension === "pdf") {
    return "pdf";
  }
  return null;
};
