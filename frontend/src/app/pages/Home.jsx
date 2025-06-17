import { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import FileUpload from "../components/FileUpload";
import { animationStyles } from "../utils/animations";

const Home = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const rotatingTexts = [
    "Drop Your Files. We'll Handle The Rest",
    "Unggah file-mu. Biar kami yang urus sisanya",
    "Déposez vos fichiers. On s'occupe du reste",
    "Suelta Tu(s) Archivo(s). Nosotros Nos Encargamos Del Resto",
    "ファイルをドロップしてください。あとはお任せください",
    "拖放你的文件，其余的交给我们",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) =>
          prevIndex === rotatingTexts.length - 1 ? 0 : prevIndex + 1
        );
        setIsAnimating(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-full min-h-screen flex flex-col items-center justify-center font-satoshi px-3 sm:px-6 md:px-8">
      <style>
        {`
          ${animationStyles}
          @keyframes slideUpFadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideUpFadeOut {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0;
              transform: translateY(-20px);
            }
          }
          .animate-slide-up-fade-in {
            animation: slideUpFadeIn 0.3s ease-out forwards;
          }
          .animate-slide-up-fade-out {
            animation: slideUpFadeOut 0.3s ease-out forwards;
          }
        `}
      </style>
      <div className="w-full max-w-4xl text-center sm:text-left">
        <div
          className={`transition-all duration-500 ${
            showFileUpload ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-customBlack font-medium tracking-tight whitespace-pre-line">
            Your All-in-one File
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-customBlack font-medium mb-2 sm:mb-4 tracking-tight whitespace-pre-line">
            Processing Tool
          </h1>
          <div className="h-8 sm:h-8 relative overflow-visible">
            <div
              key={currentTextIndex}
              className={`text-sm sm:text-base md:text-lg text-customGray absolute w-full text-center sm:text-left sm:w-auto ${
                isAnimating
                  ? "animate-slide-up-fade-out"
                  : "animate-slide-up-fade-in"
              }`}
            >
              {rotatingTexts[currentTextIndex]}
            </div>
          </div>
          <div className="flex flex-row space-x-3 sm:space-x-4 justify-center sm:justify-start mt-4 sm:mt-6">
            <button
              onClick={() => setShowFileUpload(true)}
              className="text-white flex items-center justify-center sm:justify-start group hover:brightness-95"
            >
              <span className="py-2 sm:py-2.5 md:py-2 px-3 sm:px-6 bg-[#1F1F1F] rounded-lg sm:rounded-xl text-xs sm:text-base group-hover:bg-[#2a2a2a] group-hover:sm:px-8 transition-all duration-300">
                Get Started
              </span>
            </button>
            <Link
              to="/about"
              className="text-customBlack flex items-center justify-center sm:justify-start group hover:brightness-95"
            >
              <span className="py-2 sm:py-2.5 md:py-2 px-3 sm:px-6 bg-white border border-customGray rounded-lg sm:rounded-xl text-xs sm:text-base">
                How It Works
              </span>
              <div className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 md:w-10 md:h-10 bg-white border border-customGray rounded-full -ml-2 sm:-ml-4 group-hover:-ml-1 transition-all">
                <FiArrowRight className="h-4 w-4 sm:h-6 sm:w-6 regular-icon group-hover:regular-icon rotate-[-45deg] transition-transform group-hover:rotate-0" />
              </div>
            </Link>
          </div>
        </div>

        {showFileUpload && (
          <div className="animate-slide-up-fade-in">
            <FileUpload />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
