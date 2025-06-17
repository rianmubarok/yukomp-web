import { getFileType } from "../utils/fileUtils";
import { useState, useEffect } from "react";
import { FiSettings, FiShare2 } from "react-icons/fi";
import { toast } from "react-toastify";

const features = [
  {
    id: "image",
    title: "Image Compression",
    supportedTypes: ["image"],
    customSettings: {
      quality: {
        min: 5,
        max: 100,
        default: 80,
        label: "Compression Quality",
        step: 5,
        format: (value) => `${value}%`,
        description:
          "Lower quality = smaller file size, Higher quality = better image",
      },
    },
  },
  {
    id: "pdf",
    title: "PDF Compression",
    supportedTypes: ["pdf"],
    customSettings: {
      quality: {
        min: 0,
        max: 100,
        default: 80,
        label: "Compression Quality",
        step: 5,
        format: (value) => `${value}%`,
        description:
          "Lower quality = smaller file size, Higher quality = better images in PDF",
      },
      dpi: {
        min: 72,
        max: 600,
        default: 300,
        label: "DPI",
        step: 72,
        format: (value) => `${value} DPI`,
        description:
          "Lower DPI = smaller file size, Higher DPI = sharper images",
      },
    },
  },
  {
    id: "jpg-to-pdf",
    title: "JPG to PDF",
    supportedTypes: ["image"],
    customSettings: {
      pageSize: {
        options: ["A4", "Letter", "Legal"],
        default: "A4",
        label: "Page Size",
        description: "Select the size of your PDF page",
      },
      orientation: {
        options: ["Portrait", "Landscape"],
        default: "Portrait",
        label: "Orientation",
        description:
          "Choose page orientation (Portrait = vertical, Landscape = horizontal)",
      },
      margin: {
        min: 0,
        max: 50,
        default: 10,
        label: "Margin (mm)",
        step: 5,
        format: (value) => `${value} mm`,
        description: "Set the page margin in millimeters",
      },
    },
  },
];

