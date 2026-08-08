-- Quora Mock Database Schema
-- Database: quora_mock
-- Ensures related rows are removed when a parent is deleted (ON DELETE CASCADE)

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  category VARCHAR
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT
);

CREATE TABLE IF NOT EXISTS question_votes (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  vote INTEGER
);

CREATE TABLE IF NOT EXISTS answer_votes (
  id SERIAL PRIMARY KEY,
  answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
  vote INTEGER
);

-- If tables already existed without CASCADE, re-apply FK rules:
ALTER TABLE answers
  DROP CONSTRAINT IF EXISTS answers_question_id_fkey,
  ADD CONSTRAINT answers_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;

ALTER TABLE question_votes
  DROP CONSTRAINT IF EXISTS question_votes_question_id_fkey,
  ADD CONSTRAINT question_votes_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;

ALTER TABLE answer_votes
  DROP CONSTRAINT IF EXISTS answer_votes_answer_id_fkey,
  ADD CONSTRAINT answer_votes_answer_id_fkey
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE;
