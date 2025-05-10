import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function History() {
  const [Classify, setClassify] = useState(null);
  const [Spect, setSpect] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/history/classify');
        if (res.data) {
          setClassify(res.data.result);
        }

        const res2 = await axios.get('http://127.0.0.1:8000/history/spect');
        if (res2.data) {
          setSpect(res2.data.result);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchData();
  }, []);

  const handleClassify = (id) => {
    navigate(`/classifyResult/${id}`);
  };

  const handleSpect = (id) => {
    navigate(`/spectro/${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Classification History</h2>
        {Classify ? (
          <div className="space-y-6 mb-10">
            {Classify.map((item, index) => (
              <div key={index} className="p-4 border border-gray-700 rounded-md shadow-sm bg-zinc-800 hover:shadow-md transition-shadow">
                <p><span className="font-semibold">Filename:</span> {item.filename}</p>
                <p className="text-gray-300"><span className="font-semibold">Uploaded At:</span> {new Date(item.upload_time).toLocaleString()}</p>
                <p><span className="font-semibold">Result:</span> {item.classification_result.label}</p>
                <button
                  onClick={() => handleClassify(item._id)}
                  className="mt-3 inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                >
                  See Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Loading classification history...</p>
        )}

        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Spectrogram History</h2>
        {Spect ? (
          <div className="space-y-6">
            {Spect.map((item, index) => (
              <div key={index} className="p-4 border border-gray-700 rounded-md shadow-sm bg-zinc-800 hover:shadow-md transition-shadow">
                <p><span className="font-semibold">Filename:</span> {item.filename}</p>
                <p className="text-gray-300"><span className="font-semibold">Uploaded At:</span> {new Date(item.upload_time).toLocaleString()}</p>
                <button
                  onClick={() => handleSpect(item._id)}
                  className="mt-3 inline-block bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                >
                  See Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Loading spectrogram history...</p>
        )}
      </div>
    </div>
  );
}

export default History;
