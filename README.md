# InstaVibe 🚀

A modern, high-performance, and beautifully styled full-stack social media application. Share moments, search users, and manage posts with ease.

---

## 🔗 Live Deployments

* **Frontend**: [https://instavibe-khushbu.web.app](https://instavibe-khushbu.web.app) (Hosted on Firebase)
* **Backend API**: [https://instavibe-v0hy.onrender.com](https://instavibe-v0hy.onrender.com) (Hosted on Render)

---

## 🛠️ Tech Stack

* **Frontend**: React.js (Vite), Axios, HTML5, Vanilla CSS (harmonious dark/light theme, sleek layouts)
* **Backend**: Node.js, Express.js, Multer
* **Database**: MongoDB Atlas (Cloud Database)
* **Image Hosting**: Cloudinary API (Secure cloud media storage)
* **Authentication**: JWT (JSON Web Tokens) & bcrypt hashing
* **Hosting**: Firebase Hosting (Frontend) & Render (Backend Web Service)

---

## ✨ Features

* 📸 **Photo Sharing**: Upload images directly from your device or capture them live via camera.
* 🏷️ **Captions & Timestamps**: Add custom captions and see when posts were published.
* 🔍 **User Search**: Instantly look up posts filtered by specific usernames.
* 🛡️ **Role-Based Permissions**: 
  - Regular users can view the feed, upload posts, search users, and delete *only their own* posts.
  - Admins can delete *any* post from the feed to manage content.
* 🔑 **Seeded Admin Account**: Automatically initializes an admin user (`admin` / `admin123` by default) on server startup.
* 📱 **Responsive Design**: Designed with premium aesthetics, micro-interactions, smooth hover transitions, and full mobile responsiveness.

---

## 📂 Project Structure

```
Instavibe/
├── Backend/               # Express API & Server Logic
│   ├── uploads/           # Local file upload directory (used in dev fallback)
│   ├── index.js           # Server entry point
│   ├── .env               # Environment configuration (git-ignored)
│   ├── .env.example       # Backend template environment file
│   └── package.json       # Backend dependencies
│
└── Frontend/
    └── my-app/            # React + Vite application
        ├── src/
        │   ├── components/# App components (Auth, ShowPost, CreatePost, SearchUser, Click)
        │   ├── App.jsx    # Root React component
        │   └── main.jsx   # Client entry point
        ├── .env           # Frontend environment configuration (git-ignored)
        ├── .env.example   # Frontend template environment file
        └── firebase.json  # Firebase Hosting configurations
```

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Khushbu112005/Instavibe.git
cd Instavibe
```

### 2. Configure Backend
1. Go to the `Backend` directory:
   ```bash
   cd Backend
   npm install
   ```
2. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```
3. Start the backend:
   ```bash
   npm start
   ```

### 3. Configure Frontend
1. Go to the `Frontend/my-app` directory:
   ```bash
   cd ../Frontend/my-app
   npm install
   ```
2. Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📦 Deployment Instructions

### Backend (Render)
1. Link your GitHub repository to your **Render** account.
2. Create a new **Web Service** pointing to the repository.
3. Set the **Root Directory** to `Backend`.
4. Configure environment variables matching `.env.example`.
5. Under **Settings**, make sure **Auto-Deploy** is set to **Yes** to deploy on commit.

### Frontend (Firebase)
1. Initialize/Login into Firebase CLI:
   ```bash
   firebase login
   ```
2. Set your Project ID in `Frontend/my-app/.firebaserc`.
3. Set your production backend API URL in `Frontend/my-app/.env`:
   ```env
   VITE_API_URL=https://your-render-app-url.onrender.com
   ```
4. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
