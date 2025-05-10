import React from 'react'
import { Link } from 'react-router-dom'; // Import Link from React Router
import './Home.css'

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-header">
        Deepfake Voice Detection System
      </h1>
      <p className="home-description">
        Deepfake voices are AI-generated audio that mimics a person's voice with high accuracy, often used to spread misinformation or impersonate others. This project aims to develop a robust and reliable system to detect such synthetic voices, helping to mitigate the risks associated with malicious use of AI-generated content. By leveraging machine learning techniques, our system identifies deepfake audio samples by analyzing intricate audio patterns, distinguishing them from real human speech.
      </p>
      <p className="home-description">
        The system employs various advanced methods such as audio pre-processing, Mel-spectrogram extraction, and deep learning models trained on a comprehensive dataset of both real and fake voices. The model is designed to be accurate, efficient, and scalable, ensuring that it can handle large volumes of data. Its effectiveness in identifying deepfake audio makes it an essential tool for industries concerned with media integrity, cybersecurity, and privacy protection.
      </p>
      <p className="home-description">
        As AI continues to evolve, the sophistication of deepfake technology is advancing rapidly. In response, our system is built to stay ahead of these developments by using cutting-edge algorithms in signal processing and machine learning. This ensures the detection of even the most convincing synthetic voices. Additionally, we plan to extend the system to detect deepfake voices across various languages and accents, broadening its applicability and ensuring it can protect users worldwide.
      </p>
      <p className="home-description">
        Beyond media and entertainment, the potential applications of this technology are vast. From safeguarding financial institutions against fraudulent voice transactions to enhancing security measures in legal and healthcare sectors, deepfake detection has a wide range of practical uses. Our long-term goal is to contribute to a trustworthy digital landscape, where AI technologies are used responsibly and safely, and to provide a continuously evolving tool for detecting synthetic voices.
      </p>

      {/* Redirect Button to About Page */}
      <div className="button-container">
      <Link to="/about" className="home-button">
        Learn More About Us
      </Link>
      </div>
    </div>
  )
}

export default Home
