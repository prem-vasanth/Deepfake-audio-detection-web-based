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
    <div style={{ padding: '2rem' }}>
      <h1>Classification Result</h1>

      {Res ? (
        <>
          <p><strong>File Name:</strong> {Res.filename}</p>
          <p><strong>Upload Time:</strong> {new Date(Res.upload_time).toLocaleString()}</p>

          <h3>Audio Preview</h3>
          <audio controls>
            <source
              src={`data:${Res.content_type};base64,${Res.audio_data_base64}`}
              type={Res.content_type}
            />
            Your browser does not support the audio element.
          </audio>

          <h3 style={{ marginTop: '2rem' }}>Confidence Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip />
              <Bar dataKey="confidence" fill="#8884d8">
                <LabelList dataKey="confidence" position="top" formatter={(value) => `${value}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ClassifyResult
