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
    <div className="p-4">
      <input type="file" accept="audio/*" onChange={handleChange} />
      <button onClick={handleUpload} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Upload & Detect</button>

      {audioURL && (
        <div className="mt-4">
          <p className="mb-1"><strong>Preview Audio:</strong></p>
          <audio controls src={audioURL} className="w-full" />
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50 shadow">
          <p><strong>Label:</strong> {result.label}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>

          <div className="mt-4" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Bar dataKey="confidence" fill="#3182CE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetectUpload;
