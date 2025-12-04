const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';
const ADMIN_EMAIL = 'tandahmarcelle2@gmail.com';
const ADMIN_PASSWORD = 'marcelle1234';

let authToken = '';
let testUserId = '';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(`\n${colors.bold}${colors.blue}Step ${step}: ${description}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function makeRequest(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const data = response.ok ? await response.json() : null;
  return { response, data };
}

async function testAuthentication() {
  logStep(1, 'Testing Admin Authentication');
  
  try {
    const { response, data } = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      }),
    });

    if (response.ok && data) {
      authToken = data.token;
      logSuccess(`Admin authenticated successfully`);
      logSuccess(`Admin user: ${data.user.firstName} ${data.user.lastName} (${data.user.role})`);
      return true;
    } else {
      logError(`Authentication failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Authentication error: ${error.message}`);
    return false;
  }
}

async function testGetUsers() {
  logStep(2, 'Testing Get Users with Pagination');
  
  try {
    const { response, data } = await makeRequest('/users?page=1&limit=10');

    if (response.ok && data) {
      logSuccess(`Retrieved users successfully`);
      logSuccess(`Total users: ${data.total}, Page: ${data.page}, Total Pages: ${data.totalPages}`);
      logSuccess(`Users on current page: ${data.users.length}`);
      
      if (data.users.length > 0) {
        logSuccess(`Sample user: ${data.users[0].firstName} ${data.users[0].lastName} (${data.users[0].email})`);
      }
      
      return true;
    } else {
      logError(`Get users failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Get users error: ${error.message}`);
    return false;
  }
}

async function testCreateUser() {
  logStep(3, 'Testing Create User');
  
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    password: 'testpassword123',
    role: 'user',
    phone: '+33123456789',
    address: '123 Test Street, Test City',
    isActive: true,
  };

  try {
    const { response, data } = await makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(testUser),
    });

    if (response.ok && data) {
      testUserId = data.id;
      logSuccess(`User created successfully`);
      logSuccess(`Created user: ${data.firstName} ${data.lastName} (${data.email})`);
      logSuccess(`User ID: ${data.id}`);
      logSuccess(`Role: ${data.role}, Active: ${data.isActive}`);
      return true;
    } else {
      logError(`Create user failed: ${response.status} ${response.statusText}`);
      if (response.status === 400) {
        try {
          const errorData = await response.json();
          logError(`Error details: ${JSON.stringify(errorData)}`);
        } catch (e) {
          logError(`Could not parse error response`);
        }
      }
      return false;
    }
  } catch (error) {
    logError(`Create user error: ${error.message}`);
    return false;
  }
}

async function testUpdateUser() {
  logStep(4, 'Testing Update User');
  
  if (!testUserId) {
    logError('No test user ID available for update test');
    return false;
  }

  const updateData = {
    firstName: 'Updated',
    lastName: 'TestUser',
    phone: '+33987654321',
    address: '456 Updated Street, Updated City',
  };

  try {
    const { response, data } = await makeRequest(`/users/${testUserId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });

    if (response.ok && data) {
      logSuccess(`User updated successfully`);
      logSuccess(`Updated user: ${data.firstName} ${data.lastName}`);
      logSuccess(`Updated phone: ${data.phone}`);
      logSuccess(`Updated address: ${data.address}`);
      return true;
    } else {
      logError(`Update user failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Update user error: ${error.message}`);
    return false;
  }
}

async function testUpdateUserStatus() {
  logStep(5, 'Testing Update User Status');
  
  if (!testUserId) {
    logError('No test user ID available for status update test');
    return false;
  }

  try {
    const { response, data } = await makeRequest(`/users/${testUserId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: false }),
    });

    if (response.ok && data) {
      logSuccess(`User status updated successfully`);
      logSuccess(`User active status: ${data.isActive}`);
      return true;
    } else {
      logError(`Update user status failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Update user status error: ${error.message}`);
    return false;
  }
}

async function testUpdatePassword() {
  logStep(6, 'Testing Update User Password');
  
  if (!testUserId) {
    logError('No test user ID available for password update test');
    return false;
  }

  try {
    const { response, data } = await makeRequest(`/users/${testUserId}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password: 'newpassword123' }),
    });

    if (response.ok) {
      logSuccess(`User password updated successfully`);
      return true;
    } else {
      logError(`Update password failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Update password error: ${error.message}`);
    return false;
  }
}

