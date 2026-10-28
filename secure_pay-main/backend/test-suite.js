const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 Running SecurePay Full Security & API Test Suite');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, description) {
    if (condition) {
      console.log(`\x1b[32m[PASS]\x1b[0m ${description}`);
      passed++;
    } else {
      console.error(`\x1b[31m[FAIL]\x1b[0m ${description}`);
      failed++;
    }
  }

  try {
    // 1. GET / status
    const statusRes = await fetch(`${BASE_URL}/`);
    const statusData = await statusRes.json();
    assert(statusRes.status === 200 && statusData.status === 'ONLINE', 'GET / Health & Architecture Check');

    // 2. Failed login attempt (Password mismatch)
    const badLoginRes = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@securepay.test',
        password: 'WrongPassword!',
      }),
    });
    assert(badLoginRes.status === 401, 'POST /api/login rejects invalid credentials (HTTP 401)');

    // 3. Customer Login (Establish Session)
    let customerCookie = '';
    const custLoginRes = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@securepay.test',
        password: 'Customer@123',
      }),
    });
    const custLoginData = await custLoginRes.json();
    assert(custLoginRes.status === 200 && custLoginData.user?.role === 'customer', 'POST /api/login as Customer');

    const rawCookie = custLoginRes.headers.get('set-cookie');
    if (rawCookie) {
      customerCookie = rawCookie.split(';')[0];
    }
    assert(!!customerCookie, 'Session cookie (connect.sid) issued upon login');

    // 4. GET /api/me with session cookie
    const meRes = await fetch(`${BASE_URL}/api/me`, {
      headers: { Cookie: customerCookie },
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.authenticated === true, 'GET /api/me validates active session');

    // 5. GET /api/customer/profile
    const profRes = await fetch(`${BASE_URL}/api/customer/profile`, {
      headers: { Cookie: customerCookie },
    });
    const profData = await profRes.json();
    assert(profRes.status === 200 && !!profData.data?.summary?.accountNumber, 'GET /api/customer/profile returns customer details');

    // 6. RBAC Test: Customer attempting to access Admin endpoint
    const rbacRes = await fetch(`${BASE_URL}/api/admin`, {
      headers: { Cookie: customerCookie },
    });
    assert(rbacRes.status === 403, 'RBAC Enforcement: Customer blocked from /api/admin (HTTP 403 Forbidden)');

    // 7. Input Validation: Invalid payment payload (negative amount)
    const badPayRes = await fetch(`${BASE_URL}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: customerCookie,
      },
      body: JSON.stringify({ amount: -50, recipient: 'Test Store', description: 'Test' }),
    });
    assert(badPayRes.status === 400, 'Server-side Validation: Negative payment rejected (HTTP 400)');

    // 8. Payment Processing: Valid Dummy Payment
    const payRes = await fetch(`${BASE_URL}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: customerCookie,
      },
      body: JSON.stringify({
        amount: 350,
        recipient: 'CloudSec Hosting Solutions',
        description: 'Monthly VPS Hosting Test',
      }),
    });
    const payData = await payRes.json();
    assert(payRes.status === 201 && !!payData.data?.transactionId, 'POST /api/payment processes dummy payment');

    // 9. Payment History
    const payListRes = await fetch(`${BASE_URL}/api/payments`, {
      headers: { Cookie: customerCookie },
    });
    const payListData = await payListRes.json();
    assert(payListRes.status === 200 && payListData.data?.length > 0, 'GET /api/payments returns transaction records');

    // 10. Logout and Session Destruction
    const logoutRes = await fetch(`${BASE_URL}/api/logout`, {
      method: 'POST',
      headers: { Cookie: customerCookie },
    });
    const logoutData = await logoutRes.json();
    assert(logoutRes.status === 200 && logoutData.success === true, 'POST /api/logout destroys active session');

    // 11. Verify session is invalidated
    const invalidRes = await fetch(`${BASE_URL}/api/me`, {
      headers: { Cookie: customerCookie },
    });
    assert(invalidRes.status === 401, 'Session Invalidation: Subsequent calls with destroyed cookie return HTTP 401');

    // 12. Admin Login
    let adminCookie = '';
    const adminLoginRes = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@securepay.test',
        password: 'Admin@123',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.user?.role === 'admin', 'POST /api/login as Admin');
    const adminRawCookie = adminLoginRes.headers.get('set-cookie');
    if (adminRawCookie) {
      adminCookie = adminRawCookie.split(';')[0];
    }

    // 13. Admin Dashboard & Telemetry
    const adminDashRes = await fetch(`${BASE_URL}/api/admin`, {
      headers: { Cookie: adminCookie },
    });
    const adminDashData = await adminDashRes.json();
    assert(
      adminDashRes.status === 200 && adminDashData.data?.metrics?.totalUsers > 0,
      'GET /api/admin returns SOC telemetry metrics to authorized Admin'
    );

    // 14. Admin Security Audit Logs
    const adminLogsRes = await fetch(`${BASE_URL}/api/logs`, {
      headers: { Cookie: adminCookie },
    });
    const adminLogsData = await adminLogsRes.json();
    assert(
      adminLogsRes.status === 200 && adminLogsData.data?.length > 0,
      'GET /api/logs returns centralized security audit trail'
    );

    // 15. Admin User Directory
    const adminUsersRes = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Cookie: adminCookie },
    });
    const adminUsersData = await adminUsersRes.json();
    assert(
      adminUsersRes.status === 200 && adminUsersData.data?.length >= 2,
      'GET /api/admin/users returns sanitized user accounts list'
    );

    console.log('====================================================');
    console.log(`✅ TEST SUITE RESULT: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');
  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

runTests();
