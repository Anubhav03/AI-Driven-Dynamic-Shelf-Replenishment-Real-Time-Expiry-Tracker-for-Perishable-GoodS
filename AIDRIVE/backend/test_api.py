import pytest
from httpx import AsyncClient
import os
import sys

# Set in-memory SQLite for tests before importing app (for future use)
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
# from app.main import app  # Not needed for direct HTTP tests

# NOTE: You must start the FastAPI server (uvicorn app.main:app --reload) before running these tests.
BASE_URL = "http://127.0.0.1:8000"

@pytest.mark.asyncio
async def test_products_crud_and_errors():
    async with AsyncClient(base_url=BASE_URL) as ac:
        # Create product
        resp = await ac.post("/api/v1/products/", json={
            "name": "Milk",
            "barcode": "12345678",
            "category": "Dairy",
            "min_stock": 5,
            "max_stock": 50
        })
        assert resp.status_code == 201, resp.text
        product = resp.json()
        product_id = product["id"]

        # Duplicate barcode
        resp = await ac.post("/api/v1/products/", json={
            "name": "Milk2",
            "barcode": "12345678",
            "category": "Dairy",
            "min_stock": 1,
            "max_stock": 10
        })
        assert resp.status_code == 409, resp.text
        assert "already exists" in resp.json()["detail"]

        # Get product
        resp = await ac.get(f"/api/v1/products/{product_id}")
        assert resp.status_code == 200, resp.text
        assert resp.json()["name"] == "Milk"

        # Update product to duplicate barcode
        resp = await ac.post("/api/v1/products/", json={
            "name": "Yogurt",
            "barcode": "87654321",
            "category": "Dairy",
            "min_stock": 2,
            "max_stock": 20
        })
        assert resp.status_code == 201, resp.text
        other = resp.json()
        other_id = other["id"]
        resp = await ac.put(f"/api/v1/products/{other_id}", json={
            "name": "Yogurt",
            "barcode": "12345678",
            "category": "Dairy",
            "min_stock": 2,
            "max_stock": 20
        })
        assert resp.status_code == 409, resp.text

        # Delete product
        resp = await ac.delete(f"/api/v1/products/{product_id}")
        assert resp.status_code == 204, resp.text
        # Get deleted product
        resp = await ac.get(f"/api/v1/products/{product_id}")
        assert resp.status_code == 404, resp.text

@pytest.mark.asyncio
async def test_expiry_manual_and_errors():
    async with AsyncClient(base_url=BASE_URL) as ac:
        # Create a product
        resp = await ac.post("/api/v1/products/", json={
            "name": "Cheese",
            "barcode": "11223344",
            "category": "Dairy",
            "min_stock": 1,
            "max_stock": 10
        })
        assert resp.status_code == 201, resp.text
        product_id = resp.json()["id"]
        # Add expiry with valid date
        resp = await ac.post("/api/v1/expiry/manual", json={
            "product_id": product_id,
            "expiry_date": "2099-12-31"
        })
        assert resp.status_code == 201, resp.text
        # Add expiry with past date
        resp = await ac.post("/api/v1/expiry/manual", json={
            "product_id": product_id,
            "expiry_date": "2000-01-01"
        })
        assert resp.status_code == 400, resp.text
        # Add expiry for missing product
        resp = await ac.post("/api/v1/expiry/manual", json={
            "product_id": 9999,
            "expiry_date": "2099-12-31"
        })
        assert resp.status_code == 404, resp.text
        # List expiry
        resp = await ac.get("/api/v1/expiry/")
        assert resp.status_code == 200, resp.text
        assert any(e["product_id"] == product_id for e in resp.json())

@pytest.mark.asyncio
async def test_expiry_ocr_scan_and_errors():
    async with AsyncClient(base_url=BASE_URL) as ac:
        # Create a product
        resp = await ac.post("/api/v1/products/", json={
            "name": "Butter",
            "barcode": "55667788",
            "category": "Dairy",
            "min_stock": 1,
            "max_stock": 10
        })
        assert resp.status_code == 201, resp.text
        product_id = resp.json()["id"]
        # Use a sample image (must exist in images/expiry_samples/sample.jpg)
        sample_path = "images/expiry_samples/sample.jpg"
        if not os.path.exists(sample_path):
            with open(sample_path, "wb") as f:
                f.write(b"test")
        with open(sample_path, "rb") as f:
            files = {"file": ("sample.jpg", f, "image/jpeg")}
            resp = await ac.post(f"/api/v1/expiry/scan?product_id={product_id}", files=files)
            # Should fail OCR or succeed with default
            assert resp.status_code in (201, 422), resp.text
        # Scan expiry for missing product
        with open(sample_path, "rb") as f:
            files = {"file": ("sample.jpg", f, "image/jpeg")}
            resp = await ac.post(f"/api/v1/expiry/scan?product_id=9999", files=files)
            assert resp.status_code == 404, resp.text

@pytest.mark.asyncio
async def test_alerts_and_forecast():
    async with AsyncClient(base_url=BASE_URL) as ac:
        resp = await ac.get("/api/v1/alerts/")
        assert resp.status_code == 200, resp.text
        assert isinstance(resp.json(), list)
        resp = await ac.get("/api/v1/forecast/")
        assert resp.status_code == 200, resp.text
        assert isinstance(resp.json(), list) 