import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import calorie_prediction_model
from dotenv import load_dotenv
import os

load_dotenv()  

MONGO_URI = os.getenv("MONGO_URI")


app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client.flask_database
userData = db.userData
exerciseData = db.exerciseData

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if userData.find_one({"email": data.get("email")}):
        return jsonify({"status": "error", "message": "Email already registered"}), 400

    try:
        userData.insert_one({
            "firstName": data.get("firstName"),
            "lastName": data.get("lastName"),
            "email": data.get("email"),
            "password": data.get("password"),
            "gender": data.get("gender"),
            "age": data.get("age"),
            "height": data.get("height"),
            "weight": data.get("weight")
        })
        return jsonify({"status": "success", "message": "User registered successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = userData.find_one({"email": email})

    if user and user["password"] == password:
        return jsonify({"status": "success", "message": "Login successful", "user": {
            "firstName": user.get("firstName"),
            "lastName": user.get("lastName"),
            "email": user.get("email"),
            "gender": user.get("gender"),
            "age": user.get("age"),
            "height": user.get("height"),
            "weight": user.get("weight")
        }})

    return jsonify({"status": "error", "message": "Incorrect email or password"}), 401

@app.route("/home/exercise-history", methods=["POST"])
def get_exercise_history():
    data = request.get_json()
    email = data.get("email")
    
    if not email:
        return jsonify({"status": "error", "message": "Email is required"}), 400

    try:
        records = list(exerciseData.find({"email": email}).sort("date", -1).limit(7))
        formatted = [
            {
                "name": f"{r['day'][:3]}",
                "kcal": r['caloriesBurnt']
            } for r in records
        ]
        return jsonify({"status": "success", "data": formatted})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/home/exercise", methods=["POST"])
def exercise():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400

    data['gender'] = 0 if data['gender'] == "male" else 1

    # Extract duration value if it's a dict
    duration = data['duration']
    if isinstance(duration, dict) and 'current' in duration:
        duration = duration['current']

    # Convert all values to float (or int where appropriate)
    predData = (
        int(data['gender']),
        int(data['age']),
        float(data['height']),
        float(data['weight']),
        float(duration),
        float(data['heartRate']),
        float(data['bodyTemp'])
    )
    prediction = calorie_prediction_model.prediction_model(predData)
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    day_str = now.strftime("%A")
    prediction = float(prediction)
    try:
        exerciseData.insert_one({
            "email": data.get("email"),
            "date": date_str,
            "day": day_str,
            "caloriesBurnt": prediction
        })
        return jsonify({"status": "success", "calories_burnt": prediction})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
