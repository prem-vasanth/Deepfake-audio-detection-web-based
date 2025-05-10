import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from 'recharts';

import styles from './ClassifyResult.module.css';

function ClassifyResult() {
  const { id } = useParams();
  const [Res, setRes] = useState(null);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/history/classifyResult/${id}`);
        if (res.data) {
          setRes(res.data.result);
        } else {
          console.log("no data");
        }
      } catch (err) {
        console.log("unable to fetch the record");
      }
    };

    fetch_data();
  }, [id]);

  const data = Res
    ? (() => {
        const confidence = +(Res.classification_result.confidence * 100).toFixed(2);
        const isReal = Res.classification_result.label.toUpperCase() === 'REAL';
        return [
          {
            label: 'REAL',
            confidence: isReal ? confidence : 100 - confidence,
          },
          {
            label: 'FAKE',
            confidence: isReal ? 100 - confidence : confidence,
          }
        ];
      })()
    : [];

  const finalLabel = Res?.classification_result.label.toUpperCase();
  const isFinalReal = finalLabel === 'REAL';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const valueColor = isFinalReal ? '#34D399' : '#F87171'; // green or red based on final result

      return (
        <div
          style={{
            backgroundColor: '#333',
            padding: '10px',
            borderRadius: '5px',
            color: valueColor,
          }}
        >
          <p style={{ color: '#fff', marginBottom: '5px' }}><strong>{label}</strong></p>
          <p style={{ margin: 0 }}>Confidence: {payload[0].value.toFixed(2)}%</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.header}>Classification Result</h1>

        {Res ? (
          <>
            <p className={styles.info}>
              <span className={styles.label}>File Name:</span> {Res.filename}
            </p>
            <p className={styles.info}>
              <span className={styles.label}>Upload Time:</span> {new Date(Res.upload_time).toLocaleString()}
            </p>

            <h3 className={styles.subheader}>Audio Preview</h3>
            <audio controls className={styles.audio}>
              <source
                src={`data:${Res.content_type};base64,${Res.audio_data_base64}`}
                type={Res.content_type}
              />
              Your browser does not support the audio element.
            </audio>

            <h3 className={styles.subheader}>Confidence Score</h3>
            <div className={styles.chart}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="white" />
                  <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} stroke="white" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="confidence">
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.label === 'REAL' ? '#34D399' : '#F87171'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className={styles.loading}>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default ClassifyResult;
