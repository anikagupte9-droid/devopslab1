import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Viewer3D from "../components/Viewer3D";
import axios from "../api/axios";
import "../assets/style.css";
import { useParams } from "react-router-dom";

const CADFileDetail = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get(`/api/cadfiles/${id}/`).then((res) => setFile(res.data));
  }, [id]);

  if (!file) return <div className="loading">Loading...</div>;

  const isSTL = file.file.toLowerCase().endsWith(".stl");

  return (
    <div className="dark-bg">
      <Navbar />

      <section className="glass-card detail-card">
        <h1 style={{ color: "#38bdf8" }}>{file.design_title || file.name}</h1>
        {file.description && <p>{file.description}</p>}
        <a href={file.file} className="btn-primary" download>
          ⬇ Download File
        </a>
      </section>

      {isSTL && (
        <section className="glass-card viewer-section">
          <h2>🧊 3D Model Viewer</h2>
          <Viewer3D fileUrl={file.file} />
        </section>
      )}
    </div>
  );
};

export default CADFileDetail;
