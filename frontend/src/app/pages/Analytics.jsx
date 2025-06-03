import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Analytics = () => {
  const [serverStatus, setServerStatus] = useState({
    local: false,
    production: false,
    backend: false,
    fileProcessing: false,
  });

  const checkEndpoint = async (url) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request timeout");
      } else {
        console.error("Error checking endpoint:", error);
      }
      return false;
    }
  };

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Check if we're in production or local environment
        const isProduction =
          window.location.hostname !== "localhost" &&
          window.location.hostname !== "127.0.0.1";

        // Check local server status
        if (!isProduction) {
          const localStatus = await checkEndpoint(
            "http://localhost:5000/api/health"
          );
          setServerStatus((prev) => ({ ...prev, local: localStatus }));
        }

        // Check production server status
        if (isProduction) {
          const prodStatus = await checkEndpoint("/api/health");
          setServerStatus((prev) => ({ ...prev, production: prodStatus }));
        }

        // Check backend API status
        const backendStatus = await checkEndpoint(
          `${isProduction ? "" : "http://localhost:5000"}/api/health`
        );
        setServerStatus((prev) => ({ ...prev, backend: backendStatus }));

        // Check file processing service
        const fileServiceStatus = await checkEndpoint(
          `${
            isProduction ? "" : "http://localhost:5000"
          }/api/file-service-health`
        );
        setServerStatus((prev) => ({
          ...prev,
          fileProcessing: fileServiceStatus,
        }));
      } catch (error) {
        console.error("Error checking server status:", error);
        // Set all statuses to false if there's an error
        setServerStatus({
          local: false,
          production: false,
          backend: false,
          fileProcessing: false,
        });
      }
    };

    checkServerStatus();
    // Check status every 5 seconds instead of 30
    const interval = setInterval(checkServerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const isProduction =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          Server Analytics
        </h1>
        <p className="text-xl">Real-time server status monitoring</p>
      </div>

      <div className="bg-white rounded-4xl border border-lightGrayBlue p-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Server Status</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {!isProduction && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Local Server</h3>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          serverStatus.local ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`font-medium ${
                          serverStatus.local ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {serverStatus.local ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Running on: http://localhost:5000
                  </p>
                </div>
              )}
              {isProduction && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Production Server</h3>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          serverStatus.production
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span
                        className={`font-medium ${
                          serverStatus.production
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {serverStatus.production ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Running on: {window.location.origin}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">System Information</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Backend API Status</span>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        serverStatus.backend ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${
                        serverStatus.backend ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {serverStatus.backend ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">File Processing Service</span>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        serverStatus.fileProcessing
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`font-medium ${
                        serverStatus.fileProcessing
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {serverStatus.fileProcessing ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
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

export default Analytics;
