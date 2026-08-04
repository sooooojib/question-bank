-- =============================================
-- University Question Bank — Supabase Schema
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. BATCHES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS batches (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 2. QUESTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS questions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id     UUID REFERENCES batches(id) ON DELETE CASCADE,
  course_name  TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  semester     TEXT NOT NULL,
  exam_type    TEXT NOT NULL,
  year         INT NOT NULL,
  file_url     TEXT NOT NULL,
  file_type    TEXT NOT NULL DEFAULT 'pdf',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 3. INDEXES for fast lookups
-- =============================================
CREATE INDEX IF NOT EXISTS idx_questions_batch_id     ON questions(batch_id);
CREATE INDEX IF NOT EXISTS idx_questions_course_name  ON questions(course_name);
CREATE INDEX IF NOT EXISTS idx_questions_semester     ON questions(semester);
CREATE INDEX IF NOT EXISTS idx_questions_exam_type    ON questions(exam_type);
CREATE INDEX IF NOT EXISTS idx_questions_year         ON questions(year);

-- =============================================
-- 4. ROW LEVEL SECURITY (RLS) — TABLES
-- =============================================
ALTER TABLE batches  ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on batches" ON batches;
DROP POLICY IF EXISTS "Allow public read on questions" ON questions;
DROP POLICY IF EXISTS "Allow public insert on batches" ON batches;
DROP POLICY IF EXISTS "Allow public insert on questions" ON questions;

CREATE POLICY "Allow public read on batches" ON batches FOR SELECT USING (true);
CREATE POLICY "Allow public read on questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on batches" ON batches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on questions" ON questions FOR INSERT WITH CHECK (true);

-- =============================================
-- 5. INITIAL DEFAULT BATCHES (Seed Data)
-- =============================================
INSERT INTO batches (name) VALUES 
  ('CSE 14th Batch'),
  ('CSE 15th Batch'),
  ('CSE 16th Batch'),
  ('CSE 17th Batch')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 6. STORAGE BUCKET & RLS POLICIES FOR FILE UPLOADS
-- Fixes: "Failed to upload file to storage: new row violates row-level security policy"
-- =============================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('question-bank', 'question-bank', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Allow public uploads on question-bank" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads on question-bank" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates on question-bank" ON storage.objects;

CREATE POLICY "Allow public uploads on question-bank" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'question-bank');

CREATE POLICY "Allow public reads on question-bank" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'question-bank');

CREATE POLICY "Allow public updates on question-bank" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'question-bank');
