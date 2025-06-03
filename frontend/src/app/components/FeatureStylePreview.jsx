import React, { useState } from "react";
import {
  FiImage,
  FiFileText,
  FiCrop,
  FiLayers,
  FiFile,
  FiSettings,
  FiLock,
  FiUnlock,
  FiUpload,
  FiDownload,
} from "react-icons/fi";

const FeatureStylePreview = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isMultipleFiles, setIsMultipleFiles] = useState(false);

  const features = [
    // Image Processing Features
    {
      id: "image-compress",
      name: "Image Compression",
      description: "Compress image(s) while maintaining quality",
      icon: <FiImage className="h-5 w-5" />,
      disabled: false,
      category: "Image",
    },
    {
      id: "image-resize",
      name: "Image Resize",
      description: "Resize images to specific dimensions",
      icon: <FiCrop className="h-5 w-5" />,
      disabled: false,
      category: "Image",
    },
    {
      id: "image-watermark",
      name: "Image Watermark",
      description: "Add text or image watermark to your images",
      icon: <FiLayers className="h-5 w-5" />,
      disabled: false,
      category: "Image",
    },
    {
      id: "image-convert",
      name: "Image Format Convert",
      description: "Convert images between JPG, PNG, and WebP formats",
      icon: <FiSettings className="h-5 w-5" />,
      disabled: false,
      category: "Image",
    },

    // PDF Processing Features
    {
      id: "pdf-compress",
      name: "PDF Compression",
      description: "Reduce PDF file size",
      icon: <FiFileText className="h-5 w-5" />,
      disabled: isMultipleFiles,
      category: "PDF",
    },
    {
      id: "pdf-merge",
      name: "PDF Merge",
      description: "Combine multiple PDF files into one",
      icon: <FiFile className="h-5 w-5" />,
      disabled: false,
      category: "PDF",
    },
    {
      id: "pdf-split",
      name: "PDF Split",
      description: "Split PDF into multiple files",
      icon: <FiFileText className="h-5 w-5" />,
      disabled: isMultipleFiles,
      category: "PDF",
    },
    {
      id: "pdf-protect",
      name: "PDF Protection",
      description: "Add password protection to PDF files",
      icon: <FiLock className="h-5 w-5" />,
      disabled: isMultipleFiles,
      category: "PDF",
    },
    {
      id: "pdf-unlock",
      name: "PDF Unlock",
      description: "Remove password protection from PDF files",
      icon: <FiUnlock className="h-5 w-5" />,
      disabled: isMultipleFiles,
      category: "PDF",
    },

    // Conversion Features
    {
      id: "img-to-pdf",
      name: "Image to PDF",
      description: "Convert one or multiple images to a single PDF",
      icon: <FiUpload className="h-5 w-5" />,
      disabled: false,
      category: "Conversion",
    },
    {
      id: "pdf-to-img",
      name: "PDF to Image",
      description: "Convert PDF pages to JPG or PNG images",
      icon: <FiDownload className="h-5 w-5" />,
      disabled: isMultipleFiles,
      category: "Conversion",
    },
  ];

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {});

  return (
    <div className="mt-20 border-t pt-20">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Feature Selection Style Preview
      </h2>

      {/* Toggle for multiple files simulation */}
      <div className="mb-6 flex justify-center">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isMultipleFiles}
            onChange={(e) => setIsMultipleFiles(e.target.checked)}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">
            Simulate Multiple Files
          </span>
        </label>
      </div>

      {/* Features grouped by category */}
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            {category} Processing
          </h3>
          <div className="space-y-3">
            {categoryFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() =>
                  !feature.disabled && setSelectedFeature(feature.id)
                }
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  selectedFeature === feature.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                } ${feature.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={feature.disabled}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-md ${
                      selectedFeature === feature.id
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
                      {feature.disabled && " (Multiple files not supported)"}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Selected Feature Info */}
      {selectedFeature && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Selected Feature:{" "}
            <span className="font-medium text-gray-900">{selectedFeature}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FeatureStylePreview;
