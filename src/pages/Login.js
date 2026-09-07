import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/style.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (isLogin) {
      const result = await login(username, password);
      if (result.success) {
        setMessage("✅ Login successful!");
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(result.error);
      }
    } else {
      if (!email) {
        setError("Email is required for registration");
        return;
      }
      const result = await register(username, password, email);
      if (result.success) {
        setMessage("✅ Account created successfully!");
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setError(result.error);
      }
    }
  };

  return (
    <div className="dark-bg">
      <section className="login-section">
        <div className="upload-container glass-card">
          <h2>{isLogin ? "Login" : "Create Account"}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#4a9eff",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;