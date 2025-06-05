import { FiImage, FiFileText, FiLoader } from "react-icons/fi";
import { formatFileSize } from "../utils/fileUtils";

const FileProgress = ({ files, uploadProgress }) => {
  return (
    <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 md:space-y-4">
      {files.map((file, index) => (
        <div
          key={index}
          className="py-3 sm:py-4 px-4 sm:px-6 bg-gray-200 rounded-full flex items-center justify-between"
        >
          <div className="flex items-center space-x-3 cursor-move w-1/2 sm:w-auto">
            {file.type.startsWith("image/") ? (
              <FiImage className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 regular-icon" />
            ) : (
              <FiFileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 regular-icon" />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-gray-800 text-sm font-medium block truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                {file.name}
              </span>
              <p className="text-gray-600 text-xs truncate">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-1 mx-3">
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-700 w-10 text-right whitespace-nowrap">
              {uploadProgress}%
            </span>
          </div>

          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
            <FiLoader className="animate-spin text-gray-600 h-5 w-5 sm:h-6 sm:w-6 regular-icon" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileProgress;
