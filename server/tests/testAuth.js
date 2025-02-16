// testAuth.js
const request = require('supertest');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');
const authRoutes = require('../routes/auth'); // your auth router
const pool = require('../db'); // your database pool

// Create an Express app and mount middleware and routes
const app = express();
app.use(bodyParser.json());

// Configure sessions (using your same pool)
app.use(
  session({
    store: new pgSession({
      pool, // your pg Pool instance
      tableName: 'user_sessions',
    }),
    secret: 'testsecret', // For testing purposes, use a simple secret
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

// Mount the auth routes at /api/auth
app.use('/api/auth', authRoutes);

async function runTests() {
  // Use an agent to preserve cookies across requests (for session persistence)
  const agent = request.agent(app);

  // Data for signup and login
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  };

  console.log('--- Testing Signup ---');
  // Try signing up the test user
  let signupRes = await agent.post('/api/auth/signup').send(testUser);
  console.log('Signup Status:', signupRes.status);
  console.log('Signup Response:', signupRes.body);

  // If user already exists (e.g. from a previous test run), remove it and try again
  if (signupRes.status !== 201 && signupRes.body.message === 'User already exists') {
    await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
    signupRes = await agent.post('/api/auth/signup').send(testUser);
    console.log('Re-attempt Signup Status:', signupRes.status);
    console.log('Re-attempt Signup Response:', signupRes.body);
  }

  console.log('\n--- Testing Login ---');
  // Now, attempt to login with the test user credentials
  const loginRes = await agent.post('/api/auth/login').send({
    email: testUser.email,
    password: testUser.password,
  });
  console.log('Login Status:', loginRes.status);
  console.log('Login Response:', loginRes.body);

  // Cleanup: Delete the test user from the database
  await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  console.log('\nTest user deleted. Tests complete.');

  // End the process (or gracefully shut down your app if needed)
  process.exit(0);
}

// Run the tests
runTests().catch((err) => {
  console.error('Error during tests:', err);
  process.exit(1);
});
