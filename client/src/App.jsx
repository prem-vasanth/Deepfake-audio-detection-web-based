import { useState } from 'react'
import { BrowserRouter,Routes,Route,Link } from 'react-router-dom'
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
    <div>
      <nav>
          <Link to="/">Home</Link>
          <Link to="/DetectUpload"> Upload </Link>
          <Link to="/DetectRecord">Record</Link>
          <Link to="/SpectrogramCheck">Spectrogram</Link>
          <Link to="/History">Logs</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/DetectUpload" element={<DetectUpload/>}></Route>
        <Route path="/DetectRecord" element={<DetectRecord/>}></Route>
        <Route path="/SpectrogramCheck" element={<SpectrogramCheck/>}/>
        <Route path="/History" element={<History/>}></Route>
        <Route path="/classifyResult/:id" element={<ClassifyResult></ClassifyResult>}></Route>
        <Route path="/spectro/:id" element={<Spectro/>}></Route>
      </Routes>
   </div>
   </BrowserRouter>
  )
}

export default App
