const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Data ini adalah HASIL dari rule-engine (kandidat_bahan, kebutuhan_nutrisi),
    // dikirim dari frontend setelah frontend memanggil rule-engine terlebih dahulu.
    const { kebutuhan_nutrisi, kandidat_bahan } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    // Menyusun instruksi (prompt) untuk Gemini.
    // PENTING: kandidat_bahan yang dikirim ke sini SUDAH difilter alergi & diet oleh rule-engine,
    // jadi Gemini hanya boleh memilih dari daftar ini, tidak boleh mengarang bahan lain.
    const daftarBahanText = kandidat_bahan
      .map((b: any) => `- ${b.nama} (estimasi harga Rp${b.harga_estimasi}, kategori ${b.kategori})`)
      .join("\n");

    const prompt = `
Kamu adalah asisten nutrisi. Berdasarkan kebutuhan nutrisi berikut: ${kebutuhan_nutrisi.join(", ")},
dan HANYA dari daftar bahan makanan aman berikut ini (jangan menyebutkan bahan di luar daftar ini):
${daftarBahanText}

Tolong pilih 3 bahan makanan yang paling sesuai, lalu berikan jawaban dalam format JSON PERSIS seperti ini,
tanpa teks tambahan apapun di luar JSON:
{
  "bahan": ["nama1", "nama2", "nama3"],
  "estimasi_total_harga": angka_total_rupiah,
  "saran_menu": "deskripsi singkat menu yang bisa dibuat",
  "penjelasan": "penjelasan singkat kenapa bahan ini membantu, bahasa awam, maksimal 3 kalimat"
}
`;

    // Memanggil Gemini 2.0 Flash API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const geminiData = await response.json();

    // Ambil teks jawaban dari struktur respons Gemini
    const teksJawaban = geminiData.candidates[0].content.parts[0].text;

    // Bersihkan kalau Gemini membungkus jawabannya dengan ```json ... ```
    const teksBersih = teksJawaban.replace(/```json|```/g, "").trim();
    const hasilRekomendasi = JSON.parse(teksBersih);

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