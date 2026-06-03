const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.DB_URL || null;

const pool = new Pool(
  connectionString
    ? { connectionString }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST || '/cloudsql/' + (process.env.CLOUD_SQL_CONNECTION_NAME || ''),
      }
);

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
