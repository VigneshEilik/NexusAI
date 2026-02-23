# 🚀 NexusAI - Enterprise AI-Powered SaaS Platform

<div align="center">

![NexusAI](https://img.shields.io/badge/NexusAI-Enterprise%20Platform-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-8+-green?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-7+-red?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**AI-powered SaaS platform for intelligent conversations, data analytics, and enterprise insights.**

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

---

## ✨ Features

### 🤖 AI Chat
- Real-time AI conversations powered by Ollama
- Chat history with search
- Response streaming effect
- Redis-cached AI responses

### 📊 Data Analytics
- CSV file upload & parsing
- AI-powered data analysis
- Interactive charts (Line, Bar, Pie)
- Statistical insights & recommendations

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- HttpOnly cookies support
- Role-based access control (User/Admin/SuperAdmin)
- Rate limiting (general, auth, AI endpoints)
- Helmet security headers
- MongoDB injection sanitization
- XSS protection

### 🎨 Modern UI/UX
- Split-screen login with glassmorphism
- Dark/Light mode toggle
- Collapsible sidebar navigation
- Skeleton loading states
- Toast notifications
- Responsive design
- Smooth animations

### 📱 Pages
1. Landing Page
2. Login Page (User/Admin toggle)
3. Register Page (with password strength meter)
4. Dashboard (stats, quick actions, activity feed)
5. AI Chat (streaming, history sidebar)
6. Analytics (CSV upload, AI insights, charts)
7. Subscription/Billing
8. User Profile
9. Settings
10. Admin Panel
11. Privacy Policy
12. Terms & Conditions
13. 404 Page

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite 7 | Build Tool |
| Redux Toolkit | State Management |
| RTK Query | API Data Fetching & Caching |
| React Router DOM | Client Routing |
| Tailwind CSS 4 | Styling |
| Recharts | Data Visualization |
| Axios | HTTP Client |
| react-hot-toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | API Server |
| MongoDB + Mongoose | Database |
| Redis | Caching Layer |
| JWT | Authentication |
| Joi | Validation |
| Winston | Logging |
| Helmet | Security Headers |
| PM2 | Process Management |

### AI
| Technology | Purpose |
|---|---|
| Ollama | AI Model Serving |
| REST API | Model Communication |
| Redis | Response Caching |

---

## 🏗 Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   MongoDB    │
│  React/Vite  │     │   Express    │     │              │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────┴───────┐
                     │              │
              ┌──────▼──────┐ ┌────▼─────┐
              │    Redis    │ │  Ollama  │
              │   Cache     │ │ AI Model │
              └─────────────┘ └──────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Redis (local or cloud)
- Ollama (for AI features)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd SaaS

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration

# Frontend setup
cd ../frontend
npm install

# Start Ollama (separate terminal)
ollama serve
ollama pull llama3

# Start Backend (from /backend)
npm run dev

# Start Frontend (from /frontend)
npm run dev
```

### Quick Start URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/v1
- **Health Check**: http://localhost:5000/api/v1/health

---

## 📁 Project Structure

```
SaaS/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, Logger, Env config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, Error, Validation, Rate limiting
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic (Ollama)
│   │   ├── utils/           # Utilities (AppError)
│   │   ├── validations/     # Joi schemas
│   │   ├── app.js           # Express app config
│   │   └── server.js        # Entry point
│   ├── Dockerfile
│   ├── ecosystem.config.js  # PM2 config
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute
│   │   │   ├── layout/      # Sidebar, Navbar, DashboardLayout
│   │   │   └── ui/          # SkeletonLoader
│   │   ├── pages/           # All 13 pages
│   │   ├── store/
│   │   │   ├── api/         # RTK Query APIs
│   │   │   ├── slices/      # Redux slices
│   │   │   └── index.js     # Store config
│   │   ├── services/        # Axios instance
│   │   ├── App.jsx          # Router + Providers
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Design system
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📡 API Documentation

### Auth Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/refresh-token` | Refresh JWT |
| GET | `/api/v1/auth/me` | Get current user |
| PATCH | `/api/v1/auth/profile` | Update profile |
| PATCH | `/api/v1/auth/change-password` | Change password |

### Chat Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/chat` | Get user's chats |
| POST | `/api/v1/chat` | Create new chat |
| POST | `/api/v1/chat/message` | Send message |
| GET | `/api/v1/chat/:chatId` | Get chat detail |
| DELETE | `/api/v1/chat/:chatId` | Delete chat |
| GET | `/api/v1/chat/ai/health` | AI health check |

### Analytics Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/analytics/upload` | Upload CSV |
| GET | `/api/v1/analytics` | List analytics |
| GET | `/api/v1/analytics/:id` | Get report |
| DELETE | `/api/v1/analytics/:id` | Delete report |
| GET | `/api/v1/analytics/dashboard/stats` | Dashboard stats |

### Admin Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/admin/stats` | Platform stats |
| GET | `/api/v1/admin/users` | List users |
| PATCH | `/api/v1/admin/users/:id/role` | Change role |
| DELETE | `/api/v1/admin/users/:id` | Delete user |

---

## 🚢 Deployment

### Docker (Backend)
```bash
cd backend
docker build -t nexusai-api .
docker run -p 5000:5000 --env-file .env nexusai-api
```

### PM2 (Production)
```bash
cd backend
npm run pm2:start
```

### Vercel (Frontend)
```bash
cd frontend
npm run build
# Deploy dist/ to Vercel
```

---

## 🔐 Environment Variables

See `backend/.env.example` for all configuration options.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `REDIS_HOST` - Redis server host
- `JWT_SECRET` - JWT signing secret
- `OLLAMA_BASE_URL` - Ollama API URL
- `CORS_ORIGIN` - Frontend origin

---

## 📄 License

MIT License - see LICENSE file for details.

---

<div align="center">
  <strong>Built with ❤️ for enterprise teams</strong>
</div>
