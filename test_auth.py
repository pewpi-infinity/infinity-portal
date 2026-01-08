"""
Test script for user authentication functionality
"""
import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:8080"
TEST_USERNAME = f"testuser_{uuid.uuid4().hex[:8]}"
TEST_PASSWORD = "secure123"

def test_register():
    """Test user registration"""
    print("Testing user registration...")
    response = requests.post(
        f"{BASE_URL}/api/register",
        json={"username": TEST_USERNAME, "password": TEST_PASSWORD},
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data
    print("✓ Registration successful")
    return data["access_token"]

def test_login():
    """Test user login"""
    print("Testing user login...")
    response = requests.post(
        f"{BASE_URL}/api/login",
        json={"username": TEST_USERNAME, "password": TEST_PASSWORD},
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data
    print("✓ Login successful")
    return data["access_token"]

def test_invalid_login():
    """Test login with invalid credentials"""
    print("Testing invalid login...")
    response = requests.post(
        f"{BASE_URL}/api/login",
        json={"username": TEST_USERNAME, "password": "wrongpassword"},
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 401
    data = response.json()
    assert data["status"] == "error"
    print("✓ Invalid login correctly rejected")

def test_protected_endpoint_with_auth(token):
    """Test accessing protected endpoint with valid token"""
    print("Testing protected endpoint with authentication...")
    # Create a test file
    files = {'file': ('test.zip', b'test content', 'application/zip')}
    data = {'deploymentType': 'gpt'}
    headers = {'Authorization': f'Bearer {token}'}
    
    response = requests.post(
        f"{BASE_URL}/upload",
        files=files,
        data=data,
        headers=headers
    )
    assert response.status_code == 200
    result = response.json()
    assert result["status"] == "success"
    print("✓ Protected endpoint accessible with valid token")

def test_protected_endpoint_without_auth():
    """Test accessing protected endpoint without token"""
    print("Testing protected endpoint without authentication...")
    files = {'file': ('test.zip', b'test content', 'application/zip')}
    data = {'deploymentType': 'gpt'}
    
    response = requests.post(
        f"{BASE_URL}/upload",
        files=files,
        data=data
    )
    assert response.status_code == 401
    print("✓ Protected endpoint correctly requires authentication")

def main():
    print("\n=== Running Authentication Tests ===\n")
    try:
        # Test registration
        token1 = test_register()
        
        # Test login
        token2 = test_login()
        
        # Test invalid login
        test_invalid_login()
        
        # Test protected endpoint with auth
        test_protected_endpoint_with_auth(token2)
        
        # Test protected endpoint without auth
        test_protected_endpoint_without_auth()
        
        print("\n=== All tests passed! ✓ ===\n")
    except AssertionError as e:
        print(f"\n✗ Test failed: {e}\n")
        raise
    except Exception as e:
        print(f"\n✗ Error: {e}\n")
        raise

if __name__ == "__main__":
    main()
