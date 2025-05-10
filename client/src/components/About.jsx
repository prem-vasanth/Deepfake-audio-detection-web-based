import React, { useState, useEffect, useRef } from 'react';
import './About.css';

const About = () => {
  const [flipped, setFlipped] = useState(null);
  const observedRefs = useRef([]);

  const handleClick = (index) => {
    setFlipped(flipped === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.classList.add('fade-in');
            el.classList.remove('fade-out');
          } else {
            el.classList.remove('fade-in');
            el.classList.add('fade-out');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // Observe the elements in the observedRefs array
    observedRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observedRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !observedRefs.current.includes(el)) {
      observedRefs.current.push(el);
    }
  };

  return (
    <div className="about-container">
      <h1 ref={addToRefs} className="fade-element">About This Project</h1>
      <h2 ref={addToRefs} className="fade-element">Team Members</h2>
      <p ref={addToRefs} className="fade-element">
        This project was passionately built by a team of innovative, highly motivated, and enthusiastic students specializing in CSE and AIML. Currently, in our third year, we strive to make meaningful contributions to the fields of artificial intelligence and machine learning.
      </p>
      <div className="team-cards fade-element" ref={addToRefs}>
        {['Velayudam Prem Vasanth Kumar', 'Komaragiri Sai Avinash Bharadwaj', 'Mohd Shawar Akthar'].map((member, index) => (
          <div
            className={`flip-card ${flipped === index ? 'flipped' : ''}`}
            key={index}
            onClick={() => handleClick(index)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <p>Click to Reveal</p>
              </div>
              <div className="flip-card-back">
                <h3>{member}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 ref={addToRefs} className="fade-element">Project Overview</h2>
      <p ref={addToRefs} className="fade-element">
        This project is a Deepfake Audio Detection System designed to detect manipulated audio using state-of-the-art techniques.
      </p>
      <p ref={addToRefs} className="fade-element">
        The system works by analyzing audio input and extracting Mel-spectrograms, which are then processed by machine learning models for deepfake detection.
      </p>
      <p ref={addToRefs} className="fade-element">
        The system first extracts features from uploaded or recorded audio, then uses a pre-trained deep learning model to classify it as real or fake.
      </p>
      <p ref={addToRefs} className="fade-element">
        Our primary models are wav2vec2 and XLSR, both state-of-the-art models in speech recognition, adapted for deepfake audio detection.
      </p>

      <h2 ref={addToRefs} className="fade-element">Key Features</h2>
      <ul ref={addToRefs} className="fade-element">
        <li>Real-time detection of deepfake audio through user-uploaded or directly recorded audio.</li>
        <li>Utilization of Facebook's wav2vec2-XLSR model, fine-tuned with a diverse dataset to ensure high accuracy.</li>
        <li>Pitch-shifting technique applied for data augmentation to improve model robustness against synthetic variations.</li>
        <li>Custom audio pre-processing and feature extraction pipeline to enhance model performance.</li>
        <li>MongoDB used for storing user data and results, ensuring scalability and performance.</li>
      </ul>

      <h2 ref={addToRefs} className="fade-element">Architecture Overview</h2>
      <p ref={addToRefs} className="fade-element">
        The architecture of this system is designed for maximum efficiency and scalability, leveraging a modern tech stack. The backend is primarily built using Python with Flask, allowing for a lightweight and flexible server-side environment that handles the audio processing and model inference.
      </p>
      <p ref={addToRefs} className="fade-element">
        Node.js serves as a powerful middleware that handles real-time requests and communication between the frontend and the backend. React and Tailwind CSS are employed to create a sleek, responsive user interface that allows users to easily upload audio for analysis and view the results instantly.
      </p>
      <p ref={addToRefs} className="fade-element">
        MongoDB is used for efficient storage of audio files, logs, and detection results, allowing for quick retrieval and easy scalability. The database is also optimized to store metadata associated with each request, such as timestamps, user identifiers, and model outputs.
      </p>
      <p ref={addToRefs} className="fade-element">
        Together, this tech stack ensures that the system is fast, reliable, and scalable, ready to handle large amounts of data and perform deepfake audio detection in real-time.
      </p>

      <h2 ref={addToRefs} className="fade-element">Model Training and Detection</h2>
      <p ref={addToRefs} className="fade-element">
        The model training pipeline for this deepfake audio detection system focuses on training a robust model to differentiate between real and fake audio using advanced feature extraction techniques.
      </p>
      <p ref={addToRefs} className="fade-element">
        We employ the use of Mel-spectrograms as the primary feature extraction method. Mel-spectrograms are a 2D representation of audio signals, capturing frequency content over time, and are particularly well-suited for speech and audio analysis. The model, trained on these spectrograms, learns the distinct features of real and fake audio.
      </p>
      <p ref={addToRefs} className="fade-element">
        The training process involves using a large dataset of real and deepfake audio samples, carefully pre-processed to ensure consistent feature extraction. Data augmentation techniques, such as pitch-shifting and noise addition, are applied to improve the model's robustness to variations in the input data.
      </p>
      <p ref={addToRefs} className="fade-element">
        The detection phase involves using the trained model to classify new, unseen audio. The uploaded audio is first converted into a Mel-spectrogram, which is then fed into the pre-trained model to output a classification of "real" or "fake". This enables the system to provide near-instant results, making it ideal for real-time applications.
      </p>

      <h2 ref={addToRefs} className="fade-element">Future Enhancements</h2>
      <ul ref={addToRefs} className="fade-element">
        <li>Support for more regional languages and dialects for broader applicability.</li>
        <li>Mobile app integration for voice verification on-the-go.</li>
        <li>Advanced deepfake countermeasures using adversarial training.</li>
        <li>Visualization dashboard for user activity and prediction trends.</li>
        <li>Enhanced real-time detection algorithms for even faster audio processing.</li>
      </ul>
    </div>
  );
};

export default About;
