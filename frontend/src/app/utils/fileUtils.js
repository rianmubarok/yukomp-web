export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const mb = bytes / (1024 * 1024);
  const kb = bytes / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  } else {
    return `${kb.toFixed(2)} KB`;
  }
};

export const downloadFile = (data, filename) => {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const getFileType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png"].includes(extension)) {
    return "image";
  }
  if (extension === "pdf") {
    return "pdf";
  }
  return null;
};
