from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/weather")
def weather():

    lat = request.args.get("lat")
    lon = request.args.get("lon")

    # Open-Meteo API link (FREE, no key needed)
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}"
        f"&longitude={lon}"
        f"&current_weather=true"
        f"&hourly=relative_humidity_2m,soil_moisture_0_to_1cm"
    )

    response = requests.get(url).json()

    temperature = response["current_weather"]["temperature"]

    humidity = response["hourly"]["relative_humidity_2m"][0]
    soil = response["hourly"]["soil_moisture_0_to_1cm"][0]

    flood = round(soil * 100)
    vegetation = humidity
    water = flood
    air = humidity

    return jsonify({
        "temperature": temperature,
        "flood": flood,
        "vegetation": vegetation,
        "water": water,
        "air": air
    })


if __name__ == "__main__":
    app.run(debug=True)
    