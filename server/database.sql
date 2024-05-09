CREATE DATABASE nimbus;

-- set extension
-- UUID creates user id that is a very hard to conflict serialized string
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

-- insert fake users

INSERT INTO users (user_name, user_email, user_password) VALUES ('username', 'user_email', 'user_password');