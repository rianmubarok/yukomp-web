import { FiArrowLeft } from "react-icons/fi";

const ThankYou = ({ onReset }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 tracking-tight">
        Thank You!
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
        Your processed file will be downloaded automatically.
      </p>
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="text-black font-medium flex items-center group"
        >
          {/* Icon Part with Round Background */}
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-lightGreen rounded-full -mr-4 group-hover:-mr-1 transition-all">
            <FiArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 regular-icon rotate-[45deg] transition-transform group-hover:rotate-0" />
          </div>

          {/* Text Part */}
          <span className="py-2.5 sm:py-3 px-4 sm:px-6 bg-lightGreen rounded-full text-sm sm:text-base">
            Process Another File
          </span>
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
