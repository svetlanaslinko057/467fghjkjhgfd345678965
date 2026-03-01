#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class SupportSystemTester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.admin_token = None
        self.user_token = None
        self.test_ticket_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, passed, details=""):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            self.failed_tests.append({"name": name, "details": details})
            print(f"❌ {name} - {details}")

    def make_request(self, method, endpoint, data=None, token=None, expected_status=200):
        """Make HTTP request with optional auth"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                return False, f"Unsupported method: {method}"

            success = response.status_code == expected_status
            result = {}
            try:
                result = response.json() if response.text else {}
            except:
                result = {"response_text": response.text}
            
            return success, result, response.status_code
        except Exception as e:
            return False, f"Request failed: {str(e)}", 0

    def test_admin_login(self):
        """Test admin login"""
        print("\n🔐 Testing Admin Authentication...")
        
        success, result, status_code = self.make_request(
            'POST', 'api/auth/login',
            data={"email": "admin@ystore.com", "password": "admin123"}
        )
        
        if success and 'access_token' in result:
            self.admin_token = result['access_token']
            self.log_test("Admin login", True)
            return True
        else:
            self.log_test("Admin login", False, f"Status: {status_code}, Response: {result}")
            return False

    def test_user_login_or_register(self):
        """Test user login/register for ticket creation"""
        print("\n👤 Testing User Authentication...")
        
        # Try login first
        user_email = f"support_test_{datetime.now().strftime('%H%M%S')}@test.com"
        user_password = "testpass123"
        
        # Register test user
        success, result, status_code = self.make_request(
            'POST', 'api/auth/register',
            data={
                "email": user_email,
                "password": user_password,
                "full_name": "Support Test User"
            }
        )
        
        if success and 'access_token' in result:
            self.user_token = result['access_token']
            self.log_test("User registration", True)
            return True
        else:
            self.log_test("User registration", False, f"Status: {status_code}, Response: {result}")
            return False

    def test_support_categories(self):
        """Test GET /api/support/categories"""
        print("\n📁 Testing Support Categories...")
        
        success, result, status_code = self.make_request('GET', 'api/support/categories')
        
        if success and isinstance(result, list):
            categories_count = len(result)
            expected_categories = ["order", "payment", "delivery", "product", "technical", "other"]
            found_categories = [cat.get("id") for cat in result]
            
            all_found = all(cat_id in found_categories for cat_id in expected_categories)
            
            if categories_count == 6 and all_found:
                self.log_test("Support categories (6 categories)", True)
                print(f"   Categories: {', '.join(found_categories)}")
                return True
            else:
                self.log_test("Support categories", False, 
                            f"Expected 6 categories {expected_categories}, got {categories_count}: {found_categories}")
                return False
        else:
            self.log_test("Support categories", False, f"Status: {status_code}, Response: {result}")
            return False

    def test_create_ticket_unauthorized(self):
        """Test creating ticket without auth (should fail)"""
        print("\n🚫 Testing Ticket Creation (Unauthorized)...")
        
        success, result, status_code = self.make_request(
            'POST', 'api/support/tickets',
            data={
                "category": "technical",
                "subject": "Test issue",
                "message": "This should fail without auth"
            },
            expected_status=401
        )
        
        if success:
            self.log_test("Ticket creation (unauthorized)", True)
            return True
        else:
            self.log_test("Ticket creation (unauthorized)", False, 
                        f"Expected 401, got {status_code}")
            return False

    def test_create_ticket_authorized(self):
        """Test creating ticket with user auth"""
        print("\n🎫 Testing Ticket Creation (Authorized)...")
        
        if not self.user_token:
            self.log_test("Ticket creation (authorized)", False, "No user token available")
            return False
        
        ticket_data = {
            "category": "technical",
            "subject": "Test support ticket",
            "message": "This is a test ticket to verify the support system functionality. It should be created successfully.",
            "contact_telegram": "@testuser",
            "contact_viber": "+380501234567"
        }
        
        success, result, status_code = self.make_request(
            'POST', 'api/support/tickets',
            data=ticket_data,
            token=self.user_token
        )
        
        if success and result.get("id"):
            self.test_ticket_id = result["id"]
            required_fields = ["id", "category", "subject", "message", "status", "user_id", "created_at"]
            has_all_fields = all(field in result for field in required_fields)
            
            if has_all_fields and result["status"] == "new":
                self.log_test("Ticket creation (authorized)", True)
                print(f"   Ticket ID: {self.test_ticket_id}")
                return True
            else:
                self.log_test("Ticket creation (authorized)", False, 
                            f"Missing fields or wrong status. Got: {list(result.keys())}")
                return False
        else:
            self.log_test("Ticket creation (authorized)", False, 
                        f"Status: {status_code}, Response: {result}")
            return False

    def test_admin_get_tickets(self):
        """Test GET /api/support/admin/tickets (admin only)"""
        print("\n👨‍💼 Testing Admin Ticket Retrieval...")
        
        if not self.admin_token:
            self.log_test("Admin ticket retrieval", False, "No admin token available")
            return False
        
        success, result, status_code = self.make_request(
            'GET', 'api/support/admin/tickets',
            token=self.admin_token
        )
        
        if success and isinstance(result, list):
            self.log_test("Admin ticket retrieval", True)
            print(f"   Found {len(result)} tickets")
            return True
        else:
            self.log_test("Admin ticket retrieval", False, 
                        f"Status: {status_code}, Response: {result}")
            return False

    def test_admin_get_tickets_unauthorized(self):
        """Test admin tickets endpoint with user token (should fail)"""
        print("\n🚫 Testing Admin Tickets (User Token)...")
        
        if not self.user_token:
            self.log_test("Admin tickets (user token)", False, "No user token available")
            return False
        
        success, result, status_code = self.make_request(
            'GET', 'api/support/admin/tickets',
            token=self.user_token,
            expected_status=403
        )
        
        if success:
            self.log_test("Admin tickets (user token - forbidden)", True)
            return True
        else:
            self.log_test("Admin tickets (user token - forbidden)", False, 
                        f"Expected 403, got {status_code}")
            return False

    def test_admin_stats(self):
        """Test GET /api/support/admin/stats"""
        print("\n📊 Testing Admin Support Stats...")
        
        if not self.admin_token:
            self.log_test("Admin support stats", False, "No admin token available")
            return False
        
        success, result, status_code = self.make_request(
            'GET', 'api/support/admin/stats',
            token=self.admin_token
        )
        
        if success and isinstance(result, dict):
            required_keys = ["new", "in_progress", "resolved", "closed", "total"]
            has_all_keys = all(key in result for key in required_keys)
            
            if has_all_keys:
                self.log_test("Admin support stats", True)
                print(f"   Stats: {result}")
                return True
            else:
                self.log_test("Admin support stats", False, 
                            f"Missing stats keys. Got: {list(result.keys())}")
                return False
        else:
            self.log_test("Admin support stats", False, 
                        f"Status: {status_code}, Response: {result}")
            return False

    def test_admin_reply_to_ticket(self):
        """Test admin replying to ticket"""
        print("\n💬 Testing Admin Reply to Ticket...")
        
        if not self.admin_token or not self.test_ticket_id:
            self.log_test("Admin reply to ticket", False, "No admin token or ticket ID available")
            return False
        
        reply_data = {
            "message": "Thank you for contacting support. We are looking into your issue and will get back to you shortly."
        }
        
        success, result, status_code = self.make_request(
            'POST', f'api/support/admin/tickets/{self.test_ticket_id}/reply',
            data=reply_data,
            token=self.admin_token
        )
        
        if success and result.get("success"):
            self.log_test("Admin reply to ticket", True)
            return True
        else:
            self.log_test("Admin reply to ticket", False, 
                        f"Status: {status_code}, Response: {result}")
            return False

    def test_admin_update_ticket_status(self):
        """Test admin updating ticket status"""
        print("\n🔄 Testing Admin Update Ticket Status...")
        
        if not self.admin_token or not self.test_ticket_id:
            self.log_test("Admin update ticket status", False, "No admin token or ticket ID available")
            return False
        
        status_data = {"status": "resolved"}
        
        success, result, status_code = self.make_request(
            'PATCH', f'api/support/admin/tickets/{self.test_ticket_id}/status',
            data=status_data,
            token=self.admin_token
        )
        
        if success and result.get("success") and result.get("status") == "resolved":
            self.log_test("Admin update ticket status", True)
            return True
        else:
            self.log_test("Admin update ticket status", False, 
                        f"Status: {status_code}, Response: {result}")
            return False

    def run_all_tests(self):
        """Run all support system tests"""
        print("🎯 Starting Support System Testing...")
        print(f"Backend URL: {self.base_url}")
        
        # Authentication tests
        admin_auth_ok = self.test_admin_login()
        user_auth_ok = self.test_user_login_or_register()
        
        # Core functionality tests
        self.test_support_categories()
        self.test_create_ticket_unauthorized()
        
        if user_auth_ok:
            self.test_create_ticket_authorized()
        
        if admin_auth_ok:
            self.test_admin_get_tickets()
            self.test_admin_stats()
            
            if self.test_ticket_id:
                self.test_admin_reply_to_ticket()
                self.test_admin_update_ticket_status()
        
        if user_auth_ok:
            self.test_admin_get_tickets_unauthorized()
        
        # Print summary
        print(f"\n📊 Test Results Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\nSuccess Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    backend_url = "https://full-stack-setup-19.preview.emergentagent.com"
    
    tester = SupportSystemTester(backend_url)
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())