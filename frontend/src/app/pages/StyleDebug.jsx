import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import FeatureStylePreview from "../components/FeatureStylePreview";

const StyleDebug = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">Style Debug</h1>
        <p className="text-xl">Preview and test different UI styles</p>
      </div>

      <div className="bg-white rounded-4xl border border-lightGrayBlue p-8">
        <FeatureStylePreview />
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default StyleDebug;
