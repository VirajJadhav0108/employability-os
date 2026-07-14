"""
Content-based recommendation engine for Employability OS (e-OS).

Uses scikit-learn's TF-IDF vectorizer + cosine similarity to match a
student's skill profile against each open internship's required-skills
description. This is a classic content-based filtering approach: both
the student and each internship are represented as documents in the
same "skills vocabulary" vector space, and similarity is the match score.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def _skills_to_doc(skills):
    """Turn a list of skill strings into a single space-joined document,
    e.g. ["React", "Node.js", "MongoDB"] -> "react node.js mongodb"."""
    return " ".join(s.strip().lower() for s in skills if s and s.strip())


def recommend(student_skills, internships, top_n=5):
    """
    student_skills: list[str]
    internships: list[dict] each with keys id, title, company, description, required_skills
    top_n: number of top matches to return

    Returns: list of {"internship_id": str, "score": float}, sorted descending by score.
    """
    if not internships:
        return []

    student_doc = _skills_to_doc(student_skills)

    # Combine each internship's title + description + required skills into
    # one document so the vectorizer has richer context than skills alone.
    corpus = [student_doc] + [
        _skills_to_doc(i["required_skills"]) + " " + i["title"].lower() + " " + i["description"].lower()
        for i in internships
    ]

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(corpus)

    student_vector = tfidf_matrix[0:1]
    internship_vectors = tfidf_matrix[1:]

    similarity_scores = cosine_similarity(student_vector, internship_vectors)[0]

    ranked = sorted(
        zip(internships, similarity_scores),
        key=lambda pair: pair[1],
        reverse=True,
    )

    return [
        {"internship_id": internship["id"], "score": round(float(score), 4)}
        for internship, score in ranked[:top_n]
    ]
