-- Isi snapshot untuk baris macro_targets yang masih NULL
UPDATE macro_targets mt
SET
  height_cm = p.height_cm,
  weight_kg = p.weight_kg,
  age       = p.age
FROM profiles p
WHERE mt.profile_id = p.id
  AND mt.height_cm IS NULL;
