import { FiArrowLeft } from "react-icons/fi";

const ThankYou = ({ onReset }) => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold mb-4 tracking-tight">Thank You!</h1>
      <p className="text-xl text-gray-600 mb-4">
        Your processed file will be downloaded automatically.
      </p>
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="text-black font-medium flex items-center group"
        >
          {/* Icon Part with Round Background */}
          <div className="flex items-center justify-center w-12 h-12 bg-lightGreen rounded-full -mr-4 group-hover:-mr-1 transition-all">
            <FiArrowLeft className="h-6 w-6 regular-icon rotate-[45deg] transition-transform group-hover:rotate-0" />
          </div>

          {/* Text Part */}
          <span className="py-3 px-6 bg-lightGreen rounded-full">
            Process Another File
          </span>
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
