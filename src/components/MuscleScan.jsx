import { useState, useEffect } from "react";
import UpperNavbar from './UpperNavbar'
import BottomNavbar from './BottomNavbar'
import { useTheme } from '../context/ThemeContext'

/* ============================================================
   VARENPRIL LABS — Muscle Scan (React + Tailwind port)
   Same behavior as the single-file HTML version:
   chips → auto view switch → glow highlight → AI protocol panel
   → exercise video modal.
   ============================================================ */

/* ---------- design tokens ---------- */
const LIGHT_C = {
  bg: "#FFFFFF",
  bgSoft: "#F8FAFC",
  panel: "#FFFFFF",
  panel2: "#F4F8FB",
  line: "rgba(37,99,235,0.16)",
  line2: "rgba(37,99,235,0.10)",
  teal: "#2563EB",
  blue: "#1E40AF",
  orange: "#F5A97F",
  ink: "#1F2937",
  ink2: "#4B5563",
  ink3: "#9CA3AF",
  glowTeal: "0 0 24px rgba(37,99,235,.25)",
  page: "#eff6ff",
  stageBg: `radial-gradient(ellipse at 50% 28%, rgba(37,99,235,.06), transparent 62%), #FFFFFF`,
  panelSoft: "rgba(248,250,252,0.85)",
};

const DARK_C = {
  bg: "#0b0f17",
  bgSoft: "#0f1420",
  panel: "#0e131d",
  panel2: "#121826",
  line: "rgba(34,211,238,0.25)",
  line2: "rgba(34,211,238,0.14)",
  teal: "#22d3ee",
  blue: "#3b82f6",
  orange: "#F5A97F",
  ink: "#e5e7eb",
  ink2: "#9aa4b2",
  ink3: "#64748b",
  glowTeal: "0 0 24px rgba(34,211,238,.35)",
  page: "#05070d",
  stageBg: `radial-gradient(ellipse at 50% 28%, rgba(34,211,238,.08), transparent 62%), #0b0f17`,
  panelSoft: "rgba(15,20,32,0.85)",
};

/* mutated per-render by MuscleScan based on the active theme; ProtoCard/VideoModal
   read this same module binding when React calls them during the same render pass */
let C = LIGHT_C;

