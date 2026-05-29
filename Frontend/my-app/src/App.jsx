import React, { useState, useEffect } from "react";
import CreatePost from "./components/CreatePost";
import ShowPost from "./components/ShowPost";
import SearchUser from "./components/SearchUser";
import Click from "./components/Click"; 
import Auth from "./components/Auth";
import axios from "axios";
import "./components/Styles.css";
import { TiSocialInstagramCircular } from "react-icons/ti";
import { BsCameraFill } from "react-icons/bs";
const App = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showSearchUser, setShowSearchUser] = useState(false);
  const [showClick, setShowClick] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const toggleCreatePost = () => setShowCreate((prev) => !prev);
  const refreshPosts = () => setRefreshTrigger((prev) => prev + 1);
  const toggleSearchUser = () => setShowSearchUser((prev) => !prev);
  const toggleClick = () => setShowClick((prev) => !prev); 

  const handleLogin = (newToken, newUsername, newIsAdmin) => {
    setToken(newToken);
    setUsername(newUsername);
    setIsAdmin(newIsAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setToken(null);
    setUsername(null);
    setIsAdmin(false);
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <h1>
          <span className="Ti"><TiSocialInstagramCircular /></span>
          <span className="logo">InstaVibe</span>
        </h1>
        <div className="user-info">
          <span style={{ marginRight: '15px', fontWeight: 'bold' }}>{username}</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <main>
        <div className="action-buttons">
          <button className="plus-button" onClick={toggleCreatePost}>+</button>  
          <button className="search-user-button" onClick={toggleSearchUser}>🔍</button>
          <button className="camera-button" onClick={toggleClick}><BsCameraFill/></button>
        </div>

        {showCreate && <CreatePost setRefreshTrigger={setRefreshTrigger} />}
        {showSearchUser && <SearchUser />}
        {showClick && <Click onClose={toggleClick} onUpload={refreshPosts} />} 

        <ShowPost refreshTrigger={refreshTrigger} username={username} isAdmin={isAdmin} />
      </main>
    </div>
  );
};

export default App;
