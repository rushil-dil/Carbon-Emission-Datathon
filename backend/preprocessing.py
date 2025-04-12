import pandas as pd
import joblib


sample_user_data = {
    "bodyType": "overweight",
    "sex": "male",
    "diet": "omnivore",
    "shower": "daily",
    "heatingSource": "electricity",
    "transport": "public",
    "vehicleType": "hybrid",
    "socialActivity": "moderate",
    "monthlyGroceryBill": 350,
    "airTravelFrequency": "sometimes",
    "vehicleDistance": 1561,
    "wasteBagSize": "medium",
    "wasteBagWeeklyCount": 2,
    "tvPcDailyHour": 4,
    "newClothesMonthly": 2,
    "internetDailyHour": 6,
    "energyEfficiency": "Standard",
    "recycling": ['Paper', 'Plastic', 'Glass'],
    "cookingWith": ['Stove', 'Oven', 'Microwave'],
}

category_encodings = {
    "bodyType": {'underweight': 0, 'normal': 1, 'overweight': 2, 'obese': 3},
    "sex": {'male': 0, 'female': 1, 'other': 2},
    "diet": {'vegan': 0, 'vegetarian': 1, 'omnivore': 2},
    "shower": {'less frequently': 0, 'more frequently': 1, 'daily': 2, 'twice a day': 3},
    "heatingSource": {'electricity': 0, 'wood': 1, 'natural gas': 2, 'coal': 3},
    "transport": {'walk/bicycle': 0, 'public': 1, 'private': 2},
    "vehicleType": {'none': 0, 'electric': 1, 'hybrid': 2, 'lpg': 3, 'petrol': 4, 'diesel': 5},
    "socialActivity": {'never': 0, 'sometimes': 1, 'moderate': 2, 'often': 3},
    "airTravelFrequency": {'never': 0, 'rarely': 1, 'sometimes': 2, 'frequently': 3, 'very frequently': 4},
    "wasteBagSize": {'small': 0, 'medium': 1, 'large': 2, 'extra large': 3},
    "energyEfficiency": {'Yes': 0, 'Sometimes': 1, 'Standard': 2, 'No': 3},
}

def processing(user_data):
    processed = {}
    for key, value in user_data.items():
        if key in category_encodings:
            processed[key] = category_encodings[key].get(value)
        elif key == "recycling":
            processed[key] = 4 - len(value)
        elif key == "cookingWith":
            processed[key] = len(value)
        else:
            processed[key] = value  # numeric values
    return processed


if __name__ == '__main__':
    data = processing(sample_user_data)
    print(f'data is {data}')
    input_data = [[data[key] for key in data.keys()]]
    print(f'input_data: {input_data}')
    model = joblib.load('/Users/rushildileep/Documents/Carbon-Emission-Datathon/data/gradboostreg_carbon.joblib')
    prediction = model.predict(input_data)[0]
    print(prediction)
    



#8377, 9000/10