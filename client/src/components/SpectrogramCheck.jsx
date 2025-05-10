import React, { useState } from 'react'
import axios from 'axios'

function SpectrogramCheck() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [result, setResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAudioURL(URL.createObjectURL(selectedFile));
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

      setResult(res.data.result);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to detect audio.');
    }
  };

  const openModal = (base64Image) => {
    setImageUrl(`data:image/png;base64,${base64Image}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className='text-center mb-6'>To visualise your audio in the form of Spectrogram upload it here and click on the Upload Spectrogram button.</h2>
      <div className="max-w-3xl mx-auto bg-zinc-900 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="audio/*"
            onChange={handleChange}
            className="block w-full text-white file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-white file:text-black
              hover:file:bg-gray-200
              cursor-pointer"
          />
          <button
            onClick={handleUpload}
            className="px-5 py-2 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            Check Spectrogram
          </button>
        </div>

        {audioURL && (
          <div className="mt-6">
            <p className="mb-2 font-semibold">Preview Audio:</p>
            <audio
              controls
              src={audioURL}
              className="w-full rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 rounded-xl shadow-md bg-zinc-800 space-y-6">
            <div>
              <img
                src={`data:image/png;base64,${result.spectrogram_image_base64}`}
                alt="Mel Spectrogram"
                className="w-full rounded-md cursor-pointer"
                onClick={() => openModal(result.spectrogram_image_base64)}
              />
            </div>

            <div className="text-sm space-y-2">
              <p>🎧 <span className="font-semibold">Duration:</span> {result.duration_sec} sec</p>
              <p>🎚️ <span className="font-semibold">Low Frequency Energy Ratio:</span> {result.low_freq_energy_ratio}</p>
              <p>🎚️ <span className="font-semibold">High Frequency Energy Ratio:</span> {result.high_freq_energy_ratio}</p>
              <p>📊 <span className="font-semibold">Spectral Flatness:</span> {result.spectral_flatness}</p>
            </div>

            {result.deepfake_indicators.length > 0 && (
              <div>
                <h3 className="text-red-400 font-medium mb-2">⚠️ Deepfake Indicators:</h3>
                <ul className="list-disc ml-5 text-sm space-y-1">
                  {result.deepfake_indicators.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.natural_indicators.length > 0 && (
              <div>
                <h3 className="text-green-400 font-medium mb-2">✅ Natural Indicators:</h3>
                <ul className="list-disc ml-5 text-sm space-y-1">
                  {result.natural_indicators.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
  <div
    className="fixed inset-0 z-50 flex justify-center items-center bg-black"
    onClick={closeModal} // click outside image to close
  >
    {/* Close Button */}
    <div className="absolute top-4 right-6 z-50">
      <button
        onClick={closeModal}
        className="text-white text-5xl font-bold hover:text-red-500"
        aria-label="Close"
      >
        &times;
      </button>
    </div>

    {/* Image container - stops propagation */}
    <div
      className="bg-transparent"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={imageUrl}
        alt="Full Spectrogram"
        className="w-[90vw] max-w-5xl h-auto rounded-lg shadow-lg border border-white"
      />
    </div>
  </div>
)}


    </div>
  );
}

export default SpectrogramCheck;
