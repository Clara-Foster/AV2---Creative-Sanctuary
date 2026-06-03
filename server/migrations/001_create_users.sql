CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  provider TEXT NOT NULL DEFAULT 'local',
  created_at TIMESTAMPTZ DEFAULT now()
);
