CREATE DATABASE frogs_db;

\c frogs_db;

CREATE TABLE frogs (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    habitat VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO frogs (id, image, title, description, habitat) VALUES
(1, '/static/images/1image.jpg', 'Лягушка 1', '<h1>Краткое описание лягушки 1.</h1> Обитает в тропических лесах.', 'Австралия'),
(2, '/static/images/2image.jpg', 'Лягушка 2', 'Краткое описание лягушки 2. Ядовитый вид.', 'Индонезия');