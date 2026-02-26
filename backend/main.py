from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# create FastAPI app
app = FastAPI()

# allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# city data
city = {
    "green": 42,
    "heat": 65,
    "flood": 30
}

# score calculation
def calculate_score():
    return int(
        city["green"] * 0.4 +
        (100 - city["heat"]) * 0.3 +
        (100 - city["flood"]) * 0.3
    )

# status API
@app.get("/status")
def status():
    return {
        "green": city["green"],
        "heat": city["heat"],
        "flood": city["flood"],
        "score": calculate_score()
    }

# simulation green
@app.get("/simulate/green")
def simulate_green():
    city["green"] += 10
    city["heat"] -= 5
    return status()

# simulation flood
@app.get("/simulate/flood")
def simulate_flood():
    city["flood"] += 20
    return status()