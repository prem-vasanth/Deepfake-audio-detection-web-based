import React, { useState } from 'react';
import axios from 'axios';
import './DetectUpload.css'; // Add your custom CSS here
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function DetectUpload() {
  const [file, setFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAudioURL(URL.createObjectURL(selectedFile)); // For audio preview
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://127.0.0.1:8000/detectup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(res.data.result);
      console.log('Backend response:', res.data);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to detect audio.');
    }
  };

  const chartData = result ? [
    {
      label: 'REAL',
      confidence: result.label === 'real' ? result.confidence * 100 : (1 - result.confidence) * 100
    },
    {
      label: 'FAKE',
      confidence: result.label === 'fake' ? result.confidence * 100 : (1 - result.confidence) * 100
    }
  ] : [];

  return (
    <div id="container">
      <h2 className='mb-6'>To use this option please choose an audio file and click on Upload & Detect Button.</h2>
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
            Detect & Upload
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
</div>

      {result && (
        <div id="result-section" className="col-span-1 md:col-span-5 text-center transform transition-transform hover:scale-105 duration-300 ease-in-out">
          <p>Label: <span>{result.label}</span></p>
          <p>Confidence: <span>{(result.confidence * 100).toFixed(2)}%</span></p>

          <div id="chart-container" className="h-72 flex justify-center items-center">
              <ResponsiveContainer width={550} height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="white" />
                <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} stroke="white" />
                <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}%`, 'Confidence']}
                  contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: '5px' }} // Tooltip styling
                  labelStyle={{ fontWeight: 'bold' }} // Optional label styling
                />
                <Bar dataKey="confidence" fill={result.label === 'real' ? "#34D399" : "#F87171"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetectUpload;
