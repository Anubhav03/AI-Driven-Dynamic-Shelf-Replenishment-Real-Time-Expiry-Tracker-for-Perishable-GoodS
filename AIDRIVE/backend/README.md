# AI-Driven Dynamic Shelf Replenishment & Real-Time Expiry Tracker (Backend)

## Overview
A production-ready FastAPI backend for perishable goods management, featuring:
- Demand forecasting (ML-ready, demo logic included)
- Expiry tracking (manual and OCR-based)
- Smart alerts (expiry, low-stock, discount, donation)
- Robust error handling and validation
- Clean, extensible business logic

## Setup
1. **Clone the repo**
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the app:**
   ```bash
   uvicorn app.main:app --reload
   ```

## API Endpoints
- `POST /api/v1/products/` — Create product (unique barcode enforced)
- `GET /api/v1/products/` — List all products
- `GET /api/v1/products/{id}` — Get product by ID
- `PUT /api/v1/products/{id}` — Update product (barcode uniqueness checked)
- `DELETE /api/v1/products/{id}` — Delete product
- `POST /api/v1/expiry/manual` — Add expiry manually (validates date, product)
- `POST /api/v1/expiry/scan` — Upload image, extract expiry via OCR (validates product, file)
- `GET /api/v1/expiry/` — List all expiry records
- `GET /api/v1/alerts/` — Get all current alerts (expiry, low-stock, discount, donation)
- `GET /api/v1/forecast/` — Get demand forecast for all products

## Business Logic Highlights
- **Expiry Alerts:**
  - Alerts for products expiring in <3 days
  - Discount and donation flags for near/past expiry
- **Forecast:**
  - Deterministic demo logic (easy to swap for ML model)
- **Error Handling:**
  - Duplicate barcodes: 409 Conflict
  - Not found: 404
  - Invalid expiry date: 400
  - OCR/file errors: 422
  - All errors return clear messages

## Testing
- **Automated tests:**
  ```bash
  pytest test_api.py
  ```
- Tests cover:
  - Product CRUD and error cases
  - Expiry manual entry and error cases
  - OCR scan (valid, missing product, OCR failure)
  - Alerts and forecast endpoints

## Docker
Build and run:
```bash
docker build -t shelf-backend .
docker run -p 8000:8000 shelf-backend
```

## Extending
- Plug in a real ML model in `app/services/forecast_model.py`
- Add authentication, advanced business rules, or more endpoints as needed

---
**This backend is ready for real-world integration and hackathon/demo use!**
