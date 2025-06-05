import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import FileUpload from "../components/FileUpload";
import FileProgress from "../components/FileProgress";
import ThankYou from "../components/ThankYou";
import { compressFile, convertJpgToPdf } from "../services/api";
import { downloadFile } from "../utils/fileUtils";
import { animationStyles } from "../utils/animations";

const Home = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressionType, setCompressionType] = useState("image");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isPngFile, setIsPngFile] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const rotatingTexts = [
    "Drop Your File(s). We'll Handle The Rest",
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

  const handleStartProcess = async (files) => {
    if (compressionType === "jpg-to-pdf") {
      setIsConverting(true);
      try {
        const pdfBlob = await convertJpgToPdf(files);
        downloadFile(pdfBlob, `converted_${new Date().getTime()}.pdf`);
        toast.success("Images successfully converted to PDF!");
        setShowThankYou(true);
      } catch (error) {
        toast.error(error.message || "Failed to convert images to PDF");
      } finally {
        setIsConverting(false);
        setSelectedFiles([]);
      }
      return;
    }

    setIsCompressing(true);
    setUploadProgress(0);

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
      } else if (compressionType === "pdf" && files.length > 1) {
        downloadName = "compressed_pdfs.zip";
      } else if (files.length > 0) {
        const originalName = files[0].name;
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
    <div
      className={`max-w-3xl mx-auto ${
        isCompressing || isConverting ? "mt-10" : "mt-20 sm:mt-4 md:mt-6"
      } px-3 sm:px-4 md:px-6 py-4 sm:py-4 mb-8 sm:mb-12 md:mb-16`}
    >
      <style>{animationStyles}</style>
      <div
        className={`transition-all duration-500 ${
          showThankYou ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <div className="text-center">
          {!isCompressing && !isConverting ? (
            <>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Your All-in-one File
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-3 tracking-tight">
                Processing Tool
              </h1>
              <div className="h-10 sm:h-12 relative overflow-visible">
                <div
                  key={currentTextIndex}
                  className={`text-sm sm:text-base md:text-lg absolute w-full ${
                    isAnimating
                      ? "animate-slide-up-fade-out"
                      : "animate-slide-up-fade-in"
                  }`}
                >
                  {rotatingTexts[currentTextIndex]}
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Please Wait
              </h1>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 tracking-tight whitespace-nowrap">
                We're working on your files
              </h1>
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mx-auto mb-4 sm:mb-6 md:mb-8">
                <DotLottieReact
                  src="https://lottie.host/7ffaf54c-fc48-4cd9-9459-b18d765a5e18/X232jk2jah.lottie"
                  loop
                  autoplay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
                {isPngFile
                  ? "PNG compression can sometimes take a while, please wait a moment..."
                  : "This may take a moment..."}
              </p>
            </>
          )}
        </div>

        {!isCompressing && !isConverting && (
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

        {(isCompressing || isConverting) && selectedFiles.length > 0 && (
          <FileProgress files={selectedFiles} uploadProgress={uploadProgress} />
        )}
      </div>

      <div
        className={`transition-all duration-500 ${
          showThankYou ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        }`}
      >
        <ThankYou onReset={handleReset} />
      </div>
    </div>
  );
};

export default Home;
