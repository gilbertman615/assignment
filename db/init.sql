DO
$do$
BEGIN
    -- create extensions for uuid generate
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- create db table
    CREATE TABLE IF NOT EXISTS users (
        id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password TEXT NOT NULL,
        CONSTRAINT email_unique UNIQUE (email)
    );
    CREATE INDEX idx_name ON users using btree(name);
    CREATE UNIQUE INDEX idx_email ON users using btree(email);
END
$do$;
