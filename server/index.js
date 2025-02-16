// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import session libraries
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

// Our Postgres pool
const pool = require('./db');

// Our routes
const authRoutes = require('./routes/auth');
const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Session middleware
app.use(
  session({
    store: new pgSession({
      pool,               // connection pool
      tableName: 'user_sessions', // create this table or use an existing one
    }),
    secret: process.env.SESSION_SECRET, // make sure this is set in your .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in ms
      secure: process.env.NODE_ENV === 'production', // only send cookie over HTTPS in production
      httpOnly: true,   // prevents client JS from reading the cookie
      sameSite: 'strict',
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
