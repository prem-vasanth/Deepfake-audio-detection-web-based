import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './HowToUse.css';

const HowToUse = () => {
  const observedRefs = useRef([]);

  // Intersection observer to track when each element comes into view
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
        threshold: 0.2, // Trigger the observer when 20% of the element is visible
      }
    );

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
    <div className="howto-container">
      <h1 className="howto-title fade-element" ref={addToRefs}>How to Use</h1>
      <p className="howto-step fade-element" ref={addToRefs}>Follow these steps to use the deepfake audio detection system:</p>
      <ol className="howto-list fade-element" ref={addToRefs}>
        <li>
          <strong>1. </strong>
          Navigate to <Link to="/DetectUpload" className="hover-grow-white"><b>Upload</b></Link> to upload an audio file.
        </li>
        <li>
          <strong>2. </strong>
          Or go to <Link to="/DetectRecord" className="hover-grow-white"><b>Record</b></Link> to record audio directly using your microphone.
        </li>
        <li>
          <strong>3. </strong>
          Use <Link to="/SpectrogramCheck" className="hover-grow-white"><b>Spectrogram</b></Link> to visualize the audio input.
        </li>
        <li>
          <strong>4. </strong>
          Visit <Link to="/History" className="hover-grow-white"><b>Logs</b></Link> to check your classification history.
        </li>
      </ol>
    </div>
  );
};

export default HowToUse;
