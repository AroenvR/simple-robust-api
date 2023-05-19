-- schema.sql
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- auto-incrementing primary key
    uuid TEXT NOT NULL UNIQUE,            -- User's UUID v4
    name TEXT NOT NULL                    -- User's name
);