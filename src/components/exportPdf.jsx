import jsPDF from 'jspdf';

export function exportHasilKePDF(macroTarget, rekomendasi) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Hasil Asesmen SehatIn', 10, 15);
  doc.setFontSize(11);
  doc.text(`Target Kalori: ${macroTarget.calorie_target} kkal`, 10, 30);
  doc.text(`Protein: ${macroTarget.protein_g}g | Karbohidrat: ${macroTarget.carbs_g}g | Lemak: ${macroTarget.fat_g}g`, 10, 40);
  doc.text(`Serat: ${macroTarget.fiber_g}g | Gula Maks: ${macroTarget.sugar_max_g}g | Air: ${macroTarget.water_liter}L`, 10, 50);
  doc.text(`BMI: ${macroTarget.bmi} | TDEE: ${macroTarget.tdee} kkal`, 10, 60);

  let y = 75;
  if (rekomendasi && rekomendasi.length > 0) {
    doc.text('Rekomendasi Makanan:', 10, y);
    y += 10;
    rekomendasi.forEach((r) => {
      doc.text(`- ${r.food_name} (${r.portion}): ${r.kalori}kkal, P${r.protein_g}g, KH${r.carbs_g}g, L${r.lemak_g}g`, 10, y);
      y += 8;
    });
    y += 5;
  }

  doc.text('Catatan: Ini bukan diagnosis medis. Konsultasikan ke tenaga', 10, y);
  doc.text('kesehatan profesional untuk penanganan lebih lanjut.', 10, y + 7);
  doc.save('hasil-asesmen-sehatin.pdf');
}
