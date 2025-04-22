import { useState, useRef } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

function DetectRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState({ label: "Start Detecting", confidence: 0 });
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const uploadAudio = (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recorded.wav");

    axios.post("http://127.0.0.1:8000/detectRecord", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        const { result } = response.data;  // Backend response containing label and confidence
        setResult(result);  // Set result state with the returned data
        console.log('Backend response:', result);
      })
      .catch((err) => console.error("Upload failed:", err));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.current.push(event.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        uploadAudio(audioBlob);  // Send audio for processing
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Prepare chart data based on the result
  const chartData = [
    {
      label: 'real',
      confidence: result.label === 'real' ? result.confidence * 100 : (1 - result.confidence) * 100
    },
    {
      label: 'fake',
      confidence: result.label === 'fake' ? result.confidence * 100 : (1 - result.confidence) * 100
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-5 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isRecording
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className={`px-5 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            !isRecording
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          Stop Recording
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        <div className="col-span-1 md:col-span-5">
          {!isRecording && audioURL && (
            <audio
              src={audioURL}
              controls
              className="w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
        {result.label !== "Start Detecting" &&  (<h2 className="text-2xl font-bold text-gray-800">{result.label}</h2>) }
        {result.label !== "Start Detecting" &&  (<h3 className="text-lg text-gray-700">
            Confidence: <span className="font-semibold">{(result.confidence * 100).toFixed(2)}%</span>
          </h3>) }
        </div>

        {result.label !== "Start Detecting" && (
          <div className="col-span-1 md:col-span-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: '#4B5563', fontWeight: '600' }} />
                <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} tick={{ fill: '#4B5563', fontWeight: '600' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Bar dataKey="confidence" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default DetectRecord;
