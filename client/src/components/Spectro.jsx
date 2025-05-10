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
    <div className="max-w-4xl mx-auto bg-zinc-900 rounded-lg shadow-md p-8">
      {Res ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Spectrogram Result for {Res.filename}
          </h1>

          <p className="mb-6 text-gray-300">
            <span className="font-semibold text-white">Upload Time:</span> {new Date(Res.upload_time).toLocaleString()}
          </p>

          <h3 className="text-xl font-semibold mb-3">Audio Preview</h3>
          <audio
            controls
            className="w-full rounded-md border border-gray-700 mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <source
              src={`data:${Res.content_type};base64,${Res.audio_data_base64}`}
              type={Res.content_type}
            />
            Your browser does not support the audio element.
          </audio>

          <h3 className="text-xl font-semibold mb-3 mt-8">Spectrogram Result</h3>
            <img
              src={`data:image/png;base64,${Res.spectrogram_result.spectrogram_image_base64}`}
              alt="Spectrogram"
              className="w-full max-h-[500px] object-contain rounded-md shadow-sm"
            />

          <h4 className="text-lg font-semibold mt-4 mb-2">Deepfake Indicators:</h4>
          <ul className="list-disc list-inside mb-4 text-gray-300">
            {Res.spectrogram_result.deepfake_indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>

          <h4 className="text-lg font-semibold mt-4 mb-2">Natural Indicators:</h4>
          <ul className="list-disc list-inside mb-6 text-gray-300">
            {Res.spectrogram_result.natural_indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>

          <p className="mb-2 text-gray-300">
            <span className="font-semibold text-white">Spectral Flatness:</span> {Res.spectrogram_result.spectral_flatness}
          </p>
          <p className="mb-2 text-gray-300">
            <span className="font-semibold text-white">High Frequency Energy Ratio:</span> {Res.spectrogram_result.high_freq_energy_ratio}
          </p>
          <p className="mb-6 text-gray-300">
            <span className="font-semibold text-white">Low Frequency Energy Ratio:</span> {Res.spectrogram_result.low_freq_energy_ratio}
          </p>
        </>
      ) : (
        <p className="text-center text-gray-400 text-lg">Loading...</p>
      )}
    </div>
  );
}

export default Spectro;
