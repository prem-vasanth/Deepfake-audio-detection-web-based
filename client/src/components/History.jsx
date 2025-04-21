import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function History() {
    const [Classify,setClassify] = useState(null);
    const [Spect,setSpect] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await axios.get('http://127.0.0.1:8000/history/classify');
            if (res.data) {
              setClassify(res.data.result);  // Extract the actual result array
              console.log("Received classify data");
            }
      
            const res2 = await axios.get('http://127.0.0.1:8000/history/spect');
            if (res2.data) {
              setSpect(res2.data.result);  // Extract the actual result array
              console.log("Received spect data");
            }
          } catch (error) {
            console.error("Error fetching history:", error);
          }
        };
      
        fetchData();
      }, []);

      const handleClassify=(id)=>{
        navigate(`/classifyResult/${id}`);
      }

      const handleSpect= (id)=>{
        navigate(`/spectro/${id}`);
      }
      
  return (
    <div>
  <h2>Classification History</h2>
  {Classify ? Classify.map((item, index) => (
    <div key={index}>
      <p>Filename: {item.filename}</p>
      <p>Uploaded At: {new Date(item.upload_time).toLocaleString()}</p>
      <p>Result: {item.classification_result.label}</p>
      <button onClick={()=>handleClassify(item._id)}>See Details</button>
    </div>
  )) : <p>Loading classification history...</p>}

  <h2>Spectrogram History</h2>
  {Spect ? Spect.map((item, index) => (
    <div key={index}>
      <p>Filename: {item.filename}</p>
      <p>Uploaded At: {new Date(item.upload_time).toLocaleString()}</p>
      <button onClick={()=>handleSpect(item._id)}>See Details</button>
    </div>
  )) : <p>Loading spectrogram history...</p>}
</div>

  )
}

export default History
