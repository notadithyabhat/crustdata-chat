// server/routes/chatHistory.js

const express = require('express');
const router = express.Router();
const pool = require('../db');  // your pg Pool from db.js

/**
 * Middleware to ensure user is authenticated.
 * You might already have something similar; adapt as needed.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

/**
 * CREATE a new chat session
 * Endpoint: POST /api/chatHistory/sessions
 * Body: { title: 'Some title' }
 */
router.post('/sessions', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;  // adapt to how your session stores user ID
    const { title } = req.body;

    // Insert a new row into chat_sessions
    const result = await pool.query(
      `INSERT INTO chat_sessions (user_id, title) 
       VALUES ($1, $2) 
       RETURNING id, user_id, title, created_at, updated_at`,
      [userId, title]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating chat session:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET all chat sessions for the authenticated user
 * Endpoint: GET /api/chatHistory/sessions
 */
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;

    const result = await pool.query(
      `SELECT id, user_id, title, created_at, updated_at
         FROM chat_sessions
        WHERE user_id = $1
        ORDER BY created_at DESC`,
      [userId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('Error getting chat sessions:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * GET a single chat session's messages
 * Endpoint: GET /api/chatHistory/sessions/:chatId/messages
 */
router.get('/sessions/:chatId/messages', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { chatId } = req.params;

    // First, ensure this session belongs to the current user
    const chatSessionCheck = await pool.query(
      `SELECT id, user_id FROM chat_sessions WHERE id = $1 AND user_id = $2`,
      [chatId, userId]
    );

    if (chatSessionCheck.rowCount === 0) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    const result = await pool.query(
      `SELECT id, chat_id, content, role, created_at
         FROM messages
        WHERE chat_id = $1
        ORDER BY created_at ASC`,
      [chatId]
    );

    return res.json(result.rows);
  } catch (err) {
    console.error('Error getting messages:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * ADD a new message to an existing chat session
 * Endpoint: POST /api/chatHistory/sessions/:chatId/messages
 * Body: { content: 'Hello', role: 'user' }   // or 'assistant'
 */
router.post('/sessions/:chatId/messages', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { chatId } = req.params;
    const { content, role } = req.body;

    // Check if chat session belongs to the user
    const chatSessionCheck = await pool.query(
      `SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2`,
      [chatId, userId]
    );
    if (chatSessionCheck.rowCount === 0) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Insert a new message
    const newMessage = await pool.query(
      `INSERT INTO messages (chat_id, content, role) 
       VALUES ($1, $2, $3)
       RETURNING id, chat_id, content, role, created_at`,
      [chatId, content, role]
    );

    // Update the chat_session's updated_at timestamp
    await pool.query(
      `UPDATE chat_sessions
          SET updated_at = CURRENT_TIMESTAMP
        WHERE id = $1`,
      [chatId]
    );

    return res.status(201).json(newMessage.rows[0]);
  } catch (err) {
    console.error('Error adding message:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * UPDATE chat session title
 * Endpoint: PUT /api/chatHistory/sessions/:chatId
 * Body: { title: 'New title' }
 */
router.put('/sessions/:chatId', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { chatId } = req.params;
    const { title } = req.body;

    // Make sure this session belongs to the user
    const chatSessionCheck = await pool.query(
      `SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2`,
      [chatId, userId]
    );
    if (chatSessionCheck.rowCount === 0) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Update
    const updated = await pool.query(
      `UPDATE chat_sessions
          SET title = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, user_id, title, created_at, updated_at`,
      [title, chatId]
    );

    return res.json(updated.rows[0]);
  } catch (err) {
    console.error('Error updating chat session:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * DELETE a chat session
 * Endpoint: DELETE /api/chatHistory/sessions/:chatId
 */
router.delete('/sessions/:chatId', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { chatId } = req.params;

    // Make sure user owns the chat session
    const chatSessionCheck = await pool.query(
      `SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2`,
      [chatId, userId]
    );
    if (chatSessionCheck.rowCount === 0) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Delete it (CASCADE on messages if foreign key is on DELETE CASCADE)
    await pool.query(
      `DELETE FROM chat_sessions WHERE id = $1`,
      [chatId]
    );

    return res.json({ message: 'Chat session deleted successfully' });
  } catch (err) {
    console.error('Error deleting chat session:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
