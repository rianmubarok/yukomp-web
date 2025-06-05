import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [serverStatus, setServerStatus] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="relative flex justify-between items-center px-2 sm:px-4 py-2 sm:py-4">
      <style>
        {`
          @keyframes smoothPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes smoothPing {
            0% { transform: scale(1); opacity: 0.75; }
            50% { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(1); opacity: 0; }
          }
          .status-pulse {
            animation: smoothPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .status-ping {
            animation: smoothPing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}
      </style>

      {/* Logo */}
      <div className="text-2xl font-bold lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
        Yukomp
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
        <Link
          to="/"
          className={`px-4 xl:px-6 py-2 rounded-full text-sm transition-colors ${
            isActive("/")
              ? "bg-black text-white"
              : "text-black hover:bg-gray-100"
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`px-4 xl:px-6 py-2 rounded-full text-sm transition-colors ${
            isActive("/about")
              ? "bg-black text-white"
              : "text-black hover:bg-gray-100"
          }`}
        >
          About
        </Link>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
        <Link
          to="/analytics"
          className={`px-4 xl:px-6 py-2 rounded-full text-sm transition-colors ${
            isActive("/analytics")
              ? "bg-black text-white"
              : "text-black hover:bg-gray-100"
          }`}
        >
          Analytics
        </Link>
        <div className="px-4 xl:px-6 py-2 rounded-full text-sm text-black flex items-center">
          Server Status
          <div className="relative ml-2">
            <div
              className={`w-2 h-2 rounded-full ${
                serverStatus ? "bg-green-500" : "bg-red-500"
              } status-pulse transition-colors duration-500`}
            />
            <div
              className={`absolute inset-0 rounded-full ${
                serverStatus ? "bg-green-500" : "bg-red-500"
              } status-ping transition-colors duration-500`}
            />
          </div>
        </div>
      </nav>

      {/* Mobile menu button */}
      <button
        className="lg:hidden p-1.5 sm:p-2 rounded-md hover:bg-gray-100"
        onClick={toggleMenu}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 sm:w-72 bg-white shadow-lg lg:hidden z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-3 sm:p-4">
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleMenu}
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`px-6 py-2 rounded-full text-sm transition-colors ${
                isActive("/")
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
              }`}
              onClick={() => setIsMenuOpen(false)}
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
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/analytics"
              className={`px-6 py-2 rounded-full text-sm transition-colors ${
                isActive("/analytics")
                  ? "bg-black text-white"
                  : "text-black hover:bg-gray-100"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Analytics
            </Link>
            <div className="px-6 py-2 rounded-full text-sm text-black flex items-center">
              Server Status
              <div className="relative ml-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    serverStatus ? "bg-green-500" : "bg-red-500"
                  } status-pulse transition-colors duration-500`}
                />
                <div
                  className={`absolute inset-0 rounded-full ${
                    serverStatus ? "bg-green-500" : "bg-red-500"
                  } status-ping transition-colors duration-500`}
                />
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-40 transition-all duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />
    </header>
  );
};

export default Header;
