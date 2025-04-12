from flask import Flask, request, jsonify
from flask_cors import CORS
from preprocessing import processing
import pandas as pd
import joblib



app = Flask(__name__)
CORS(app)

def get_prediction(model, input_dict):
    input_data = [input_dict[key] for key in input_dict]
    prediction = model.predict(input_data)[0]

    return prediction

model = joblib.load('/Users/rushildileep/Documents/Carbon-Emission-Datathon/data/gradboostreg_carbon.joblib')



@app.route('/submit', methods=['POST'])
def submit():
    # data is json given from frontend
    data = request.get_json()

    # use model here
    # possible preprocess the model here

    # send a json file back to frontend with json received + extra data

    return jsonify({"result": 12})


@app.route('/emission_estimate', methods=['POST'])
def emission_estimate():
    pass

if __name__ == '__main__':
    app.run(debug=True)



