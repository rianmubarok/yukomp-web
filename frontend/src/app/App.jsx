import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import FileUpload from "./components/FileUpload";
import { compressFile } from "./services/api";
import { downloadFile } from "./utils/fileUtils";
import { FiArrowLeft, FiImage, FiFileText, FiLoader } from "react-icons/fi";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import StyleDebug from "./pages/StyleDebug";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const mb = bytes / (1024 * 1024);
  const kb = bytes / 1024;

  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  } else {
    return `${kb.toFixed(2)} KB`;
  }
};

const Home = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionType, setCompressionType] = useState("image");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isLargePng, setIsLargePng] = useState(false);
  const [isPngFile, setIsPngFile] = useState(false);

  const handleStartProcess = async (files) => {
    setIsCompressing(true);
    setUploadProgress(0);

    // Check if any file is a PNG file
    const hasPngFile = files.some((file) => file.type === "image/png");
    setIsPngFile(hasPngFile);

    try {
      const compressedData = await compressFile(
        files,
        compressionType,
        setUploadProgress
      );

      let downloadName;
      if (compressionType === "image" && files.length > 1) {
        downloadName = "compressed_images.zip";
      } else if (files.length > 0) {
        const originalName = files[0].name;
        const extension = originalName.split(".").pop().toLowerCase();
        downloadName = `compressed_${originalName}`;
      } else {
        return;
      }

      downloadFile(compressedData, downloadName);
      toast.success(
        files.length > 1
          ? "Files compressed successfully!"
          : "File compressed successfully!"
      );
      setShowThankYou(true);
    } catch (error) {
      const errorMessage =
        error.message || "Error compressing file(s). Please try again.";
      const additionalGuidance =
        files.length > 1
          ? " If the error persists, try compressing files one by one."
          : "";

      toast.error(
        <div>
          <p>{errorMessage}</p>
          {files.length > 1 && (
            <p className="mt-1 text-sm">
              If the error persists, try compressing files one by one.
            </p>
          )}
        </div>
      );
      console.error("Compression error:", error);
    } finally {
      setIsCompressing(false);
      setUploadProgress(0);
      setSelectedFiles([]);
    }
  };

  const handleReset = () => {
    setShowThankYou(false);
    setSelectedFiles([]);
    setCompressionType("image");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div
        className={`transition-all duration-500 ${
          showThankYou ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <div className="text-center">
          {!isCompressing ? (
            <>
              <h1 className="text-6xl font-bold mb-2 tracking-tight">
                Your All-in-one File
              </h1>
              <h1 className="text-6xl font-bold mb-4 tracking-tight">
                Processing Tool
              </h1>
              <p className="text-lg mb-8">
                Drop Your File(s). We'll Handle The Rest
              </p>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-bold mb-2 tracking-tight">
                Please Wait
              </h1>
              <h1 className="text-6xl font-bold mb-4 tracking-tight">
                We're working on your files
              </h1>
              <div className="w-64 h-64 mx-auto mb-8">
                <DotLottieReact
                  src="https://lottie.host/7ffaf54c-fc48-4cd9-9459-b18d765a5e18/X232jk2jah.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <p className="text-lg mb-8">
                {isPngFile
                  ? "PNG compression can sometimes take a while, please wait a moment..."
                  : "This may take a moment..."}
              </p>
            </>
          )}
        </div>

        {!isCompressing && (
          <FileUpload
            onDrop={(acceptedFiles) => setSelectedFiles(acceptedFiles)}
            compressionType={compressionType}
            setCompressionType={setCompressionType}
            isCompressing={isCompressing}
            uploadProgress={uploadProgress}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onStartProcess={handleStartProcess}
          />
        )}

        {isCompressing && selectedFiles.length > 0 && (
          <div className="mt-6 space-y-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="py-4 px-6 bg-gray-200 rounded-full flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {file.type.startsWith("image/") ? (
                    <FiImage className="h-6 w-6 text-gray-600" />
                  ) : (
                    <FiFileText className="h-6 w-6 text-gray-600" />
                  )}
                  <div>
                    <span className="text-gray-800 text-sm font-medium">
                      {file.name}
                    </span>
                    <p className="text-gray-600 text-xs">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 flex-grow mx-4">
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700 w-10 text-right">
                    {uploadProgress}%
                  </span>
                </div>

                <div className="flex items-center justify-center w-6 h-6">
                  <FiLoader className="animate-spin text-gray-600 h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={`transition-all duration-500 ${
          showThankYou ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        }`}
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 tracking-tight">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your file has been processed successfully.
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Process Another File
          </button>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [serverStatus, setServerStatus] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const isProduction =
          window.location.hostname !== "localhost" &&
          window.location.hostname !== "127.0.0.1";
        const response = await fetch(
          `${isProduction ? "" : "http://localhost:5000"}/api/health`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );
        setServerStatus(response.ok);
      } catch (error) {
        setServerStatus(false);
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative flex justify-between items-center px-4">
      <nav className="flex items-center space-x-10">
        <Link
          to="/"
          className={`px-6 py-2 rounded-full text-sm transition-colors ${
            isActive("/")
              ? "bg-black text-white"
              : "text-black hover:bg-gray-100"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`px-6 py-2 rounded-full text-sm transition-colors ${
            isActive("/about")
              ? "bg-black text-white"
              : "text-black hover:bg-gray-100"
          }`}
        >
          About
        </Link>
      </nav>
      <div className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold">
        Yukomp
      </div>
      <nav className="flex items-center space-x-10">
        <Link
          to="/analytics"
          className={`px-6 py-2 rounded-full text-sm transition-colors ${
            isActive("/analytics")
              ? "bg-black text-white"
              : "text-black hover:bg-gray-100"
          }`}
        >
          Analytics
        </Link>
        <div className="px-6 py-2 rounded-full text-sm text-black flex items-center">
          Server Status
          <div
            className={`w-2 h-2 rounded-full ml-2 ${
              serverStatus ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
        </div>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8 font-sans">
        <ToastContainer position="top-right" />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/style-debug" element={<StyleDebug />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
