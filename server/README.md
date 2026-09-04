# ⚔ WhiteGod Portfolio Backend API

Production-ready, high-performance Node.js & Express backend for the WhiteGod / Ayush portfolio.

---

## 🚀 Features
- **Scroll Casting (Contact API)**: Rate-limited `POST /api/contact` with validation and email forwarding.
- **Dual Data Store**: Connects to **MongoDB Atlas** when configured, or auto-falls back to **local JSON persistence** with zero setup.
- **Nodemailer Alerts**: Automatically forwards contact scrolls to your personal email (`ayush.singh.10293@gmail.com`).
- **Security**: Built-in **Helmet** headers, **CORS** origin locking, and **Express Rate Limiting** to prevent spam and DDoS.
- **Deployment Ready**: Pre-configured for **Render**, **Railway**, **Vercel**, and **Docker**.

---

## 📦 Quick Start (Local Run)

1. **Navigate into the server folder:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start in development mode (with auto-restart):**
   ```bash
   npm run dev
   ```
   Or in production mode:
   ```bash
   npm start
   ```

4. **Verify Health:**
   Visit `http://localhost:5000/api/health` in your browser.

---

## 🌐 API Endpoints

| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Server & Database Health Status | 150 req / 15m |
| `POST` | `/api/contact` | Submit a Contact Scroll (`name`, `email`, `message`) | 10 req / 15m |
| `GET` | `/api/contact/messages` | View all received scrolls | 150 req / 15m |
| `GET` | `/api/projects` | Get dynamic projects & reels metadata | 150 req / 15m |

---

## ☁️ Deployment Instructions

### 1. Deploy on Render (Recommended - Free Tier)
1. Push your project to **GitHub**.
2. Go to [render.com](https://render.com) -> New **Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add:
   - `CLIENT_ORIGIN`: Your frontend URL (or `*`)
   - `MONGO_URI`: (Optional) Your MongoDB Atlas connection string
   - `EMAIL_USER`: (Optional) Your Gmail address
   - `EMAIL_PASS`: (Optional) Your Gmail App Password
6. Click **Deploy**. Render will provide you a live URL like `https://whitegod-api.onrender.com`.

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app) -> New Project -> Deploy from GitHub repo.
2. Set root directory to `/server`.
3. Add environment variables.

### 3. Connect Frontend to Live Backend
Once deployed, open `index.html` and update the `API_BASE_URL` in the `<script>` section from `http://localhost:5000` to your live Render/Railway URL.
