// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

// Existing routes
const authRoutes = require('./routes/auth');
const chatRoute = require('./routes/chat');
// New chatHistory route
const chatHistoryRoutes = require('./routes/chatHistory');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3001', // or your client's URL
  credentials: true
}));
app.use(bodyParser.json());

// Session middleware
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: 'user_sessions',
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// Existing routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoute);

// NEW: Chat history
app.use('/api/chatHistory', chatHistoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
