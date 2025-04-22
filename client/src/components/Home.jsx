import React from 'react'
import architectureImg from '../assets/ArchitectureDiagram.png'

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Audio Detection and Spectrogram Analysis
      </h1>
      <img
        src={architectureImg}
        alt="Architecture"
        className="w-full max-w-3xl rounded-lg shadow-lg"
      />
    </div>
  )
}

export default Home