async function testSearchUsers() {
  logStep(7, 'Testing Search Users');
  
  try {
    const { response, data } = await makeRequest('/users?search=Updated&page=1&limit=10');

    if (response.ok && data) {
      logSuccess(`Search users successful`);
      logSuccess(`Found ${data.users.length} users matching search criteria`);
      
      if (data.users.length > 0) {
        logSuccess(`Search result: ${data.users[0].firstName} ${data.users[0].lastName}`);
      }
      
      return true;
    } else {
      logError(`Search users failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Search users error: ${error.message}`);
    return false;
  }
}

async function testFilterUsers() {
  logStep(8, 'Testing Filter Users by Role');
  
  try {
    const { response, data } = await makeRequest('/users?role=user&page=1&limit=10');

    if (response.ok && data) {
      logSuccess(`Filter users by role successful`);
      logSuccess(`Found ${data.users.length} users with 'user' role`);
      
      if (data.users.length > 0) {
        const allUsersRole = data.users.every(user => user.role === 'user');
        if (allUsersRole) {
          logSuccess(`All filtered users have correct role`);
        } else {
          logWarning(`Some users don't have the expected role`);
        }
      }
      
      return true;
    } else {
      logError(`Filter users failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Filter users error: ${error.message}`);
    return false;
  }
}

async function testGetUserById() {
  logStep(9, 'Testing Get User by ID');
  
  if (!testUserId) {
    logError('No test user ID available for get by ID test');
    return false;
  }

  try {
    const { response, data } = await makeRequest(`/users/${testUserId}`);

    if (response.ok && data) {
      logSuccess(`Get user by ID successful`);
      logSuccess(`Retrieved user: ${data.firstName} ${data.lastName} (${data.email})`);
      logSuccess(`User role: ${data.role}, Active: ${data.isActive}`);
      return true;
    } else {
      logError(`Get user by ID failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Get user by ID error: ${error.message}`);
    return false;
  }
}

async function testDeleteUser() {
  logStep(10, 'Testing Delete User');
  
  if (!testUserId) {
    logError('No test user ID available for delete test');
    return false;
  }

  try {
    const { response } = await makeRequest(`/users/${testUserId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      logSuccess(`User deleted successfully`);
      logSuccess(`Deleted user ID: ${testUserId}`);
      return true;
    } else {
      logError(`Delete user failed: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Delete user error: ${error.message}`);
    return false;
  }
}

async function testDeletedUserNotFound() {
  logStep(11, 'Testing Deleted User Not Found');
  
  if (!testUserId) {
    logError('No test user ID available for not found test');
    return false;
  }

  try {
    const { response } = await makeRequest(`/users/${testUserId}`);

    if (response.status === 404) {
      logSuccess(`Deleted user correctly returns 404 Not Found`);
      return true;
    } else {
      logError(`Expected 404 but got: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    logError(`Deleted user check error: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  log(`${colors.bold}${colors.blue}Starting User Management System Tests...${colors.reset}\n`);
  
  const tests = [
    testAuthentication,
    testGetUsers,
    testCreateUser,
    testUpdateUser,
    testUpdateUserStatus,
    testUpdatePassword,
    testSearchUsers,
    testFilterUsers,
    testGetUserById,
    testDeleteUser,
    testDeletedUserNotFound,
  ];

  let passedTests = 0;
  const totalTests = tests.length;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passedTests++;
    }
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Final Results
  log(`\n${colors.bold}${colors.blue}Test Results Summary:${colors.reset}`);
  log(`${colors.bold}Total Tests: ${totalTests}${colors.reset}`);
  log(`${colors.bold}${colors.green}Passed: ${passedTests}${colors.reset}`);
  log(`${colors.bold}${colors.red}Failed: ${totalTests - passedTests}${colors.reset}`);
  
  if (passedTests === totalTests) {
    log(`\n${colors.bold}${colors.green}🎉 All tests passed! User Management System is working correctly.${colors.reset}`);
  } else {
    log(`\n${colors.bold}${colors.red}❌ Some tests failed. Please check the backend implementation.${colors.reset}`);
  }
}

// Run the tests
runAllTests().catch(console.error);
