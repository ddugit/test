import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import warnings
warnings.filterwarnings("ignore")


class TKDLHybridRecommender:
    def __init__(self, csv_path):
        print("🌿 Loading TKDL Dataset...")
        self.df = pd.read_csv(csv_path).fillna("")

        required_cols = [
            "disease", "symptoms", "herbs_used",
            "precautions", "prevention", "preparation"
        ]

        for col in required_cols:
            if col not in self.df.columns:
                raise ValueError(f"❌ Missing required column: {col}")

        self.df["combined_text"] = (
            self.df["symptoms"] + " " + self.df["symptoms"] +
            " " + self.df["disease"]
        )

        self._build_models()
        print(f"✅ Model ready with {len(self.df)} records")

    def _clean_text(self, text):
        text = text.lower()
        text = re.sub(r"[^a-z\s]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    def _build_models(self):
        print("⚙️ Building TF-IDF model...")
        self.tfidf = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            min_df=2,
            sublinear_tf=True
        )

        self.tfidf_matrix = self.tfidf.fit_transform(
            self.df["combined_text"].apply(self._clean_text)
        )

        print("⚙️ Loading SBERT model...")
        self.sbert = SentenceTransformer("all-MiniLM-L6-v2")

        self.sbert_embeddings = self.sbert.encode(
            self.df["symptoms"].tolist(),
            show_progress_bar=False
        )

    def predict(self, symptoms="", disease_name=""):
        if not symptoms.strip():
            return {"error": "❌ Please provide at least one symptom."}

        user_input = symptoms.strip()
        if disease_name.strip():
            user_input += " " + disease_name

        user_input_clean = self._clean_text(user_input)

        tfidf_vec = self.tfidf.transform([user_input_clean])
        tfidf_scores = cosine_similarity(
            tfidf_vec, self.tfidf_matrix
        )[0]

        symptom_emb = self.sbert.encode([symptoms])
        sbert_scores = cosine_similarity(
            symptom_emb, self.sbert_embeddings
        )[0]

        symptom_len = len(symptoms.split())

        if disease_name.strip():
            w_sbert, w_tfidf = 0.65, 0.35
            threshold = 0.48
        else:
            if symptom_len <= 2:
                w_sbert, w_tfidf = 0.85, 0.15
                threshold = 0.45
            else:
                w_sbert, w_tfidf = 0.75, 0.25
                threshold = 0.50

        final_scores = (w_sbert * sbert_scores) + (w_tfidf * tfidf_scores)

        top_idx = final_scores.argsort()[-2:][::-1]
        top_score = final_scores[top_idx[0]]

        results = []
        for idx in top_idx:
            row = self.df.iloc[idx]
            results.append({
                "disease": row["disease"],
                "herbs": row["herbs_used"],
                "precautions": row["precautions"],
                "prevention": row["prevention"],
                "preparation": row["preparation"],
                "confidence (%)": round(float(final_scores[idx] * 100), 2)
            })

        if top_score < threshold:
            return {
                "warning": "⚠ Low confidence. Add more symptoms.",
                "results": results
            }

        return results