/* ===================== DATA ===================== */
const MUSCLE_DATA = {
  chest: {
    name: "Chest — Pectoralis Major & Minor",
    func: "The chest muscles handle arm flexion, adduction, and internal rotation. One of the largest muscles in the upper body and the key to pressing strength.",
    exercises: [
      { name: "Bench Press (Barbell)", img: "🏋️", yt: "https://www.youtube.com/embed/rT7DgCr-3pg", desc: "The main chest compound lift. Lie on a bench, lower the barbell to your chest, then press it back up. Activates the pec major, anterior deltoid, and triceps.", sets: "2 working sets × 5-8 reps", rest: "2-3 minutes", alat: "Barbell, Bench" },
      { name: "Incline Dumbbell Press", img: "🔵", yt: "https://www.youtube.com/embed/8iPEnn-ltC8", desc: "Emphasizes the upper chest. On a 30° incline bench, press the dumbbells up and slightly inward with a full stretch at the bottom.", sets: "2 working sets × 8-12 reps", rest: "2 minutes", alat: "Dumbbell, Incline Bench" },
      { name: "Cable Crossover", img: "⚡", yt: "https://www.youtube.com/embed/taI4XduLpTk", desc: "Isolates the chest with constant tension. Bring the handles together in front of your chest, squeezing at peak contraction. A perfect finisher.", sets: "2 working sets × 12-15 reps", rest: "60-90 seconds", alat: "Cable Machine" },
      { name: "Push-Up", img: "💪", yt: "https://www.youtube.com/embed/IODxDxX7oi4", desc: "A classic bodyweight move for chest, shoulders, and triceps. Can be varied wide/narrow/incline. Great as a to-failure finisher.", sets: "2 working sets × max reps", rest: "60 seconds", alat: "Bodyweight" },
    ],
  },
  bicep: {
    name: "Biceps — Biceps Brachii",
    func: "The biceps have two heads (long & short), responsible for elbow flexion and forearm supination. Most visible when the arm is flexed.",
    exercises: [
      { name: "Barbell Curl", img: "🏋️", yt: "https://www.youtube.com/embed/kwG2ipFRgfo", desc: "The main biceps exercise. Stand upright, curl the barbell up with elbow flexion, keeping your elbows pinned. One of the most effective moves.", sets: "2 working sets × 6-10 reps", rest: "90 seconds", alat: "Barbell / EZ Bar" },
      { name: "Incline Dumbbell Curl", img: "🔵", yt: "https://www.youtube.com/embed/soxrZlIl35U", desc: "Arms hanging back give a maximal stretch to the long head. Strong supination on every rep.", sets: "2 working sets × 8-12 reps", rest: "90 seconds", alat: "Dumbbell, Incline Bench" },
      { name: "Cable Curl", img: "⚡", yt: "https://www.youtube.com/embed/cyb_1-zB9PU", desc: "Constant tension throughout the movement. Squeeze at the peak, slow negative. A great pump finisher.", sets: "2 working sets × 12-15 reps", rest: "45-60 seconds", alat: "Cable Machine" },
      { name: "Hammer Curl", img: "🔨", yt: "https://www.youtube.com/embed/zC3nLlEvin4", desc: "Neutral grip activates the brachialis & brachioradialis. Adds overall arm thickness.", sets: "2 working sets × 10-12 reps", rest: "60 seconds", alat: "Dumbbell" },
    ],
  },
  tricep: {
    name: "Triceps — Triceps Brachii",
    func: "The triceps have three heads and make up ~2/3 of the upper arm's mass. Responsible for elbow extension — crucial for every pressing movement.",
    exercises: [
      { name: "Close-Grip Bench / Dip", img: "🏋️", yt: "https://www.youtube.com/embed/2z8JmcrW-As", desc: "The heaviest triceps compound. Tuck your elbows, lower with control, full lockout. Weighted dips are also very effective.", sets: "2 working sets × 6-10 reps", rest: "2-3 minutes", alat: "Barbell / Parallel Bars" },
      { name: "Overhead Extension", img: "🙆", yt: "https://www.youtube.com/embed/YbX7Wd8jQ-Q", desc: "A deep stretch on the long head overhead. Keep your elbows pointed forward, lower slowly.", sets: "2 working sets × 8-12 reps", rest: "90 seconds", alat: "Dumbbell / Cable / EZ Bar" },
      { name: "Tricep Pushdown (Rope)", img: "⬇️", yt: "https://www.youtube.com/embed/vB5OHsJ3EME", desc: "Lock your elbows at your sides, push down, spread the rope at the end of the movement for maximal contraction. A classic finisher.", sets: "2 working sets × 12-20 reps", rest: "45-60 seconds", alat: "Cable Machine, Rope" },
      { name: "Skull Crusher", img: "💀", yt: "https://www.youtube.com/embed/d_KZxkY_0cM", desc: "Lying down, lower the EZ bar to your forehead then extend. A very strong isolation move for all three heads.", sets: "2 working sets × 10-12 reps", rest: "75 seconds", alat: "EZ Bar, Bench" },
    ],
  },
  shoulder: {
    name: "Shoulders — Deltoid (Anterior, Medial, Posterior)",
    func: "The deltoid has three parts: front, side, and rear. Responsible for arm abduction, flexion, and extension. Wide shoulders create the V-taper look.",
    exercises: [
      { name: "Overhead Press", img: "🏋️", yt: "https://www.youtube.com/embed/2yjwXTZQDDI", desc: "The main shoulder compound. Press a barbell/dumbbell from shoulder height overhead. Brace your core, don't flare your ribs.", sets: "2 working sets × 6-10 reps", rest: "2-3 minutes", alat: "Barbell / Dumbbell" },
      { name: "Seated Dumbbell Press", img: "💪", yt: "https://www.youtube.com/embed/qEwKCR5JCog", desc: "A press with a larger ROM. Press in a slight arc, stopping just short of lockout for constant tension.", sets: "2 working sets × 8-12 reps", rest: "2 minutes", alat: "Dumbbell" },
      { name: "Lateral Raise", img: "↔️", yt: "https://www.youtube.com/embed/3VcKaXpzqRo", desc: "Isolates the medial deltoid — adds shoulder width. Lead with your elbows, no swinging, lower with control.", sets: "2 working sets × 12-20 reps", rest: "45-60 seconds", alat: "Dumbbell / Cable" },
      { name: "Face Pull", img: "🎯", yt: "https://www.youtube.com/embed/rep-qVOkqgk", desc: "Pull the cable toward your face with high elbows. Trains the rear delts & rotator cuff. Important for shoulder health.", sets: "2 working sets × 15-20 reps", rest: "60 seconds", alat: "Cable Machine, Rope" },
    ],
  },
  back: {
    name: "Back — Latissimus Dorsi & Rhomboids",
    func: "The lats are the widest muscle in the body, creating the V-taper look. Responsible for pulling movements, shoulder extension, and spine stabilization.",
    exercises: [
      { name: "Pull-Up / Lat Pulldown", img: "⬆️", yt: "https://www.youtube.com/embed/eGo4IYlbE5g", desc: "The king of back exercises. Drive your elbows down, lead with your chest, full hang at the bottom. Add weight once 12+ reps feels easy.", sets: "2 working sets × 6-10 reps", rest: "2-3 minutes", alat: "Pull-Up Bar / Cable" },
      { name: "Barbell Row", img: "🏋️", yt: "https://www.youtube.com/embed/FWJR5Ve8bnQ", desc: "The best compound for back thickness. Pull to your lower ribs, squeeze your shoulder blades, no torso swinging.", sets: "2 working sets × 8-12 reps", rest: "2 minutes", alat: "Barbell" },
      { name: "Seated Cable Row", img: "🚣", yt: "https://www.youtube.com/embed/GZbfZ033f74", desc: "Pull the cable to your stomach. Trains the rhomboids, mid-back, and lats. Keep your chest up, pull with your elbows.", sets: "2 working sets × 10-12 reps", rest: "90 seconds", alat: "Cable Machine" },
      { name: "Straight-Arm Pulldown", img: "⚡", yt: "https://www.youtube.com/embed/G9uNaXGTJ4w", desc: "Pure lat isolation. Arms nearly straight, pull to your thighs, feel the stretch & contraction. A great pump finisher.", sets: "2 working sets × 12-15 reps", rest: "60-90 seconds", alat: "Cable Machine" },
    ],
  },
  abs: {
    name: "Abs — Rectus Abdominis & Core",
    func: "The rectus abdominis creates the six-pack look. Responsible for spinal flexion and core stability. A strong core improves every compound lift.",
    exercises: [
      { name: "Cable Crunch", img: "⚡", yt: "https://www.youtube.com/embed/2fbujeH3F0E", desc: "Kneel in front of the cable, pull the rope down by contracting your abs. Round your spine — allows progressive loading.", sets: "2 working sets × 10-15 reps", rest: "60-90 seconds", alat: "Cable Machine, Rope" },
      { name: "Hanging Leg Raise", img: "🦵", yt: "https://www.youtube.com/embed/hdng3Nm1x_E", desc: "Hang from a bar, curl your pelvis up (not just lifting your legs). No swinging, lower with control. Targets the lower abs.", sets: "2 working sets × 8-15 reps", rest: "60 seconds", alat: "Pull-Up Bar" },
      { name: "Plank", img: "🪨", yt: "https://www.youtube.com/embed/ASdvN_XEl_c", desc: "Hold a static push-up position. Brace like you're about to be punched, neutral spine, don't let your hips sag. Anti-extension core work.", sets: "2 working sets × 30-60 seconds", rest: "45-60 seconds", alat: "Bodyweight / Mat" },
      { name: "Crunches", img: "🔄", yt: "https://www.youtube.com/embed/Xyd_fa5zoEU", desc: "A classic abs move. Lift your shoulders off the floor with a contraction, focus on the squeeze not momentum. Great as a finisher.", sets: "2 working sets × 15-25 reps", rest: "45 seconds", alat: "Bodyweight / Mat" },
    ],
  },
  forearm: {
    name: "Forearms — Forearm Flexors & Extensors",
    func: "The forearm muscles control wrist movement and grip strength. A strong grip is essential for every heavy pulling and pressing lift.",
    exercises: [
      { name: "Barbell Wrist Curl", img: "🔄", yt: "https://www.youtube.com/embed/dO2tRvD12-g", desc: "Forearms resting on your thighs, curl your wrists up — let the bar roll down to your fingertips for full ROM.", sets: "2 working sets × 12-20 reps", rest: "60-90 seconds", alat: "Barbell / Dumbbell" },
      { name: "Reverse Curl", img: "↩️", yt: "https://www.youtube.com/embed/nRgxYX2Ve9w", desc: "Overhand grip. Trains the brachioradialis & wrist extensors. No swinging, controlled in both directions.", sets: "2 working sets × 10-15 reps", rest: "60 seconds", alat: "Barbell / EZ Bar" },
      { name: "Farmer's Walk", img: "🧺", yt: "https://www.youtube.com/embed/Fkzk_RqlYig", desc: "Carry heavy weights while walking. Crush the grip, brace your core, walk tall. Grip and conditioning in one.", sets: "2 working sets × 30-45 seconds", rest: "60 seconds", alat: "Dumbbell / Trap Bar" },
    ],
  },
  quad: {
    name: "Quads — Quadriceps",
    func: "The quadriceps have 4 heads and are among the largest muscles in the body. Responsible for knee extension. Key for squatting, jumping, and running.",
    exercises: [
      { name: "Barbell Squat", img: "🏋️", yt: "https://www.youtube.com/embed/ultWZbUMPL8", desc: "The best compound for legs. Brace hard, track your knees over your toes, hit a controlled depth then drive back up.", sets: "2 working sets × 5-8 reps", rest: "3 minutes", alat: "Barbell, Squat Rack" },
      { name: "Leg Press / Hack Squat", img: "⬆️", yt: "https://www.youtube.com/embed/IZxyjW7MPJQ", desc: "Full depth, don't lock out hard, push through your mid-foot. Safer on the lower back, easy to add weight.", sets: "2 working sets × 8-12 reps", rest: "2 minutes", alat: "Leg Press / Hack Machine" },
      { name: "Leg Extension", img: "🦵", yt: "https://www.youtube.com/embed/YyvSfVjQeL0", desc: "Pure quad isolation. Pause & squeeze at the top, slow negative. A safe to-failure finisher.", sets: "2 working sets × 12-20 reps", rest: "60 seconds", alat: "Leg Extension Machine" },
      { name: "Walking Lunges", img: "🚶", yt: "https://www.youtube.com/embed/QOVaHwm-Q6U", desc: "Unilateral work for balance & fixing imbalances. Step forward, lower your knee toward the floor with control.", sets: "2 working sets × 10-12 / leg", rest: "90 seconds", alat: "Dumbbell / Barbell" },
    ],
  },
  hamstring: {
    name: "Hamstrings",
    func: "The hamstrings consist of 3 muscles (biceps femoris, semitendinosus, semimembranosus). Responsible for knee flexion & hip extension. Often undertrained.",
    exercises: [
      { name: "Romanian Deadlift", img: "🏋️", yt: "https://www.youtube.com/embed/JCXUYuzwNrM", desc: "Hinge at the hips with soft knees, feel the hamstring stretch, neutral spine, then return upright. The primary exercise.", sets: "2 working sets × 6-10 reps", rest: "2-3 minutes", alat: "Barbell / Dumbbell" },
      { name: "Lying / Seated Leg Curl", img: "🔄", yt: "https://www.youtube.com/embed/1Tq3QdYUuHs", desc: "Hamstring isolation. Controlled curl, full squeeze, don't lift your hips off the pad.", sets: "2 working sets × 8-12 reps", rest: "90 seconds", alat: "Leg Curl Machine" },
      { name: "Good Morning / Nordic", img: "🌅", yt: "https://www.youtube.com/embed/YA-h3n9L4YU", desc: "A very slow lowering phase for heavy eccentric loading. Keep your hips extended. High hamstring stimulus.", sets: "2 working sets × 8-12 reps", rest: "90 seconds", alat: "Barbell / Bodyweight" },
    ],
  },
  glute: {
    name: "Glutes — Gluteus Maximus, Medius & Minimus",
    func: "The glutes are the largest muscle in the body. Responsible for hip extension, abduction, and rotation. Strong glutes mean good posture, high power output, and safer knees.",
    exercises: [
      { name: "Hip Thrust", img: "🍑", yt: "https://www.youtube.com/embed/xDmFkJxPzeM", desc: "The best glute exercise by EMG data. Posterior pelvic tilt, drive through your heels, lock out your hips, pause at the top.", sets: "2 working sets × 8-12 reps", rest: "2 minutes", alat: "Barbell, Bench" },
      { name: "Bulgarian Split Squat", img: "🦵", yt: "https://www.youtube.com/embed/2C-uNgKwPLE", desc: "Lean slightly forward, drop straight down, push through your front heel. Unilateral and very challenging.", sets: "2 working sets × 8-12 / leg", rest: "90 seconds", alat: "Dumbbell / Bodyweight" },
      { name: "Cable Kickback / Abduction", img: "⬅️", yt: "https://www.youtube.com/embed/RMFCOSi5nAk", desc: "Squeeze the glute at the peak, no lower-back arching, slow return. An effective isolation finisher.", sets: "2 working sets × 15-20 reps", rest: "45-60 seconds", alat: "Cable Machine" },
    ],
  },
  calf: {
    name: "Calves — Gastrocnemius & Soleus",
    func: "The calves consist of the gastrocnemius (outer) & soleus (inner). Responsible for plantarflexion. Known for being stubborn to train and needing full ROM + a pause.",
    exercises: [
      { name: "Standing Calf Raise", img: "⬆️", yt: "https://www.youtube.com/embed/gwLzBJYoWlI", desc: "Full stretch at the bottom, explode up, hard pause at the top. Maximally targets the gastrocnemius.", sets: "2 working sets × 8-12 reps", rest: "90 seconds", alat: "Calf Machine / Step" },
      { name: "Seated Calf Raise", img: "🪑", yt: "https://www.youtube.com/embed/JbyjNymZOt0", desc: "Bent knee targets the soleus. Slow tempo, don't bounce, full contraction every rep.", sets: "2 working sets × 12-15 reps", rest: "60-90 seconds", alat: "Seated Calf Machine" },
      { name: "Leg-Press Calf Raise", img: "⚡", yt: "https://www.youtube.com/embed/YObPOcXZ-YA", desc: "Maximal ROM on the leg press. 1-second pause every rep, push through the balls of your feet. A to-failure finisher.", sets: "2 working sets × 15-20 reps", rest: "60 seconds", alat: "Leg Press Machine" },
    ],
  },
  trap: {
    name: "Trapezius — Upper, Middle & Lower Traps",
    func: "The trapezius is a large diamond-shaped muscle across the upper back. Responsible for scapular elevation (upper), retraction (middle), and depression (lower). Big traps create the \"yoked\" look.",
    exercises: [
      { name: "Barbell / Dumbbell Shrug", img: "🤷", yt: "https://www.youtube.com/embed/g6qbq4Lf1FI", desc: "Lift your shoulders straight toward your ears, pause at the top, no rolling. The primary upper-trap exercise.", sets: "2 working sets × 8-12 reps", rest: "90 seconds", alat: "Barbell / Dumbbell" },
      { name: "Rack Pull / Deadlift", img: "🏋️", yt: "https://www.youtube.com/embed/op9kVnSso6Q", desc: "Neutral spine, drive your hips, squeeze your traps hard at lockout. Heavy loading builds upper-back thickness.", sets: "2 working sets × 5-8 reps", rest: "2-3 minutes", alat: "Barbell" },
      { name: "Face Pull / Y-Raise", img: "🎯", yt: "https://www.youtube.com/embed/rep-qVOkqgk", desc: "High elbows, pull toward your forehead. Targets the mid & lower traps as well as the rear delts. Important for posture & healthy shoulders.", sets: "2 working sets × 15-20 reps", rest: "60 seconds", alat: "Cable Machine, Rope" },
    ],
  },
};

