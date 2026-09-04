# 🚀 WhiteGod Portfolio Deployment Guide

Your portfolio is fully configured for deployment with zero additional coding required. Choose your preferred platform below.

---

## ⚡ Option 1: Deploy on Vercel (Fastest & Recommended)

Vercel provides global edge CDN for your frontend and automatic serverless hosting for your backend `/api/*` endpoints.

### Method A: Using Vercel CLI (Direct from Terminal)
1. In your terminal, run:
   ```bash
   npx vercel
   ```
2. Log in with your GitHub, GitLab, or Email account.
3. Follow the quick terminal prompts:
   - **Set up and deploy?** `Y`
   - **Which scope?** (Select your account)
   - **Link to existing project?** `N`
   - **What's your project's name?** `whitegod-portfolio` (or press Enter)
   - **In which directory is your code located?** `./` (Press Enter)
4. To deploy to production:
   ```bash
   npx vercel --prod
   ```

### Method B: Deploy via GitHub & Vercel Dashboard
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/WhiteGod0227/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Click **Deploy**. Vercel will automatically read [vercel.json](file:///c:/Desktop/Portfolio/vercel.json) and deploy both the frontend and API routes.

---

## ☁️ Option 2: Deploy on Render (Full-Stack Web Service)

Render runs your Express server continuously as a live service with persistent local fallback and MongoDB support.

1. Push your repository to GitHub:
   ```bash
   git remote add origin https://github.com/WhiteGod0227/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [dashboard.render.com](https://dashboard.render.com/) -> Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Render will auto-detect settings from [render.yaml](file:///c:/Desktop/Portfolio/render.yaml), or enter:
   - **Name**: `whitegod-portfolio`
   - **Runtime**: `Node`
   - **Build Command**: `npm --prefix server install`
   - **Start Command**: `node server/server.js`
   - **Instance Type**: `Free`
5. *(Optional)* Add Environment Variables in the Render dashboard:
   - `NOTIFICATION_EMAIL`: `ayush.singh.10293@gmail.com`
   - `MONGO_URI`: (Your MongoDB Atlas connection string, or leave blank for local storage)
   - `EMAIL_USER`: (Your Gmail address for email alerts)
   - `EMAIL_PASS`: (Your Gmail App Password)
6. Click **Create Web Service**.

---

## 🔒 Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Listening port for Express | `5000` (or dynamic in cloud) |
| `NODE_ENV` | Environment mode | `production` |
| `CLIENT_ORIGIN` | Allowed CORS origins | `*` |
| `MONGO_URI` | MongoDB Atlas database URI | *Optional (defaults to Local JSON)* |
| `EMAIL_USER` | Gmail address sending scroll alerts | `ayush.singh.10293@gmail.com` |
| `EMAIL_PASS` | 16-character Gmail App Password | *Optional* |
| `NOTIFICATION_EMAIL` | Destination email for new scroll alerts | `ayush.singh.10293@gmail.com` |

---

## 🛡️ Verifying Your Deployed App
Once deployed, open your live URL:
- Check that the **Grimoire Core Status Badge** shows `Grimoire Core: Online`.
- Click on the status badge to open the **Grimoire Inspector Modal**.
- Submit a test scroll in the Contact section to verify end-to-end delivery.
