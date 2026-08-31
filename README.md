# 🌟 STARWIRE INTELLIGENCE

> **The Executive Intelligence Terminal for Global Cinema & Talent Equity**

STARWIRE INTELLIGENCE is an enterprise-grade entertainment intelligence platform engineered for producers, studio executives, distributors, and talent agencies. It synthesizes proprietary **StarScore™** talent equity benchmarks, **AI-powered predictive intelligence**, and live theatrical box office telemetry from **TMDB**.

---

## 🎬 Project Screenshots & Media Showcase

### 📹 Full Demo Video
Watch the interactive walkthrough video:  
👉 **[Watch Demo Video (`https://drive.google.com/file/d/1o9PFCtkDYmnml2GvI-n_C-4KR6NbB8LT/view?usp=sharing`)](https://drive.google.com/file/d/1o9PFCtkDYmnml2GvI-n_C-4KR6NbB8LT/view?usp=sharing)**

---

### 📷 Application Screen Showcase

| Landing Page | Member Sign In & Authentication |
| :---: | :---: |
| ![Landing Page](screenshots/landing%20page.png) | ![Sign In](screenshots/signup.png) |

| AI Starwire Intelligence Dossier | Explore Talent Index (50+ Stars) |
| :---: | :---: |
| ![AI Intelligence](screenshots/ai-%20intelligence.png) | ![Explore Stars](screenshots/explore.png) |

| Star Dossier & Career Deep-Dive | Live TMDB Box Office & Movies |
| :---: | :---: |
| ![Star Detail](screenshots/star-detail.png) | ![Movies](screenshots/movies.png) |

| Trending Stars & BuzzMeter™ | Industry Dispatches & News Wire |
| :---: | :---: |
| ![Trending](screenshots/trending.png) | ![News Wire](screenshots/news.png) |

| Tracked Stars (Following) | Saved Intel Briefs (Watchlist) |
| :---: | :---: |
| ![Following](screenshots/following.png) | ![Watchlist](screenshots/watchlist.png) |

---

## 🏗️ System Architecture

```
                                  ┌──────────────────────────────────────────┐
                                  │           STARWIRE FRONTEND              │
                                  │  (React 19 + TypeScript + Vite 6)        │
                                  │  • Zustand State Management              │
                                  │  • Tailwind CSS v4 Theme Engine          │
                                  └────────────────────┬─────────────────────┘
                                                       │
                                            HTTP / REST API Requests
                                                       │
                                                       ▼
                                  ┌──────────────────────────────────────────┐
                                  │            STARWIRE BACKEND              │
                                  │    (Node.js + Express + TypeScript)      │
                                  │  • JWT Auth & Password Hashing (Bcrypt)  │
                                  │  • Proxy Controller & Rate Limiter       │
                                  └───────────┬──────────────────┬───────────┘
                                              │                  │
                      ┌───────────────────────┘                  └───────────────────────┐
                      ▼                                                                  ▼
        ┌──────────────────────────┐                                       ┌──────────────────────────┐
        │     MONGODB DATABASE     │                                       │     EXTERNAL SERVICES    │
        │  • User Accounts & Auth  │                                       │  •  AI API  │
        │  • Tracked Talent Lists  │                                       │  • TMDB Telemetry Stream │
        │  • Saved Briefs          │                                       │  • Nodemailer Verification│
        └──────────────────────────┘                                       └──────────────────────────┘
```

---

## ✨ Key Features

- 📊 **StarScore™ & BuzzMeter™ Engine**: Algorithmic metrics calculating talent commercial pull, social reach, and audience sentiment out of 100.
- 🤖 ** Executive AI Terminal**: Instant AI-generated talent dossiers, box office projections, and risk assessments powered by Openrouter API.
- 🍿 **Live TMDB Theatrical Stream**: Real-time tracking of popular, top-rated, and upcoming global theatrical releases with detailed modal breakdowns.
- 📰 **Industry News Wire & Dispatches**: Categorized intelligence briefs with impact scores and read time indicators.
- 🔒 **Secure Executive Authentication**: JWT token-based auth with bcrypt password encryption, persistent session management, and multi-step 6-digit email reset flows.
- 🌗 **Adaptive Dual Theme Engine**: Seamless switching between **Obsidian Dark Mode** and **Ivory Light Mode** with zero contrast loss across all viewports.
- 📱 **Mobile First & Fully Responsive**: Responsive bento grids, mobile drawer navigation, horizontal scrolling tables, and 1-star-per-row mobile layouts.

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Framework**: React 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4, Vanilla CSS Custom Variables
- **State Management**: Zustand v5
- **Routing**: React Router DOM v7
- **Icons & Fonts**: Google Material Symbols Outlined, Playfair Display, Inter, IBM Plex Mono

### Backend
- **Runtime & Server**: Node.js, Express.js (TypeScript with `tsx`)
- **Database**: MongoDB & Mongoose ORM
- **Security**: JWT (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv
- **Mail Service**: Nodemailer (6-digit verification dispatch)
- **APIs Integrated**: Openrouter  AI API (`@google/genai`), TMDB API (The Movie Database)

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas Connection String

---

### 2. Environment Configuration

Create a `.env` file in the root directory:
```env
VITE_BACKEND_URL="http://localhost:5000"
```

Create a `.env` file in the `backend/` directory:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="[EMAIL_ADDRESS]"
SMTP_PASS="..."
SMTP_FROM='"STARWIRE Security" <[EMAIL_ADDRESS]>'
PORT=5000
MONGODB_URI="...."
JWT_SECRET="...."
TMDB_API_KEY="...."
TMDB_READ_ACCESS_TOKEN="...."
OPENROUTER_API_KEY="...."
OPENROUTER_MODEL="...."
```

---

### 3. Installation & Run

#### Start Frontend (Client)
```bash
npm install
npm run dev
```
Client dev server runs at: `http://localhost:5173`

#### Start Backend (API Server)
```bash
cd backend
npm install
npm run dev
```
Backend API server runs at: `http://localhost:5000`

---

## 🌐 Deploying Fullstack (Frontend & Express Backend) to Vercel

STARWIRE is configured for **unified single-click Vercel deployment** hosting both the React Vite frontend and Express serverless backend API.

### 1. Vercel Configuration Files
- **`vercel.json`**: Configures rewrites routing `/api/*` to the serverless function (`api/index.ts`) and all other routes to React client router (`dist/index.html`).
- **`api/index.ts`**: Entry point wrapping the Express backend app into a Vercel Serverless Function.

### 2. Environment Variables on Vercel
In your Vercel Project Settings $\rightarrow$ **Environment Variables**, add:

| Key | Example / Description |
| :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/starwire` |
| `JWT_SECRET` | `your_secure_jwt_secret_key` |
| `TMDB_API_KEY` | `your_tmdb_api_key` |
| `TMDB_READ_ACCESS_TOKEN` | `your_tmdb_read_access_token` |
| `OPENROUTER_API_KEY` | `sk-or-v1-...` |
| `OPENROUTER_MODEL` | `google/gemini-2.5-flash` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your_email@gmail.com` |
| `SMTP_PASS` | `your_app_password` |
| `SMTP_FROM` | `"STARWIRE Security" <your_email@gmail.com>` |

### 3. Deploy via Vercel CLI or GitHub
- **Option A (GitHub Integration)**: Push your repo to GitHub and import it directly into Vercel. Vercel will automatically detect `vercel.json` and build both frontend and serverless API.
- **Option B (Vercel CLI)**:
```bash
npm install -g vercel
vercel --prod
```

---

## 📄 License
This project is licensed under the **MIT License**.
