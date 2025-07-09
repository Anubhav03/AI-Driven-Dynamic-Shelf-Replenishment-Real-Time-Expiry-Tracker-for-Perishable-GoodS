import numpy as np
# import joblib
# import xgboost as xgb

def predict_demand(features):
    """
    Predict demand for a product. For demo, use a deterministic formula based on product_id,
    but fallback to random if not present.
    """
    product_id = features.get("product_id", 0)
    # Simple deterministic pattern for demo
    if product_id:
        return 100 + (product_id % 5) * 10
    # Fallback to random
    return int(np.random.randint(50, 200))

# def load_model():
#     return joblib.load("model.joblib")
