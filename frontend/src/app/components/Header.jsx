import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

export default Header;
