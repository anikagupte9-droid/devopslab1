import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import STLViewer from "../components/STLViewer";
import "../assets/style.css";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [selectedFileComments, setSelectedFileComments] = useState({});
  const [fileCommentText, setFileCommentText] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}/`);
      setProject(response.data);
      
      // Fetch comments for each file
      if (response.data.files) {
        response.data.files.forEach(file => {
          fetchFileComments(file.id);
        });
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        showMessage("❌ You must be a member to view this project");
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    }
  };

  const fetchFileComments = async (fileId) => {
    try {
      const response = await axios.get(`/api/comments/?cad_file=${fileId}`);
      setSelectedFileComments(prev => ({
        ...prev,
        [fileId]: response.data
      }));
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleProjectComment = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post("/api/comments/", { project: id, text: commentText });
      setCommentText("");
      fetchProject();
      showMessage("✅ Comment posted!");
    } catch (error) {
      console.error("Error posting comment:", error);
      showMessage("❌ Failed to post comment");
    }
  };

  const handleFileComment = async (fileId) => {
    const text = fileCommentText[fileId];
    if (!text?.trim()) return;
    
    try {
      await axios.post("/api/comments/", { 
        cad_file: fileId, 
        project: id,
        text 
      });
      setFileCommentText(prev => ({ ...prev, [fileId]: "" }));
      fetchFileComments(fileId);
      showMessage("✅ Comment posted on file!");
    } catch (error) {
      console.error("Error posting file comment:", error);
      showMessage("❌ Failed to post comment");
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("project", id);
    try {
      await axios.post("/api/cadfiles/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadFile(null);
      fetchProject();
      showMessage("✅ File uploaded successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
      showMessage("❌ File upload failed");
    }
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!project) return (
    <div className="dark-bg">
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2>Loading project...</h2>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dark-bg" style={{ padding: "2rem" }}>
      <Navbar />
      
      {message && <div className="toast-message glass-card">{message}</div>}

      <div className="glass-card" style={{ padding: "20px", marginBottom: "20px" }}>
        <h1>{project.name}</h1>
        <p>{project.description}</p>
        <small>Admin: {project.admin?.username || "Unknown"}</small>
      </div>

      {/* Members */}
      <div className="glass-card" style={{ marginBottom: "20px", padding: "20px" }}>
        <h2>👥 Members ({project.members?.length || 0})</h2>
        {project.members?.length ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {project.members.map((m) => (
              <li key={m.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <strong>{m.user.username}</strong> 
                <span style={{ 
                  marginLeft: '1rem', 
                  padding: '0.25rem 0.5rem', 
                  background: m.role === 'admin' ? '#ff6b6b' : '#4a9eff',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No members yet.</p>
        )}
      </div>

      {/* File Upload */}
      <div className="glass-card" style={{ marginBottom: "20px", padding: "20px" }}>
        <h2>📁 CAD Files ({project.files?.length || 0})</h2>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="file"
            accept=".stl,.step"
            onChange={(e) => setUploadFile(e.target.files[0])}
            style={{ marginRight: '1rem' }}
          />
          <button
            onClick={handleFileUpload}
            disabled={!uploadFile}
            className="btn-primary"
          >
            Upload File
          </button>
        </div>

        {project.files?.map((file) => (
          <div key={file.id} className="file-card glass-card" style={{ marginTop: "20px", padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>{file.file.split("/").pop()}</h4>
              <a href={file.file} download className="btn-secondary">
                ⬇ Download
              </a>
            </div>
            <small>Uploaded by {file.uploaded_by?.username}</small>

            {file.file.toLowerCase().endsWith(".stl") && (
              <div style={{ marginTop: '1rem' }}>
                <STLViewer fileUrl={file.file} />
              </div>
            )}

            {/* File Comments */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <h5>💬 Comments on this file</h5>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Add a comment on this file..."
                  value={fileCommentText[file.id] || ""}
                  onChange={(e) => setFileCommentText(prev => ({ 
                    ...prev, 
                    [file.id]: e.target.value 
                  }))}
                  style={{ flex: 1 }}
                />
                <button 
                  onClick={() => handleFileComment(file.id)}
                  className="btn-primary"
                >
                  Post
                </button>
              </div>

              <div>
                {selectedFileComments[file.id]?.length ? (
                  selectedFileComments[file.id].map((c) => (
                    <div key={c.id} className="comment-card" style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      padding: '0.5rem', 
                      marginBottom: '0.5rem',
                      borderRadius: '4px'
                    }}>
                      <strong>{c.author?.username}</strong>
                      <p style={{ margin: '0.25rem 0' }}>{c.text}</p>
                      <small>{new Date(c.created_at).toLocaleString()}</small>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>No comments yet</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {!project.files?.length && (
          <p style={{ opacity: 0.7 }}>No files uploaded yet. Be the first to upload!</p>
        )}
      </div>

      {/* Project Comments */}
      <div className="glass-card" style={{ padding: "20px" }}>
        <h2>💬 Project Discussion</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <textarea
            placeholder="Add a comment about this project..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ flex: 1, minHeight: "80px" }}
          />
          <button onClick={handleProjectComment} className="btn-primary">
            Post Comment
          </button>
        </div>

        <div style={{ marginTop: "20px" }}>
          {project.comments?.length ? (
            project.comments.map((c) => (
              <div key={c.id} className="comment-card glass-card" style={{ 
                marginBottom: "10px",
                padding: '1rem'
              }}>
                <strong>{c.author?.username}</strong>
                <p>{c.text}</p>
                <small>{new Date(c.created_at).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p>No project comments yet. Start the discussion!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;