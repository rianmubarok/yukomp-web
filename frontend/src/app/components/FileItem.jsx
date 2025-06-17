import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiImage, FiFileText, FiX, FiLoader, FiCheck } from "react-icons/fi";
import { formatFileSize } from "../utils/fileUtils";

function FileItem({
  file,
  index,
  onRemove,
  isProcessing,
  isCompleted,
  progress,
  selectedFeature,
  customSettings,
  compressedSize,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.name + index, disabled: isCompleted });

  if (isProcessing) {
    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className="py-3 sm:py-4 px-4 sm:px-6 bg-[#F1F1F1] rounded-2xl flex items-center justify-between gap-3 sm:gap-4"
      >
        <div className="flex items-center space-x-3 w-1/2 min-w-0">
          {file.type.startsWith("image/") ? (
            <FiImage className="h-6 w-6 sm:h-8 sm:w-8 text-customBlack flex-shrink-0 regular-icon" />
          ) : (
            <FiFileText className="h-6 w-6 sm:h-8 sm:w-8 text-customBlack flex-shrink-0 regular-icon" />
          )}
          <div className="min-w-0 flex-1 text-left">
            <span className="text-sm sm:text-base text-customBlack block truncate">
              {file.name}
            </span>
            <p className="text-sm sm:text-base text-gray-500 truncate">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-1/2 min-w-0">
          <div className="w-full bg-gray-300 rounded-full h-2.5 sm:h-3">
            <div
              className="bg-customBlack h-2.5 sm:h-3 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm sm:text-base text-gray-700 w-12 text-right whitespace-nowrap">
            {progress}%
          </span>
          <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
            <FiLoader className="animate-spin text-customBlack h-5 w-5 sm:h-6 sm:w-6 regular-icon" />
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const savedSize = file.size - compressedSize;
    const savedPercentage = Math.round((savedSize / file.size) * 100);

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className="py-3 sm:py-4 px-4 sm:px-6 bg-[#F1F1F1] rounded-2xl flex items-center justify-between gap-3 sm:gap-4"
      >
        <div className="flex items-center space-x-3 flex-grow min-w-0">
          {file.type.startsWith("image/") ? (
            <FiImage className="h-6 w-6 sm:h-8 sm:w-8 text-customBlack flex-shrink-0 regular-icon" />
          ) : (
            <FiFileText className="h-6 w-6 sm:h-8 sm:w-8 text-customBlack flex-shrink-0 regular-icon" />
          )}
          <div className="min-w-0 flex-1 text-left">
            <span className="text-sm sm:text-base text-customBlack block truncate">
              {file.name}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base">
              {selectedFeature === "jpg-to-pdf" ? (
                <p className="text-gray-500 truncate">Converted to PDF</p>
              ) : (
                <>
                  <p className="text-gray-500 truncate">
                    {formatFileSize(file.size)} →{" "}
                    {formatFileSize(compressedSize)}
                  </p>
                  <span className="hidden sm:inline text-green-600 font-medium whitespace-nowrap">
                    • {savedPercentage}% smaller ({formatFileSize(savedSize)}{" "}
                    saved)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <FiCheck className="text-green-600 h-5 w-5 sm:h-6 sm:w-6 regular-icon" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="py-3 sm:py-4 px-4 sm:px-6 bg-[#F1F1F1] rounded-2xl flex items-center justify-between gap-3 sm:gap-4"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center space-x-3 cursor-move flex-grow min-w-0"
      >
        {file.type.startsWith("image/") ? (
          <FiImage className="h-6 w-6 sm:h-8 sm:w-8 text-customBlack flex-shrink-0 regular-icon" />
        ) : (
          <FiFileText className="h-6 w-6 sm:h-8 sm:w-8 text-customBlack flex-shrink-0 regular-icon" />
        )}
        <div className="min-w-0 flex-1 text-left">
          <span className="text-sm sm:text-base text-customBlack block truncate">
            {file.name}
          </span>
          <p className="text-sm sm:text-base text-gray-500 truncate">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className="text-customBlack hover:text-gray-600"
        >
          <FiX className="h-5 w-5 sm:h-6 sm:w-6 regular-icon" />
        </button>
      </div>
    </div>
  );
}

export default FileItem;
