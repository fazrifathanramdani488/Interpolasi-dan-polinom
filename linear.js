/**
 * Fungsi untuk menghitung Interpolasi Lanjar (Linear Interpolation)
 * Fungsi ini diexport agar bisa digunakan oleh file lain (seperti script.js)
 * * @param {number} x  - Nilai x yang ingin dicari nilai y-nya
 * @param {number} x0 - Koordinat x dari titik pertama (titik bawah)
 * @param {number} y0 - Koordinat y dari titik pertama (titik bawah)
 * @param {number} x1 - Koordinat x dari titik kedua (titik atas)
 * @param {number} y1 - Koordinat y dari titik kedua (titik atas)
 * @returns {number|null} - Hasil nilai y hasil interpolasi, atau null jika terjadi error
 */
export function interpolasiLanjar(x, x0, y0, x1, y1) {
    // KETERANGAN MODIFIKASI: 
    // Validasi ini mencegah pembagian dengan nol jika pengguna memasukkan nilai x0 dan x1 yang sama.
    // Jika di aplikasi web kamu ingin memunculkan alert ke user, bagian ini bisa kamu sesuaikan.
    if (x1 === x0) {
        console.error("Error (Linear): Nilai x1 dan x0 tidak boleh sama karena menyebabkan pembagian dengan nol.");
        return null;
    }

    // KETERANGAN RUMUS:
    // Rumus dasar: y = y0 + ((x - x0) * (y1 - y0)) / (x1 - x0)
    // Kamu bisa mengubah rumus ini jika ingin menambahkan pembulatan angka, 
    // misalnya dengan menambahkan `.toFixed(2)` di akhir hasil jika ingin 2 angka di belakang koma.
    const hasilY = y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
    
    return hasilY;
}