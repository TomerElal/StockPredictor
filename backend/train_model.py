import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib


data = pd.read_csv("stocks_fundamentals.csv")
X = data.drop("StockPriceFourYearsGrowth", axis=1).to_numpy()  # Features
y = data["StockPriceFourYearsGrowth"].to_numpy()  # Labels
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
rf_regressor = RandomForestRegressor(n_estimators=128, random_state=42, max_depth=3)
rf_regressor.fit(X_train, y_train)
joblib.dump(rf_regressor, 'trained_model.joblib')  # Save the trained model to a file
loaded_model = joblib.load('trained_model.joblib')
# y_pred = loaded_model.predict(X_train)
# mae = mean_absolute_error(y_train, y_pred)
# print(f"Mean Absolute Error: {mae}")

