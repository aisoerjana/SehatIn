-- Tambah kolom name ke tabel profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;
