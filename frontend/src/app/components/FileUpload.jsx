import { useCallback, useState, useRef, useEffect } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FiUpload, FiCheckCircle } from "react-icons/fi";
import { getFileType } from "../utils/fileUtils";
import { toast } from "react-toastify";
import FileItem from "./FileItem";
import FeatureSelector from "./FeatureSelector";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { compressFile, convertJpgToPdf } from "../services/api";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFeature, setSelectedFeature] = useState("image");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [customSettings, setCustomSettings] = useState({});
  const [compressedSizes, setCompressedSizes] = useState({});
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateContainerHeight = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      containerRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height =
        selectedFiles.length > 0
          ? `${contentRef.current?.scrollHeight}px`
          : "0px";
    }
  }, [
    selectedFiles,
    isCustomMode,
    isProcessing,
    isCompleted,
    updateContainerHeight,
  ]);

  const handleDrop = useCallback((acceptedFiles) => {
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
    if (acceptedFiles.length > 0) {
      const fileType = getFileType(acceptedFiles[0].name);
      if (fileType) setSelectedFeature(fileType);
    }
  }, []);

  const handleProcessStart = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to process");
      return;
    }

    if (isProcessing || isCompleted) {
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setIsCompleted(false);
    setCompressedSizes({});

    try {
      if (selectedFeature === "jpg-to-pdf") {
        const pdfBlob = await convertJpgToPdf(selectedFiles, customSettings);
        if (!pdfBlob || pdfBlob.size === 0) {
          throw new Error("Failed to convert images to PDF");
        }

        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `converted_${new Date().getTime()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Images successfully converted to PDF!");
        setIsCompleted(true);
      } else {
        const settings = isCustomMode
          ? {
              quality: parseInt(customSettings.quality) || 80,
              ...(selectedFeature === "pdf" && {
                dpi: parseInt(customSettings.dpi) || 300,
              }),
              ...(selectedFeature === "jpg-to-pdf" && {
                pageSize: customSettings.pageSize || "A4",
                orientation: customSettings.orientation || "Portrait",
                margin: parseInt(customSettings.margin) || 10,
              }),
            }
          : {};

        const { blob: compressedBlob, compressedSizes: newCompressedSizes } =
          await compressFile(
            selectedFiles,
            selectedFeature,
            (progress) => {
              setUploadProgress(progress);
            },
            settings
          );

        if (!compressedBlob || compressedBlob.size === 0) {
          throw new Error("Failed to compress files");
        }

        setCompressedSizes(newCompressedSizes);

        const url = window.URL.createObjectURL(compressedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download =
          selectedFiles.length > 1
            ? `compressed_${selectedFeature}s.zip`
            : `compressed_${selectedFiles[0].name}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success(
          selectedFiles.length > 1
            ? "Files compressed successfully!"
            : "File compressed successfully!"
        );
      }

      setIsCompleted(true);
    } catch (error) {
      console.error("Processing error:", error);
      toast.error(error.message || "An error occurred during processing");
    } finally {
      setIsProcessing(false);
    }
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
    disabled: isProcessing,
  });

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl max-w-2xl mx-auto p-2 sm:p-4 md:p-5 my-3 sm:my-8 md:my-10">
      <div
        {...getRootProps()}
        className={`border border-dashed rounded-lg sm:rounded-xl p-4 sm:p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ease-in-out
          ${
            isDragActive
              ? "border-customBlack bg-gray-50 scale-[1.02] shadow-lg"
              : "border-customGray hover:border-customBlack hover:bg-gray-50 hover:scale-[1.01]"
          }
          ${isProcessing || isCompleted ? "pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} disabled={isProcessing || isCompleted} />
        <div
          className={`relative mx-auto h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 text-customBlack transition-transform duration-300 ${
            isDragActive ? "scale-110" : ""
          }`}
        >
          {isProcessing ? (
            <DotLottieReact
              src="https://lottie.host/e2c164c0-53e7-451a-b3c1-e60f8467af58/e4pGiEOkhd.lottie"
              loop
              autoplay
            />
          ) : isCompleted ? (
            <FiCheckCircle className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 thin-icon text-green-600" />
          ) : (
            <FiUpload className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 thin-icon text-customBlack" />
          )}
        </div>
        <p className="mt-2 sm:mt-4 text-base sm:text-xl md:text-2xl text-gray-800 tracking-tight">
          {isProcessing ? (
            <span className="font-bold">Please wait...</span>
          ) : isCompleted ? (
            <span className="font-bold">Process completed!</span>
          ) : isDragActive ? (
            <span className="font-bold">Drop your files here</span>
          ) : (
            <>
              <span className="font-bold">Drop your files here</span> or click
              to upload
            </>
          )}
        </p>
        <p className="mt-1 text-xs sm:text-base text-gray-500">
          {isProcessing
            ? "We're working on your files"
            : isCompleted
            ? "Your files will be downloaded automatically"
            : "Supports JPG, JPEG, PNG, and PDF files"}
        </p>
      </div>

      <div
        ref={containerRef}
        className="transition-all duration-300 ease-in-out"
        style={{
          opacity: selectedFiles.length > 0 ? 1 : 0,
          visibility: selectedFiles.length > 0 ? "visible" : "hidden",
        }}
      >
        <div ref={contentRef} className="mt-3 sm:mt-4">
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
                  <FileItem
                    key={file.name + index}
                    file={file}
                    index={index}
                    onRemove={() =>
                      setSelectedFiles((files) =>
                        files.filter((_, i) => i !== index)
                      )
                    }
                    isProcessing={isProcessing}
                    isCompleted={isCompleted}
                    progress={uploadProgress}
                    selectedFeature={selectedFeature}
                    customSettings={customSettings}
                    compressedSize={
                      compressedSizes[file.name + index] || file.size
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <FeatureSelector
            selectedFiles={selectedFiles}
            selectedFeature={selectedFeature}
            onFeatureSelect={setSelectedFeature}
            onModeChange={setIsCustomMode}
            onProcessStart={handleProcessStart}
            isProcessing={isProcessing}
            isCompleted={isCompleted}
            customSettings={customSettings}
            onCustomSettingsChange={setCustomSettings}
            onReset={() => {
              setSelectedFiles([]);
              setSelectedFeature("image");
              setIsCustomMode(false);
              setIsProcessing(false);
              setIsCompleted(false);
              setUploadProgress(0);
              setCustomSettings({});
              setCompressedSizes({});
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
