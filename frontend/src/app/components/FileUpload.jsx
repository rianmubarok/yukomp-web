import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FiUpload,
  FiImage,
  FiFileText,
  FiX,
  FiCheck,
  FiArrowRight,
  FiLoader,
} from "react-icons/fi";
import { getFileType, formatFileSize } from "../utils/fileUtils";
import { toast } from "react-toastify";
import bg1 from "../../assets/bg1.png";
import bg2 from "../../assets/bg2.png";
import bg3 from "../../assets/bg3.png";
import imgPng from "../../assets/jpg.png";
import PdfPng1 from "../../assets/pdf1.png";
import PdfPng2 from "../../assets/pdf2.png";

function SortableItem({ file, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.name + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="py-3 sm:py-4 px-4 sm:px-6 bg-lightGrayBlue rounded-full flex items-center justify-between"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center space-x-3 cursor-move flex-grow min-w-0"
      >
        {file.type.startsWith("image/") ? (
          <FiImage className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 flex-shrink-0 regular-icon" />
        ) : (
          <FiFileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 flex-shrink-0 regular-icon" />
        )}
        <div className="min-w-0 flex-1">
          <span className="text-gray-800 text-sm font-medium block truncate">
            {file.name}
          </span>
          <p className="text-gray-600 text-xs truncate">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
      >
        <FiX className="h-5 w-5 regular-icon" />
      </button>
    </div>
  );
}

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
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDrop = useCallback(
    (acceptedFiles) => {
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

      setSelectedFiles(acceptedFiles);
      // Auto detect file type based on the first file
      if (acceptedFiles.length > 0) {
        const fileType = getFileType(acceptedFiles[0].name);
        if (fileType) {
          setCompressionType(fileType);
        }
      }
    },
    [setSelectedFiles, setCompressionType]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
    disabled: isCompressing,
  });

  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedFiles((items) => {
        const oldIndex = items.findIndex(
          (item, index) => item.name + index === active.id
        );
        const newIndex = items.findIndex(
          (item, index) => item.name + index === over.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getAvailableFeatures = (files) => {
    const allFeatures = [
      {
        id: "image",
        title: "Image Compression",
        description: "Compress image(s) while maintaining quality",
        bgImage: bg1,
        icon: imgPng,
        supportedTypes: ["image"],
      },
      {
        id: "jpg-to-pdf",
        title: "JPG to PDF",
        description: "Convert image(s) to PDF document",
        bgImage: bg2,
        icon: PdfPng1,
        supportedTypes: ["image"],
      },
      {
        id: "pdf",
        title: "PDF Compression",
        description: "Compress PDF file(s) to reduce size",
        bgImage: bg3,
        icon: PdfPng2,
        supportedTypes: ["pdf"],
      },
    ];

    if (!files || files.length === 0) return allFeatures;

    const fileType = getFileType(files[0].name);

    return allFeatures.map((feature) => ({
      ...feature,
      disabled: !feature.supportedTypes.includes(fileType),
    }));
  };

  const availableFeatures = selectedFiles
    ? getAvailableFeatures(selectedFiles)
    : getAvailableFeatures();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-4xl border border-lightGrayBlue p-3 sm:p-4 md:p-6">
        <div
          {...getRootProps()}
          className={`border border-dashed rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-12 text-center cursor-pointer transition-all duration-300 group upload-area
            ${
              isDragActive
                ? "border-blue-500 gradient-animate scale-[1.02]"
                : "border-black hover:border-blue-500 hover:gradient-animate hover:scale-[1.02] hover bg-lightGrayBlue"
            }`}
        >
          <input {...getInputProps()} />
          <div className="relative mx-auto h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20">
            <FiUpload
              className={`absolute top-0 left-0 h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 thin-icon transition-opacity duration-300 ${
                isDragActive ? "opacity-0" : "group-hover:opacity-0"
              }`}
            />
            <FiUpload
              className={`absolute top-0 left-0 h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 regular-icon text-blue-500 transition-opacity duration-300 ${
                isDragActive
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
          <p
            className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg transition-colors duration-300 ${
              isDragActive
                ? "text-blue-600"
                : "text-gray-600 group-hover:text-blue-600"
            }`}
          >
            {isDragActive
              ? "Drop your files here"
              : "Drag and drop your files here, or click to select"}
          </p>
          <p
            className={`mt-1 sm:mt-2 text-xs sm:text-sm transition-colors duration-300 ${
              isDragActive
                ? "text-blue-500"
                : "text-gray-500 group-hover:text-blue-500"
            }`}
          >
            Supports JPG, JPEG, PNG, and PDF files
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 md:space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedFiles.map((file, index) => file.name + index)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2 sm:space-y-3">
                {selectedFiles.map((file, index) => (
                  <SortableItem
                    key={file.name + index}
                    file={file}
                    index={index}
                    onRemove={handleRemoveFile}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            {availableFeatures.map((feature) => (
              <div
                key={feature.id}
                onClick={() =>
                  !feature.disabled && setCompressionType(feature.id)
                }
                className={`bg-white rounded-2xl border p-3 md:p-4 flex flex-row md:flex-col items-center text-center w-full md:w-[250px] h-[72px] md:h-auto group transition-all duration-300 ${
                  feature.disabled
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : compressionType === feature.id
                    ? "border-blue-500 scale-[1.02] cursor-pointer"
                    : "border-lightGrayBlue hover:border-blue-300 cursor-pointer"
                }`}
              >
                <div className="relative w-14 h-50 md:w-full md:h-50 rounded-lg md:rounded-xl md:mb-4 overflow-hidden flex-shrink-0">
                  <img
                    src={feature.bgImage}
                    alt={`${feature.title} icon background`}
                    className="w-full h-full object-cover"
                  />
                  <img
                    src={feature.icon}
                    alt="Feature icon"
                    className="absolute m-auto w-12 md:w-44 top-2 md:top-8 left-1 md:left-16 group-hover:top-1 md:group-hover:top-6 md:group-hover:left-14 transition-all duration-200"
                  />
                </div>
                <div className="ml-4 md:ml-0 text-left md:text-center">
                  <h3
                    className={`text-sm sm:text-base font-medium ${
                      feature.disabled
                        ? "text-gray-400"
                        : compressionType === feature.id
                        ? "text-blue-600"
                        : "text-gray-900"
                    }`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-3 sm:mt-4">
            <button
              onClick={() => onStartProcess(selectedFiles)}
              disabled={isCompressing}
              className={`text-black font-medium flex items-center group ${
                isCompressing ? "cursor-not-allowed" : "hover:brightness-95"
              }`}
            >
              <span className="mb-5 mt-3 py-2.5 sm:py-2.5 md:py-3 px-4 sm:px-6 bg-lightGreen rounded-full text-sm sm:text-base">
                {compressionType === "jpg-to-pdf"
                  ? "Convert to PDF"
                  : "Compress Files"}
              </span>

              <div className="mb-5 mt-3 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-lightGreen rounded-full -ml-3 sm:-ml-4 group-hover:-ml-1 transition-all">
                {isCompressing ? (
                  <FiLoader className="h-5 w-5 sm:h-6 sm:w-6 thin-icon animate-spin" />
                ) : (
                  <FiArrowRight className="h-5 w-5 sm:h-6 sm:w-6 regular-icon group-hover:regular-icon rotate-[-45deg] transition-transform group-hover:rotate-0" />
                )}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
