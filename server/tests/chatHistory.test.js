// test/testChatHistory.js

const request = require('supertest');
const express = require('express');
const pool = require('../db'); // Adjust the path if needed
const chatHistoryRoutes = require('../routes/chatHistory');

const app = express();
app.use(express.json());

// Fake session middleware to simulate an authenticated user with id = 1.
app.use((req, res, next) => {
  req.session = { user: { id: 1, name: 'Test User', email: 'test@example.com' } };
  next();
});
app.use('/api/chatHistory', chatHistoryRoutes);

beforeAll(async () => {
  // Insert a test user with id 1 so that foreign key constraints are satisfied.
  // Provide a dummy password_hash value for testing.
  await pool.query(`
    INSERT INTO users (id, name, email, password_hash)
    VALUES (1, 'Test User', 'test@example.com', 'dummyhash')
    ON CONFLICT (id) DO NOTHING
  `);
});

beforeEach(async () => {
  // Clean up chat_sessions and messages tables for isolation.
  await pool.query('DELETE FROM messages');
  await pool.query('DELETE FROM chat_sessions');
});

afterAll(async () => {
  // Optionally, you can delete the test user here or leave it.
  // await pool.query('DELETE FROM users WHERE id = 1');
  await pool.end();
});

describe('Chat History API', () => {
  test('POST /api/chatHistory/sessions - should create a new chat session', async () => {
    const res = await request(app)
      .post('/api/chatHistory/sessions')
      .send({ title: 'Test Chat Session' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Chat Session');
  });

  test('GET /api/chatHistory/sessions - should retrieve all chat sessions for the user', async () => {
    // Create two sessions first.
    await request(app).post('/api/chatHistory/sessions').send({ title: 'Chat 1' });
    await request(app).post('/api/chatHistory/sessions').send({ title: 'Chat 2' });

    const res = await request(app).get('/api/chatHistory/sessions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('GET /api/chatHistory/sessions/:chatId/messages - should return empty messages initially', async () => {
    // Create a session.
    const sessionRes = await request(app)
      .post('/api/chatHistory/sessions')
      .send({ title: 'Session For Messages' });
    const chatId = sessionRes.body.id;

    const res = await request(app).get(`/api/chatHistory/sessions/${chatId}/messages`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/chatHistory/sessions/:chatId/messages - should add a message to a chat session', async () => {
    // Create a session.
    const sessionRes = await request(app)
      .post('/api/chatHistory/sessions')
      .send({ title: 'Session For Adding Message' });
    const chatId = sessionRes.body.id;

    // Add a message.
    const messageRes = await request(app)
      .post(`/api/chatHistory/sessions/${chatId}/messages`)
      .send({ content: 'Hello, world!', role: 'user' });
    expect(messageRes.statusCode).toBe(201);
    expect(messageRes.body).toHaveProperty('id');
    expect(messageRes.body.content).toBe('Hello, world!');
    expect(messageRes.body.role).toBe('user');

    // Verify that the message is returned when fetching messages.
    const messagesRes = await request(app).get(`/api/chatHistory/sessions/${chatId}/messages`);
    expect(messagesRes.statusCode).toBe(200);
    expect(messagesRes.body.length).toBe(1);
    expect(messagesRes.body[0].content).toBe('Hello, world!');
  });

  test('PUT /api/chatHistory/sessions/:chatId - should update the chat session title', async () => {
    // Create a session.
    const sessionRes = await request(app)
      .post('/api/chatHistory/sessions')
      .send({ title: 'Original Title' });
    const chatId = sessionRes.body.id;

    // Update the title.
    const updateRes = await request(app)
      .put(`/api/chatHistory/sessions/${chatId}`)
      .send({ title: 'Updated Title' });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.title).toBe('Updated Title');

    // Confirm the update by retrieving sessions.
    const sessionsRes = await request(app).get('/api/chatHistory/sessions');
    const sessionFound = sessionsRes.body.find((s) => s.id === chatId);
    expect(sessionFound).toBeDefined();
    expect(sessionFound.title).toBe('Updated Title');
  });

  test('DELETE /api/chatHistory/sessions/:chatId - should delete a chat session and cascade delete messages', async () => {
    // Create a session.
    const sessionRes = await request(app)
      .post('/api/chatHistory/sessions')
      .send({ title: 'Chat to Delete' });
    const chatId = sessionRes.body.id;

    // Add a message to test cascade deletion.
    await request(app)
      .post(`/api/chatHistory/sessions/${chatId}/messages`)
      .send({ content: 'Message to be deleted', role: 'user' });

    // Delete the chat session.
    const deleteRes = await request(app).delete(`/api/chatHistory/sessions/${chatId}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.message).toBe('Chat session deleted successfully');

    // Verify the session is deleted.
    const sessionsRes = await request(app).get('/api/chatHistory/sessions');
    const sessionFound = sessionsRes.body.find((s) => s.id === chatId);
    expect(sessionFound).toBeUndefined();

    // Verify that fetching messages returns a 404 since the session no longer exists.
    const messagesRes = await request(app).get(`/api/chatHistory/sessions/${chatId}/messages`);
    expect(messagesRes.statusCode).toBe(404);
  });

  test('PUT /api/chatHistory/sessions/:chatId - should return 404 when updating a non-existent session', async () => {
    const res = await request(app)
      .put('/api/chatHistory/sessions/9999')
      .send({ title: "Non-existent Session" });
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/chatHistory/sessions/:chatId/messages - should return 404 when adding a message to a non-existent session', async () => {
    const res = await request(app)
      .post('/api/chatHistory/sessions/9999/messages')
      .send({ content: 'Test message', role: 'user' });
    expect(res.statusCode).toBe(404);
  });
});
