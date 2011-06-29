DROP TABLE IF EXISTS snippets;
CREATE TABLE snippets (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	lang VARCHAR(32) NOT NULL,
	title VARCHAR(256) NOT NULL,
	tags VARCHAR(256),
	code TEXT NOT NULL,
	memo TEXT,
	lastmod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"js",
		"Hello World",
		"test,js",
		"alert('Hello World');",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"js",
		"Hello World 2",
		"test,js",
		"alert('Hello World 2');",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"js",
		"Hello World 3",
		"test,js",
		"alert('Hello World 3');",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"css",
		"Body background 1",
		"test,css",
		"body{background-color: #F0F0F0;}",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"css",
		"Body background 2",
		"test,css",
		"body{background-color: #F0F0FF;}",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"css",
		"Body background 3",
		"test,css",
		"body{background-color: #FFF0F0;}",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"html",
		"Hello World (H1)",
		"test,js",
		"<h1>Hello World</h1>",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"html",
		"Hello World (H2)",
		"test,js",
		"<h2>Hello World</h2>",
		"this is a test"
	);

INSERT INTO snippets (id, lang, title, tags, code, memo)
	VALUES (
		NULL,
		"html",
		"Hello World (H3)",
		"test,js",
		"<h3>Hello World</h3>",
		"this is a test"
	);
