"""
Flask micro-service exposing the scikit-learn recommendation engine as a
REST API. The Node.js/Express backend (see backend/controllers/
recommendationController.js) calls POST /recommend with a student's
skills and the current list of open internships, and gets back a
ranked list of {internship_id, score}.

Run:
    pip install -r requirements.txt
    python app.py
Service listens on http://localhost:8000 by default.
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from recommender import recommend

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/recommend", methods=["POST"])
def recommend_route():
    payload = request.get_json(force=True)

    student_skills = payload.get("student_skills", [])
    internships = payload.get("internships", [])
    top_n = payload.get("top_n", 5)

    if not internships:
        return jsonify({"recommendations": []})

    results = recommend(student_skills, internships, top_n=top_n)
    return jsonify({"recommendations": results})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
