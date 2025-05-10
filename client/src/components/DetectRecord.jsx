import { useState, useRef } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';

function DetectRecord() {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState({ label: "Start Detecting", confidence: 0 });
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const uploadAudio = (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recorded.webm");

    axios.post("http://127.0.0.1:8000/detectRecord", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        const { result } = response.data;
        setResult(result);
        console.log("Backend response:", result);
      })
      .catch((err) => console.error("Upload failed:", err));
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          uploadAudio(audioBlob);

          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  const chartData = [
    {
      label: "REAL",
      confidence: result.label === "real" ? result.confidence * 100 : (1 - result.confidence) * 100
    },
    {
      label: "FAKE",
      confidence: result.label === "fake" ? result.confidence * 100 : (1 - result.confidence) * 100
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-white rounded-lg shadow-md">
      <h2 className="text-center mb-6">To use this option please click on the record button and stop when you are done recording.</h2>
      <div className="flex justify-center mb-6">
        <button
          onClick={toggleRecording}
          className={`flex items-center justify-center w-20 h-20 rounded-full ${
            isRecording ? "bg-white" : "bg-white"
          } border-2 border-indigo-600 transition-all focus:outline-none focus:ring-2 focus:ring-black`}
        >
          {isRecording ? (
            <FontAwesomeIcon icon={faStop} className="text-2xl text-black" />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} className="text-2xl text-black" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center justify-center">
        <div className="col-span-1 md:col-span-5 text-center">
          {/* Audio preview container */}
          {!isRecording && audioURL && (
            <div className="bg-white p-4 rounded-lg shadow-md w-3/4 mx-auto text-center">
              <p className="bg-white text-black font-bold">Preview Audio:</p>
              <audio
                controls
                src={audioURL}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Section wrapping Label, Confidence, and BarChart with Hover Effect */}
        <div className="col-span-1 md:col-span-5 text-center transform transition-transform hover:scale-105 duration-300 ease-in-out">
          {/* Label and Confidence */}
          {result.label !== "Start Detecting" && (
            <>
              <p className="text-2xl font-bold">Label: {result.label}</p>
              <h3 className="text-lg">
                Confidence:{" "}
                <span className="font-semibold">{(result.confidence * 100).toFixed(2)}%</span>
              </h3>
            </>
          )}

          {/* BarChart Section */}
          {result.label !== "Start Detecting" && (
            <div className="h-72 flex justify-center items-center">
              <ResponsiveContainer width={550} height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#fff", fontWeight: "600" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickFormatter={(tick) => `${tick}%`}
                    tick={{ fill: "#fff", fontWeight: "600" }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(2)}%`, 'Confidence']}
                    contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: '5px' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="confidence" fill={result.label === 'real' ? "#34D399" : "#F87171"} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetectRecord;
