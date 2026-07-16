// Import library Supabase client untuk dipakai di dalam Edge Function
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Header CORS: mengizinkan request dari domain manapun (perlu untuk dipanggil dari React di browser)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Deno.serve() = cara membuat "server" sederhana yang menunggu request masuk,
// mirip seperti fungsi main() di C tapi ini menunggu request HTTP, bukan dijalankan sekali.
Deno.serve(async (req) => {
  // Menangani preflight request dari browser (bagian dari mekanisme CORS, bisa diabaikan detailnya)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Ambil data yang dikirim dari frontend (body request dalam format JSON)
    const { bmi, gejala, usia, gender, alergi, preferensi_diet } = await req.json();
    // gejala, alergi, preferensi_diet diharapkan berupa array string, contoh: ["lemas", "pusing"]

    // Membuat koneksi ke Supabase database dari dalam Edge Function
    // SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY diambil dari "Secrets" (dijelaskan di bawah),
    // BUKAN ditulis langsung di kode.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ===== LANGKAH 1: CEK RED FLAG (GEJALA DARURAT) DULU =====
    const { data: redFlags, error: redFlagError } = await supabase
      .from("gejala_darurat")
      .select("nama_gejala, pesan_peringatan");

    if (redFlagError) throw redFlagError;

    // Cari apakah ada gejala user yang cocok dengan daftar red flag
    const gejalaDarurat = redFlags.filter((rf) => gejala.includes(rf.nama_gejala));

    if (gejalaDarurat.length > 0) {
      // KALAU ADA red flag, LANGSUNG STOP dan kembalikan status darurat.
      // Tidak lanjut ke pencocokan rule/nutrisi sama sekali.
      return new Response(
        JSON.stringify({
          is_darurat: true,
          pesan: gejalaDarurat.map((g) => g.pesan_peringatan),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===== LANGKAH 2: COCOKKAN KE TABEL ATURAN_REKOMENDASI =====
    const { data: rules, error: rulesError } = await supabase
      .from("aturan_rekomendasi")
      .select("*");

    if (rulesError) throw rulesError;

    // Filter rule yang cocok dengan kondisi user (BMI range, usia range, gender, dan ada gejala yang overlap)
    const rulesCocok = rules.filter((rule) => {
      const cocokBmi =
        (rule.bmi_min === null || bmi >= rule.bmi_min) &&
        (rule.bmi_max === null || bmi <= rule.bmi_max);
      const cocokUsia = usia >= rule.usia_min && usia <= rule.usia_max;
      const cocokGender = rule.gender === "semua" || rule.gender === gender;
      const cocokGejala =
        rule.gejala_terkait.length === 0 ||
        rule.gejala_terkait.some((g: string) => gejala.includes(g));

      return cocokBmi && cocokUsia && cocokGender && cocokGejala;
    });

    // Urutkan berdasarkan prioritas tertinggi, lalu gabungkan semua kebutuhan nutrisi (tanpa duplikat)
    const kebutuhanNutrisi = Array.from(
      new Set(rulesCocok.flatMap((r) => r.kebutuhan_nutrisi))
    );

    // ===== LANGKAH 3: CARI BAHAN MAKANAN YANG COCOK, SUDAH DIFILTER ALERGI & DIET =====
    const { data: semuaBahan, error: bahanError } = await supabase
      .from("bahan_makanan")
      .select("*");

    if (bahanError) throw bahanError;

    const bahanAman = semuaBahan.filter((bahan) => {
      // Bahan harus punya minimal 1 nutrisi yang dibutuhkan
      const punyaNutrisiDibutuhkan = bahan.nutrisi_utama.some((n: string) =>
        kebutuhanNutrisi.includes(n)
      );
      // Bahan TIDAK BOLEH mengandung alergen yang dipilih user
      const tidakAdaAlergen = !bahan.alergen.some((a: string) => alergi.includes(a));
      // Kalau user punya preferensi diet (misal halal), bahan harus punya tag itu
      const cocokDiet =
        preferensi_diet.length === 0 ||
        preferensi_diet.every((d: string) => bahan.tag_diet.includes(d));

      return punyaNutrisiDibutuhkan && tidakAdaAlergen && cocokDiet;
    });

    // Kembalikan hasil rule engine (belum diterjemahkan ke bahasa natural, itu tugas gemini-proxy)
    return new Response(
      JSON.stringify({
        is_darurat: false,
        kebutuhan_nutrisi: kebutuhanNutrisi,
        kandidat_bahan: bahanAman,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Kalau ada error di manapun di atas, kembalikan pesan error dengan status 500
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});