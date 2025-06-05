import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import FeatureStylePreview from "../components/FeatureStylePreview";
import FeatureCards from "../components/FeatureCards";

const StyleDebug = () => {
  return (
    <div className="max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-10 px-3 sm:px-4 md:px-6">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tight">
          Style Debug
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          Preview and test different UI styles
        </p>
      </div>

        <FeatureCards />

      <div className="mt-6 sm:mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default StyleDebug;
