const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { macro_target, food_catalog } = await req.json();

    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY tidak ditemukan di secrets");
    }

    const daftarMakanan = food_catalog
      .map((b: any) =>
        `- ${b.food_name} (${b.category}): ${b.kalori}kkal, P${b.protein_g}g, KH${b.carbs_g}g, L${b.lemak_g}g, S${b.serat_g}g per 100g`
      )
      .join("\n");

    const messages = [
      {
        role: "system",
        content: "Kamu adalah asisten nutrisi yang membuat rencana makan harian berdasarkan target nutrisi dan daftar bahan makanan.",
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

    let hasilRekomendasi;
    try {
      hasilRekomendasi = JSON.parse(teksBersih);
    } catch {
      const match = teksJawaban.match(/\{[\s\S]*\}/);
      if (match) {
        hasilRekomendasi = JSON.parse(match[0]);
      } else {
        throw new Error("Gagal parse response Groq: " + teksJawaban);
      }
    }

    return new Response(JSON.stringify(hasilRekomendasi), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
