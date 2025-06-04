import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import StyleDebug from "./pages/StyleDebug";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 py-5 px-4 sm:px-6 lg:px-8 font-sans">
        <ToastContainer position="top-right" />
        <Header />
        <main className="min-h-[calc(100vh-200px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/style-debug" element={<StyleDebug />} />
          </Routes>
        </main>
      </div>
      {location.pathname === "/style-debug" && <Footer />}
      <ToastContainer position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
