from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {"message": "Bites AI service running"}

@app.post("/insights")
def get_insights(data: dict):
    sales = data.get("sales", {})
    prompt = f"""You are a restaurant analytics assistant. Given this sales data: {json.dumps(sales)}
    Give 2-3 short, actionable insights for the restaurant owner. Be concise, friendly, specific.
    Format as plain sentences, no bullet points."""
    response = model.generate_content(prompt)
    return {"insight": response.text}

@app.post("/forecast")
def forecast(data: dict):
    orders = data.get("orders", [])
    prompt = f"""Based on these recent daily order counts: {orders}
    Predict tomorrow's expected orders. Reply with just a JSON object like:
    {{"predicted": 85, "confidence": "medium", "tip": "one short prep tip"}}
    No other text."""
    response = model.generate_content(prompt)
    try:
        return json.loads(response.text.strip().replace("```json","").replace("```",""))
    except:
        return {{"predicted": "N/A", "confidence": "low", "tip": "Not enough data yet"}}