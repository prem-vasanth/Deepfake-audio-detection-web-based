import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import DetectUpload from './components/DetectUpload';
import DetectRecord from './components/DetectRecord';
import SpectrogramCheck from './components/SpectrogramCheck';
import History from './components/History';
import ClassifyResult from './components/ClassifyResult';
import Spectro from './components/Spectro';
import About from './components/About';
import HowToUse from './components/HowToUse';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black text-white">
        {/* Navbar */}
        <nav className="navbar flex space-x-6 p-4 bg-gray-900 shadow-md z-10 fixed w-full top-0">
          {[
            { to: "/", label: "Home" },
            { to: "/About", label: "About" },
            { to: "/HowToUse", label: "How to Use" },
            { to: "/DetectUpload", label: "Upload" },
            { to: "/DetectRecord", label: "Record" },
            { to: "/SpectrogramCheck", label: "Spectrogram" },
            { to: "/History", label: "Logs" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-white font-semibold transform hover:scale-110 transition-all duration-500 ease-in-out hover:text-blue-400"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-grow pt-24 p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/HowToUse" element={<HowToUse />} />
            <Route path="/DetectUpload" element={<DetectUpload />} />
            <Route path="/DetectRecord" element={<DetectRecord />} />
            <Route path="/SpectrogramCheck" element={<SpectrogramCheck />} />
            <Route path="/History" element={<History />} />
            <Route path="/classifyResult/:id" element={<ClassifyResult />} />
            <Route path="/spectro/:id" element={<Spectro />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