function FeatureSelector({
  selectedFiles,
  selectedFeature,
  onFeatureSelect,
  onModeChange,
  onProcessStart,
  isProcessing,
  isCompleted,
  customSettings,
  onCustomSettingsChange,
  onReset,
}) {
  const [processingMode, setProcessingMode] = useState("auto");

  // Initialize custom settings when feature changes
  useEffect(() => {
    const currentFeature = features.find((f) => f.id === selectedFeature);
    if (currentFeature && processingMode === "custom") {
      const initialSettings = {};
      Object.entries(currentFeature.customSettings).forEach(
        ([key, setting]) => {
          initialSettings[key] = setting.default;
        }
      );
      onCustomSettingsChange(initialSettings);
    }
  }, [selectedFeature, processingMode]);

  const getAvailableFeatures = (files) => {
    if (!files || files.length === 0) return features;
    const fileType = getFileType(files[0].name);
    return features.map((feature) => ({
      ...feature,
      disabled: !feature.supportedTypes.includes(fileType),
    }));
  };

  const handleSettingChange = (settingKey, value) => {
    const newSettings = { ...customSettings, [settingKey]: value };
    onCustomSettingsChange(newSettings);
  };

  const getCurrentFeature = () => {
    return features.find((f) => f.id === selectedFeature);
  };

  const toggleProcessingMode = () => {
    const newMode = processingMode === "auto" ? "custom" : "auto";
    setProcessingMode(newMode);
    onModeChange(newMode === "custom");

    // Initialize custom settings when switching to custom mode
    if (newMode === "custom") {
      const currentFeature = getCurrentFeature();
      if (currentFeature) {
        const initialSettings = {};
        Object.entries(currentFeature.customSettings).forEach(
          ([key, setting]) => {
            initialSettings[key] = setting.default;
          }
        );
        onCustomSettingsChange(initialSettings);
      }
    } else {
      onCustomSettingsChange({});
    }
  };

  const handleBack = () => {
    setProcessingMode("auto");
    onCustomSettingsChange({});
    onReset();
  };

  const handleShare = async () => {
    try {
      const shareUrl = "https://yukomp.vercel.app"; // URL produksi
      if (navigator.share) {
        const shareData = {
          title: "Hey! Check out Yukomp",
          text: `Hi! I just compressed ${selectedFiles.length} file(s) using Yukomp - a super easy way to compress your files! 🚀\n\nTry it yourself and save some space! 💪`,
          url: shareUrl,
        };

        await navigator.share(shareData);
        toast.success("Shared successfully! 🎉");
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Hi! I just compressed ${selectedFiles.length} file(s) using Yukomp - a super easy way to compress your files! 🚀\n\nTry it yourself and save some space! 💪\n\n${shareUrl}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Link copied! Share it with your friends! 📋");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Oops! Sharing failed. Try again? 😅");
      }
    }
  };

  return (
    <div className="mt-6 sm:mt-8">
      {isProcessing ? null : (
        <>
          {!isCompleted && (
            <>
              <p className="text-center text-customBlack text-sm sm:text-base mb-3 sm:mb-4 tracking-tight">
                Choose what you'd like to do with your files:
              </p>

              <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                {getAvailableFeatures(selectedFiles).map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => {
                      if (!feature.disabled) {
                        onFeatureSelect(feature.id);
                        onCustomSettingsChange({});
                        setProcessingMode("auto");
                      }
                    }}
                    className={`py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl border text-sm sm:text-base
                      ${
                        feature.disabled
                          ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          : selectedFeature === feature.id
                          ? "border-customBlack text-customBlack"
                          : "border-gray-300 bg-white text-customGray hover:border-gray-400"
                      }
                    `}
                    disabled={feature.disabled}
                  >
                    {feature.title}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pt-4 sm:pt-6">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {isCompleted ? (
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto bg-[#1F1F1F] text-white py-2.5 px-6 rounded-lg sm:rounded-xl hover:bg-[#2a2a2a] transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={toggleProcessingMode}
                  className="relative flex items-center space-x-2 py-2.5 px-4 sm:px-5 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-customGray hover:border-gray-400 text-sm sm:text-base transition-all duration-200"
                >
                  {processingMode === "auto" ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg border border-gray-400 flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-lg bg-gray-600"></div>
                    </div>
                  ) : (
                    <FiSettings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 regular-icon" />
                  )}
                  <span className="font-medium">
                    {processingMode === "auto" ? "Auto" : "Custom"}
                  </span>
                </button>
              )}
              {processingMode === "custom" && !isCompleted && (
                <span className="text-sm sm:text-base text-gray-500">
                  Customize processing settings
                </span>
              )}
            </div>

            {isCompleted ? (
              <button
                onClick={handleShare}
                className="w-full sm:w-auto relative flex items-center justify-center space-x-2 py-2.5 px-4 sm:px-5 rounded-lg sm:rounded-xl border border-gray-300 bg-white text-customGray hover:border-gray-400 text-sm sm:text-base transition-all duration-200"
              >
                <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 regular-icon" />
                <span className="font-medium">Share</span>
              </button>
            ) : (
              <button
                className="w-full sm:w-auto bg-[#1F1F1F] text-white py-2.5 px-6 rounded-lg sm:rounded-xl hover:bg-[#2a2a2a] transition-colors duration-200 font-medium text-sm sm:text-base"
                onClick={onProcessStart}
              >
                Start Processing
              </button>
            )}
          </div>

          {processingMode === "custom" && !isCompleted && (
            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              {Object.entries(getCurrentFeature()?.customSettings || {}).map(
                ([key, setting]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm sm:text-base text-gray-600">
                      {setting.label}
                    </label>
                    {setting.description && (
                      <p className="text-xs sm:text-sm text-gray-500 mb-2">
                        {setting.description}
                      </p>
                    )}
                    {setting.options ? (
                      <select
                        value={customSettings[key] || setting.default}
                        onChange={(e) =>
                          handleSettingChange(key, e.target.value)
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-customBlack focus:border-transparent"
                      >
                        {setting.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min={setting.min}
                          max={setting.max}
                          step={setting.step || 1}
                          value={customSettings[key] || setting.default}
                          onChange={(e) =>
                            handleSettingChange(key, parseInt(e.target.value))
                          }
                          className="flex-grow"
                        />
                        <span className="text-sm sm:text-base text-gray-600 w-12 text-right">
                          {setting.format
                            ? setting.format(
                                customSettings[key] || setting.default
                              )
                            : customSettings[key] || setting.default}
                        </span>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FeatureSelector;
