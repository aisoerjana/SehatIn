const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const mode = body.mode || "rekomendasi";

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY tidak ditemukan di secrets");
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
      const { macro_target, food_catalog } = body;
      if (!macro_target || !food_catalog) throw new Error("macro_target dan food_catalog harus diisi");

      const daftarMakanan = food_catalog
        .map((b) =>
          `- ${b.nama} (${b.kategori}): ${b.kalori}kkal, P${b.protein_g}g, KH${b.carbs_g}g, L${b.lemak_g}g, S${b.serat_g}g per ${b.satuan}`
        )
        .join("\n");

      messages = [
        {
          role: "system",
          content:
            "Kamu adalah asisten nutrisi yang membantu merekomendasikan bahan makanan dan menu berdasarkan target nutrisi harian pengguna.",
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

Daftar bahan makanan yang tersedia:
${daftarMakanan}

Berdasarkan target di atas, pilih 4-6 bahan makanan dari daftar yang PALING SESUAI untuk memenuhi target nutrisi tersebut. Pertimbangkan variasi kategori (protein, karbohidrat, sayuran, dll).

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

      const daftarMakanan = food_catalog
        .map((b) =>
          `- ${b.food_name} (${b.category}): ${b.kalori}kkal, P${b.protein_g}g, KH${b.carbs_g}g, L${b.lemak_g}g, S${b.serat_g}g per 100g`
        )
        .join("\n");

      messages = [
        {
          role: "system",
          content:
            "Kamu adalah asisten nutrisi yang membuat rencana makan harian berdasarkan target nutrisi dan daftar bahan makanan.",
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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
      }),
    });

    const groqData = await response.json();

    if (!response.ok || !groqData.choices?.[0]?.message?.content) {
      throw new Error("Groq API error: " + JSON.stringify(groqData));
    }

    let teksJawaban = groqData.choices[0].message.content;
    let teksBersih = teksJawaban.replace(/```json\n?|```/g, "").trim();

    let hasil;
    try {
      hasil = JSON.parse(teksBersih);
    } catch {
      const match = teksJawaban.match(/\{[\s\S]*\}/);
      if (match) {
        hasil = JSON.parse(match[0]);
      } else {
        throw new Error("Gagal parse response Groq: " + teksJawaban);
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
