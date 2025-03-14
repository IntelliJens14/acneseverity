import React, { useEffect, useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import "./styles.css";

const SEVERITY_LEVELS = ['Extremely Mild', 'Mild', 'Moderate', 'Severe'];
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AcneSeverityPredictor = () => {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [severityLevel, setSeverityLevel] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Detect if the user is on a mobile device
  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  // ✅ Load Model from /public folder
  useEffect(() => {
    const loadModel = async () => {
      if (model) return; // Prevent reloading if already loaded
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

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      setSeverityLevel(null); // Reset previous prediction
    };
    reader.readAsDataURL(file);

    // Create image preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    // Cleanup previous URL when new image is uploaded
    return () => URL.revokeObjectURL(objectUrl);
  };

  // ✅ Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error("❌ Error accessing camera:", err);
      alert("⚠️ Unable to access camera. Please check your permissions.");
    }
  };

  // ✅ Stop Camera (Cleanup Function)
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // ✅ Capture Image from Camera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/png');
    setImage(imageData);
    setSeverityLevel(null); // Reset previous prediction
  };

  // ✅ Predict Acne Severity
  const predictSeverity = async () => {
    if (!model) {
      alert("⚠️ Model is not loaded yet. Please wait.");
      return;
    }
    if (!image) {
      alert("⚠️ Please upload or capture an image first.");
      return;
    }

    const img = new Image();
    img.src = image;

    img.onload = async () => {
      try {
        const tensor = tf.browser
          .fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(tf.scalar(255)) // ✅ Normalization fix
          .expandDims();

        const predictions = await model.predict(tensor);
        const data = await predictions.data();
        const severity = data.indexOf(Math.max(...data));

        setSeverityLevel(severity);
        console.log("✅ Predicted Severity Level:", severity);
      } catch (error) {
        console.error("❌ Error during prediction:", error);
      }
    };
  };

  // Send Image to Backend for Analysis
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
      setPrediction(data.prediction); // Assuming backend sends { prediction: value }
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
      <div className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* Camera Section */}
      <div className="camera-section">
        <video ref={videoRef} autoPlay playsInline></video>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={captureImage} disabled={!videoRef.current}>Capture Image</button>
        <button onClick={stopCamera}>Stop Camera</button>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>

      {/* Predict Button */}
      <button onClick={predictSeverity} disabled={!model || !image}>
        Predict Severity
      </button>

      {/* Prediction Result */}
      {severityLevel !== null && (
        <div className="prediction-result">
          <p>Predicted Acne Severity: <strong>{SEVERITY_LEVELS[severityLevel]}</strong></p>
        </div>
      )}

      {/* Image Upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={loading} />

      {/* Camera Capture (Mobile Only) */}
      {isMobile && (
        <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} disabled={loading} />
      )}

      {imagePreview && (
        <div className="image-container">
          <img src={imagePreview} alt="Uploaded Preview" />
        </div>
      )}

      <button onClick={analyzeImage} className="analyze-button" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {prediction !== null && (
        <div className="result">
          <h2>Prediction: {prediction.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
};

export default AcneSeverityPredictor;
