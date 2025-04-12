from flask import Flask, request, jsonify


app = Flask(__name__)


@app.route("/")
def home():
    pass


@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json()
    user_input = data.get('user_input')

    # Process input (e.g., call a model or function)
    result = f"Processed: {user_input}"

    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)



    