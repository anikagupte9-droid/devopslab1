import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assets/style.css";

const Home = () => (
  <div className="dark-bg">
    <Navbar />
    <section className="hero">
      <div className="hero-content glass-card">
        <h1>
          Welcome to the <span>CAD Collaboration Platform</span>
        </h1>
        <p>
          Upload, visualize, and share your 3D CAD creations with designers and engineers worldwide.
        </p>
        <div className="hero-buttons">
          <Link to="/upload" className="btn-primary">
            🚀 Upload a Design
          </Link>
          <Link to="/files" className="btn-secondary">
            🔍 Browse Files
          </Link>
        </div>
      </div>
    </section>

    <section className="about-section glass-card">
      <h2>Collaborate, Innovate, Create.</h2>
      <p>
        The CAD Platform empowers you to upload, preview, and manage 3D CAD models directly in your browser.
        With built-in 3D rendering and project management tools, it’s your all-in-one digital design hub.
      </p>
    </section>

    <footer className="footer">
      <p>© {new Date().getFullYear()} CAD Platform | Built with 💙 Django + Three.js</p>
    </footer>
  </div>
);

export default Home;
