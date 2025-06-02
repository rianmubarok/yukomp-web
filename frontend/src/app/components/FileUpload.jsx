import { useDropzone } from "react-dropzone";
import {
  FiUpload,
  FiImage,
  FiFileText,
  FiX,
  FiCheck,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { getFileType } from "../utils/fileUtils";
import { toast } from "react-toastify";

const FileUpload = ({
  onDrop,
  compressionType,
  setCompressionType,
  isCompressing,
  uploadProgress,
  selectedFiles,
  setSelectedFiles,
  onStartProcess,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Check if files are of mixed types
      const fileTypes = new Set(
        acceptedFiles.map((file) => getFileType(file.name))
      );
      if (fileTypes.size > 1) {
        toast.warning(
          "Mixed file types are not supported. Please upload files of the same type."
        );
        return;
      }

      // Check if trying to upload multiple PDFs
      if (fileTypes.has("pdf") && acceptedFiles.length > 1) {
        toast.warning(
          "Multiple PDF files are not supported. Please upload one PDF file at a time."
        );
        return;
      }

      setSelectedFiles(acceptedFiles);
      // Auto detect file type based on the first file
      if (acceptedFiles.length > 0) {
        const fileType = getFileType(acceptedFiles[0].name);
        if (fileType) {
          setCompressionType(fileType);
        }
      }
    },
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getAvailableFeatures = (files) => {
    // For simplicity, assume all files are of the same type for feature detection
    if (!files || files.length === 0) return [];

    const features = [];
    const fileType = getFileType(files[0].name);

    if (fileType === "image") {
      features.push({
        id: "image",
        name: "Image Compression",
        description: "Compress image(s) while maintaining quality",
        icon: <FiImage className="h-5 w-5" />,
      });
    } else if (fileType === "pdf") {
      // PDF compression currently supports only a single file
      if (files.length === 1) {
        features.push({
          id: "pdf",
          name: "PDF Compression",
          description: "Reduce PDF file size",
          icon: <FiFileText className="h-5 w-5" />,
        });
      }
    }

    return features;
  };

  const availableFeatures = selectedFiles
    ? getAvailableFeatures(selectedFiles)
    : [];

  return (
    <>
      <div className="bg-white rounded-4xl border border-lightGrayBlue p-6">
        <div
          {...getRootProps()}
          className={`border border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-black hover:border-blue-500 bg-lightGrayBlue"
            }`}
        >
          <input {...getInputProps()} />
          <FiUpload className="mx-auto h-20 w-20 thin-icon" />
          <p className="mt-4 text-lg text-gray-600">
            {isDragActive
              ? "Drop the file(s) here"
              : "Drag and drop your file(s) here, or click to select"}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Supports JPG, JPEG, PNG, and PDF (single file only)
          </p>
        </div>
      </div>

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="py-4 px-6 bg-lightGrayBlue rounded-full flex items-center justify-between"
            >
              {/* File Info: Icon, Name, Size */}
              <div className="flex items-center space-x-3">
                {getFileType(file.name) === "image" ? (
                  <FiImage className="h-6 w-6 text-gray-600" />
                ) : (
                  <FiFileText className="h-6 w-6 text-gray-600" />
                )}
                <div>
                  <span className="text-gray-800 text-sm font-medium">
                    {file.name}
                  </span>
                  <p className="text-gray-600 text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              {/* Progress Bar, Percentage, and Status Icon */}
              <div className="flex items-center space-x-4 flex-grow mx-4">
                {isCompressing || uploadProgress > 0 ? (
                  <>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700 w-10 text-right">
                      {uploadProgress}%
                    </span>
                  </>
                ) : (
                  <div className="flex-grow">
                    {/* Placeholder for spacing when no progress */}
                  </div>
                )}

                {/* Status Icon (Check or Spinner) */}
                <div className="flex items-center justify-center w-6 h-6">
                  {uploadProgress === 100 ? (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-lightGreen">
                      <FiCheck className="text-black h-4 w-4" />
                    </div>
                  ) : isCompressing && uploadProgress < 100 ? (
                    <FiLoader className="animate-spin text-gray-600 h-5 w-5" />
                  ) : null}
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFile(file)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Available Features Section (below the file info/progress) */}
      {selectedFiles &&
        selectedFiles.length > 0 &&
        !isCompressing &&
        uploadProgress === 0 &&
        availableFeatures.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Available Features
            </h3>
            <div className="space-y-3">
              {availableFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setCompressionType(feature.id)}
                  disabled={feature.id === "pdf" && selectedFiles.length > 1}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    compressionType === feature.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  } ${
                    feature.id === "pdf" && selectedFiles.length > 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-md ${
                        compressionType === feature.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {feature.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Start Process Button */}
      {selectedFiles &&
        selectedFiles.length > 0 &&
        !isCompressing &&
        uploadProgress === 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => onStartProcess(selectedFiles)}
              disabled={
                isCompressing ||
                (compressionType === "pdf" && selectedFiles.length > 1)
              }
              className={`mt-6 text-black font-medium flex items-center group ${
                isCompressing ||
                (compressionType === "pdf" && selectedFiles.length > 1)
                  ? "cursor-not-allowed"
                  : "hover:brightness-95"
              }`}
            >
              {/* Text Part */}
              <span className="py-3 px-6 bg-lightGreen rounded-full">
                Start Process
              </span>

              {/* Icon Part with Round Background */}
              <div className="flex items-center justify-center w-12 h-12 bg-lightGreen rounded-full -ml-4 group-hover:-ml-1 transition-all">
                <FiArrowRight className="h-6 w-6 regular-icon rotate-[-45deg] transition-transform group-hover:rotate-0" />
              </div>
            </button>
          </div>
        )}
    </>
  );
};

export default FileUpload;
