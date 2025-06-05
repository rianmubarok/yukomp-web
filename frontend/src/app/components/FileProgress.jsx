import { FiImage, FiFileText, FiLoader } from "react-icons/fi";
import { formatFileSize } from "../utils/fileUtils";

const FileProgress = ({ files, uploadProgress }) => {
  return (
    <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 md:space-y-4">
      {files.map((file, index) => (
        <div
          key={index}
          className="py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 bg-gray-200 rounded-lg sm:rounded-xl md:rounded-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 md:gap-0"
        >
          <div className="flex items-center space-x-2 sm:space-x-3">
            {file.type.startsWith("image/") ? (
              <FiImage className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-600" />
            ) : (
              <FiFileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-600" />
            )}
            <div className="min-w-0">
              <span className="text-gray-800 text-xs sm:text-sm font-medium truncate block">
                {file.name}
              </span>
              <p className="text-gray-600 text-xs">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-grow sm:mx-3 md:mx-4">
            <div className="w-full bg-gray-300 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-xs sm:text-sm text-gray-700 w-8 sm:w-10 text-right whitespace-nowrap">
              {uploadProgress}%
            </span>
          </div>

          <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
            <FiLoader className="animate-spin text-gray-600 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileProgress;
