import React, { useState } from 'react'
import axios from 'axios'

function SpectrogramCheck() {

     const [file, setFile] = useState(null);
      const [audioURL, setAudioURL] = useState(null); //For audio preview
      const [result, setResult] = useState(null);

      const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setAudioURL(URL.createObjectURL(selectedFile)); //Create a local URL
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
    <div>
        
      <input type="file" accept="audio/*" onChange={handleChange} />
      <button onClick={handleUpload} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Upload & Detect</button>

      {audioURL && (
        <div className="mt-4">
          <p className="mb-1"><strong>Preview Audio:</strong></p>
          <audio controls src={audioURL} className="w-full" />
        </div>
      )}

      { result &&(
       
       <div className="p-4 rounded-xl shadow-md bg-white space-y-4">
      {/* Verdict */}
      

      {/* Spectrogram Image */}
      <div className="mt-2">
        <img
          src={`data:image/png;base64,${result.spectrogram_image_base64}`}
          alt="Mel Spectrogram"
          className="w-full rounded-md"
        />
      </div>

      {/* Metrics */}
      <div className="mt-4 text-sm space-y-1">
        <p>🎧 Duration: {result.duration_sec} sec</p>
        <p>🎚️ Low Frequency Energy Ratio: {result.low_freq_energy_ratio}</p>
        <p>🎚️ High Frequency Energy Ratio: {result.high_freq_energy_ratio}</p>
        <p>📊 Spectral Flatness: {result.spectral_flatness}</p>
      </div>

      {/* Indicators */}
      {result.deepfake_indicators.length > 0 && (
        <div className="mt-3">
          <h3 className="text-red-600 font-medium">⚠️ Deepfake Indicators:</h3>
          <ul className="list-disc ml-5 text-sm">
            {result.deepfake_indicators.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.natural_indicators.length > 0 && (
        <div className="mt-3">
          <h3 className="text-green-600 font-medium">✅ Natural Indicators:</h3>
          <ul className="list-disc ml-5 text-sm">
            {result.natural_indicators.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
      )

      }

    </div>
  )
}

export default SpectrogramCheck
