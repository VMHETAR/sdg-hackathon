from fastapi import FastAPI
import pandas as pd
import joblib

app = FastAPI()

model = joblib.load("model.pkl")

@app.get("/")
def home():
    return {"message": "EduRetain Dropout Prediction API"}

@app.post("/predict")
def predict(student: dict):

    df = pd.DataFrame([student])
    
    risk_prob = model.predict_proba(df)[0][1]

    if risk_prob < 0.3:
        risk_level = "Low"
    elif risk_prob < 0.6:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return {
        "dropout_risk_score": float(risk_prob),
        "risk_level": risk_level
    }