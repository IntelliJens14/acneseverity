import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import "./styles.css";

const SEVERITY_LEVELS = ['Extremely Mild', 'Mild', 'Moderate', 'Severe'];
const BACKEND_URL = "https://acne-ai-backend.onrender.com"; // ✅ Use correct backend URL

const AcneSeverityPredictor = () => {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [severityLevel, setSeverityLevel] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ✅ Load Model from the server
  useEffect(() => {
    const loadModel = async () => {
      if (model) return;
      try {
        console.log("⏳ Loading model...");
        const loadedModel = await tf.loadLayersModel('/models/model.json');
        setModel(loadedModel);
        console.log("✅ Model loaded successfully!");
      } catch (err) {
        console.error("❌ Error loading model:", err);
      }
    };
    loadModel();
  }, [model]);

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file); // Store file for backend processing

    // Create image preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  };

  // ✅ Predict Acne Severity (Frontend)
  const predictSeverity = async () => {
    if (!model || !image) {
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

        const predictions = model.predict(tensor);
        const data = await predictions.data();
        const severity = data.indexOf(Math.max(...data));

        setSeverityLevel(severity);
      } catch (error) {
        console.error("❌ Error during prediction:", error);
      }
    };
  };

  // ✅ Send Image to Backend for Prediction
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
      alert("Error during analysis. Check console for details.");
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
      <button onClick={predictSeverity} disabled={!model || !image}>
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