from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/")
def home():
    pass


@app.route('/submit', methods=['POST'])
def submit():
    # data is json given from frontend
    data = request.get_json()

    # use model here
    # possible preprocess the model here

    # send a json file back to frontend with json received + extra data

    return jsonify({"result"})


if __name__ == '__main__':
    app.run(debug=True)



