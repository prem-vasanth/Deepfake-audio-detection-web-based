import { useState, useRef, useEffect } from "react";
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
    <div className="App">
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>

      <div className="grid grid-cols-5 grid-rows-5 gap-4">
        <div className="col-span-5">
          {!isRecording && audioURL && <audio src={audioURL} controls />}
        </div>
        
        <div className="mt-4">
          <h2>{result.label}</h2>
          <h3>Confidence: {(result.confidence * 100).toFixed(2)}%</h3>
        </div>

        {/* Display the Bar Chart */}
        {result.label !== "Start Detecting" && (
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
        )}
      </div>
    </div>
  );
}

export default DetectRecord;
