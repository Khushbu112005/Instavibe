import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const res = await axios.post(`${endpoint}`, {
        username,
        password,
      });

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("isAdmin", res.data.isAdmin);
        onLogin(res.data.token, res.data.username, res.data.isAdmin);
      } else {
        alert("Signup successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data || "An error occurred");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
