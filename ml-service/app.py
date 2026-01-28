print("App is loading...")  # Debugging line

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Union, List
from recommender import TKDLHybridRecommender

app = FastAPI()

# Load model ONCE
model = TKDLHybridRecommender("final_dataset_short_preparation.csv")

class PredictRequest(BaseModel):
    disease: Optional[str] = None
    disease_name: Optional[str] = None
    # Accept either "headache, pain" or ["headache", "pain"]
    symptoms: Optional[Union[str, List[str]]] = None

@app.post("/predict")
async def predict(req: PredictRequest):
    disease = (req.disease or req.disease_name or "").strip()
    if isinstance(req.symptoms, list):
        symptoms = ", ".join([s.strip() for s in req.symptoms if isinstance(s, str) and s.strip()])
    else:
        symptoms = (req.symptoms or "").strip()

    if not disease and not symptoms:
        raise HTTPException(status_code=400, detail="Provide at least one of: disease/disease_name or symptoms")

    return model.predict(symptoms, disease)
