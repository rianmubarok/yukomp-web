import { FiImage, FiFileText, FiLoader } from "react-icons/fi";
import { formatFileSize } from "../utils/fileUtils";

const FileProgress = ({ files, uploadProgress }) => {
  return (
    <div className="mt-6 space-y-4">
      {files.map((file, index) => (
        <div
          key={index}
          className="py-4 px-6 bg-gray-200 rounded-full flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            {file.type.startsWith("image/") ? (
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

          <div className="flex items-center space-x-4 flex-grow mx-4">
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-700 w-10 text-right">
              {uploadProgress}%
            </span>
          </div>

          <div className="flex items-center justify-center w-6 h-6">
            <FiLoader className="animate-spin text-gray-600 h-5 w-5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileProgress;
