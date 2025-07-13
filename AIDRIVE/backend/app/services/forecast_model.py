import numpy as np
import pandas as pd
import joblib
import os

# Try to import TensorFlow, but handle gracefully if not available
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model  # type: ignore
    TENSORFLOW_AVAILABLE = True
    print("TensorFlow successfully imported")
except ImportError as e:
    print(f"Warning: TensorFlow not available ({e}). Using fallback prediction methods.")
    TENSORFLOW_AVAILABLE = False
except Exception as e:
    print(f"Warning: TensorFlow import error ({e}). Using fallback prediction methods.")
    TENSORFLOW_AVAILABLE = False

from sklearn.preprocessing import MinMaxScaler

# Global variables for model and scaler
_model = None
_scaler = None

def load_trained_model():
    """
    Load the trained GRU model and scaler.
    """
    global _model, _scaler
    
    if not TENSORFLOW_AVAILABLE:
        print("TensorFlow not available. Using fallback prediction.")
        return False
    
    try:
        # Load the trained GRU model
        model_path = os.path.join(os.path.dirname(__file__), "gru_multi_output_model.h5")
        if os.path.exists(model_path):
            _model = load_model(model_path)
            print("GRU model loaded successfully")
        else:
            print(f"Warning: Model file {model_path} not found. Using fallback prediction.")
            return False
            
        # Load the fitted scaler
        scaler_path = os.path.join(os.path.dirname(__file__), "scaler.save")
        if os.path.exists(scaler_path):
            _scaler = joblib.load(scaler_path)
            print("Scaler loaded successfully")
        else:
            print(f"Warning: Scaler file {scaler_path} not found. Using fallback prediction.")
            return False
            
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def create_sequences(data, n_steps=30, n_outputs=7):
    """
    Create sequences for GRU model input.
    """
    X, y = [], []
    for i in range(n_steps, len(data) - n_outputs + 1):
        X.append(data[i - n_steps:i, :])
        y.append(data[i:i + n_outputs, 0])  # Next 7 units_sold
    return np.array(X), np.array(y)

def inverse_units_scaled(y_scaled, X_ref):
    """
    Inverse scaling for predictions.
    """
    if _scaler is None:
        raise ValueError("Scaler not loaded")
    full = np.hstack([y_scaled.reshape(-1, 1), np.repeat(X_ref[:, -1, 1:], y_scaled.shape[1], axis=0)])
    return _scaler.inverse_transform(full)[:, 0].reshape(y_scaled.shape)

def predict_demand(features):
    """
    Predict demand for a product using the trained GRU model.
    Falls back to simple prediction if model is not available.
    """
    global _model, _scaler
    
    # Try to load model if not already loaded
    if _model is None or _scaler is None:
        if not load_trained_model():
            return _fallback_predict_demand(features)
    
    try:
        # Check if model and scaler are available
        if _model is None or _scaler is None:
            return _fallback_predict_demand(features)
        
        # Extract features for prediction
        # Expected features: units_sold, avg_daily_footfall, unit_price, temperature, is_holiday
        required_features = ["units_sold", "avg_daily_footfall", "unit_price", "temperature", "is_holiday"]
        
        # Check if we have the required features
        if not all(feature in features for feature in required_features):
            print("Warning: Missing required features for GRU model. Using fallback prediction.")
            return _fallback_predict_demand(features)
        
        # Prepare input data
        input_data = np.array([[features[feature] for feature in required_features]])
        
        # Scale the input data
        scaled_input = _scaler.transform(input_data)
        
        # Create sequence (repeat the same data for 30 steps as required by the model)
        sequence = np.repeat(scaled_input.reshape(1, 1, -1), 30, axis=1)
        
        # Make prediction
        prediction_scaled = _model.predict(sequence, verbose=0)
        
        # Inverse scale the prediction
        prediction = inverse_units_scaled(prediction_scaled, sequence)
        
        # Return the first day prediction (or average of 7 days)
        return int(prediction[0, 0])
        
    except Exception as e:
        print(f"Error in GRU prediction: {e}")
        return _fallback_predict_demand(features)

