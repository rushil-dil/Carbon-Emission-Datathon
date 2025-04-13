from flask import Flask, request, jsonify
from flask_cors import CORS
from preprocessing import processing
import pandas as pd
import joblib
import os





app = Flask(__name__)
CORS(app)

def get_prediction(model, input_dict):
    input_data = [[input_dict[key] for key in input_dict]]
    print(input_data)
    prediction = model.predict(input_data)[0]
    return float("{:.2f}".format(prediction))

def transportation_details(distance, v_type):
    match v_type:
        case 'none':
            return 0
        case 'electric':
            return 0.124*distance
        case 'petrol':
            return 0.25*distance
        case 'diesel':
            return 0.19*distance
        case 'hybrid':
            return 0.143*distance
        case 'lpg':
            return 0.21*distance
        
@app.route('/')
def home():
    return jsonify({'Welcome to home': 'hihi'})
@app.route('/submit', methods=['POST'])
def submit():
    # data is json given from frontend
    data = request.get_json()
    processed_data = processing(data)
    model = joblib.load('../data/gbr_tuned.joblib')
    prediction = get_prediction(model, processed_data)

    return jsonify({"result": prediction})


@app.route('/breakdown', methods=['POST'])
def breakdown():
    data =  request.get_json(force = True)
    print(f'data is {data}')
    # print(f'data input is {data['tvPcDailyHour']}')
    # print(type(data['tvPcDailyHour']))
    electricity = int(data['tvPcDailyHour'])
    ##print(f'electricity is {electricity}')
    electricity = electricity * 0.81 * 30
    shopping = int(data['newClothesMonthly']) * 7
    transportation = transportation_details(int(data['vehicleDistance']), data['vehicleType'])
    
    food = int(data['monthlyGroceryBill']) * 0.1
    return jsonify({'electricity': electricity, 'shopping': shopping, 'transportation': transportation, 'food': food})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)



