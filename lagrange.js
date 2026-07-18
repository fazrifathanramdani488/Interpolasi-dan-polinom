function prosesLagrange(X, Y, xTarget, n) {
    let hasilAkhirY = 0;
    let langkahTeks = "";
    let hasilLi = []; // Untuk menyimpan nilai L_i yang sudah dihitung

    // 1. MENGHITUNG DAN MENYUSUN DETAIL LANGKAH UNTUK SETIAP L_i(x)
    for (let i = 0; i < n; i++) {
        let pembilangNilai = 1;
        let penyebutNilai = 1;
        
        let teksRumusAtas = "";
        let teksRumusBawah = "";
        let teksSubstitusiAtas = "";
        let teksSubstitusiBawah = "";
        let teksHasilKurangAtas = "";
        let teksHasilKurangBawah = "";

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                pembilangNilai *= (xTarget - X[j]);
                penyebutNilai *= (X[i] - X[j]);

                // Menyusun string teks rumus (ex: (x - x1))
                teksRumusAtas += `(x - x${j})`;
                teksRumusBawah += `(x${i} - x${j})`;

                // Menyusun string substitusi angka (ex: (1966 - 1965))
                teksSubstitusiAtas += `(${xTarget} - ${X[j]})`;
                teksSubstitusiBawah += `(${X[i]} - ${X[j]})`;

                // Menyusun string hasil pengurangan awal (ex: (6)(1)(-4))
                teksHasilKurangAtas += `(${(xTarget - X[j])})`;
                teksHasilKurangBawah += `(${(X[i] - X[j])})`;
            }
        }

        let nilaiLi = pembilangNilai / penyebutNilai;
        hasilLi.push(nilaiLi); // Simpan untuk kalkulasi Pn(x) nanti
        hasilAkhirY += nilaiLi * Y[i];

        // Menggabungkan teks langkah per L_i sesuai format gambar
        langkahTeks += `Hitung L${i}(x) :\n`;
        langkahTeks += `L${i}(x) = (${teksRumusAtas}) / (${teksRumusBawah})\n`;
        langkahTeks += `L${i}(${xTarget}) = (${teksSubstitusiAtas}) / (${teksSubstitusiBawah})\n`;
        langkahTeks += `= (${teksHasilKurangAtas}) / (${teksHasilKurangBawah})\n`;
        langkahTeks += `= ${pembilangNilai} / ${penyebutNilai}\n`;
        langkahTeks += `= ${nilaiLi.toFixed(2).replace('.', ',')}\n\n`;
    }

    // 2. MENGHITUNG NILAI INTERPOLASI AKHIR (P_n)
    langkahTeks += `Menghitung Nilai Interpolasi :\n`;
    
    // Baris Pn(x) dengan simbol L_i
    let barisP3Simbol = `P${n-1}(${xTarget}) = ` + Y.map((yVal, i) => `${yVal.toFixed(1).replace('.', ',')}L${i}(${xTarget})`).join(" + ");
    langkahTeks += barisP3Simbol + "\n";

    // Baris substitusi nilai L_i ke rumus Pn
    let barisP3Angka = `= ` + Y.map((yVal, i) => `${yVal.toFixed(1).replace('.', ',')}(${hasilLi[i].toFixed(2).replace('.', ',')})`).join(" + ");
    langkahTeks += barisP3Angka + "\n";

    // Baris hasil perkalian tiap suku
    let barisP3Perkalian = `= ` + Y.map((yVal, i) => `${(yVal * hasilLi[i]).toFixed(3).replace('.', ',')}`).join(" + ");
    langkahTeks += barisP3Perkalian + "\n";

    // Hasil Akhir
    langkahTeks += `= ${hasilAkhirY.toFixed(2).replace('.', ',')}\n\n`;
    langkahTeks += `Jadi, perkiraan nilai pada tahun ${xTarget} adalah ${hasilAkhirY.toFixed(2).replace('.', ',')}.`;

    // 3. MENAMPILKAN KE LAYAR WEB
    document.getElementById("output-y-polinom").innerText = `P_${n-1}(${xTarget}) = ${hasilAkhirY.toFixed(4)}`;
    document.getElementById("langkah-polinom").innerText = langkahTeks;
}