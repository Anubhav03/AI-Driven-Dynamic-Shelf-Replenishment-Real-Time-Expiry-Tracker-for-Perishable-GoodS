#!/usr/bin/env python3
"""
Test API Endpoints for ShelfAI Backend
This script tests all the API endpoints to ensure they're working correctly
"""

import requests
import json
import sys
from datetime import datetime

def test_endpoint(url, method="GET", data=None, description=""):
    """Test a single endpoint"""
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "PUT":
            response = requests.put(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        print(f"✅ {description}")
        print(f"   URL: {url}")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            try:
                result = response.json()
                if isinstance(result, list):
                    print(f"   Results: {len(result)} items")
                else:
                    print(f"   Response: {result}")
            except:
                print(f"   Response: {response.text[:100]}...")
        print()
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ {description}")
        print(f"   URL: {url}")
        print(f"   Error: {e}")
        print()
        return False

def main():
    """Test all endpoints"""
    base_url = "http://localhost:8000/api/v1"
    
    print("🚀 Testing ShelfAI API Endpoints")
    print("=" * 50)
    print(f"Base URL: {base_url}")
    print()
    
    # Test products endpoints
    print("📦 Testing Products Endpoints:")
    test_endpoint(f"{base_url}/products/", description="GET /products/ - List all products")
    
    # Test creating a product
    sample_product = {
        "name": "Test Product",
        "barcode": "1234567890999",
        "category": "Test",
        "min_stock": 5,
        "max_stock": 20
    }
    test_endpoint(f"{base_url}/products/", method="POST", data=sample_product, 
                  description="POST /products/ - Create a product")
    
    # Test alerts endpoint
    print("🚨 Testing Alerts Endpoints:")
    test_endpoint(f"{base_url}/alerts/", description="GET /alerts/ - Get all alerts")
    
    # Test forecast endpoint
    print("📊 Testing Forecast Endpoints:")
    test_endpoint(f"{base_url}/forecast/", description="GET /forecast/ - Get demand forecast")
    
    # Test expiry endpoints
    print("📅 Testing Expiry Endpoints:")
    test_endpoint(f"{base_url}/expiry/", description="GET /expiry/ - List all expiry records")
    
    # Test creating an expiry record
    sample_expiry = {
        "product_id": 1,
        "expiry_date": "2024-12-31"
    }
    test_endpoint(f"{base_url}/expiry/manual", method="POST", data=sample_expiry,
                  description="POST /expiry/manual - Add expiry manually")
    
    print("🎉 Endpoint testing completed!")
    print("\n📋 Next steps:")
    print("1. Check the results above")
    print("2. Visit http://localhost:8000/docs for interactive API docs")
    print("3. Test the frontend connection")

if __name__ == "__main__":
    main() 