const PROTOCOL = {
  chest: {
    main: { role: "Main", name: "Barbell Bench Press", scheme: "2 × 5–8", rest: "2–3 min", rir: "0–1 RIR", type: "Compound", cue: "Retract scapula, elbows ~45°, control the descent." },
    secondary: { role: "Secondary", name: "Incline DB Press", scheme: "2 × 8–12", rest: "2 min", rir: "0–1 RIR", type: "Compound", cue: "Press up & slightly in, full stretch at the bottom." },
    finisher: { role: "Finisher", name: "Cable Crossover", scheme: "2 × 12–15", rest: "60–90 s", rir: "0 RIR", type: "Isolation", cue: "Squeeze hard at peak, keep constant tension." },
  },
  back: {
    main: { role: "Main", name: "Weighted Pull-Up", scheme: "2 × 6–10", rest: "2–3 min", rir: "0–1 RIR", type: "Compound", cue: "Drive elbows down, lead with the chest, full hang." },
    secondary: { role: "Secondary", name: "Barbell Row", scheme: "2 × 8–12", rest: "2 min", rir: "0–1 RIR", type: "Compound", cue: "Pull to lower ribs, squeeze blades, no torso swing." },
    finisher: { role: "Finisher", name: "Straight-Arm Pulldown", scheme: "2 × 12–15", rest: "60–90 s", rir: "0 RIR", type: "Isolation", cue: "Feel the lats, soft elbows, control the stretch." },
  },
  shoulder: {
    main: { role: "Main", name: "Overhead Press", scheme: "2 × 6–10", rest: "2–3 min", rir: "0–1 RIR", type: "Compound", cue: "Brace core, bar over mid-foot, don't flare the ribs." },
    secondary: { role: "Secondary", name: "Seated DB Press", scheme: "2 × 8–12", rest: "2 min", rir: "0–1 RIR", type: "Compound", cue: "Press in a slight arc, stop just short of lockout." },
    finisher: { role: "Finisher", name: "Lateral Raise", scheme: "2 × 12–20", rest: "45–60 s", rir: "0 RIR", type: "Isolation", cue: "Lead with elbows, no swing, controlled lower." },
  },
  bicep: {
    main: { role: "Main", name: "Barbell / EZ Curl", scheme: "2 × 6–10", rest: "90 s", rir: "0–1 RIR", type: "Isolation", cue: "Elbows pinned, no hip swing, full top-to-bottom ROM." },
    secondary: { role: "Secondary", name: "Incline DB Curl", scheme: "2 × 8–12", rest: "90 s", rir: "0–1 RIR", type: "Isolation", cue: "Let arms hang back for max stretch, supinate hard." },
    finisher: { role: "Finisher", name: "Cable Curl", scheme: "2 × 12–15", rest: "45–60 s", rir: "0 RIR", type: "Isolation", cue: "Constant tension, squeeze the peak, slow negative." },
  },
  tricep: {
    main: { role: "Main", name: "Close-Grip Bench / Dip", scheme: "2 × 6–10", rest: "2–3 min", rir: "0–1 RIR", type: "Compound", cue: "Tuck elbows, control descent, full lockout." },
    secondary: { role: "Secondary", name: "Overhead Extension", scheme: "2 × 8–12", rest: "90 s", rir: "0–1 RIR", type: "Isolation", cue: "Deep stretch overhead, keep elbows pointed forward." },
    finisher: { role: "Finisher", name: "Rope Pushdown", scheme: "2 × 12–20", rest: "45–60 s", rir: "0 RIR", type: "Isolation", cue: "Lock elbows in place, spread the rope at the bottom." },
  },
  quad: {
    main: { role: "Main", name: "Barbell Squat", scheme: "2 × 5–8", rest: "3 min", rir: "1–2 RIR", type: "Compound", cue: "Brace hard, knees track over toes, hit depth controlled." },
    secondary: { role: "Secondary", name: "Leg Press / Hack", scheme: "2 × 8–12", rest: "2 min", rir: "0–1 RIR", type: "Compound", cue: "Full depth, don't lock hard, push through mid-foot." },
    finisher: { role: "Finisher", name: "Leg Extension", scheme: "2 × 12–20", rest: "60 s", rir: "0 RIR", type: "Isolation", cue: "Pause & squeeze at the top, slow the negative." },
  },
  hamstring: {
    main: { role: "Main", name: "Romanian Deadlift", scheme: "2 × 6–10", rest: "2–3 min", rir: "1 RIR", type: "Compound", cue: "Hinge at hips, soft knees, feel stretch, neutral spine." },
    secondary: { role: "Secondary", name: "Lying Leg Curl", scheme: "2 × 8–12", rest: "90 s", rir: "0–1 RIR", type: "Isolation", cue: "Curl with control, full squeeze, no hip lift." },
    finisher: { role: "Finisher", name: "Nordic / Good Morning", scheme: "2 × 8–12", rest: "60–90 s", rir: "0–1 RIR", type: "Compound", cue: "Lower as slow as possible, keep hips extended." },
  },
  glute: {
    main: { role: "Main", name: "Hip Thrust", scheme: "2 × 8–12", rest: "2 min", rir: "0–1 RIR", type: "Compound", cue: "Posterior tilt, drive heels, lock out, pause at top." },
    secondary: { role: "Secondary", name: "Bulgarian Split Squat", scheme: "2 × 8–12", rest: "90 s", rir: "0–1 RIR", type: "Compound", cue: "Slight forward lean, sink straight down, push front heel." },
    finisher: { role: "Finisher", name: "Cable Kickback", scheme: "2 × 15–20", rest: "45–60 s", rir: "0 RIR", type: "Isolation", cue: "Squeeze the glute, no lower-back arch, slow return." },
  },
  calf: {
    main: { role: "Main", name: "Standing Calf Raise", scheme: "2 × 8–12", rest: "90 s", rir: "0–1 RIR", type: "Isolation", cue: "Full stretch at bottom, explode up, pause hard on top." },
    secondary: { role: "Secondary", name: "Seated Calf Raise", scheme: "2 × 12–15", rest: "60–90 s", rir: "0–1 RIR", type: "Isolation", cue: "Targets soleus — slow tempo, don't bounce." },
    finisher: { role: "Finisher", name: "Leg-Press Calf Raise", scheme: "2 × 15–20", rest: "60 s", rir: "0 RIR", type: "Isolation", cue: "Max range, 1-sec pause each rep, burn through it." },
  },
  abs: {
    main: { role: "Main", name: "Weighted Cable Crunch", scheme: "2 × 10–15", rest: "60–90 s", rir: "0–1 RIR", type: "Isolation", cue: "Round the spine, crunch with abs not hips, squeeze." },
    secondary: { role: "Secondary", name: "Hanging Leg Raise", scheme: "2 × 8–15", rest: "60 s", rir: "0–1 RIR", type: "Compound", cue: "No swing, curl the pelvis up, lower with control." },
    finisher: { role: "Finisher", name: "Plank / Ab Wheel", scheme: "2 × 30–60s", rest: "45–60 s", rir: "0–1 RIR", type: "Isometric", cue: "Brace like taking a punch, neutral spine, don't sag." },
  },
  forearm: {
    main: { role: "Main", name: "Barbell Wrist Curl", scheme: "2 × 12–20", rest: "60–90 s", rir: "0–1 RIR", type: "Isolation", cue: "Full flex & extension, let the bar roll to fingertips." },
    secondary: { role: "Secondary", name: "Reverse Curl", scheme: "2 × 10–15", rest: "60 s", rir: "0–1 RIR", type: "Isolation", cue: "Overhand grip, no swinging, controlled both ways." },
    finisher: { role: "Finisher", name: "Farmer's Carry", scheme: "2 × 30–45s", rest: "60 s", rir: "0–1 RIR", type: "Loaded", cue: "Crush the grip, brace the core, walk tall." },
  },
  trap: {
    main: { role: "Main", name: "Barbell Shrug", scheme: "2 × 8–12", rest: "90 s", rir: "0–1 RIR", type: "Isolation", cue: "Straight up to the ears, pause at top, no rolling." },
    secondary: { role: "Secondary", name: "Rack Pull", scheme: "2 × 5–8", rest: "2–3 min", rir: "1 RIR", type: "Compound", cue: "Neutral spine, drive hips, squeeze traps at lockout." },
    finisher: { role: "Finisher", name: "Face Pull / Y-Raise", scheme: "2 × 15–20", rest: "60 s", rir: "0 RIR", type: "Isolation", cue: "High elbows, pull to forehead, hit mid & lower traps." },
  },
};

