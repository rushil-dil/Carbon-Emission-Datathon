from flask import Flask, request, jsonify
from flask_cors import CORS
from preprocessing import processing
import pandas as pd
import joblib



app = Flask(__name__)
CORS(app)

def get_prediction(model, input_dict):
    input_data = [[input_dict[key] for key in input_dict]]
    print(input_data)
    prediction = model.predict(input_data)[0]
    return float("{:.2f}".format(prediction))


@app.route('/submit', methods=['POST'])
def submit():
    # data is json given from frontend
    data = request.get_json()
    processed_data = processing(data)
    model = joblib.load('/Users/rushildileep/Documents/Carbon-Emission-Datathon/data/gbr_tuned.joblib')
    prediction = get_prediction(model, processed_data)

    return jsonify({"result": prediction})


@app.route('/emission_estimate', methods=['POST'])
def emission_estimate():
    pass

if __name__ == '__main__':
    app.run(debug=True)



