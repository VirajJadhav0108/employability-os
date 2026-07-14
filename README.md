# Employability OS (e-OS)

**AI-powered internship & placement platform** — built for Smart India Hackathon 2025
(Problem Statement 25106: *Internship/Industrial Training with Placement Opportunity*, Theme: Smart Education).

e-OS replaces the chaotic mix of emails, WhatsApp groups, and spreadsheets that colleges
typically use to run placements with a single system: students discover and apply to
internships, recruiters post roles and manage applicants, and the placement cell gets a
live, data-driven view of everything happening on campus.

---

## Architecture

```
employability-os/
├── backend/          Node.js + Express REST API, MongoDB (Mongoose), JWT auth, Socket.IO
├── ml-service/        Python Flask micro-service — scikit-learn recommendation engine
└── frontend/          React (Vite) SPA — role-based dashboards, live charts (Recharts)
```

```
 React (Vite) frontend
        │  REST + JWT
        ▼
 Node.js / Express API  ──HTTP──▶  Flask + scikit-learn ML micro-service
        │  MongoDB (Mongoose)              (TF-IDF + cosine similarity)
        ▼
     MongoDB
        │
        └── Socket.IO ──▶ live dashboard updates (no polling / no refresh)
```

The Node backend is intentionally the **only** thing the frontend talks to. It owns
auth, data, and role-based access; the ML micro-service is a pure recommendation
engine the backend calls internally and proxies back to the client. This mirrors how
you'd design it in production, where the ML service could scale/redeploy independently.

---

## How this maps to the resume bullets

**"Architected full-stack placement platform (React, Node.js, MongoDB) with RESTful
APIs and role-based access"**
- REST resources: `/api/auth`, `/api/internships`, `/api/applications`, `/api/dashboard`,
  `/api/recommendations` (see `backend/routes/`).
- Role-Based Access Control (RBAC) enforced server-side via `authorize(...roles)` in
  `backend/middleware/auth.js`, and mirrored client-side by `ProtectedRoute.jsx`. Three
  roles: `student`, `recruiter`, `placement_admin`.
- MongoDB schemas: `User`, `Internship`, `Application` (`backend/models/`).

**"Designed JWT-based multi-role authentication system and real-time dashboards for
placement and internship analytics"**
- JWT issued on register/login (`backend/utils/generateToken.js`), verified per-request
  by `protect` middleware, role embedded in the token payload.
- Real-time dashboard: Socket.IO server (`backend/utils/socket.js`) emits
  `application:new`, `application:updated`, and `internship:new` events; the React
  dashboard (`frontend/src/pages/Dashboard.jsx`) listens and re-fetches aggregated
  stats instantly, no manual refresh. Stats themselves are computed with MongoDB
  aggregation pipelines in `backend/controllers/dashboardController.js`.

**"Integrated Scikit-learn recommendation engine via backend APIs to power
personalized internship-student matching"**
- `ml-service/recommender.py` uses `TfidfVectorizer` + `cosine_similarity` for
  content-based filtering between a student's skills and each internship's
  requirements/description.
- The Node backend (`backend/controllers/recommendationController.js`) gathers the
  student profile and open internships from MongoDB, calls the Flask service's
  `POST /recommend` over HTTP, and returns the ranked, match-scored list to the
  frontend's `Recommendations.jsx` page.

---

## Running it locally

### 1. MongoDB
Have a local MongoDB instance running, or use MongoDB Atlas and update `MONGO_URI`.

### 2. Backend
```bash
cd backend
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev                # http://localhost:5000
```

### 3. ML micro-service
```bash
cd ml-service
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py               # http://localhost:8000
```

### 4. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Register three test accounts (one per role: student, recruiter, placement_admin) to
exercise the full flow: recruiter posts an internship → student sees it, gets a
personalized match score, and applies → recruiter/placement_admin update status →
dashboard updates live.

---

## Tech stack

| Layer            | Technology                                              |
|-------------------|----------------------------------------------------------|
| Frontend          | React 18, Vite, React Router, Recharts, Socket.IO client |
| Backend           | Node.js, Express, Mongoose, JWT, bcrypt, Socket.IO        |
| Database          | MongoDB                                                   |
| ML micro-service  | Python, Flask, scikit-learn (TF-IDF, cosine similarity)   |

## Notes for reviewers

This is an MVP built to demonstrate the architecture end-to-end, not a production
deployment — there's no rate limiting, email verification, or file-upload/resume
parsing yet. Natural next steps: resume-PDF parsing into the skills vector, a
collaborative-filtering signal (past placement outcomes) layered on top of the
current content-based model, and containerizing the three services with
Docker Compose.
