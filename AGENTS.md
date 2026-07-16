# SehatIn — Agent Guide

## Stack
- **Frontend:** React 19 + Vite 8, JSX (no TypeScript), Tailwind CSS v4
- **Backend:** Supabase, 2 Deno Edge Functions (not Node.js)
- **Package manager:** npm
- **Language:** Indonesian (UI text, variable names, comments, DB tables)

## Commands
| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint flat config (`eslint.config.js`) |
| `npm run supabase` | Pass-through to `supabase` CLI |
| `npx supabase functions serve` | Run Edge Functions locally |
| `npx supabase functions deploy rule-engine` | Deploy rule-engine to hosted |
| `npx supabase functions deploy gemini-proxy` | Deploy gemini-proxy to hosted |
| `npx supabase secrets set GROQ_API_KEY=<key>` | Set Groq key on hosted |

Run **lint** before committing. No tests or typecheck commands exist.

## Data flow
1. User fills profile form (gender, berat, tinggi, usia, goal: bulking/cutting/maintain)
2. `asesmen.jsx` calls `supabase.functions.invoke('rule-engine', ...)` with form data
3. `rule-engine` calculates TDEE, BMI, macro targets (kalori, protein, carbs, fat, fiber, sugar max, air putih), saves to `macro_targets` with `is_active: true`, and matches food catalog items → returns structured data
4. Frontend calls `gemini-proxy` with filtered data → **Groq Llama 3.3** (not Gemini — misleading name) returns natural-language food recommendations
5. Recommendations saved to `food_recommendations` (food_name, portion, kalori, protein_g, carbs_g, lemak_g, serat_g, `is_cooked: false`, optional `meal_type`: sarapan/siang/malam/snack)
6. `daily_food_totals` view auto-sums all recommendations per day

## Tables (created via Supabase Dashboard SQL Editor — no migration files)
| Table/View | Purpose |
|---|---|
| `profiles` | gender (enum), weight_kg, height_cm, age, goal (enum: bulking/cutting/maintain) — column names are **English** |
| `macro_targets` | tdee, calorie_target, bmi, protein_g, protein_per_kg, carbs_g, fat_g, fiber_g, sugar_max_g, water_liter; unique partial index ensures 1 active target per profile (`is_active`) |
| `food_catalog` | Master data: 50 seed foods with nutritional values per 100g (food_name, category, kalori, protein_g, carbs_g, lemak_g, serat_g). Readable by all authenticated users via RLS, write only by service_role |
| `food_recommendations` | Daily food recs: food_name, portion, kalori, protein_g, carbs_g, lemak_g, serat_g, is_cooked (default false), optional meal_type, notes, links to macro_target & food_catalog |
| `daily_food_totals` | View — auto-sums total_kalori, total_protein_g, total_carbs_g, total_lemak_g, total_serat_g, total_items, all_cooked per profile per day |

## Edge Functions (Deno/TS)
- Both have `verify_jwt = false` — no auth required to invoke
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` auto-injected by Supabase runtime (do NOT set manually)
- Only `GROQ_API_KEY` must be set as a secret
- `rule-engine` uses `createClient` from `https://esm.sh/@supabase/supabase-js@2` directly (import map `deno.json` is not used for the supabase client)
- `.npmrc` files in function dirs are placeholders (ignored by Deno)
- VSCode: Deno extension recommended (`denoland.vscode-deno`), settings in `backend/.vscode/`

## Environment
| Variable | Where | For |
|---|---|---|
| `VITE_SUPABASE_URL` | Root `.env` | Frontend Supabase client |
| `VITE_SUPABASE_ANON_KEY` | Root `.env` | Frontend Supabase client |
| `GROQ_API_KEY` | `backend/supabase/.env` (local) / secret (hosted) | Groq API in gemini-proxy |
| `SUPABASE_URL` | Auto-injected by runtime | Edge Functions (do NOT set) |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected by runtime | Edge Functions (do NOT set) |

## Caveats
- Tables created via **Supabase Dashboard SQL Editor** — no migration files
- Root `supabase/` contains only `.temp/` (CLI artifact); real project is `backend/supabase/`
- `src/App.css` is unused Vite scaffold artifact (not imported)
- Tailwind v4 via `@tailwindcss/vite` plugin — no PostCSS config or `tailwind.config.js`
- `config.toml:71` references `seed.sql` — ignored, local Docker workflow not used
