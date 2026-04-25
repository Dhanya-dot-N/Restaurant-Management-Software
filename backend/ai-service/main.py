from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Bites AI service is running"}