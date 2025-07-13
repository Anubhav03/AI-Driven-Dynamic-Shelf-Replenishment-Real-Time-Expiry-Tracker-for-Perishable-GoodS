import pytest
from httpx import AsyncClient
import os
import sys

# MySQL configuration for tests
os.environ["DATABASE_TYPE"] = "mysql"
os.environ["MYSQL_HOST"] = "localhost"
os.environ["MYSQL_PORT"] = "3306"
os.environ["MYSQL_USER"] = "root"
os.environ["MYSQL_PASSWORD"] = "january2023"
os.environ["MYSQL_DATABASE"] = "shelf_management_test"

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

        # Update product
        resp = await ac.put(f"/api/v1/products/{product_id}", json={
            "name": "Updated Milk",
            "barcode": "12345678",
            "category": "Dairy",
            "min_stock": 10,
            "max_stock": 100
        })
        assert resp.status_code == 200, resp.text
        assert resp.json()["name"] == "Updated Milk"

        # Try to update with duplicate barcode
        resp = await ac.put(f"/api/v1/products/{product_id}", json={
            "name": "Updated Milk",
            "barcode": "87654321",  # This barcode belongs to other product
            "category": "Dairy",
            "min_stock": 10,
            "max_stock": 100
        })
        assert resp.status_code == 409, resp.text

        # Get all products
        resp = await ac.get("/api/v1/products/")
        assert resp.status_code == 200, resp.text
        products = resp.json()
        assert len(products) >= 2

        # Delete product
        resp = await ac.delete(f"/api/v1/products/{product_id}")
        assert resp.status_code == 200, resp.text

        # Verify deletion
        resp = await ac.get(f"/api/v1/products/{product_id}")
        assert resp.status_code == 404, resp.text

        # Clean up
        await ac.delete(f"/api/v1/products/{other_id}")

@pytest.mark.asyncio
async def test_expiry_crud():
    async with AsyncClient(base_url=BASE_URL) as ac:
        # First create a product
        resp = await ac.post("/api/v1/products/", json={
            "name": "Test Product",
            "barcode": "TEST123",
            "category": "Test",
            "min_stock": 1,
            "max_stock": 10
        })
        assert resp.status_code == 201, resp.text
        product = resp.json()
        product_id = product["id"]

        # Create expiry record
        resp = await ac.post("/api/v1/expiry/", json={
            "product_id": product_id,
            "expiry_date": "2024-12-31",
            "quantity": 5,
            "batch_number": "BATCH001"
        })
        assert resp.status_code == 201, resp.text
        expiry = resp.json()
        expiry_id = expiry["id"]

        # Get expiry record
        resp = await ac.get(f"/api/v1/expiry/{expiry_id}")
        assert resp.status_code == 200, resp.text
        assert resp.json()["batch_number"] == "BATCH001"

        # Get all expiry records
        resp = await ac.get("/api/v1/expiry/")
        assert resp.status_code == 200, resp.text
        expiries = resp.json()
        assert len(expiries) >= 1

        # Update expiry record
        resp = await ac.put(f"/api/v1/expiry/{expiry_id}", json={
            "product_id": product_id,
            "expiry_date": "2024-11-30",
            "quantity": 3,
            "batch_number": "BATCH001_UPDATED"
        })
        assert resp.status_code == 200, resp.text
        assert resp.json()["batch_number"] == "BATCH001_UPDATED"

        # Delete expiry record
        resp = await ac.delete(f"/api/v1/expiry/{expiry_id}")
        assert resp.status_code == 200, resp.text

        # Clean up
        await ac.delete(f"/api/v1/products/{product_id}")

@pytest.mark.asyncio
async def test_alerts():
    async with AsyncClient(base_url=BASE_URL) as ac:
        # Test getting alerts
        resp = await ac.get("/api/v1/alerts/")
        assert resp.status_code == 200, resp.text
        alerts = resp.json()
        assert isinstance(alerts, list)

@pytest.mark.asyncio
async def test_forecast():
    async with AsyncClient(base_url=BASE_URL) as ac:
        # Test getting forecast
        resp = await ac.get("/api/v1/forecast/")
        assert resp.status_code == 200, resp.text
        forecast = resp.json()
        assert isinstance(forecast, dict) 