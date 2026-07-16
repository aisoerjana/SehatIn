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
    name: "Dada — Pectoralis Major & Minor",
    func: "Otot dada berfungsi untuk fleksi, adduksi, dan rotasi internal lengan. Salah satu otot terbesar di tubuh bagian atas dan kunci kekuatan mendorong (pressing).",
    exercises: [
      { name: "Bench Press (Barbell)", img: "🏋️", yt: "https://www.youtube.com/embed/rT7DgCr-3pg", desc: "Compound utama dada. Berbaring di bench, turunkan barbell ke dada lalu dorong ke atas. Mengaktifkan pec major, deltoid anterior, dan trisep.", sets: "2 working set × 5-8 rep", rest: "2-3 menit", alat: "Barbell, Bench" },
      { name: "Incline Dumbbell Press", img: "🔵", yt: "https://www.youtube.com/embed/8iPEnn-ltC8", desc: "Menekankan upper chest. Bench miring 30°, dorong dumbbell ke atas dan sedikit ke dalam dengan stretch penuh di bawah.", sets: "2 working set × 8-12 rep", rest: "2 menit", alat: "Dumbbell, Incline Bench" },
      { name: "Cable Crossover", img: "⚡", yt: "https://www.youtube.com/embed/taI4XduLpTk", desc: "Isolasi dada dengan tension konstan. Pertemukan handle di depan dada, squeeze di puncak kontraksi. Finisher sempurna.", sets: "2 working set × 12-15 rep", rest: "60-90 detik", alat: "Cable Machine" },
      { name: "Push-Up", img: "💪", yt: "https://www.youtube.com/embed/IODxDxX7oi4", desc: "Bodyweight klasik untuk dada, bahu, dan trisep. Bisa divariasikan wide/narrow/incline. Bagus untuk finisher to-failure.", sets: "2 working set × max rep", rest: "60 detik", alat: "Bodyweight" },
    ],
  },
  bicep: {
    name: "Bisep — Biceps Brachii",
    func: "Bisep punya dua kepala (long & short head), berfungsi untuk fleksi siku dan supinasi lengan bawah. Paling terlihat saat lengan ditekuk.",
    exercises: [
      { name: "Barbell Curl", img: "🏋️", yt: "https://www.youtube.com/embed/kwG2ipFRgfo", desc: "Latihan utama bisep. Berdiri tegak, angkat barbell dengan fleksi siku, elbow tetap pinned. Salah satu yang paling efektif.", sets: "2 working set × 6-10 rep", rest: "90 detik", alat: "Barbell / EZ Bar" },
      { name: "Incline Dumbbell Curl", img: "🔵", yt: "https://www.youtube.com/embed/soxrZlIl35U", desc: "Lengan menggantung ke belakang memberi stretch maksimal pada long head. Supinasi kuat di tiap rep.", sets: "2 working set × 8-12 rep", rest: "90 detik", alat: "Dumbbell, Incline Bench" },
      { name: "Cable Curl", img: "⚡", yt: "https://www.youtube.com/embed/cyb_1-zB9PU", desc: "Tension konstan sepanjang gerakan. Squeeze peak, negative lambat. Cocok sebagai finisher pump.", sets: "2 working set × 12-15 rep", rest: "45-60 detik", alat: "Cable Machine" },
      { name: "Hammer Curl", img: "🔨", yt: "https://www.youtube.com/embed/zC3nLlEvin4", desc: "Grip netral mengaktifkan brachialis & brachioradialis. Menambah ketebalan lengan secara keseluruhan.", sets: "2 working set × 10-12 rep", rest: "60 detik", alat: "Dumbbell" },
    ],
  },
  tricep: {
    name: "Trisep — Triceps Brachii",
    func: "Trisep punya tiga kepala dan menyusun ~2/3 massa lengan atas. Berfungsi untuk ekstensi siku — krusial untuk semua gerakan pressing.",
    exercises: [
      { name: "Close-Grip Bench / Dip", img: "🏋️", yt: "https://www.youtube.com/embed/2z8JmcrW-As", desc: "Compound terberat untuk trisep. Tuck siku, turunkan terkontrol, lockout penuh. Dip berbeban juga sangat efektif.", sets: "2 working set × 6-10 rep", rest: "2-3 menit", alat: "Barbell / Parallel Bars" },
      { name: "Overhead Extension", img: "🙆", yt: "https://www.youtube.com/embed/YbX7Wd8jQ-Q", desc: "Stretch dalam pada long head di atas kepala. Jaga siku menghadap depan, turunkan perlahan.", sets: "2 working set × 8-12 rep", rest: "90 detik", alat: "Dumbbell / Cable / EZ Bar" },
      { name: "Tricep Pushdown (Rope)", img: "⬇️", yt: "https://www.youtube.com/embed/vB5OHsJ3EME", desc: "Kunci siku di sisi tubuh, dorong ke bawah, buka rope di akhir gerakan untuk kontraksi maksimal. Finisher klasik.", sets: "2 working set × 12-20 rep", rest: "45-60 detik", alat: "Cable Machine, Rope" },
      { name: "Skull Crusher", img: "💀", yt: "https://www.youtube.com/embed/d_KZxkY_0cM", desc: "Berbaring, turunkan EZ bar ke dahi lalu ekstensi. Isolasi trisep yang sangat kuat untuk semua kepala.", sets: "2 working set × 10-12 rep", rest: "75 detik", alat: "EZ Bar, Bench" },
    ],
  },
  shoulder: {
    name: "Bahu — Deltoid (Anterior, Medial, Posterior)",
    func: "Deltoid terdiri dari tiga bagian: depan, samping, dan belakang. Berfungsi untuk abduksi, fleksi, dan ekstensi lengan. Bahu lebar membentuk V-taper.",
    exercises: [
      { name: "Overhead Press", img: "🏋️", yt: "https://www.youtube.com/embed/2yjwXTZQDDI", desc: "Compound utama bahu. Dorong barbell/dumbbell dari bahu ke atas kepala. Brace core, jangan flare tulang rusuk.", sets: "2 working set × 6-10 rep", rest: "2-3 menit", alat: "Barbell / Dumbbell" },
      { name: "Seated Dumbbell Press", img: "💪", yt: "https://www.youtube.com/embed/qEwKCR5JCog", desc: "Press dengan ROM lebih besar. Dorong dalam busur sedikit, berhenti tepat sebelum lockout untuk tension konstan.", sets: "2 working set × 8-12 rep", rest: "2 menit", alat: "Dumbbell" },
      { name: "Lateral Raise", img: "↔️", yt: "https://www.youtube.com/embed/3VcKaXpzqRo", desc: "Isolasi deltoid medial — memberi lebar bahu. Lead with elbows, tanpa ayunan, lower terkontrol.", sets: "2 working set × 12-20 rep", rest: "45-60 detik", alat: "Dumbbell / Cable" },
      { name: "Face Pull", img: "🎯", yt: "https://www.youtube.com/embed/rep-qVOkqgk", desc: "Tarik cable ke wajah dengan siku tinggi. Melatih rear delt & rotator cuff. Penting untuk kesehatan bahu.", sets: "2 working set × 15-20 rep", rest: "60 detik", alat: "Cable Machine, Rope" },
    ],
  },
  back: {
    name: "Punggung — Latissimus Dorsi & Rhomboids",
    func: "Lats adalah otot terlebar di tubuh, membentuk V-taper. Berfungsi untuk menarik (pulling), ekstensi bahu, dan stabilisasi tulang belakang.",
    exercises: [
      { name: "Pull-Up / Lat Pulldown", img: "⬆️", yt: "https://www.youtube.com/embed/eGo4IYlbE5g", desc: "Raja latihan punggung. Drive siku ke bawah, lead with chest, full hang di bawah. Tambah beban jika >12 rep mudah.", sets: "2 working set × 6-10 rep", rest: "2-3 menit", alat: "Pull-Up Bar / Cable" },
      { name: "Barbell Row", img: "🏋️", yt: "https://www.youtube.com/embed/FWJR5Ve8bnQ", desc: "Compound terbaik untuk ketebalan punggung. Tarik ke lower ribs, squeeze scapula, tanpa ayunan torso.", sets: "2 working set × 8-12 rep", rest: "2 menit", alat: "Barbell" },
      { name: "Seated Cable Row", img: "🚣", yt: "https://www.youtube.com/embed/GZbfZ033f74", desc: "Tarik cable ke perut. Melatih rhomboid, mid-back, dan lats. Jaga dada tegak, tarik dengan siku.", sets: "2 working set × 10-12 rep", rest: "90 detik", alat: "Cable Machine" },
      { name: "Straight-Arm Pulldown", img: "⚡", yt: "https://www.youtube.com/embed/G9uNaXGTJ4w", desc: "Isolasi lats murni. Lengan hampir lurus, tarik ke paha, rasakan stretch & kontraksi. Finisher pump.", sets: "2 working set × 12-15 rep", rest: "60-90 detik", alat: "Cable Machine" },
    ],
  },
  abs: {
    name: "Perut — Rectus Abdominis & Core",
    func: "Rectus abdominis memberi tampilan six-pack. Berfungsi untuk fleksi tulang belakang dan stabilisasi core. Core kuat meningkatkan semua angkatan compound.",
    exercises: [
      { name: "Cable Crunch", img: "⚡", yt: "https://www.youtube.com/embed/2fbujeH3F0E", desc: "Berlutut di depan cable, tarik rope ke bawah dengan kontraksi abs. Round the spine — beban progresif memungkinkan.", sets: "2 working set × 10-15 rep", rest: "60-90 detik", alat: "Cable Machine, Rope" },
      { name: "Hanging Leg Raise", img: "🦵", yt: "https://www.youtube.com/embed/hdng3Nm1x_E", desc: "Gantung di bar, curl panggul ke atas (bukan sekadar angkat kaki). Tanpa ayunan, lower terkontrol. Target lower abs.", sets: "2 working set × 8-15 rep", rest: "60 detik", alat: "Pull-Up Bar" },
      { name: "Plank", img: "🪨", yt: "https://www.youtube.com/embed/ASdvN_XEl_c", desc: "Tahan posisi push-up statis. Brace seperti akan dipukul, spine netral, jangan turun pinggul. Anti-extension core.", sets: "2 working set × 30-60 detik", rest: "45-60 detik", alat: "Bodyweight / Mat" },
      { name: "Crunches", img: "🔄", yt: "https://www.youtube.com/embed/Xyd_fa5zoEU", desc: "Klasik abs. Angkat bahu dari lantai dengan kontraksi, fokus squeeze bukan momentum. Bagus untuk finisher.", sets: "2 working set × 15-25 rep", rest: "45 detik", alat: "Bodyweight / Mat" },
    ],
  },
  forearm: {
    name: "Lengan Bawah — Forearm Flexors & Extensors",
    func: "Otot lengan bawah mengontrol gerakan pergelangan tangan dan grip strength. Grip kuat penting untuk semua pulling dan pressing berat.",
    exercises: [
      { name: "Barbell Wrist Curl", img: "🔄", yt: "https://www.youtube.com/embed/dO2tRvD12-g", desc: "Lengan bawah di paha, curl pergelangan ke atas — biarkan bar menggelinding ke ujung jari untuk ROM penuh.", sets: "2 working set × 12-20 rep", rest: "60-90 detik", alat: "Barbell / Dumbbell" },
      { name: "Reverse Curl", img: "↩️", yt: "https://www.youtube.com/embed/nRgxYX2Ve9w", desc: "Grip overhand. Melatih brachioradialis & ekstensor. Tanpa ayunan, terkontrol di kedua arah.", sets: "2 working set × 10-15 rep", rest: "60 detik", alat: "Barbell / EZ Bar" },
      { name: "Farmer's Walk", img: "🧺", yt: "https://www.youtube.com/embed/Fkzk_RqlYig", desc: "Bawa beban berat sambil berjalan. Crush the grip, brace core, jalan tegak. Grip & kondisi sekaligus.", sets: "2 working set × 30-45 detik", rest: "60 detik", alat: "Dumbbell / Trap Bar" },
    ],
  },
  quad: {
    name: "Paha Depan — Quadriceps",
    func: "Quadriceps terdiri dari 4 kepala dan termasuk otot terbesar di tubuh. Berfungsi untuk ekstensi lutut. Kunci untuk squat, lompat, dan lari.",
    exercises: [
      { name: "Barbell Squat", img: "🏋️", yt: "https://www.youtube.com/embed/ultWZbUMPL8", desc: "Compound terbaik untuk kaki. Brace kuat, lutut track over toes, capai depth terkontrol lalu drive naik.", sets: "2 working set × 5-8 rep", rest: "3 menit", alat: "Barbell, Squat Rack" },
      { name: "Leg Press / Hack Squat", img: "⬆️", yt: "https://www.youtube.com/embed/IZxyjW7MPJQ", desc: "Depth penuh, jangan lock keras, dorong lewat mid-foot. Lebih aman untuk lower back, mudah ditambah beban.", sets: "2 working set × 8-12 rep", rest: "2 menit", alat: "Leg Press / Hack Machine" },
      { name: "Leg Extension", img: "🦵", yt: "https://www.youtube.com/embed/YyvSfVjQeL0", desc: "Isolasi murni quadriceps. Pause & squeeze di atas, negative lambat. Finisher to-failure yang aman.", sets: "2 working set × 12-20 rep", rest: "60 detik", alat: "Leg Extension Machine" },
      { name: "Walking Lunges", img: "🚶", yt: "https://www.youtube.com/embed/QOVaHwm-Q6U", desc: "Unilateral untuk keseimbangan & memperbaiki imbalance. Langkah ke depan, lutut mendekati lantai terkontrol.", sets: "2 working set × 10-12 / kaki", rest: "90 detik", alat: "Dumbbell / Barbell" },
    ],
  },
  hamstring: {
    name: "Paha Belakang — Hamstrings",
    func: "Hamstrings terdiri dari 3 otot (biceps femoris, semitendinosus, semimembranosus). Berfungsi untuk fleksi lutut & ekstensi pinggul. Sering kurang dilatih.",
    exercises: [
      { name: "Romanian Deadlift", img: "🏋️", yt: "https://www.youtube.com/embed/JCXUYuzwNrM", desc: "Hinge di pinggul dengan soft knees, rasakan stretch hamstring, spine netral, lalu kembali tegak. Latihan utama.", sets: "2 working set × 6-10 rep", rest: "2-3 menit", alat: "Barbell / Dumbbell" },
      { name: "Lying / Seated Leg Curl", img: "🔄", yt: "https://www.youtube.com/embed/1Tq3QdYUuHs", desc: "Isolasi hamstring. Curl terkontrol, squeeze penuh, jangan angkat pinggul dari pad.", sets: "2 working set × 8-12 rep", rest: "90 detik", alat: "Leg Curl Machine" },
      { name: "Good Morning / Nordic", img: "🌅", yt: "https://www.youtube.com/embed/YA-h3n9L4YU", desc: "Lower sangat lambat untuk tekanan eksentrik besar. Jaga pinggul ekstensi. Stimulus hamstring tinggi.", sets: "2 working set × 8-12 rep", rest: "90 detik", alat: "Barbell / Bodyweight" },
    ],
  },
  glute: {
    name: "Bokong — Gluteus Maximus, Medius & Minimus",
    func: "Glutes adalah otot terbesar di tubuh. Berfungsi untuk ekstensi pinggul, abduksi, dan rotasi. Glutes kuat = postur baik, power tinggi, lutut lebih aman.",
    exercises: [
      { name: "Hip Thrust", img: "🍑", yt: "https://www.youtube.com/embed/xDmFkJxPzeM", desc: "Latihan terbaik untuk glutes (EMG). Posterior tilt, drive lewat tumit, lockout pinggul, pause di atas.", sets: "2 working set × 8-12 rep", rest: "2 menit", alat: "Barbell, Bench" },
      { name: "Bulgarian Split Squat", img: "🦵", yt: "https://www.youtube.com/embed/2C-uNgKwPLE", desc: "Condong sedikit ke depan, turun lurus ke bawah, dorong lewat tumit depan. Unilateral, sangat menantang.", sets: "2 working set × 8-12 / kaki", rest: "90 detik", alat: "Dumbbell / Bodyweight" },
      { name: "Cable Kickback / Abduction", img: "⬅️", yt: "https://www.youtube.com/embed/RMFCOSi5nAk", desc: "Squeeze glute di puncak, tanpa arch lower-back, return lambat. Finisher isolasi yang efektif.", sets: "2 working set × 15-20 rep", rest: "45-60 detik", alat: "Cable Machine" },
    ],
  },
  calf: {
    name: "Betis — Gastrocnemius & Soleus",
    func: "Betis terdiri dari gastrocnemius (luar) & soleus (dalam). Berfungsi untuk plantarfleksi. Dikenal keras dilatih dan butuh ROM penuh + pause.",
    exercises: [
      { name: "Standing Calf Raise", img: "⬆️", yt: "https://www.youtube.com/embed/gwLzBJYoWlI", desc: "Stretch penuh di bawah, explode naik, pause keras di atas. Menargetkan gastrocnemius maksimal.", sets: "2 working set × 8-12 rep", rest: "90 detik", alat: "Calf Machine / Step" },
      { name: "Seated Calf Raise", img: "🪑", yt: "https://www.youtube.com/embed/JbyjNymZOt0", desc: "Lutut bengkok menargetkan soleus. Tempo lambat, jangan memantul, kontraksi penuh tiap rep.", sets: "2 working set × 12-15 rep", rest: "60-90 detik", alat: "Seated Calf Machine" },
      { name: "Leg-Press Calf Raise", img: "⚡", yt: "https://www.youtube.com/embed/YObPOcXZ-YA", desc: "ROM maksimal di leg press. Pause 1 detik tiap rep, dorong lewat ujung kaki. Finisher to-failure.", sets: "2 working set × 15-20 rep", rest: "60 detik", alat: "Leg Press Machine" },
    ],
  },
  trap: {
    name: "Trapezius — Upper, Middle & Lower Traps",
    func: "Trapezius adalah otot berlian besar di punggung atas. Berfungsi untuk elevasi (upper), retraksi (middle), dan depresi (lower) scapula. Traps besar = tampilan \"yoked\".",
    exercises: [
      { name: "Barbell / Dumbbell Shrug", img: "🤷", yt: "https://www.youtube.com/embed/g6qbq4Lf1FI", desc: "Angkat bahu lurus ke arah telinga, pause di atas, tanpa rolling. Latihan utama upper traps.", sets: "2 working set × 8-12 rep", rest: "90 detik", alat: "Barbell / Dumbbell" },
      { name: "Rack Pull / Deadlift", img: "🏋️", yt: "https://www.youtube.com/embed/op9kVnSso6Q", desc: "Spine netral, drive pinggul, squeeze traps keras di lockout. Beban berat membangun ketebalan punggung atas.", sets: "2 working set × 5-8 rep", rest: "2-3 menit", alat: "Barbell" },
      { name: "Face Pull / Y-Raise", img: "🎯", yt: "https://www.youtube.com/embed/rep-qVOkqgk", desc: "Siku tinggi, tarik ke dahi. Menargetkan mid & lower traps serta rear delt. Penting untuk postur & bahu sehat.", sets: "2 working set × 15-20 rep", rest: "60 detik", alat: "Cable Machine, Rope" },
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

/* ===================== SVG FIGURE GEOMETRY ===================== */
/* each part: { m, paths: [d...], nodes: [[cx,cy]...] } */
const FRONT_PARTS = [
  { m: "trap", paths: ["M104 84 Q120 77 136 84 L150 100 Q120 92 90 100 Z"], nodes: [[120, 91]] },
  { m: "shoulder", paths: ["M84 98 Q70 100 66 116 Q64 129 77 131 Q90 127 92 110 Q92 100 84 98 Z", "M156 98 Q170 100 174 116 Q176 129 163 131 Q150 127 148 110 Q148 100 156 98 Z"], nodes: [[78, 114], [162, 114]] },
  { m: "chest", paths: ["M92 102 Q108 100 118 107 L118 134 Q104 141 94 132 Q86 119 92 102 Z", "M148 102 Q132 100 122 107 L122 134 Q136 141 146 132 Q154 119 148 102 Z"], nodes: [[105, 119], [135, 119]] },
  { m: "bicep", paths: ["M64 120 Q56 122 56 140 L60 166 Q72 168 74 150 L74 126 Q72 120 64 120 Z", "M176 120 Q184 122 184 140 L180 166 Q168 168 166 150 L166 126 Q168 120 176 120 Z"], nodes: [[65, 144], [175, 144]] },
  { m: "forearm", paths: ["M58 169 Q52 171 52 189 L57 222 Q70 226 72 205 L70 173 Q68 169 58 169 Z", "M182 169 Q188 171 188 189 L183 222 Q170 226 168 205 L170 173 Q172 169 182 169 Z"], nodes: [[62, 196], [178, 196]] },
  { m: "abs", paths: ["M104 138 Q120 136 136 138 L138 206 Q120 214 102 206 Z"], lines: ["M120 140 L120 210", "M104 162 Q120 160 136 162", "M103 186 Q120 184 137 186"], nodes: [[120, 172]] },
  { m: "quad", paths: ["M100 215 Q88 219 88 245 L94 332 Q106 338 112 328 L116 245 Q116 219 108 215 Q104 214 100 215 Z", "M140 215 Q152 219 152 245 L146 332 Q134 338 128 328 L124 245 Q124 219 132 215 Q136 214 140 215 Z"], nodes: [[102, 268], [138, 268]] },
  { m: "calf", paths: ["M98 350 Q92 352 92 384 L96 438 Q106 444 110 436 L112 384 Q112 352 106 350 Z", "M142 350 Q148 352 148 384 L144 438 Q134 444 130 436 L128 384 Q128 352 134 350 Z"], nodes: [[101, 400], [139, 400]] },
];

const BACK_PARTS = [
  { m: "trap", paths: ["M120 80 L150 102 Q140 120 124 126 L116 126 Q100 120 90 102 Z"], nodes: [[120, 104]] },
  { m: "shoulder", paths: ["M84 100 Q70 102 66 118 Q64 131 77 133 Q90 129 92 112 Q92 102 84 100 Z", "M156 100 Q170 102 174 118 Q176 131 163 133 Q150 129 148 112 Q148 102 156 100 Z"], nodes: [[78, 116], [162, 116]] },
  { m: "back", paths: ["M92 122 Q78 128 80 162 L113 186 L117 132 Q105 124 92 122 Z", "M148 122 Q162 128 160 162 L127 186 L123 132 Q135 124 148 122 Z", "M108 150 L132 150 L129 198 Q120 202 111 198 Z"], nodes: [[98, 152], [142, 152]] },
  { m: "tricep", paths: ["M64 120 Q56 122 56 140 L60 166 Q72 168 74 150 L74 126 Q72 120 64 120 Z", "M176 120 Q184 122 184 140 L180 166 Q168 168 166 150 L166 126 Q168 120 176 120 Z"], nodes: [[65, 144], [175, 144]] },
  { m: "forearm", paths: ["M58 169 Q52 171 52 189 L57 222 Q70 226 72 205 L70 173 Q68 169 58 169 Z", "M182 169 Q188 171 188 189 L183 222 Q170 226 168 205 L170 173 Q172 169 182 169 Z"], nodes: [[62, 196], [178, 196]] },
  { m: "glute", paths: ["M100 200 Q88 202 88 220 Q90 238 106 238 Q118 236 118 218 L116 204 Q108 200 100 200 Z", "M140 200 Q152 202 152 220 Q150 238 134 238 Q122 236 122 218 L124 204 Q132 200 140 200 Z"], nodes: [[104, 220], [136, 220]] },
  { m: "hamstring", paths: ["M100 242 Q90 244 90 266 L96 340 Q108 346 112 336 L114 266 Q114 244 106 242 Z", "M140 242 Q150 244 150 266 L144 340 Q132 346 128 336 L126 266 Q126 244 134 242 Z"], nodes: [[102, 288], [138, 288]] },
  { m: "calf", paths: ["M98 350 Q90 352 90 388 Q92 414 102 420 Q108 422 110 414 L112 388 Q112 352 106 350 Z", "M142 350 Q150 352 150 388 Q148 414 138 420 Q132 422 130 414 L128 388 Q128 352 134 350 Z"], nodes: [[101, 392], [139, 392]] },
];

/* frame (head, neck, joints, hands, feet) */
const HandLeft = () => (
  <>
    <path d="M48 206 Q44 210 44 220 Q44 232 54 236 L68 236 Q76 232 76 220 Q76 210 72 206 Q60 202 48 206 Z" className="frame-fill" />
    <path d="M36 214 Q30 216 30 224 Q30 231 38 232 Q47 230 46 222 Q46 215 36 214 Z" className="frame-fill" />
    <path d="M47 234 L52 234 L52 247.5 A2.5 2.5 0 0 1 47 247.5 Z" className="frame-fill" />
    <path d="M53 235 L59 235 L59 255 A3 3 0 0 1 53 255 Z" className="frame-fill" />
    <path d="M60 235 L66 235 L66 259 A3 3 0 0 1 60 259 Z" className="frame-fill" />
    <path d="M67 235 L73 235 L73 255 A3 3 0 0 1 67 255 Z" className="frame-fill" />
  </>
);
const HandRight = () => (
  <>
    <path d="M192 206 Q196 210 196 220 Q196 232 186 236 L172 236 Q164 232 164 220 Q164 210 168 206 Q180 202 192 206 Z" className="frame-fill" />
    <path d="M204 214 Q210 216 210 224 Q210 231 202 232 Q193 230 194 222 Q194 215 204 214 Z" className="frame-fill" />
    <path d="M193 234 L188 234 L188 247.5 A2.5 2.5 0 0 1 193 247.5 Z" className="frame-fill" />
    <path d="M187 235 L181 235 L181 255 A3 3 0 0 1 187 255 Z" className="frame-fill" />
    <path d="M180 235 L174 235 L174 259 A3 3 0 0 1 180 259 Z" className="frame-fill" />
    <path d="M173 235 L167 235 L167 255 A3 3 0 0 1 173 255 Z" className="frame-fill" />
  </>
);
const FootLeft = () => (
  <>
    <path d="M88 430 Q84 434 84 444 Q84 456 100 460 Q116 458 118 446 Q120 434 112 430 Q100 426 88 430 Z" className="frame-fill" />
    <path d="M92 452 Q92 456 91 459" className="detail-line" />
    <path d="M102 454 Q102 458 101 461" className="detail-line" />
    <path d="M112 452 Q112 456 111 459" className="detail-line" />
  </>
);
const FootRight = () => (
  <>
    <path d="M152 430 Q156 434 156 444 Q156 456 140 460 Q124 458 122 446 Q120 434 128 430 Q140 426 152 430 Z" className="frame-fill" />
    <path d="M148 452 Q148 456 149 459" className="detail-line" />
    <path d="M138 454 Q138 458 139 461" className="detail-line" />
    <path d="M128 452 Q128 456 129 459" className="detail-line" />
  </>
);

const FrameFront = () => (
  <>
    <ellipse cx="120" cy="46" rx="23" ry="27" className="frame-fill" />
    <path d="M108 70 h24 v16 h-24 z" className="frame-fill" />
    <HandLeft />
    <HandRight />
    <ellipse cx="101" cy="341" rx="15" ry="15" className="frame-fill" />
    <ellipse cx="139" cy="341" rx="15" ry="15" className="frame-fill" />
    <FootLeft />
    <FootRight />
  </>
);

const FrameBack = () => (
  <>
    <ellipse cx="120" cy="46" rx="23" ry="27" className="frame-fill" />
    <path d="M108 70 h24 v14 h-24 z" className="frame-fill" />
    <HandLeft />
    <HandRight />
    <ellipse cx="101" cy="341" rx="15" ry="15" className="frame-fill" />
    <ellipse cx="139" cy="341" rx="15" ry="15" className="frame-fill" />
    <FootLeft />
    <FootRight />
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
          <stop offset="0" stopColor="#93C5FD" /><stop offset="1" stopColor="#60A5FA" />
        </linearGradient>
        <linearGradient id="msOn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38BDF8" /><stop offset="0.5" stopColor="#2563EB" /><stop offset="1" stopColor="#1E40AF" />
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

function ProtoCard({ ex }) {
  return (
    <div
      className="rounded-xl px-4 py-3 mb-3 transition-all duration-200 hover:-translate-y-px group"
      style={{ background: C.panel, border: `1px solid ${C.line2}` }}
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(8px)" }}
      onClick={(ev) => ev.target === ev.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl max-h-full overflow-y-auto rounded-3xl"
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
    <div className="flex flex-col h-screen w-full transition-colors" style={{ background: C.page, fontFamily: "'Inter', sans-serif" }}>
      <UpperNavbar />
      <div className="flex-1 overflow-y-auto py-10 px-4">
      {/* fonts + SVG interaction styles (things Tailwind can't express) */}
      <style>{`
        .font-display{font-family:'Inter',sans-serif;letter-spacing:1.2px;}
        .frame-fill{fill:rgba(219,234,254,.45);stroke:rgba(37,99,235,.18);stroke-width:.8;}
        .detail-line{fill:none;stroke:rgba(37,99,235,.35);stroke-width:1;stroke-linecap:round;pointer-events:none;}
        .ms{cursor:pointer;transition:opacity .3s,filter .3s;}
        .ms .seg{fill:url(#msIdle);stroke:rgba(37,99,235,.25);stroke-width:1;transition:fill .3s,stroke .3s;}
        .ms .node{fill:rgba(37,99,235,.45);transition:.3s;}
        .ms:hover .seg{fill:url(#msHover);stroke:rgba(37,99,235,.6);}
        svg.has-sel .ms{opacity:.3;}
        svg.has-sel .ms:hover{opacity:.55;}
        svg.has-sel .ms.on{opacity:1;}
        .ms.on .seg{fill:url(#msOn);stroke:#93C5FD;stroke-width:1.4;}
        .ms.on{filter:drop-shadow(0 0 5px rgba(37,99,235,.6)) drop-shadow(0 0 16px rgba(37,99,235,.3));}
        .ms.on .node{fill:#DBEAFE;animation:nodePulse 1.4s ease-in-out infinite;}
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
        <div className="text-center mb-10">
          <div className="font-display inline-flex items-center gap-2 uppercase mb-3 rounded-full px-4 py-1.5"
            style={{ color: C.teal, fontSize: "0.6rem", letterSpacing: "3px", background: "rgba(15,123,74,.07)", border: `1px solid ${C.line}` }}>
            <span className="w-1.5 h-1.5 rounded-full blink-anim" style={{ background: C.teal, boxShadow: `0 0 10px ${C.teal}` }} />
            Cyber Muscle Scan
          </div>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl mb-3" style={{ color: C.ink }}>
            Select a target.{" "}
            <span className="gradient-clip-text" style={{ '--grad-from': C.teal, '--grad-to': C.blue }}>
              Get the protocol.
            </span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: C.ink2, fontSize: "1.04rem" }}>
            Tap otot di chip atau langsung di avatar — AI panel menampilkan protokol 2× failure lengkap dengan form cue dan video.
          </p>
        </div>

        {/* 3-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ---- CHIP LIST ---- */}
          <div className="lg:col-span-3">
            {CHIP_GROUPS.map((group) => (
              <div key={group.label} className="mb-6">
                <div className="font-display flex items-center gap-2 uppercase mb-3" style={{ color: C.ink3, fontSize: "0.6rem", letterSpacing: "3px" }}>
                  {group.label}
                  <span className="flex-1 h-px" style={{ background: C.line2 }} />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {group.items.map((item) => {
                    const isActive = muscle === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => selectMuscle(item.id)}
                        className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left font-semibold transition-all duration-200 hover:translate-x-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                        style={{
                          fontSize: "0.94rem",
                          letterSpacing: ".5px",
                          background: isActive ? "linear-gradient(100deg, rgba(15,123,74,.12), rgba(10,92,55,.08))" : C.panel,
                          border: `1px solid ${isActive ? C.teal : C.line2}`,
                          color: isActive ? C.teal : C.ink2,
                          boxShadow: isActive ? C.glowTeal : "none",
                        }}
                      >
                        {item.label}
                        <span className="font-display" style={{ fontSize: "0.5rem", letterSpacing: "1px", color: isActive ? C.teal : C.ink3, opacity: isActive ? 1 : 0.8 }}>
                          {item.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ---- AVATAR STAGE ---- */}
          <div
            className="lg:col-span-5 relative flex flex-col items-center rounded-3xl p-4 overflow-hidden"
            style={{
              minHeight: 560,
              border: `1px solid ${C.line}`,
              background: C.stageBg,
              backdropFilter: "blur(14px)",
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
            <div className="relative flex-1 flex items-center justify-center w-full z-10">
              <div className="w-full max-w-xs">
                {view === "front" ? (
                  <Figure parts={FRONT_PARTS} Frame={FrameFront} active={muscle} onSelect={selectMuscle} />
                ) : (
                  <Figure parts={BACK_PARTS} Frame={FrameBack} active={muscle} onSelect={selectMuscle} />
                )}
              </div>
            </div>

            {/* readout */}
            <div className="font-display flex items-center gap-2 uppercase mt-1.5 z-20" style={{ color: C.ink3, fontSize: "0.6rem", letterSpacing: "2px" }}>
              <span className="w-1.5 h-1.5 rounded-full blink-anim" style={{ background: C.teal, boxShadow: `0 0 10px ${C.teal}` }} />
              {muscle ? `Target locked — ${MUSCLE_DATA[muscle].name.split("—")[0].trim()}` : "Awaiting target — select a muscle"}
            </div>
          </div>

          {/* ---- AI REC PANEL ---- */}
          <div
            className="lg:col-span-4 rounded-3xl overflow-hidden"
            style={{ minHeight: 560, background: C.panelSoft, border: `1px solid ${C.line}`, backdropFilter: "blur(14px)" }}
          >
            {!muscle ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 gap-4" style={{ minHeight: 480, color: C.ink3 }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl spin-slow" style={{ border: `2px dashed ${C.line}` }}>◎</div>
                <p className="max-w-xs leading-relaxed" style={{ fontSize: "0.94rem" }}>Select a muscle to generate its AI training protocol.</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="font-display flex items-center gap-2 uppercase mb-2" style={{ color: C.teal, fontSize: "0.58rem", letterSpacing: "2.5px" }}>
                  ⚡ AI Protocol · 2× Failure Meta
                </div>
                <div className="font-display font-bold mb-3 leading-snug" style={{ color: C.ink, fontSize: "1.12rem" }}>{md.name}</div>
                <p className="leading-relaxed mb-5" style={{ color: C.ink2, fontSize: "0.9rem" }}>{md.func}</p>

                <div className="font-display flex items-center gap-2 uppercase mt-5 mb-3" style={{ color: C.orange, fontSize: "0.58rem", letterSpacing: "2.5px" }}>
                  Recommended protocol
                  <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,138,61,.4), transparent)" }} />
                </div>
                <ProtoCard ex={proto.main} />
                <ProtoCard ex={proto.secondary} />
                <ProtoCard ex={proto.finisher} />

                <div className="font-display uppercase mt-5 mb-3" style={{ color: C.teal, fontSize: "0.58rem", letterSpacing: "2.5px" }}>
                  Exercise library — tap to watch form
                </div>
                {md.exercises.map((e, i) => (
                  <button
                    key={e.name}
                    onClick={() => setModal({ muscleId: muscle, idx: i })}
                    className="w-full flex items-center justify-between gap-2 rounded-lg px-3.5 py-2.5 mb-1.5 font-semibold text-left transition-all duration-200 hover:translate-x-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    style={{ background: C.panel, border: `1px solid ${C.line2}`, color: C.ink2, fontSize: "0.9rem" }}
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
