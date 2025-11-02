#!/usr/bin/env python3
"""
Integration test for Infinity Portal Google Auth system
Tests the full flow: Google Auth → Rogers Core → Realms
"""

import requests
import json
import sys
import time

BASE_URL = "http://localhost:8080"

def test_health_check():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    data = response.json()
    assert data['status'] == 'healthy'
    assert data['service'] == 'Rogers Core'
    print("✓ Health check passed")
    return True

def test_chat_without_auth():
    """Test chat endpoint without authentication"""
    print("\nTesting chat without authentication...")
    response = requests.post(f"{BASE_URL}/chat", json={
        "message": "hello",
        "context": "Realm: portal"
    })
    assert response.status_code == 200
    data = response.json()
    assert data['authenticated'] == False
    assert data['realm'] == 'portal'
    assert 'reply' in data
    print(f"✓ Chat response: {data['reply'][:60]}...")
    return True

def test_chat_marketplace_realm():
    """Test chat in marketplace realm"""
    print("\nTesting chat in marketplace realm...")
    response = requests.post(f"{BASE_URL}/chat", json={
        "message": "help",
        "context": "Realm: marketplace"
    })
    assert response.status_code == 200
    data = response.json()
    assert data['realm'] == 'marketplace'
    assert 'marketplace' in data['reply'].lower() or 'listing' in data['reply'].lower()
    print(f"✓ Marketplace chat: {data['reply'][:60]}...")
    return True

def test_chat_socializer_realm():
    """Test chat in socializer realm"""
    print("\nTesting chat in socializer realm...")
    response = requests.post(f"{BASE_URL}/chat", json={
        "message": "help",
        "context": "Realm: socializer"
    })
    assert response.status_code == 200
    data = response.json()
    assert data['realm'] == 'socializer'
    assert 'socializer' in data['reply'].lower() or 'community' in data['reply'].lower()
    print(f"✓ Socializer chat: {data['reply'][:60]}...")
    return True

def test_chat_builder_realm():
    """Test chat in builder realm"""
    print("\nTesting chat in builder realm...")
    response = requests.post(f"{BASE_URL}/chat", json={
        "message": "hello",
        "context": "Realm: builder"
    })
    assert response.status_code == 200
    data = response.json()
    assert data['realm'] == 'builder'
    print(f"✓ Builder chat: {data['reply'][:60]}...")
    return True

def test_realm_auth_required():
    """Test that realm endpoints require authentication"""
    print("\nTesting realm endpoint auth requirement...")
    response = requests.get(f"{BASE_URL}/realm/portal")
    assert response.status_code == 401
    data = response.json()
    assert 'error' in data
    print("✓ Realm auth requirement enforced")
    return True

def test_dashboard_auth_required():
    """Test that dashboard requires authentication"""
    print("\nTesting dashboard auth requirement...")
    response = requests.get(f"{BASE_URL}/dashboard")
    assert response.status_code == 401
    print("✓ Dashboard auth requirement enforced")
    return True

def run_all_tests():
    """Run all integration tests"""
    print("=" * 60)
    print("INFINITY PORTAL INTEGRATION TESTS")
    print("Architecture: Google Auth → Rogers Core → Realms")
    print("=" * 60)
    
    tests = [
        test_health_check,
        test_chat_without_auth,
        test_chat_marketplace_realm,
        test_chat_socializer_realm,
        test_chat_builder_realm,
        test_realm_auth_required,
        test_dashboard_auth_required
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"✗ Test failed: {test.__name__}")
            print(f"  Error: {str(e)}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"RESULTS: {passed} passed, {failed} failed")
    print("=" * 60)
    
    return failed == 0

if __name__ == "__main__":
    try:
        # Wait a moment for server to be ready
        print("Waiting for server to be ready...")
        time.sleep(2)
        
        success = run_all_tests()
        sys.exit(0 if success else 1)
    except requests.exceptions.ConnectionError:
        print("\n✗ ERROR: Cannot connect to Rogers Core server")
        print("  Make sure the server is running on http://localhost:8080")
        print("  Run: python3 rogers_core.py")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
        sys.exit(1)
