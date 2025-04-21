import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Spectro() {
  const { id } = useParams();
  const [Res, setRes] = useState(null);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/history/spectro/${id}`);
        if (res.data) {
          setRes(res.data.result);
          console.log(res.data.result);
        } else {
          console.log("No data");
        }
      } catch (err) {
        console.log("Unable to fetch the record: " + err);
      }
    };

    fetch_data();
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      {Res ? (
        <>
          <h1>Spectrogram Result for {Res.filename}</h1>
          <p><strong>Upload Time:</strong> {new Date(Res.upload_time).toLocaleString()}</p>

          <h3>Audio Preview</h3>
          <audio controls>
            <source
              src={`data:${Res.content_type};base64,${Res.audio_data_base64}`}
              type={Res.content_type}
            />
            Your browser does not support the audio element.
          </audio>

          <h3 style={{ marginTop: '2rem' }}>Spectrogram Result</h3>

          <h4>Deepfake Indicators:</h4>
          <ul>
            {Res.spectrogram_result.deepfake_indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>

          <h4>Natural Indicators:</h4>
          <ul>
            {Res.spectrogram_result.natural_indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>

          <p><strong>Spectral Flatness:</strong> {Res.spectrogram_result.spectral_flatness}</p>
          <p><strong>High Frequency Energy Ratio:</strong> {Res.spectrogram_result.high_freq_energy_ratio}</p>
          <p><strong>Low Frequency Energy Ratio:</strong> {Res.spectrogram_result.low_freq_energy_ratio}</p>

          <h3>Spectrogram Image</h3>
          <img 
            src={`data:image/png;base64,${Res.spectrogram_result.spectrogram_image_base64}`} 
            alt="Spectrogram" 
            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Spectro;
