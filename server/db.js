// server/db.js
require('dotenv').config({ path: './.env' });
const { Pool } = require('pg');

const sslCert = process.env.PG_SSL_CERT;

const config = {
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: true,
    ca: sslCert,
  },
};

const pool = new Pool(config);

module.exports = pool;
