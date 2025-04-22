import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import DetectUpload from './components/DetectUpload'
import DetectRecord from './components/DetectRecord'
import SpectrogramCheck from './components/SpectrogramCheck'
import History from './components/History'
import ClassifyResult from './components/ClassifyResult'
import Spectro from './components/Spectro'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md p-4 flex space-x-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            Home
          </Link>
          <Link to="/DetectUpload" className="text-blue-600 hover:text-blue-800 font-semibold">
            Upload
          </Link>
          <Link to="/DetectRecord" className="text-blue-600 hover:text-blue-800 font-semibold">
            Record
          </Link>
          <Link to="/SpectrogramCheck" className="text-blue-600 hover:text-blue-800 font-semibold">
            Spectrogram
          </Link>
          <Link to="/History" className="text-blue-600 hover:text-blue-800 font-semibold">
            Logs
          </Link>
        </nav>
        <main className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
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
  )
}

export default App
