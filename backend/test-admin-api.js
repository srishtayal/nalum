/**
 * Quick Test Script for Admin Panel API
 * 
 * Run this file to test admin authentication and basic endpoints
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000";
let adminToken = "";

// Test Admin Login
async function testAdminLogin() {
  try {
    console.log("\n🔐 Testing Admin Login...");
    const response = await axios.post(`${BASE_URL}/admin/auth/login`, {
      email: "superadmin@nalum.com",
      password: "Admin@123",
    });

    if (response.data.success) {
      adminToken = response.data.data.access_token;
      console.log("✅ Admin login successful!");
      console.log("   Token:", adminToken.substring(0, 20) + "...");
      console.log("   Admin:", response.data.data.admin.name);
      return true;
    }
  } catch (error) {
    console.error("❌ Admin login failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Test Get Current Admin
async function testGetCurrentAdmin() {
  try {
    console.log("\n👤 Testing Get Current Admin...");
    const response = await axios.get(`${BASE_URL}/admin/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.success) {
      console.log("✅ Get current admin successful!");
      console.log("   Admin:", response.data.admin);
      return true;
    }
  } catch (error) {
    console.error("❌ Get current admin failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Test Dashboard Statistics
async function testDashboardStats() {
  try {
    console.log("\n📊 Testing Dashboard Statistics...");
    const response = await axios.get(`${BASE_URL}/admin/statistics/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.success) {
      console.log("✅ Dashboard stats retrieved!");
      console.log("   Total Users:", response.data.stats.users.total);
      console.log("   Total Alumni:", response.data.stats.users.alumni);
      console.log("   Verified Alumni:", response.data.stats.users.verified_alumni);
      console.log("   Pending Verifications:", response.data.stats.verifications.pending);
      return true;
    }
  } catch (error) {
    console.error("❌ Dashboard stats failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Test Verification Queue
async function testVerificationQueue() {
  try {
    console.log("\n📋 Testing Verification Queue...");
    const response = await axios.get(`${BASE_URL}/admin/verification/queue`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.success) {
      console.log("✅ Verification queue retrieved!");
      console.log("   Pending:", response.data.data.length);
      return true;
    }
  } catch (error) {
    console.error("❌ Verification queue failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Test Get Banned Users
async function testGetBannedUsers() {
  try {
    console.log("\n🚫 Testing Get Banned Users...");
    const response = await axios.get(`${BASE_URL}/admin/users/banned`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    if (response.data.success) {
      console.log("✅ Banned users retrieved!");
      console.log("   Total Banned:", response.data.data.length);
      return true;
    }
  } catch (error) {
    console.error("❌ Get banned users failed:", error.response?.data?.message || error.message);
    return false;
  }
}

// Test Health Check
async function testHealthCheck() {
  try {
    console.log("\n❤️  Testing Health Check...");
    const response = await axios.get(`${BASE_URL}/admin/health`);

    if (response.data.success) {
      console.log("✅ Admin API is healthy!");
      return true;
    }
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log("🚀 Starting Admin Panel API Tests...");
  console.log("=====================================");

  let passedTests = 0;
  let totalTests = 0;

  totalTests++;
  if (await testHealthCheck()) passedTests++;

  totalTests++;
  if (await testAdminLogin()) {
    passedTests++;

    totalTests++;
    if (await testGetCurrentAdmin()) passedTests++;

    totalTests++;
    if (await testDashboardStats()) passedTests++;

    totalTests++;
    if (await testVerificationQueue()) passedTests++;

    totalTests++;
    if (await testGetBannedUsers()) passedTests++;
  } else {
    console.log("\n⚠️  Skipping remaining tests due to login failure");
  }

  console.log("\n=====================================");
  console.log(`📈 Test Results: ${passedTests}/${totalTests} passed`);
  
  if (passedTests === totalTests) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Please check the errors above.");
  }
}

// Run tests
runAllTests().catch(console.error);
