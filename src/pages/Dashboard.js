import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import "../assets/style.css";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchMyMemberships();
  }, []);

  const fetchProjects = () => {
    axios
      .get("/api/projects/")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Failed to load projects:", err));
  };

  const fetchMyMemberships = () => {
    axios
      .get("/api/memberships/")
      .then((res) => {
        const projectIds = res.data.map(m => m.project?.id).filter(Boolean);
        setMyProjects(projectIds);
      })
      .catch((err) => console.error("Failed to load memberships:", err));
  };

  const createProject = () => {
    if (!name.trim()) return;
    axios
      .post("/api/projects/", { name, description })
      .then((res) => {
        setProjects([res.data, ...projects]);
        setMyProjects([...myProjects, res.data.id]);
        setName("");
        setDescription("");
        setShowCreateModal(false);
        showMessage("✅ Project created successfully!");
      })
      .catch(() => showMessage("❌ Failed to create project."));
  };

  const joinProject = (projectId, projectName) => {
    if (myProjects.includes(projectId)) {
      navigate(`/projects/${projectId}`);
      return;
    }

    axios
      .post(`/api/projects/${projectId}/join/`)
      .then(() => {
        setMyProjects([...myProjects, projectId]);
        showMessage(`✅ Joined "${projectName}" as a member!`);
        setTimeout(() => navigate(`/projects/${projectId}`), 1000);
      })
      .catch((err) => {
        if (err.response?.data?.detail) {
          showMessage(err.response.data.detail);
        } else {
          showMessage("❌ Failed to join project.");
        }
      });
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  const isMyProject = (projectId) => myProjects.includes(projectId);

  return (
    <div className="dark-bg">
      <Navbar />

      <header className="dashboard-header glass-card">
        <h1>Project Dashboard</h1>
        <p>Browse existing projects or create your own CAD design workspace</p>
        <button 
          className="btn-primary" 
          onClick={() => setShowCreateModal(true)}
          style={{ marginTop: '1rem' }}
        >
          + Create New Project
        </button>
      </header>

      {message && <div className="toast-message glass-card">{message}</div>}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem', minHeight: '80px' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={createProject} className="btn-primary">Create</button>
              <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="projects-container">
        {projects.length === 0 ? (
          <div className="empty-state glass-card">
            <p>No projects yet. Be the first to create one!</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card glass-card">
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              <small>
                Admin: {project.admin?.username || "Unknown"}
              </small>
              <br />
              <small>
                Created: {new Date(project.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </small>

              <div style={{ marginTop: '1rem' }}>
                {isMyProject(project.id) ? (
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    Open Project
                  </button>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={() => joinProject(project.id, project.name)}
                  >
                    Join Project
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} CAD Platform – React + Django REST</p>
      </footer>
    </div>
  );
};

export default Dashboard;