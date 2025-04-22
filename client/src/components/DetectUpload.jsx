import React, { useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function DetectUpload() {
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

  // Prepare chart data if result is available
  const chartData = result ? [
    {
      label: 'real',
      confidence: result.label === 'real' ? result.confidence * 100 : (1 - result.confidence) * 100
    },
    {
      label: 'fake',
      confidence: result.label === 'fake' ? result.confidence * 100 : (1 - result.confidence) * 100
    }
  ] : [];

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
          Upload & Detect
        </button>
      </div>

      {audioURL && (
        <div className="mt-6">
          <p className="mb-2 text-gray-700 font-semibold">Preview Audio:</p>
          <audio controls src={audioURL} className="w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      )}

      {result && (
        <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow-inner">
          <p className="text-gray-800 font-semibold mb-1">Label: <span className="font-normal">{result.label}</span></p>
          <p className="text-gray-800 font-semibold mb-4">Confidence: <span className="font-normal">{(result.confidence * 100).toFixed(2)}%</span></p>

          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: '#4B5563', fontWeight: '600' }} />
                <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} tick={{ fill: '#4B5563', fontWeight: '600' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Bar dataKey="confidence" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetectUpload;
