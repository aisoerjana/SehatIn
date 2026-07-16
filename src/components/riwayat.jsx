async function ambilRiwayatUntukGrafik() {
  const { data, error } = await supabase
    .from('riwayat_asesmen')
    .select('bmi, created_at')
    .order('created_at', { ascending: true });
  // Karena RLS aktif, otomatis cuma dapat riwayat milik user yang sedang login

  if (error) {
    console.error(error);
    return [];
  }
  return data; // bisa langsung dipakai sebagai data grafik, misal dengan library "recharts"
}