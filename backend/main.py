from flask import Flask, request, jsonify
import joblib
from extract_stock_data import extract_fundamentals

app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    stock_ticker = data["features"]
    # Load the trained model from the file
    loaded_model = joblib.load('trained_model.joblib')
    stock_data = extract_fundamentals(stock_ticker)
    prediction = round(loaded_model.predict(stock_data)[0], 2)
    # Return the prediction as JSON
    return jsonify({"prediction": prediction})


if __name__ == '__main__':
    app.run(host='172.20.10.2', debug=True)