/* which side of the avatar shows each muscle best */
const VIEW_MAP = {
  chest: "front", bicep: "front", abs: "front", quad: "front", shoulder: "front", forearm: "front",
  back: "back", tricep: "back", glute: "back", hamstring: "back", calf: "back", trap: "back",
};

const CHIP_GROUPS = [
  {
    label: "Upper Body",
    items: [
      { id: "chest", label: "Chest", tag: "PUSH" },
      { id: "back", label: "Back / Lats", tag: "PULL" },
      { id: "shoulder", label: "Shoulders", tag: "DELTS" },
      { id: "bicep", label: "Biceps", tag: "PULL" },
      { id: "tricep", label: "Triceps", tag: "PUSH" },
      { id: "forearm", label: "Forearms", tag: "GRIP" },
      { id: "trap", label: "Traps", tag: "YOKE" },
    ],
  },
  {
    label: "Lower & Core",
    items: [
      { id: "quad", label: "Quads", tag: "POWER" },
      { id: "hamstring", label: "Hamstrings", tag: "HINGE" },
      { id: "glute", label: "Glutes", tag: "DRIVE" },
      { id: "calf", label: "Calves", tag: "PUMP" },
      { id: "abs", label: "Abs / Core", tag: "BRACE" },
    ],
  },
];

