

sample_user_data = {
    "bodyType": "overweight",
    "sex": "male",
    "diet": "omnivore",
    "shower": "daily",
    "heatingSource": "electricity",
    "transport": "public transit",
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
    "recycling": "Yes",
    "cookingWith": "Electricity",
}

category_encodings = {
    "bodyType": {'underweight': 0, 'normal': 1, 'overweight': 2, 'obese': 3},
    "sex": {'male': 0, 'female': 1, 'other': 2},
    "diet": {'vegan': 0, 'vegetarian': 1, 'omnivore': 2},
    "shower": {'less frequently': 0, 'more frequently': 1, 'daily': 2, 'twice a day': 3},
    "Heating Energy Source": {'electricity': 0, 'wood': 1, 'natural gas': 2, 'coal': 3},
    "Transport": {'walk/bicycle': 0, 'public': 1, 'private': 2},
    "Vehicle Type": {'none': 0, 'electric': 1, 'hybrid': 2, 'lpg': 3, 'petrol': 4, 'diesel': 5},
    "Social Activity": {'never': 0, 'sometimes': 1, 'moderate': 2, 'often': 3},
    "Frequency of Traveling by Air": {'never': 0, 'rarely': 1, 'sometimes': 2, 'frequently': 3, 'very frequently': 4},
    "Waste Bag Size": {'small': 0, 'medium': 1, 'large': 2, 'extra large': 3},
    "Energy efficiency": {'Yes': 0, 'Sometimes': 1, 'Standard': 2, 'No': 3},
    "Recycling": {'Yes': 0, 'Sometimes': 1, 'No': 2},
    "Cooking_With": {'Electricity': 0, 'Gas': 1, 'Wood': 2}
}

'''
body_type = [['underweight', 'normal', 'overweight', 'obese']] 
shower_often = [['less frequently', 'more frequently', 'daily', 'twice a day']] 
heating_energy = [['electricity', 'wood', 'natural gas', 'coal']] 
transport_type = [['walk/bicycle', 'public', 'private']] 
social_activity = [['never', 'sometimes', 'often']] 
air_travel_freq = [['never', 'rarely', 'frequently', 'very frequently']] 
waste_bag_size = [['small', 'medium', 'large', 'extra large']] 
energy_efficiency = [['Yes', 'Sometimes', 'No']]
'''

def processing(user_data):
    processed = {}
    for key, value in user_data.items():
        if key in category_encodings:
            processed[key] = category_encodings[key].get(value)
        if key == 'Recycling':
            pass

        else:
            processed[key] = value  # numeric values
    return processed


if __name__ == '__main__':
    encoded_data = processing(sample_user_data)
    print(encoded_data)

