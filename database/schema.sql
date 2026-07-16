CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(30),
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP
);

CREATE TABLE servers (
    id UUID PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(255),
    icon_url TEXT,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE server_members (
    server_id UUID NOT NULL,
    user_id UUID NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (server_id, user_id),
    FOREIGN KEY (server_id) REFERENCES servers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE channels (
    id UUID PRIMARY KEY,
    server_id UUID NOT NULL,
    name VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (server_id) REFERENCES servers(id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    channel_id UUID NOT NULL,
    author_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    replied_to_message UUID,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES channels(id),
    FOREIGN KEY (author_id) REFERENCES users(id),
    FOREIGN KEY (replied_to_message) REFERENCES messages(id)
);