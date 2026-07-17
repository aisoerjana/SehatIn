const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_PER_KATEGORI = 6;

// Fisher-Yates shuffle - menghindari bias posisi (item pertama selalu terpilih)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Acak urutan lalu batasi jumlah per kategori supaya prompt tidak terlalu besar
// (hemat token -> lebih jarang kena rate limit) dan variatif antar request
function acakDanBatasi(catalog, kategoriKey, maxPerKategori = MAX_PER_KATEGORI) {
  const acak = shuffle(catalog);
  const perKategori = {};
  const hasil = [];
  for (const item of acak) {
    const kat = item[kategoriKey] || "lain";
    perKategori[kat] = perKategori[kat] || 0;
    if (perKategori[kat] < maxPerKategori) {
      perKategori[kat]++;
      hasil.push(item);
    }
  }
  return shuffle(hasil);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const mode = body.mode || "rekomendasi";

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY tidak ditemukan di secrets");
    }

    let messages;

    if (mode === "ask") {
      const { prompt } = body;
      if (!prompt) throw new Error("Prompt harus diisi");

      messages = [
        {
          role: "system",
          content:
            "Kamu adalah koki virtual yang membantu pengguna membuat resep dari bahan-bahan yang mereka miliki. Berikan resep yang praktis, bergizi, dan lezat. Selalu gunakan bahan-bahan yang disebutkan pengguna sebanyak mungkin.",
        },
        {
          role: "user",
          content: `${prompt}\n\nBerikan jawaban dalam format JSON PERSIS seperti ini, tanpa teks tambahan:
{
  "judul": "Nama Resep",
  "porsi": "2 porsi",
  "waktu_masak": "30 menit",
  "bahan": ["Bahan 1 - jumlah", "Bahan 2 - jumlah"],
  "langkah": ["Langkah 1", "Langkah 2"],
  "tips": "Tips tambahan jika ada",
  "estimasi_kalori": 400,
  "estimasi_protein_g": 25,
  "estimasi_carbs_g": 30,
  "estimasi_lemak_g": 10
}`,
        },
      ];
    } else if (mode === "result") {
      const { macro_target, food_catalog, previous_recommendations } = body;
      if (!macro_target || !food_catalog) throw new Error("macro_target dan food_catalog harus diisi");

      const catalogTerbatas = acakDanBatasi(food_catalog, "kategori");

      const daftarMakanan = catalogTerbatas
        .map((b) =>
          `- ${b.nama} (${b.kategori}): ${b.kalori}kkal, P${b.protein_g}g, KH${b.carbs_g}g, L${b.lemak_g}g, S${b.serat_g}g per ${b.satuan}`
        )
        .join("\n");

      const hindariBahan = Array.isArray(previous_recommendations) && previous_recommendations.length > 0
        ? `\n\nPada rekomendasi-rekomendasi sebelumnya untuk pengguna ini, bahan berikut sudah pernah dipilih: ${previous_recommendations.join(", ")}. Utamakan bahan LAIN yang sama baiknya secara gizi, agar rekomendasi terasa baru dan bervariasi. Hanya ulangi salah satu dari daftar itu jika benar-benar tidak ada alternatif yang sepadan.`
        : "";

      messages = [
        {
          role: "system",
          content:
            "Kamu adalah asisten nutrisi yang membantu merekomendasikan bahan makanan dan menu berdasarkan target nutrisi harian pengguna. Setiap kali diminta, usahakan memberi variasi pilihan (jangan selalu jatuh ke kombinasi paling umum/klise seperti dada ayam, nasi merah, dan brokoli) selama pilihan lain masih sesuai target gizi.",
        },
        {
          role: "user",
          content: `Target nutrisi harian pengguna:
- Kalori: ${macro_target.kalori} kkal
- Protein: ${macro_target.protein}g
- Karbohidrat: ${macro_target.karbo}g
- Lemak: ${macro_target.lemak}g
- Serat: ${macro_target.serat}g
- Gula: ${macro_target.gula}g

Daftar bahan makanan yang tersedia (urutan acak, tidak menunjukkan prioritas):
${daftarMakanan}

Berdasarkan target di atas, pilih 4-6 bahan makanan dari daftar yang PALING SESUAI untuk memenuhi target nutrisi tersebut. Pertimbangkan variasi kategori (protein, karbohidrat, sayuran, dll) dan jangan hanya memilih opsi paling umum jika ada alternatif lain dari daftar yang sama sesuainya.${hindariBahan}

Kemudian buat 1 menu inspirasi (resep sederhana) yang menggunakan beberapa bahan yang direkomendasikan.

Berikan jawaban dalam format JSON PERSIS seperti ini, tanpa teks tambahan:
{
  "rekomendasi_bahan": [
    {
      "nama": "Nama Bahan",
      "kategori": "protein",
      "alasan": "Alasan singkat kenapa bahan ini direkomendasikan"
    }
  ],
  "inspirasi_menu": {
    "judul": "Nama Menu",
    "bahan": ["Bahan 1 - jumlah", "Bahan 2 - jumlah"],
    "langkah": ["Langkah 1", "Langkah 2"],
    "kalori": 350,
    "protein_g": 25,
    "carbs_g": 20,
    "lemak_g": 12,
    "estimasi_harga": "Rp 15.000"
  }
}`,
        },
      ];
    } else {
      const { macro_target, food_catalog } = body;
      if (!macro_target || !food_catalog) throw new Error("macro_target dan food_catalog harus diisi");

      const catalogTerbatas = acakDanBatasi(food_catalog, "category");

      const daftarMakanan = catalogTerbatas
        .map((b) =>
          `- ${b.food_name} (${b.category}): ${b.kalori}kkal, P${b.protein_g}g, KH${b.carbs_g}g, L${b.lemak_g}g, S${b.serat_g}g per 100g`
        )
        .join("\n");

      messages = [
        {
          role: "system",
          content:
            "Kamu adalah asisten nutrisi yang membuat rencana makan harian berdasarkan target nutrisi dan daftar bahan makanan. Usahakan memberi variasi pilihan antar kesempatan selama masih sesuai target gizi.",
        },
        {
          role: "user",
          content: `Buat rencana makan harian dengan target berikut:
- Kalori: ${macro_target.calorie_target} kkal
- Protein: ${macro_target.protein_g}g
- Karbohidrat: ${macro_target.carbs_g}g
- Lemak: ${macro_target.fat_g}g
- Serat: ${macro_target.fiber_g}g
- Gula maksimal: ${macro_target.sugar_max_g}g

Hanya gunakan bahan dari daftar berikut:
${daftarMakanan}

Bagi menjadi 3-4 kali makan (sarapan, makan_siang, makan_malam, snack).
Pilih porsi yang sesuai agar total harian mendekati target.

Berikan jawaban dalam format JSON PERSIS seperti ini, tanpa teks tambahan:
{
  "rekomendasi": [
    {
      "food_name": "Nama Bahan",
      "portion": "150g",
      "kalori": 200,
      "protein_g": 15,
      "carbs_g": 25,
      "lemak_g": 5,
      "serat_g": 2,
      "meal_type": "makan_siang",
      "notes": "Penjelasan singkat"
    }
  ]
}`,
        },
      ];
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: messages.map((m) => `[${m.role.toUpperCase()}]\n${m.content}`).join("\n\n"),
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: messages.find((m) => m.role === "system")?.content || "",
              },
            ],
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const geminiData = await response.json();

    if (!response.ok || !geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Gemini API error: " + JSON.stringify(geminiData));
    }

    let teksJawaban = geminiData.candidates[0].content.parts[0].text;
    let teksBersih = teksJawaban.replace(/```json\n?|```/g, "").trim();

    let hasil;
    try {
      hasil = JSON.parse(teksBersih);
    } catch {
      const match = teksJawaban.match(/\{[\s\S]*\}/);
      if (match) {
        hasil = JSON.parse(match[0]);
      } else {
        throw new Error("Gagal parse response Gemini: " + teksJawaban);
      }
    }

    return new Response(JSON.stringify(hasil), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