const NAME_MAP = Object.fromEntries(
  CHIP_GROUPS.flatMap(g => g.items).map(i => [i.id, i.label])
);

const TAG_MAP = Object.fromEntries(
  CHIP_GROUPS.flatMap(g => g.items).map(i => [i.id, i.tag])
);

/* ===================== SVG FIGURE GEOMETRY ===================== */
/* each part: { m, paths: [d...], nodes: [[cx,cy]...] } */
const FRONT_PARTS = [
  { m: "trap", paths: ["M104 84 Q120 77 136 84 L150 100 Q120 92 90 100 Z"], nodes: [[120, 91]] },
  { m: "shoulder", paths: ["M84 98 Q70 100 66 116 Q64 129 77 131 Q90 127 92 110 Q92 100 84 98 Z", "M156 98 Q170 100 174 116 Q176 129 163 131 Q150 127 148 110 Q148 100 156 98 Z"], nodes: [[78, 114], [162, 114]] },
  { m: "chest", paths: ["M92 102 Q108 100 118 107 L118 134 Q104 141 94 132 Q86 119 92 102 Z", "M148 102 Q132 100 122 107 L122 134 Q136 141 146 132 Q154 119 148 102 Z"], nodes: [[105, 119], [135, 119]] },
  { m: "bicep", paths: ["M64 120 Q56 122 56 140 L60 166 Q72 168 74 150 L74 126 Q72 120 64 120 Z", "M176 120 Q184 122 184 140 L180 166 Q168 168 166 150 L166 126 Q168 120 176 120 Z"], nodes: [[65, 144], [175, 144]] },
  { m: "forearm", paths: ["M58 169 Q52 171 52 189 L57 222 Q70 226 72 205 L70 173 Q68 169 58 169 Z", "M182 169 Q188 171 188 189 L183 222 Q170 226 168 205 L170 173 Q172 169 182 169 Z"], nodes: [[62, 196], [178, 196]] },
  { m: "abs", paths: ["M104 138 Q120 136 136 138 L138 206 Q120 214 102 206 Z"], nodes: [[120, 172]] },
  { m: "quad", paths: ["M100 215 Q88 219 88 245 L94 322 Q106 330 112 320 L116 245 Q116 219 108 215 Q104 214 100 215 Z", "M140 215 Q152 219 152 245 L146 322 Q134 330 128 320 L124 245 Q124 219 132 215 Q136 214 140 215 Z"], nodes: [[102, 268], [138, 268]] },
  { m: "calf", paths: ["M98 360 Q92 362 92 384 L96 438 Q106 444 110 436 L112 384 Q112 362 106 360 Z", "M142 360 Q148 362 148 384 L144 438 Q134 444 130 436 L128 384 Q128 362 134 360 Z"], nodes: [[101, 400], [139, 400]] },
];

