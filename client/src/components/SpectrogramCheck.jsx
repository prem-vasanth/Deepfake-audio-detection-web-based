import React, { useState } from 'react'
import axios from 'axios'

function SpectrogramCheck() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null); // For audio preview
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAudioURL(URL.createObjectURL(selectedFile)); // Create a local URL
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/spectrogramCheck', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(res.data.result);
      setResult(res.data.result);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to detect audio.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="audio/*"
          onChange={handleChange}
          className="block w-full text-gray-700 file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700
            cursor-pointer"
        />
        <button
          onClick={handleUpload}
          className="px-5 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Check Spectrogram
        </button>
      </div>

      {audioURL && (
        <div className="mt-6">
          <p className="mb-2 text-gray-700 font-semibold">Preview Audio:</p>
          <audio
            controls
            src={audioURL}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 rounded-xl shadow-md bg-gray-50 space-y-6">
          {/* Spectrogram Image */}
          <div>
            <img
              src={`data:image/png;base64,${result.spectrogram_image_base64}`}
              alt="Mel Spectrogram"
              className="w-full rounded-md"
            />
          </div>

          {/* Metrics */}
          <div className="text-sm space-y-2 text-gray-700">
            <p>🎧 <span className="font-semibold">Duration:</span> {result.duration_sec} sec</p>
            <p>🎚️ <span className="font-semibold">Low Frequency Energy Ratio:</span> {result.low_freq_energy_ratio}</p>
            <p>🎚️ <span className="font-semibold">High Frequency Energy Ratio:</span> {result.high_freq_energy_ratio}</p>
            <p>📊 <span className="font-semibold">Spectral Flatness:</span> {result.spectral_flatness}</p>
          </div>

          {/* Indicators */}
          {result.deepfake_indicators.length > 0 && (
            <div>
              <h3 className="text-red-600 font-medium mb-2">⚠️ Deepfake Indicators:</h3>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                {result.deepfake_indicators.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {result.natural_indicators.length > 0 && (
            <div>
              <h3 className="text-green-600 font-medium mb-2">✅ Natural Indicators:</h3>
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                {result.natural_indicators.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SpectrogramCheck
