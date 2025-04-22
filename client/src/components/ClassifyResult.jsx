import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts'

function ClassifyResult() {
  const { id } = useParams()
  const [Res, setRes] = useState(null)

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/history/classifyResult/${id}`)
        if (res.data) {
          setRes(res.data.result)
          console.log(res.data.result)
        } else {
          console.log("no data")
        }
      } catch (err) {
        console.log("unable to fetch the record")
      }
    }

    fetch_data()
  }, [id])

  const data = Res ? [
    {
      label: Res.classification_result.label.toUpperCase(),
      confidence: +(Res.classification_result.confidence * 100).toFixed(2)
    },
    {
      label: Res.classification_result.label.toUpperCase() === 'REAL' ? 'FAKE' : 'REAL',
      confidence: 100 - +(Res.classification_result.confidence * 100).toFixed(2)
    }
  ] : []

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Classification Result</h1>

      {Res ? (
        <>
          <p className="mb-2 text-gray-700">
            <span className="font-semibold">File Name:</span> {Res.filename}
          </p>
          <p className="mb-6 text-gray-700">
            <span className="font-semibold">Upload Time:</span> {new Date(Res.upload_time).toLocaleString()}
          </p>

          <h3 className="text-xl font-semibold mb-3 text-gray-800">Audio Preview</h3>
          <audio
            controls
            className="w-full rounded-md border border-gray-300 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <source
              src={`data:${Res.content_type};base64,${Res.audio_data_base64}`}
              type={Res.content_type}
            />
            Your browser does not support the audio element.
          </audio>

          <h3 className="text-xl font-semibold mb-4 text-gray-800">Confidence Score</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: '#4B5563', fontWeight: '600' }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#4B5563', fontWeight: '600' }} />
                <Tooltip />
                <Bar dataKey="confidence" fill="#6366F1" /* Indigo-500 */>
                  <LabelList dataKey="confidence" position="top" formatter={(value) => `${value}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 text-lg">Loading...</p>
      )}
    </div>
  )
}

export default ClassifyResult
