from flask import Flask, render_template
from flask_socketio import SocketIO
import requests
import random
import time
import threading

app = Flask(__name__)
socketio = SocketIO(app)

# Mumbai coordinates
LAT = 19.076
LON = 72.8777

@app.route("/")
def index():
    return render_template("index.html")


def get_weather():
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current_weather=true"
        response = requests.get(url).json()

        temp = response["current_weather"]["temperature"]

        return temp

    except:
        return 30


def send_data():
    while True:

        temperature = get_weather()

        data = {
            "temperature": temperature,
            "flood": random.randint(30,80),
            "vegetation": random.randint(40,90),
            "density": random.randint(60,95),
            "water": random.randint(20,70),
            "air": random.randint(50,200)
        }

        socketio.emit("update", data)

        time.sleep(10)


@socketio.on("connect")
def connect():
    print("Client connected")


thread = threading.Thread(target=send_data)
thread.daemon = True
thread.start()


if __name__ == "__main__":
    socketio.run(app, debug=True)