# Employability OS (e-OS)

AI-powered internship and placement platform built for **Smart India Hackathon 2025** (Problem Statement 25106 – *Internship/Industrial Training with Placement Opportunity*, Theme: Smart Education).

Employability OS (e-OS) is a full-stack web application that streamlines the campus recruitment process by providing a centralized platform for students, recruiters, and placement administrators. The platform enables recruiters to post internships, students to discover and apply for opportunities, and placement cells to monitor recruitment activities through a unified dashboard.

---

# Features

## Student

* Browse available internship opportunities
* Receive personalized internship recommendations
* Apply for internships
* Track application status

## Recruiter

* Create and manage internship postings
* View student applications
* Update application status

## Placement Administrator

* Monitor placement activities
* View placement and internship analytics
* Manage internships and applications

---

# Architecture

```
employability-os/
├── backend/          Node.js + Express REST API
├── frontend/         React (Vite) Single Page Application
└── ml-service/       Python Flask Recommendation Service
```

```
React (Vite)
      │
      ▼
Node.js + Express
      │
      ├── MongoDB
      │
      └── Flask ML Service
```

The React frontend communicates with the Express backend through REST APIs. The backend handles authentication, business logic, and database operations while interacting with the Flask-based machine learning service to generate internship recommendations.

---

# Tech Stack

| Layer                   | Technology                   |
| ----------------------- | ---------------------------- |
| Frontend                | React 18, Vite, React Router |
| Backend                 | Node.js, Express.js          |
| Database                | MongoDB, Mongoose            |
| Authentication          | JWT, bcrypt                  |
| Machine Learning        | Python, Flask, scikit-learn  |
| Charts                  | Recharts                     |
| Real-time Communication | Socket.IO                    |

---

# Machine Learning Recommendation Engine

The recommendation engine follows a content-based filtering approach using:

* TF-IDF Vectorization
* Cosine Similarity

Student skills are compared against internship requirements and descriptions to generate personalized internship recommendations.

---

# Project Structure

```
employability-os/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── vite.config.js
│
└── ml-service/
    ├── app.py
    ├── recommender.py
    └── requirements.txt
```

---

# Getting Started

## Prerequisites

* Node.js
* Python 3.x
* MongoDB

---

## Backend

```bash
cd backend

npm install

npm run dev
```

Runs on:

```
http://localhost:5000
```

---

## ML Service

```bash
cd ml-service

pip install -r requirements.txt

python app.py
```

Runs on:

```
http://localhost:8000
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# Workflow

1. Recruiter posts internship opportunities.
2. Students browse available internships.
3. The recommendation engine suggests internships based on student skills.
4. Students submit applications.
5. Recruiters review applications and update their status.
6. Placement administrators monitor overall recruitment activities through the dashboard.

---

# Future Enhancements

* Resume parsing
* Email notifications
* Collaborative filtering recommendations
* Docker deployment
* Enhanced analytics dashboard

---

# License

This project was developed as part of **Smart India Hackathon 2025**.
