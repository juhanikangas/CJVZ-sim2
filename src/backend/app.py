from flask import Flask, jsonify, request, make_response
from flask_cors import CORS

from db_functions import *

app = Flask(__name__)
CORS(app)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"success": False, "message": "Username or password did not meet the requirements."})

    if create_user(username, password):
        return jsonify({"success": True, "message": "Account created succesfully", "userData": get_user_data_db(username)})
    
    return jsonify({"success": False, "message": "Account Already Exists. Please log in or use a different username to sign up."})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if authenticate_user(username, password):
        return jsonify({"success": True, "message": "Login successful", "userData": get_user_data_db(username)})
    
    return jsonify({"success": False, "message": "'No account found. Please sign up to create new account.'"})
    

@app.route("/get-airport-data", methods=["GET"])
def get_airports():
    airport_data = get_airport_data()

    return jsonify({"airports": airport_data})


@app.route("/save-userdata", methods=["POST"])
def save_user_data():
    data = request.get_json()

    if save_user_data_db(data):
        return jsonify({"success": True, "message": "Data saved successfully"})
    
    return jsonify({"success": False, "message": "Error when saving data to database"})


@app.route("/update-stat", methods=["POST"])
def update_stat():
    data = request.get_json()

    username = data.get("username")
    stat = data.get("stat")
    new_value = data.get("value")

    if update_stat_db(username, stat, new_value):
        return jsonify({"success": True, "message": "Stat updated succesfully"})
    
    return jsonify({"success": False, "message": "Error updating stat"})


@app.route("/get-user-data", methods=["POST"])
def get_user_data():
    data = request.get_json()

    username = data.get("username")

    user_data = get_user_data_db(username)
    if user_data:
        return jsonify({"success": True, "message": "Data retrieved successfully", "userData": user_data})

    return jsonify({"success": False, "message": "Error when retrieving data"})

if __name__ == "__main__":
    app.run(use_reloader=True, host="127.0.0.1", port=3001)
