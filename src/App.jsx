import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import "./styles.css";

const SEVERITY_LEVELS = ['Extremely Mild', 'Mild', 'Moderate', 'Severe'];
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://acne-ai-backend.onrender.com"; // ✅ Use Netlify env variable

const AcneSeverityPredictor = () => {
  const [image, setImage] = useState(null);
  const [severityLevel, setSeverityLevel] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const modelRef = useRef(null);

  // ✅ Load Model once using useRef (Fixes Netlify Path Issue)
  useEffect(() => {
    const loadModel = async () => {
      if (modelRef.current) return; // Prevent duplicate loading
      try {
        console.log("⏳ Loading model...");
        modelRef.current = await tf.loadLayersModel('/models/model.json'); // Ensure model is inside `public/models`
        console.log("✅ Model loaded successfully!");
      } catch (err) {
        console.error("❌ Error loading model:", err);
      }
    };
    loadModel();
  }, []);

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    // Cleanup old object URLs
    return () => URL.revokeObjectURL(objectUrl);
  };

  // ✅ Predict Acne Severity (Frontend)
  const predictSeverity = async () => {
    if (!modelRef.current || !image) {
      alert("⚠️ Please upload an image and ensure the model is loaded.");
      return;
    }

    const img = new Image();
    img.src = imagePreview;

    img.onload = async () => {
      try {
        const tensor = tf.browser
          .fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(tf.scalar(255))
          .expandDims();

        const predictions = modelRef.current.predict(tensor);
        const data = await predictions.data();
        const severity = data.indexOf(Math.max(...data));

        setSeverityLevel(severity);
      } catch (error) {
        console.error("❌ Error during prediction:", error);
        alert("⚠️ Error in frontend model prediction.");
      }
    };
  };

  // ✅ Send Image to Backend for Analysis
  const analyzeImage = async () => {
    if (!image) {
      alert("⚠️ Please upload an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch(`${BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("❌ Failed to get prediction!");

      const data = await response.json();
      setPrediction(SEVERITY_LEVELS[data.prediction]); // Convert to text label
    } catch (error) {
      console.error("❌ Error:", error);
      alert("⚠️ Error during backend analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Acne Severity Detector</h1>

      {/* Upload Section */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Image Preview */}
      {imagePreview && <img src={imagePreview} alt="Uploaded Preview" className="image-container" />}

      {/* Predict Buttons */}
      <button onClick={predictSeverity} disabled={!modelRef.current || !image}>
        Predict Severity (Frontend)
      </button>

      <button onClick={analyzeImage} className="analyze-button" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze (Backend)"}
      </button>

      {/* Prediction Result */}
      {severityLevel !== null && <p>Frontend Prediction: {SEVERITY_LEVELS[severityLevel]}</p>}
      {prediction && <p>Backend Prediction: {prediction}</p>}
    </div>
  );
};

export default AcneSeverityPredictor;
