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
      className="py-4 px-6 bg-lightGrayBlue rounded-full flex items-center justify-between"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center space-x-3 cursor-move flex-grow"
      >
        {file.type.startsWith("image/") ? (
          <FiImage className="h-6 w-6 text-gray-600" />
        ) : (
          <FiFileText className="h-6 w-6 text-gray-600" />
        )}
        <div>
          <span className="text-gray-800 text-sm font-medium">{file.name}</span>
          <p className="text-gray-600 text-xs">{formatFileSize(file.size)}</p>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="text-gray-500 hover:text-gray-700 ml-2"
      >
        <FiX className="h-5 w-5" />
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
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
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
      features.push({
        id: "jpg-to-pdf",
        name: "Convert to PDF",
        description: "Convert image(s) to PDF document",
        icon: <FiFileText className="h-5 w-5" />,
      });
    } else if (fileType === "pdf") {
      features.push({
        id: "pdf",
        name: "PDF Compression",
        description: "Compress PDF file(s) to reduce size",
        icon: <FiFileText className="h-5 w-5" />,
      });
    }

    return features;
  };

  const availableFeatures = selectedFiles
    ? getAvailableFeatures(selectedFiles)
    : [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-4xl border border-lightGrayBlue p-6">
        <div
          {...getRootProps()}
          className={`border border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group upload-area
            ${
              isDragActive
                ? "border-blue-500 gradient-animate scale-[1.02] shadow-lg"
                : "border-black hover:border-blue-500 hover:gradient-animate hover:scale-[1.02] hover:shadow-lg bg-lightGrayBlue"
            }`}
        >
          <input {...getInputProps()} />
          <div className="relative mx-auto h-20 w-20">
            <FiUpload
              className={`absolute top-0 left-0 h-20 w-20 thin-icon transition-opacity duration-300 ${
                isDragActive ? "opacity-0" : "group-hover:opacity-0"
              }`}
            />
            <FiUpload
              className={`absolute top-0 left-0 h-20 w-20 regular-icon text-blue-500 transition-opacity duration-300 ${
                isDragActive
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>
          <p
            className={`mt-4 text-lg transition-colors duration-300 ${
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
            className={`mt-2 text-sm transition-colors duration-300 ${
              isDragActive
                ? "text-blue-500"
                : "text-gray-500 group-hover:text-blue-500"
            }`}
          >
            Supports JPG, JPEG, PNG, GIF, BMP, and PDF files
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedFiles.map((file, index) => file.name + index)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
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

          {/* Available Features Section */}
          {!isCompressing &&
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
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        compressionType === feature.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
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

          <div className="flex justify-center mt-6">
            <button
              onClick={() => onStartProcess(selectedFiles)}
              disabled={isCompressing}
              className={`text-black font-medium flex items-center group ${
                isCompressing ? "cursor-not-allowed" : "hover:brightness-95"
              }`}
            >
              {/* Text Part */}
              <span className="py-3 px-6 bg-lightGreen rounded-full">
                {compressionType === "jpg-to-pdf"
                  ? "Convert to PDF"
                  : "Compress Files"}
              </span>

              {/* Icon Part with Round Background */}
              <div className="flex items-center justify-center w-12 h-12 bg-lightGreen rounded-full -ml-4 group-hover:-ml-1 transition-all">
                <FiArrowRight className="h-6 w-6 thin-icon group-hover:regular-icon rotate-[-45deg] transition-transform group-hover:rotate-0" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
