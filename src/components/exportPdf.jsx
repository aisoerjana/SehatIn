import jsPDF from 'jspdf';

function exportHasilKePDF(hasilRekomendasi) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Hasil Asesmen SehatIn', 10, 15);
  doc.setFontSize(11);
  doc.text(`Bahan makanan: ${hasilRekomendasi.bahan.join(', ')}`, 10, 30);
  doc.text(`Estimasi harga: Rp${hasilRekomendasi.estimasi_total_harga}`, 10, 40);
  doc.text(`Saran menu: ${hasilRekomendasi.saran_menu}`, 10, 50);
  doc.text('Catatan: Ini bukan diagnosis medis. Konsultasikan ke tenaga', 10, 65);
  doc.text('kesehatan profesional untuk penanganan lebih lanjut.', 10, 72);
  doc.save('hasil-asesmen-sehatin.pdf');
}