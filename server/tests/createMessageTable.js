
const  pool = require('../db');

(async () => {
  try {
    console.log('Creating new chat-related tables...');

    // Create chat_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        chat_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('New tables created or already exist.');

    // Create index for frequently queried fields
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id 
      ON chat_sessions (user_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_messages_chat_id 
      ON messages (chat_id);
    `);

    // List all tables in the public schema
    console.log('\nCurrent tables in the public schema:');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    result.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

  } catch (err) {
    console.error('Error during setup:', err);
  } finally {
    await pool.end();
    console.log('\nPool closed.');
  }
})();