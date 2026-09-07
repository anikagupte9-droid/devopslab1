import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import "../assets/style.css";

const UploadCADFile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    design_title: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append("file", file);

    try {
      await axios.post("/api/public/upload/", data, { headers: { "Content-Type": "multipart/form-data" } });
      setStatus("✅ Upload Successful!");
    } catch (err) {
      setStatus("❌ Upload Failed");
    }
  };

  return (
    <div className="dark-bg">
      <Navbar />
      <section className="upload-section">
        <div className="upload-container glass-card">
          <h2>Upload Your STL/STEP Design</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            {["name", "email", "design_title", "description"].map((field) => (
              <div key={field} className="form-group">
                <label>{field.replace("_", " ").toUpperCase()}</label>
                <input name={field} onChange={handleChange} required />
              </div>
            ))}
            <div className="form-group">
              <input type="file" accept=".stl,.step" onChange={handleFileChange} required />
            </div>
            <button type="submit" className="btn-primary">
              Submit Design
            </button>
          </form>
          {status && <p className="status">{status}</p>}
        </div>
      </section>
    </div>
  );
};

export default UploadCADFile;
