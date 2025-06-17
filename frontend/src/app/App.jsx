import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Analytics from "./pages/Analytics";

const ROUTES = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/analytics", element: <Analytics /> },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F1F1F1]">
        <div className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 font-sans">
          <ToastContainer position="top-right" />
          <main className="min-h-[calc(100vh-180px)] sm:min-h-[calc(100vh-200px)]">
            <Routes>
              {ROUTES.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </main>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
