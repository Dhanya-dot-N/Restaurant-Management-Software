from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai
import os
import json

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

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
    response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
    return {"insight": response.text}

@app.post("/forecast")
def forecast(data: dict):
    orders = data.get("orders", [])
    prompt = f"""Based on these recent daily order counts: {orders}
    Predict tomorrow's expected orders. Reply with just a JSON object like:
    {{"predicted": 85, "confidence": "medium", "tip": "one short prep tip"}}
    No other text."""
    response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
    try:
        return json.loads(response.text.strip().replace("```json","").replace("```",""))
    except:
        return {"predicted": "N/A", "confidence": "low", "tip": "Not enough data yet"}