const BACK_PARTS = [
  { m: "trap", paths: ["M120 80 L150 102 Q140 120 124 126 L116 126 Q100 120 90 102 Z"], nodes: [[120, 104]] },
  { m: "shoulder", paths: ["M84 100 Q70 102 66 118 Q64 131 77 133 Q90 129 92 112 Q92 102 84 100 Z", "M156 100 Q170 102 174 118 Q176 131 163 133 Q150 129 148 112 Q148 102 156 100 Z"], nodes: [[78, 116], [162, 116]] },
  { m: "back", paths: ["M92 122 Q78 128 80 162 L113 186 L117 132 Q105 124 92 122 Z", "M148 122 Q162 128 160 162 L127 186 L123 132 Q135 124 148 122 Z", "M108 150 L132 150 L129 198 Q120 202 111 198 Z"], nodes: [[98, 152], [142, 152]] },
  { m: "tricep", paths: ["M64 120 Q56 122 56 140 L60 166 Q72 168 74 150 L74 126 Q72 120 64 120 Z", "M176 120 Q184 122 184 140 L180 166 Q168 168 166 150 L166 126 Q168 120 176 120 Z"], nodes: [[65, 144], [175, 144]] },
  { m: "forearm", paths: ["M58 169 Q52 171 52 189 L57 222 Q70 226 72 205 L70 173 Q68 169 58 169 Z", "M182 169 Q188 171 188 189 L183 222 Q170 226 168 205 L170 173 Q172 169 182 169 Z"], nodes: [[62, 196], [178, 196]] },
  { m: "glute", paths: ["M100 200 Q88 202 88 220 Q90 238 106 238 Q118 236 118 218 L116 204 Q108 200 100 200 Z", "M140 200 Q152 202 152 220 Q150 238 134 238 Q122 236 122 218 L124 204 Q132 200 140 200 Z"], nodes: [[104, 220], [136, 220]] },
  { m: "hamstring", paths: ["M100 242 Q90 244 90 266 L96 330 Q108 338 112 328 L114 266 Q114 244 106 242 Z", "M140 242 Q150 244 150 266 L144 330 Q132 338 128 328 L126 266 Q126 244 134 242 Z"], nodes: [[102, 288], [138, 288]] },
  { m: "calf", paths: ["M98 360 Q90 362 90 388 Q92 414 102 420 Q108 422 110 414 L112 388 Q112 362 106 360 Z", "M142 360 Q150 362 150 388 Q148 414 138 420 Q132 422 130 414 L128 388 Q128 362 134 360 Z"], nodes: [[101, 392], [139, 392]] },
];

/* frame (head, neck, joints) */
const FrameFront = () => (
  <>
    <ellipse cx="120" cy="46" rx="23" ry="27" className="frame-fill" />
    <path d="M108 70 h24 v16 h-24 z" className="frame-fill" />
    <ellipse cx="56" cy="232" rx="11" ry="13" className="frame-fill" />
    <ellipse cx="184" cy="232" rx="11" ry="13" className="frame-fill" />
    <path d="M88 196 q32 8 64 0 l5 22 q-37 9 -74 0 z" className="frame-fill" />
    <ellipse cx="101" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="101" cy="446" rx="14" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="446" rx="14" ry="9" className="frame-fill" />
  </>
);

const FrameBack = () => (
  <>
    <ellipse cx="120" cy="46" rx="23" ry="27" className="frame-fill" />
    <path d="M108 70 h24 v14 h-24 z" className="frame-fill" />
    <ellipse cx="56" cy="232" rx="11" ry="13" className="frame-fill" />
    <ellipse cx="184" cy="232" rx="11" ry="13" className="frame-fill" />
    <ellipse cx="101" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="346" rx="13" ry="9" className="frame-fill" />
    <ellipse cx="101" cy="446" rx="14" ry="9" className="frame-fill" />
    <ellipse cx="139" cy="446" rx="14" ry="9" className="frame-fill" />
  </>
);

/* one avatar figure (front or back) */
function Figure({ parts, Frame, active, onSelect }) {
  return (
    <svg viewBox="0 0 240 540" xmlns="http://www.w3.org/2000/svg" className={`w-full h-auto block ${active ? "has-sel" : ""}`}>
      <defs>
        <linearGradient id="msIdle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DBEAFE" /><stop offset="1" stopColor="#BFDBFE" />
        </linearGradient>
        <linearGradient id="msHover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5dfff2" /><stop offset="1" stopColor="#00e5d4" />
        </linearGradient>
        <linearGradient id="msOn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5dfff2" /><stop offset="0.5" stopColor="#00e5d4" /><stop offset="1" stopColor="#2f7bff" />
        </linearGradient>
      </defs>
      <Frame />
      {parts.map((p) => (
        <g key={p.m} className={`ms ${active === p.m ? "on" : ""}`} onClick={() => onSelect(p.m)}>
          {p.paths.map((d, i) => <path key={i} className="seg" d={d} />)}
          {p.lines && p.lines.map((d, i) => <path key={`l${i}`} className="detail-line" d={d} />)}
          {p.nodes.map(([cx, cy], i) => <circle key={i} className="node" cx={cx} cy={cy} r="2.4" />)}
        </g>
      ))}
    </svg>
  );
}