def _fallback_predict_demand(features):
    """
    Fallback prediction method when GRU model is not available.
    Uses a more sophisticated algorithm based on available features.
    """
    try:
        # Extract available features
        units_sold = features.get("units_sold", 100)
        avg_daily_footfall = features.get("avg_daily_footfall", 500)
        unit_price = features.get("unit_price", 10.0)
        temperature = features.get("temperature", 25.0)
        is_holiday = features.get("is_holiday", 0)
        product_id = features.get("product_id", 0)
        
        # Base prediction based on historical units sold
        base_prediction = units_sold
        
        # Adjust for footfall (more people = more sales)
        footfall_factor = avg_daily_footfall / 500.0
        base_prediction *= footfall_factor
        
        # Adjust for price sensitivity (higher price = lower demand)
        price_factor = max(0.5, 2.0 - (unit_price / 10.0))
        base_prediction *= price_factor
        
        # Adjust for temperature (seasonal effect)
        if temperature > 30:
            temp_factor = 1.2  # Hot weather increases demand for certain products
        elif temperature < 10:
            temp_factor = 0.8  # Cold weather decreases demand
        else:
            temp_factor = 1.0
        base_prediction *= temp_factor
        
        # Holiday effect
        if is_holiday:
            base_prediction *= 1.3  # 30% increase during holidays
        
        # Add some randomness based on product ID for variety
        random_factor = 0.8 + (product_id % 5) * 0.1
        base_prediction *= random_factor
        
        # Ensure prediction is within reasonable bounds
        prediction = max(10, min(500, int(base_prediction)))
        
        return prediction
        
    except Exception as e:
        print(f"Error in fallback prediction: {e}")
        # Ultimate fallback
        return int(np.random.randint(50, 200))

def predict_multi_day_demand(features, days=7):
    """
    Predict demand for multiple days using the trained GRU model.
    Returns a list of predictions for the specified number of days.
    """
    global _model, _scaler
    
    # Try to load model if not already loaded
    if _model is None or _scaler is None:
        if not load_trained_model():
            base_prediction = _fallback_predict_demand(features)
            # Add some variation for multi-day predictions
            return [int(base_prediction * (0.8 + 0.4 * np.random.random())) for _ in range(days)]
    
    try:
        # Check if model and scaler are available
        if _model is None or _scaler is None:
            base_prediction = _fallback_predict_demand(features)
            return [int(base_prediction * (0.8 + 0.4 * np.random.random())) for _ in range(days)]
        
        # Extract features for prediction
        required_features = ["units_sold", "avg_daily_footfall", "unit_price", "temperature", "is_holiday"]
        
        # Check if we have the required features
        if not all(feature in features for feature in required_features):
            print("Warning: Missing required features for GRU model. Using fallback prediction.")
            base_prediction = _fallback_predict_demand(features)
            return [int(base_prediction * (0.8 + 0.4 * np.random.random())) for _ in range(days)]
        
        # Prepare input data
        input_data = np.array([[features[feature] for feature in required_features]])
        
        # Scale the input data
        scaled_input = _scaler.transform(input_data)
        
        # Create sequence (repeat the same data for 30 steps as required by the model)
        sequence = np.repeat(scaled_input.reshape(1, 1, -1), 30, axis=1)
        
        # Make prediction
        prediction_scaled = _model.predict(sequence, verbose=0)
        
        # Inverse scale the prediction
        prediction = inverse_units_scaled(prediction_scaled, sequence)
        
        # Return predictions for the specified number of days
        return [int(prediction[0, i]) for i in range(min(days, 7))]
        
    except Exception as e:
        print(f"Error in multi-day GRU prediction: {e}")
        base_prediction = _fallback_predict_demand(features)
        return [int(base_prediction * (0.8 + 0.4 * np.random.random())) for _ in range(days)]

# Initialize model loading on module import
load_trained_model()
