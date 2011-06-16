CREATE TABLE snippets (
	id SERIAL PRIMARY KEY,
	lang VARCHAR(32) NOT NULL,
	title VARCHAR(256) NOT NULL,
	contents TEXT NOT NULL,
	tags VARCHAR(256),
	lastmod TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO snippets (lang, title, contents, tags)
	VALUES (
		"js",
		"Hello World",
		"alert('Hello World');",
		"test"
	);
