const foodData = [
  // Protein Hewani
  { nama: 'Dada Ayam', kategori: 'protein', kalori: 165, protein_g: 31, carbs_g: 0, lemak_g: 3.6, serat_g: 0, satuan: '100g' },
  { nama: 'Paha Ayam', kategori: 'protein', kalori: 209, protein_g: 26, carbs_g: 0, lemak_g: 11, serat_g: 0, satuan: '100g' },
  { nama: 'Telur Ayam', kategori: 'protein', kalori: 155, protein_g: 13, carbs_g: 1.1, lemak_g: 11, serat_g: 0, satuan: '2 butir' },
  { nama: 'Ikan Tuna', kategori: 'protein', kalori: 130, protein_g: 28, carbs_g: 0, lemak_g: 1.4, serat_g: 0, satuan: '100g' },
  { nama: 'Ikan Salmon', kategori: 'protein', kalori: 208, protein_g: 20, carbs_g: 0, lemak_g: 13, serat_g: 0, satuan: '100g' },
  { nama: 'Ikan Kembung', kategori: 'protein', kalori: 167, protein_g: 22, carbs_g: 0, lemak_g: 8.5, serat_g: 0, satuan: '100g' },
  { nama: 'Udang', kategori: 'protein', kalori: 99, protein_g: 24, carbs_g: 0.2, lemak_g: 0.3, serat_g: 0, satuan: '100g' },
  { nama: 'Daging Sapi', kategori: 'protein', kalori: 250, protein_g: 26, carbs_g: 0, lemak_g: 15, serat_g: 0, satuan: '100g' },
  { nama: 'Sosis Ayam', kategori: 'protein', kalori: 220, protein_g: 14, carbs_g: 5, lemak_g: 17, serat_g: 0, satuan: '100g' },

  // Protein Nabati
  { nama: 'Tempe', kategori: 'protein', kalori: 193, protein_g: 20, carbs_g: 9, lemak_g: 11, serat_g: 1.4, satuan: '100g' },
  { nama: 'Tahu', kategori: 'protein', kalori: 76, protein_g: 8, carbs_g: 1.9, lemak_g: 4.7, serat_g: 0.3, satuan: '100g' },
  { nama: 'Edamame', kategori: 'protein', kalori: 122, protein_g: 12, carbs_g: 10, lemak_g: 5, serat_g: 5.2, satuan: '100g' },
  { nama: 'Kacang Merah', kategori: 'protein', kalori: 139, protein_g: 9, carbs_g: 25, lemak_g: 0.5, serat_g: 6.4, satuan: '100g' },
  { nama: 'Kacang Hijau', kategori: 'protein', kalori: 347, protein_g: 24, carbs_g: 63, lemak_g: 1.2, serat_g: 7.6, satuan: '100g' },
  { nama: 'Kacang Almond', kategori: 'protein', kalori: 579, protein_g: 21, carbs_g: 22, lemak_g: 50, serat_g: 12.5, satuan: '30g' },

  // Karbohidrat
  { nama: 'Nasi Putih', kategori: 'karbohidrat', kalori: 130, protein_g: 2.7, carbs_g: 28, lemak_g: 0.3, serat_g: 0.4, satuan: '100g' },
  { nama: 'Nasi Merah', kategori: 'karbohidrat', kalori: 123, protein_g: 2.7, carbs_g: 26, lemak_g: 0.8, serat_g: 1.8, satuan: '100g' },
  { nama: 'Kentang', kategori: 'karbohidrat', kalori: 77, protein_g: 2, carbs_g: 17, lemak_g: 0.1, serat_g: 2.2, satuan: '100g' },
  { nama: 'Ubi Jalar', kategori: 'karbohidrat', kalori: 86, protein_g: 1.6, carbs_g: 20, lemak_g: 0.1, serat_g: 3, satuan: '100g' },
  { nama: 'Singkong', kategori: 'karbohidrat', kalori: 160, protein_g: 1.4, carbs_g: 38, lemak_g: 0.3, serat_g: 1.8, satuan: '100g' },
  { nama: 'Jagung', kategori: 'karbohidrat', kalori: 96, protein_g: 3.4, carbs_g: 21, lemak_g: 1.5, serat_g: 2.4, satuan: '100g' },
  { nama: 'Pasta Gandum', kategori: 'karbohidrat', kalori: 158, protein_g: 5.8, carbs_g: 31, lemak_g: 1.1, serat_g: 3.7, satuan: '100g' },
  { nama: 'Oatmeal', kategori: 'karbohidrat', kalori: 389, protein_g: 17, carbs_g: 66, lemak_g: 7, serat_g: 10, satuan: '50g' },
  { nama: 'Roti Gandum', kategori: 'karbohidrat', kalori: 247, protein_g: 13, carbs_g: 41, lemak_g: 3.4, serat_g: 7, satuan: '2 iris' },
  { nama: 'Mie Instan', kategori: 'karbohidrat', kalori: 386, protein_g: 8, carbs_g: 52, lemak_g: 17, serat_g: 0, satuan: '1 bungkus' },

  // Sayuran
  { nama: 'Brokoli', kategori: 'sayuran', kalori: 34, protein_g: 2.8, carbs_g: 7, lemak_g: 0.4, serat_g: 2.6, satuan: '100g' },
  { nama: 'Bayam', kategori: 'sayuran', kalori: 23, protein_g: 2.9, carbs_g: 3.6, lemak_g: 0.4, serat_g: 2.2, satuan: '100g' },
  { nama: 'Kangkung', kategori: 'sayuran', kalori: 19, protein_g: 2.5, carbs_g: 3.1, lemak_g: 0.3, serat_g: 2, satuan: '100g' },
  { nama: 'Tomat', kategori: 'sayuran', kalori: 18, protein_g: 0.9, carbs_g: 3.9, lemak_g: 0.2, serat_g: 1.2, satuan: '100g' },
  { nama: 'Wortel', kategori: 'sayuran', kalori: 41, protein_g: 0.9, carbs_g: 10, lemak_g: 0.2, serat_g: 2.8, satuan: '100g' },
  { nama: 'Kol', kategori: 'sayuran', kalori: 25, protein_g: 1.3, carbs_g: 5.8, lemak_g: 0.1, serat_g: 2.5, satuan: '100g' },
  { nama: 'Sawi Hijau', kategori: 'sayuran', kalori: 22, protein_g: 2.6, carbs_g: 4.1, lemak_g: 0.3, serat_g: 1.9, satuan: '100g' },
  { nama: 'Timun', kategori: 'sayuran', kalori: 15, protein_g: 0.7, carbs_g: 3.6, lemak_g: 0.1, serat_g: 0.5, satuan: '100g' },
  { nama: 'Terong', kategori: 'sayuran', kalori: 25, protein_g: 1, carbs_g: 6, lemak_g: 0.2, serat_g: 3, satuan: '100g' },
  { nama: 'Buncis', kategori: 'sayuran', kalori: 31, protein_g: 1.8, carbs_g: 7, lemak_g: 0.2, serat_g: 2.7, satuan: '100g' },
  { nama: 'Labu Siam', kategori: 'sayuran', kalori: 19, protein_g: 0.8, carbs_g: 4.1, lemak_g: 0.1, serat_g: 1.1, satuan: '100g' },
  { nama: 'Paprika Merah', kategori: 'sayuran', kalori: 31, protein_g: 1, carbs_g: 6, lemak_g: 0.3, serat_g: 2.1, satuan: '100g' },
  { nama: 'Jamur Tiram', kategori: 'sayuran', kalori: 33, protein_g: 3.3, carbs_g: 6, lemak_g: 0.4, serat_g: 2.3, satuan: '100g' },

  // Buah
  { nama: 'Pisang', kategori: 'buah', kalori: 89, protein_g: 1.1, carbs_g: 23, lemak_g: 0.3, serat_g: 2.6, satuan: '1 buah' },
  { nama: 'Apel', kategori: 'buah', kalori: 52, protein_g: 0.3, carbs_g: 14, lemak_g: 0.2, serat_g: 2.4, satuan: '1 buah' },
  { nama: 'Jeruk', kategori: 'buah', kalori: 47, protein_g: 0.9, carbs_g: 12, lemak_g: 0.1, serat_g: 2.4, satuan: '1 buah' },
  { nama: 'Alpukat', kategori: 'buah', kalori: 160, protein_g: 2, carbs_g: 8.5, lemak_g: 15, serat_g: 6.7, satuan: '100g' },
  { nama: 'Semangka', kategori: 'buah', kalori: 30, protein_g: 0.6, carbs_g: 8, lemak_g: 0.2, serat_g: 0.4, satuan: '100g' },
  { nama: 'Pepaya', kategori: 'buah', kalori: 43, protein_g: 0.5, carbs_g: 11, lemak_g: 0.1, serat_g: 1.7, satuan: '100g' },
  { nama: 'Mangga', kategori: 'buah', kalori: 60, protein_g: 0.8, carbs_g: 15, lemak_g: 0.4, serat_g: 1.6, satuan: '100g' },
  { nama: 'Anggur', kategori: 'buah', kalori: 69, protein_g: 0.7, carbs_g: 18, lemak_g: 0.2, serat_g: 0.9, satuan: '100g' },

  // Lemak & Bumbu
  { nama: 'Minyak Zaitun', kategori: 'lemak', kalori: 884, protein_g: 0, carbs_g: 0, lemak_g: 100, serat_g: 0, satuan: '15ml' },
  { nama: 'Minyak Goreng', kategori: 'lemak', kalori: 884, protein_g: 0, carbs_g: 0, lemak_g: 100, serat_g: 0, satuan: '15ml' },
  { nama: 'Mentega', kategori: 'lemak', kalori: 717, protein_g: 0.9, carbs_g: 0.1, lemak_g: 81, serat_g: 0, satuan: '15g' },
  { nama: 'Selai Kacang', kategori: 'lemak', kalori: 588, protein_g: 25, carbs_g: 20, lemak_g: 50, serat_g: 6, satuan: '30g' },

  // Susu & Olahan
  { nama: 'Susu UHT', kategori: 'susu', kalori: 61, protein_g: 3.3, carbs_g: 4.8, lemak_g: 3.3, serat_g: 0, satuan: '250ml' },
  { nama: 'Yogurt Greek', kategori: 'susu', kalori: 97, protein_g: 9, carbs_g: 4, lemak_g: 5, serat_g: 0, satuan: '100g' },
  { nama: 'Keju Cheddar', kategori: 'susu', kalori: 403, protein_g: 25, carbs_g: 1.3, lemak_g: 33, serat_g: 0, satuan: '30g' },
  { nama: 'Susu Almond', kategori: 'susu', kalori: 17, protein_g: 0.6, carbs_g: 0.2, lemak_g: 1.1, serat_g: 0, satuan: '250ml' },

  // Minuman
  { nama: 'Air Putih', kategori: 'minuman', kalori: 0, protein_g: 0, carbs_g: 0, lemak_g: 0, serat_g: 0, satuan: '250ml' },
  { nama: 'Kopi Hitam', kategori: 'minuman', kalori: 2, protein_g: 0.3, carbs_g: 0, lemak_g: 0, serat_g: 0, satuan: '250ml' },
  { nama: 'Teh Tawar', kategori: 'minuman', kalori: 1, protein_g: 0, carbs_g: 0.2, lemak_g: 0, serat_g: 0, satuan: '250ml' },
  { nama: 'Jus Jeruk', kategori: 'minuman', kalori: 45, protein_g: 0.7, carbs_g: 10, lemak_g: 0.2, serat_g: 0.2, satuan: '250ml' },
]

export default foodData

export const kategoriWarna = {
  protein: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-300', label: 'Protein' },
  karbohidrat: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-300', label: 'Karbohidrat' },
  sayuran: { bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-700 dark:text-green-300', label: 'Sayuran' },
  buah: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-700 dark:text-orange-300', label: 'Buah' },
  lemak: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300', label: 'Lemak' },
  susu: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', label: 'Susu' },
  minuman: { bg: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-300', label: 'Minuman' },
}
