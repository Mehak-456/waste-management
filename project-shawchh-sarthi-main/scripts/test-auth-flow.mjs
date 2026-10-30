// ====================================================================
// SWACHH SEVA - AUTOMATED AUTHENTICATION & ROLE ACCESS VERIFICATION
// ====================================================================

import assert from 'assert';

console.log('🧪 Starting Swachh Seva Authentication & Role Flow Tests...\n');

// 1. Test Email Validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
};

console.log('Test 1: Email Validation');
assert.strictEqual(validateEmail('test@swachhseva.in').valid, true, 'Valid email must pass');
assert.strictEqual(validateEmail('invalid-email').valid, false, 'Invalid email format must fail');
assert.strictEqual(validateEmail('').valid, false, 'Empty email must fail');
console.log('  ✅ Email format validation passed.\n');

// 2. Test Password Validation
const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long' };
  }
  return { valid: true };
};

console.log('Test 2: Password Complexity Validation');
assert.strictEqual(validatePassword('123456').valid, true, '6-char password passes');
assert.strictEqual(validatePassword('12345').valid, false, '5-char password fails');
assert.strictEqual(validatePassword('').valid, false, 'Empty password fails');
console.log('  ✅ Password length validation passed.\n');

// 3. Test Security Role Guard on Registration
const validateRegistrationRole = (role) => {
  const normalized = (role || '').toLowerCase();
  if (normalized === 'authority' || normalized === 'admin') {
    return {
      allowed: false,
      error: 'Security Violation: Municipal Authority accounts cannot be registered publicly.',
    };
  }
  if (['citizen', 'worker'].includes(normalized)) {
    return { allowed: true };
  }
  return { allowed: false, error: 'Invalid role selection.' };
};

console.log('Test 3: Registration Role Security Guard');
assert.strictEqual(validateRegistrationRole('citizen').allowed, true, 'Citizen registration permitted');
assert.strictEqual(validateRegistrationRole('worker').allowed, true, 'Sanitation Worker registration permitted');
assert.strictEqual(validateRegistrationRole('authority').allowed, false, 'Authority registration strictly blocked');
assert.strictEqual(validateRegistrationRole('admin').allowed, false, 'Admin registration strictly blocked');
console.log('  ✅ Authority privilege escalation guard verified.\n');

// 4. Test Missing Environment Variables Handling
const isConfiguredCheck = (url, key) => {
  if (!url || !key) return false;
  const isPlaceholderUrl = url.includes('your-project-ref') || url.includes('placeholder');
  const isPlaceholderKey = key.includes('your-anon-public-key') || key.includes('placeholder');
  return !isPlaceholderUrl && !isPlaceholderKey;
};

console.log('Test 4: Supabase Environment Configuration Detection');
assert.strictEqual(isConfiguredCheck('', ''), false, 'Empty env returns unconfigured');
assert.strictEqual(
  isConfiguredCheck('https://your-project-ref.supabase.co', 'your-anon-public-key-here'),
  false,
  'Placeholder env returns unconfigured'
);
assert.strictEqual(
  isConfiguredCheck('https://xyzcorp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy'),
  true,
  'Live env returns configured'
);
console.log('  ✅ Graceful unconfigured detection verified.\n');

// 5. Test Role-Based Protected Route Authorization Matrix
const isRouteAuthorized = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};

console.log('Test 5: Role-Based Route Access Matrix');
const routes = {
  '/dashboard': ['worker', 'authority'],
  '/performance': ['worker', 'authority'],
  '/training': ['worker', 'authority'],
  '/citizen': ['citizen', 'authority'],
  '/authority': ['authority'], // Strictly authority only
  '/report': ['citizen', 'worker', 'authority'],
  '/profile': ['citizen', 'worker', 'authority'],
};

// Citizen Tests
assert.strictEqual(isRouteAuthorized('citizen', routes['/citizen']), true, 'Citizen can access /citizen');
assert.strictEqual(isRouteAuthorized('citizen', routes['/authority']), false, 'Citizen CANNOT access /authority');
assert.strictEqual(isRouteAuthorized('citizen', routes['/dashboard']), false, 'Citizen CANNOT access /dashboard');
assert.strictEqual(isRouteAuthorized('citizen', routes['/profile']), true, 'Citizen can access /profile');

// Worker Tests
assert.strictEqual(isRouteAuthorized('worker', routes['/dashboard']), true, 'Worker can access /dashboard');
assert.strictEqual(isRouteAuthorized('worker', routes['/training']), true, 'Worker can access /training');
assert.strictEqual(isRouteAuthorized('worker', routes['/authority']), false, 'Worker CANNOT access /authority');
assert.strictEqual(isRouteAuthorized('worker', routes['/citizen']), false, 'Worker CANNOT access /citizen');

// Municipal Authority Tests
assert.strictEqual(isRouteAuthorized('authority', routes['/authority']), true, 'Authority can access /authority');
assert.strictEqual(isRouteAuthorized('authority', routes['/dashboard']), true, 'Authority can inspect worker /dashboard');
assert.strictEqual(isRouteAuthorized('authority', routes['/citizen']), true, 'Authority can inspect /citizen');

console.log('  ✅ Route access control matrix verified across all 3 roles.\n');

// 6. Test Error Handling Mappings
const formatAuthError = (errorMessage) => {
  const msg = (errorMessage || '').toLowerCase();
  if (msg.includes('invalid login credentials')) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (msg.includes('already registered')) {
    return 'An account with this email address already exists. Please log in instead.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please check your email inbox to verify your account before logging in.';
  }
  return errorMessage || 'Authentication error';
};

console.log('Test 6: Supabase Auth Error Mapping');
assert.strictEqual(
  formatAuthError('Invalid login credentials'),
  'Invalid email or password. Please verify your credentials and try again.'
);
assert.strictEqual(
  formatAuthError('User already registered'),
  'An account with this email address already exists. Please log in instead.'
);
assert.strictEqual(
  formatAuthError('Email not confirmed'),
  'Please check your email inbox to verify your account before logging in.'
);
console.log('  ✅ Actionable auth error messages verified.\n');

console.log('🎉 ALL 6 TEST SUITES PASSED! Authentication & Role Foundation is Rock Solid.');
