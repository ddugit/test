from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Union
from TKDLHybridRecommender import TKDLHybridRecommender

app = FastAPI(title="TKDL Hybrid Recommender API")

# Load model once at startup (heavy work happens here only once)
model = None

@app.on_event("startup")
def load_model():
    global model
    # Use your dataset file here (.csv or .pkl containing DataFrame)
    model = TKDLHybridRecommender("ml_ready_diseases.csv")
    # If your dataset is pickled:
    # model = TKDLHybridRecommender("ml_ready_diseases.pkl")


class PredictRequest(BaseModel):
    disease: Optional[str] = None
    # Accept either a list (["headache","pain"]) or a string ("headache, pain")
    symptoms: Optional[Union[List[str], str]] = None
    # Backward/alternate key supported by some clients
    disease_name: Optional[str] = None
    message: Optional[str] = None


@app.get("/health")
def health():
    return {"status": "TKDL Model API is running"}


@app.post("/predict")
def predict(req: PredictRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    disease_name = (req.disease or req.disease_name or "").strip()

    # Normalize symptoms into comma-separated string
    symptoms_str = ""
    if isinstance(req.symptoms, list):
        symptoms_str = ", ".join([s.strip() for s in req.symptoms if isinstance(s, str) and s.strip()])
    elif isinstance(req.symptoms, str):
        symptoms_str = req.symptoms.strip()

    try:
        result = model.predict(
            symptoms=symptoms_str,
            disease_name=disease_name
        )

        # Return raw result (list or warning/error dict), matching what the frontend expects
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