/* ===================== SMALL UI PIECES ===================== */
function getRoleStyle(role) {
  return {
    Main: { background: "rgba(15,123,74,.12)", color: C.teal },
    Secondary: { background: "rgba(10,92,55,.12)", color: C.blue },
    Finisher: { background: "rgba(245,169,127,.18)", color: "#d4784b" },
  }[role];
}

function ProtoCard({ ex, delay = 0 }) {
  return (
    <div
      className="stagger-item rounded-xl px-4 py-3 mb-3 transition-all duration-200 hover:-translate-y-px group"
      style={{ background: C.panel, border: `1px solid ${C.line2}`, animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-display text-white uppercase rounded-md px-2 py-1" style={{ ...getRoleStyle(ex.role), fontSize: "0.52rem", letterSpacing: "1.5px" }}>
          {ex.role}
        </span>
        <span className="font-bold" style={{ color: C.ink, fontSize: "0.96rem" }}>{ex.name}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 my-2">
        {[["Sets", ex.scheme], ["Rest", ex.rest], ["Failure", ex.rir], ["Type", ex.type]].map(([k, v]) => (
          <div key={k} className="rounded-lg text-center px-1 py-1" style={{ background: C.bgSoft, border: `1px solid ${C.line2}` }}>
            <div className="font-display uppercase" style={{ color: C.ink3, fontSize: "0.5rem", letterSpacing: ".8px" }}>{k}</div>
            <div className="font-display font-semibold mt-0.5" style={{ color: C.ink, fontSize: "0.72rem" }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 leading-normal" style={{ color: C.ink2, fontSize: "0.8rem" }}>
        <b className="shrink-0" style={{ color: C.teal }}>CUE</b>
        <span>{ex.cue}</span>
      </div>
    </div>
  );
}

function VideoModal({ muscleId, idx, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (muscleId == null) return null;
  const e = MUSCLE_DATA[muscleId].exercises[idx];

  return (
    <div
      className="modal-backdrop-enter fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(8px)" }}
      onClick={(ev) => ev.target === ev.currentTarget && onClose()}
    >
      <div
        className="modal-panel-enter w-full max-w-2xl max-h-full overflow-y-auto rounded-3xl"
        style={{ background: C.panel, border: `1px solid ${C.line}`, boxShadow: "0 4px 24px rgba(0,0,0,.12)" }}
      >
        <div className="flex justify-between items-center px-6 pt-6">
          <h3 className="font-display" style={{ color: C.teal, fontSize: "1.15rem" }}>{e.name}</h3>
          <button onClick={onClose} className="text-xl transition-colors" style={{ color: C.ink3 }} aria-label="Close">✕</button>
        </div>
        <div className="p-6">
          <iframe
            src={e.yt}
            title={e.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full rounded-xl block mb-5"
            style={{ aspectRatio: "16/9", border: `1px solid ${C.line2}` }}
          />
          <div className="mb-4">
            <h4 className="font-display uppercase mb-1.5" style={{ color: C.teal, fontSize: "0.62rem", letterSpacing: "2px" }}>How to perform</h4>
            <p className="leading-relaxed" style={{ color: C.ink2, fontSize: "0.94rem" }}>{e.desc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[["Volume", e.sets], ["Rest", e.rest], ["Equipment", e.alat]].map(([k, v]) => (
              <div key={k} className="rounded-xl p-3" style={{ background: C.bg, border: `1px solid ${C.line2}` }}>
                <h4 className="font-display uppercase mb-1" style={{ color: C.teal, fontSize: "0.62rem", letterSpacing: "2px" }}>{k}</h4>
                <p className="font-display font-bold" style={{ color: C.ink, fontSize: "0.84rem" }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */
export default function MuscleScan() {
  const { theme } = useTheme();
  C = theme === "dark" ? DARK_C : LIGHT_C;

  const [muscle, setMuscle] = useState(null);
  const [view, setView] = useState("front");
  const [modal, setModal] = useState(null); // { muscleId, idx } | null

  const selectMuscle = (id) => {
    setMuscle(id);
    setView(VIEW_MAP[id] || "front");
  };

  const md = muscle ? MUSCLE_DATA[muscle] : null;
  const proto = muscle ? PROTOCOL[muscle] : null;

  return (
    <div className="page-enter flex flex-col h-screen w-full max-w-md mx-auto transition-colors" style={{ background: C.page, fontFamily: "'Inter', sans-serif" }}>
      <UpperNavbar />
      <div className="flex-1 overflow-y-auto py-10 px-4 pb-24">
      {/* fonts + SVG interaction styles (things Tailwind can't express) */}
      <style>{`
        .font-display{font-family:'Inter',sans-serif;letter-spacing:1.2px;}
        .frame-fill{fill:rgba(219,234,254,.45);stroke:rgba(37,99,235,.18);stroke-width:.8;}
        .ms{cursor:pointer;transition:opacity .3s,filter .3s;}
        .ms .seg{fill:url(#msIdle);stroke:rgba(37,99,235,.25);stroke-width:1;transition:fill .3s,stroke .3s;}
        .ms .node{fill:rgba(37,99,235,.45);transition:.3s;}
        .ms:hover .seg{fill:url(#msHover);stroke:rgba(120,255,245,.7);}
        svg.has-sel .ms{opacity:.26;}
        svg.has-sel .ms:hover{opacity:.6;}
        svg.has-sel .ms.on{opacity:1;}
        .ms.on .seg{fill:url(#msOn);stroke:#cffff9;stroke-width:1.4;}
        .ms.on{filter:drop-shadow(0 0 5px rgba(0,229,212,.95)) drop-shadow(0 0 16px rgba(0,229,212,.55));}
        .ms.on .node{fill:#eafffd;animation:nodePulse 1.4s ease-in-out infinite;}
        @keyframes nodePulse{0%,100%{r:2.4;opacity:1;}50%{r:3.6;opacity:.6;}}
        .scanline-anim{animation:scan 4.5s ease-in-out infinite;}
        @keyframes scan{0%{top:6%;}50%{top:78%;}100%{top:6%;}}
        .blink-anim{animation:blink 1.4s infinite;}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:.25;}}
        .spin-slow{animation:spinS 12s linear infinite;}
        @keyframes spinS{to{transform:rotate(360deg);}}
        @media (prefers-reduced-motion: reduce){
          .scanline-anim,.blink-anim,.spin-slow,.ms.on .node{animation:none;}
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* section head */}
        <div className="page-enter-up text-center mb-10">
          <div className="font-display inline-flex items-center gap-2 uppercase mb-3 rounded-full px-4 py-1.5"
            style={{ color: C.teal, fontSize: "0.6rem", letterSpacing: "3px", background: "rgba(15,123,74,.07)", border: `1px solid ${C.line}` }}>
            <span className="w-1.5 h-1.5 rounded-full blink-anim" style={{ background: C.teal, boxShadow: `0 0 10px ${C.teal}` }} />
            Cyber Muscle Scan
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-3" style={{ color: C.ink }}>
            Select a target.{" "}
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: C.ink2, fontSize: "1.04rem" }}>
            Tap directly on the avatar — the AI panel will show a complete 2× failure protocol with form cues.
          </p>
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ---- AVATAR STAGE ---- */}
          <div
            className="page-enter-up lg:col-span-6 relative flex flex-col items-center rounded-3xl p-4 overflow-hidden"
            style={{
              minHeight: 500,
              border: `1px solid ${C.line}`,
              background: C.stageBg,
              backdropFilter: "blur(14px)",
              animationDelay: "100ms",
            }}
          >
            {/* HUD corners */}
            {[
              { className: "top-3 left-3 border-r-0 border-b-0 rounded-tl-md" },
              { className: "top-3 right-3 border-l-0 border-b-0 rounded-tr-md" },
              { className: "bottom-3 left-3 border-r-0 border-t-0 rounded-bl-md" },
              { className: "bottom-3 right-3 border-l-0 border-t-0 rounded-br-md" },
            ].map((c, i) => (
              <div key={i} className={`absolute w-6 h-6 border-2 z-10 ${c.className}`} style={{ borderColor: C.teal, opacity: 0.55 }} />
            ))}
            {/* scanline */}
            <div
              className="absolute left-3.5 right-3.5 h-16 z-0 pointer-events-none scanline-anim"
              style={{ background: "linear-gradient(180deg, transparent, rgba(15,123,74,.12), transparent)" }}
            />

            {/* view toggle */}
            <div className="flex gap-1 rounded-full p-1 z-20 mb-1.5" style={{ background: C.panel, border: `1px solid ${C.line}` }}>
              {["front", "back"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="font-display font-semibold uppercase rounded-full px-4 py-1.5 transition-all duration-200"
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "1.5px",
                    background: view === v ? `linear-gradient(120deg, ${C.teal}, ${C.blue})` : "transparent",
                    color: view === v ? "#FFFFFF" : C.ink3,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* figure */}
            <div className="relative flex-none flex items-center justify-center w-full z-10 overflow-hidden" style={{ height: 700 }}>
              <div className="w-full max-w-xs">
                {view === "front" ? (
                  <Figure parts={FRONT_PARTS} Frame={FrameFront} active={muscle} onSelect={selectMuscle} />
                ) : (
                  <Figure parts={BACK_PARTS} Frame={FrameBack} active={muscle} onSelect={selectMuscle} />
                )}
              </div>
            </div>

            <div className="font-display flex items-center gap-2 uppercase mt-1.5 z-20" style={{ color: C.ink3, fontSize: "0.8rem", letterSpacing: "2px" }}>
              <span className="w-1.5 h-1.5 rounded-full blink-anim" style={{ background: C.teal, boxShadow: `0 0 10px ${C.teal}` }} />
              {muscle ? `${NAME_MAP[muscle]} (${TAG_MAP[muscle].charAt(0) + TAG_MAP[muscle].slice(1).toLowerCase()})` : "Select a muscle"}
            </div>
          </div>

          {/* ---- AI REC PANEL ---- */}
          <div
            className="page-enter-up lg:col-span-6 rounded-3xl overflow-hidden"
            style={{ minHeight: 560, background: C.panelSoft, border: `1px solid ${C.line}`, backdropFilter: "blur(14px)", animationDelay: "180ms" }}
          >
            {!muscle ? (
              <div className="page-enter flex flex-col items-center justify-center h-full text-center p-8 gap-4" style={{ minHeight: 480, color: C.ink3 }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl spin-slow" style={{ border: `2px dashed ${C.line}` }}>◎</div>
                <p className="max-w-xs leading-relaxed" style={{ fontSize: "0.94rem" }}>Select a muscle to generate its AI training protocol.</p>
              </div>
            ) : (
              <div className="page-enter p-6" key={muscle}>

                <div className="font-display font-bold mb-3 leading-snug" style={{ color: C.ink, fontSize: "1.12rem" }}>{md.name}</div>
                <p className="leading-relaxed mb-5" style={{ color: C.ink2, fontSize: "0.9rem" }}>{md.func}</p>

                <div className="font-display flex items-center gap-2 uppercase mt-5 mb-3" style={{ color: C.orange, fontSize: "0.58rem", letterSpacing: "2.5px" }}>
                  Recommended protocol
                  <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,138,61,.4), transparent)" }} />
                </div>
                <ProtoCard ex={proto.main} delay={0} />
                <ProtoCard ex={proto.secondary} delay={80} />
                <ProtoCard ex={proto.finisher} delay={160} />

                <div className="font-display uppercase mt-5 mb-3" style={{ color: C.teal, fontSize: "0.58rem", letterSpacing: "2.5px" }}>
                  Exercise library — tap to watch form
                </div>
                {md.exercises.map((e, i) => (
                  <button
                    key={e.name}
                    onClick={() => setModal({ muscleId: muscle, idx: i })}
                    className="stagger-item w-full flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 mb-1.5 font-semibold text-left transition-all duration-200 hover:translate-x-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{ background: C.panel, border: `1px solid ${C.line2}`, color: C.ink2, fontSize: "0.9rem", animationDelay: `${260 + i * 60}ms` }}
                    onMouseEnter={(ev) => { ev.currentTarget.style.borderColor = C.teal; ev.currentTarget.style.color = C.teal; }}
                    onMouseLeave={(ev) => { ev.currentTarget.style.borderColor = C.line2; ev.currentTarget.style.color = C.ink2; }}
                  >
                    <span>{e.img}&nbsp; {e.name}</span>
                    <span style={{ color: C.teal, fontSize: "0.85rem" }}>▶ watch</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>

      <BottomNavbar />

      {/* modal */}
      {modal && <VideoModal muscleId={modal.muscleId} idx={modal.idx} onClose={() => setModal(null)} />}
    </div>
  );
}
