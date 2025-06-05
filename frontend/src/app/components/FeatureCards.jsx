import React from "react";
import bg1 from "../../assets/bg1.png";
import bg2 from "../../assets/bg2.png";
import bg3 from "../../assets/bg3.png";
import imgPng from "../../assets/jpg.png";
import PdfPng1 from "../../assets/pdf1.png";
import PdfPng2 from "../../assets/pdf2.png";

const FeatureCards = ({ compressionType, setCompressionType }) => {
  const features = [
    {
      id: "image",
      title: "Image Compression",
      description: "Compress image(s) while maintaining quality",
      bgImage: bg1,
      icon: imgPng,
    },
    {
      id: "jpg-to-pdf",
      title: "JPG to PDF",
      description: "Convert image(s) to PDF document",
      bgImage: bg2,
      icon: PdfPng1,
    },
    {
      id: "pdf",
      title: "PDF Compression",
      description: "Compress PDF file(s) to reduce size",
      bgImage: bg3,
      icon: PdfPng2,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center gap-4">
      {features.map((feature) => (
        <div
          key={feature.id}
          onClick={() => setCompressionType(feature.id)}
          className={`bg-white rounded-2xl border p-3 md:p-4 flex flex-row md:flex-col items-center text-center w-full md:w-[250px] h-[72px] md:h-auto group cursor-pointer transition-all duration-300 ${
            compressionType === feature.id
              ? "border-blue-500 scale-[1.02]"
              : "border-lightGrayBlue hover:border-blue-300"
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
                compressionType === feature.id
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
  );
};

export default FeatureCards;
