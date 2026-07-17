-- Simpan snapshot data fisik di tiap baris macro_targets
ALTER TABLE macro_targets ADD COLUMN IF NOT EXISTS height_cm NUMERIC;
ALTER TABLE macro_targets ADD COLUMN IF NOT EXISTS weight_kg NUMERIC;
ALTER TABLE macro_targets ADD COLUMN IF NOT EXISTS age INT;
