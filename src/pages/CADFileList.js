import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "../api/axios";
import "../assets/style.css";
import { Link } from "react-router-dom";

const CADFileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get("/api/cadfiles/").then((res) => setFiles(res.data));
  }, []);

  return (
    <div className="dark-bg">
      <Navbar />
      <section className="glass-card file-list-section">
        <h1>CAD Files</h1>
        <ul className="file-list">
          {files.map((f) => (
            <li key={f.id} className="file-item">
              <h3>
                <a href={f.file} download>
                  {f.file.split("/").pop()}
                </a>
              </h3>
              <Link to={`/files/${f.id}`} className="btn-primary">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CADFileList;
