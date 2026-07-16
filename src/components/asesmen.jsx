import { supabase } from './supabaseClient';

async function prosesAsesmen(formData) {
  // formData contoh: { tinggi_cm, berat_kg, usia, gender, gejala, riwayat_keturunan, alergi, preferensi_diet, consent_diterima }

  // 1. Hitung BMI (rumus: berat(kg) / (tinggi(m) * tinggi(m)))
  const tinggiMeter = formData.tinggi_cm / 100;
  const bmi = formData.berat_kg / (tinggiMeter * tinggiMeter);

  // 2. Panggil Edge Function rule-engine
  const { data: hasilRule, error: errorRule } = await supabase.functions.invoke('rule-engine', {
    body: {
      bmi,
      gejala: formData.gejala,
      usia: formData.usia,
      gender: formData.gender,
      alergi: formData.alergi,
      preferensi_diet: formData.preferensi_diet,
    },
  });

  if (errorRule) {
    console.error('Error rule engine:', errorRule);
    return;
  }

  // 3. Kalau darurat, LANGSUNG tampilkan peringatan, JANGAN lanjut ke Gemini
  if (hasilRule.is_darurat) {
    // Tampilkan hasilRule.pesan ke user di UI, dan simpan ke riwayat sebagai darurat
    await supabase.from('riwayat_asesmen').insert({
      user_id: (await supabase.auth.getUser()).data.user.id,
      tinggi_cm: formData.tinggi_cm,
      berat_kg: formData.berat_kg,
      bmi,
      usia: formData.usia,
      gender: formData.gender,
      gejala: formData.gejala,
      riwayat_keturunan: formData.riwayat_keturunan,
      alergi: formData.alergi,
      preferensi_diet: formData.preferensi_diet,
      is_darurat: true,
      consent_diterima: formData.consent_diterima,
    });
    return { is_darurat: true, pesan: hasilRule.pesan };
  }

  // 4. Kalau tidak darurat, lanjut panggil gemini-proxy
  const { data: hasilGemini, error: errorGemini } = await supabase.functions.invoke('gemini-proxy', {
    body: {
      kebutuhan_nutrisi: hasilRule.kebutuhan_nutrisi,
      kandidat_bahan: hasilRule.kandidat_bahan,
    },
  });

  if (errorGemini) {
    console.error('Error gemini proxy:', errorGemini);
    return;
  }

  // 5. Simpan hasil akhir ke riwayat_asesmen
  await supabase.from('riwayat_asesmen').insert({
    user_id: (await supabase.auth.getUser()).data.user.id,
    tinggi_cm: formData.tinggi_cm,
    berat_kg: formData.berat_kg,
    bmi,
    usia: formData.usia,
    gender: formData.gender,
    gejala: formData.gejala,
    riwayat_keturunan: formData.riwayat_keturunan,
    alergi: formData.alergi,
    preferensi_diet: formData.preferensi_diet,
    is_darurat: false,
    hasil_rekomendasi: hasilGemini,
    consent_diterima: formData.consent_diterima,
  });

  return { is_darurat: false, hasil: hasilGemini };
}