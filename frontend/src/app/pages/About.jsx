import { FiArrowLeft, FiGithub } from "react-icons/fi";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto mt-6 sm:mt-8 md:mt-10 px-3 sm:px-4 md:px-6">
      <div className="text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tight">
          About Yukomp
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          Your All-in-one File Processing Solution
        </p>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-4xl border border-lightGrayBlue p-4 sm:p-6 md:p-8">
        <div className="space-y-6 sm:space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              What is Yukomp?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
              Yukomp is a powerful file compression tool designed to help you
              optimize your files efficiently. Whether you're working with
              images or PDFs, Yukomp provides a simple and intuitive interface
              to compress your files while maintaining quality. <br />
              The name "Yukomp" comes from the Indonesian phrase "Yuk Kompres!",
              which means "Let's compress!", reflecting the tool's friendly and
              inviting approach to file optimization.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Image Processing
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Compress your images while maintaining quality. Perfect for
                  reducing file size without compromising image clarity.
                </p>
              </div>
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  PDF Processing
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Compress PDF files to reduce their size. Ideal for optimizing
                  document storage and sharing.
                </p>
              </div>
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Image to PDF Conversion
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Convert one or multiple images into a single PDF document.
                  Great for creating digital documents from your photos.
                </p>
              </div>
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  Batch Processing
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Process multiple files at once. Save time by compressing or
                  converting multiple files in a single operation.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              How It Works
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-black text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0 text-sm sm:text-base">
                  1
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Upload Your Files
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Drag and drop your files or click to select them. You can
                    upload multiple files at once for batch processing.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-black text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0 text-sm sm:text-base">
                  2
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Choose Processing Type
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Select the type of processing you need.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-black text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0 text-sm sm:text-base">
                  3
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Get Your Processed Files
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Download your processed files instantly. All processing is
                    done securely in your browser.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Created By
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
                <img
                  src="https://avatars.githubusercontent.com/rianmubarok"
                  alt="Rian Mubarok"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    Muhammad Fitrian Mubarok
                  </h3>
                  <a
                    href="https://github.com/rianmubarok"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                  >
                    <FiGithub className="mr-2" />
                    rianmubarok
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6">
                <img
                  src="https://avatars.githubusercontent.com/genardaryadjaya"
                  alt="Genard Arya Djaya"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    Genard Arya Djaya
                  </h3>
                  <a
                    href="https://github.com/genardaryadjaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-black transition-colors"
                  >
                    <FiGithub className="mr-2" />
                    genardaryadjaya
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

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

export default About;
