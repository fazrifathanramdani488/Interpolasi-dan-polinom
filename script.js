/* =========================================================================
   1. INISIALISASI & EVENT LISTENER (PENGGERAK UTAMA)
   ========================================================================= */

// Keterangan: Menunggu seluruh halaman HTML selesai dimuat sebelum menjalankan fungsi di dalamnya
document.addEventListener("DOMContentLoaded", function() {
    
    // Event Listener untuk Interpolasi Lanjar
    document.getElementById("btn-hitung-lanjar").addEventListener("click", hitungInterpolasiLanjar);
    
    // Event Listener untuk mengatur jumlah baris tabel Polinom
    document.getElementById("btn-generate-titik").addEventListener("click", aturBarisTabelPolinom);
    
    // Event Listener untuk Interpolasi Polinom
    document.getElementById("btn-hitung-polinom").addEventListener("click", hitungInterpolasiPolinom);
});


/* =========================================================================
   2. LOGIKA INTERPOLASI LANJAR (LINIER)
   ========================================================================= */
function hitungInterpolasiLanjar() {
    // Keterangan: Mengambil nilai input dari form Lanjar dan mengubahnya menjadi tipe angka (Float)
    const x0 = parseFloat(document.getElementById("x0").value);
    const y0 = parseFloat(document.getElementById("y0").value);
    const x1 = parseFloat(document.getElementById("x1").value);
    const y1 = parseFloat(document.getElementById("y1").value);
    const xTarget = parseFloat(document.getElementById("x-target-lanjar").value);

    // Validasi: Memastikan semua input telah diisi dengan benar
    if (isNaN(x0) || !isNaN(x0) && (isNaN(y0) || isNaN(x1) || isNaN(y1) || isNaN(xTarget))) {
        alert("Mohon isi semua data koordinat titik lanjar dengan benar!");
        return;
    }

    // Validasi matematika: Menghindari pembagian dengan nol jika x0 sama dengan x1
    if (x1 === x0) {
        alert("Nilai x1 tidak boleh sama dengan x0 karena akan menyebabkan pembagian dengan nol.");
        return;
    }

    // RUMUS UTAMA INTERPOLASI LANJAR: y = y0 + ((y1 - y0) / (x1 - x0)) * (xTarget - x0)
    const hasilY = y0 + ((y1 - y0) / (x1 - x0)) * (xTarget - x0);

    // Keterangan: Menampilkan hasil ke layar HTML dengan batas maksimal 4 angka di belakang koma
    document.getElementById("output-y-lanjar").innerText = hasilY.toFixed(4);

    // Keterangan: Menyusun teks langkah pengerjaan/rumus agar user paham cara hitungnya
    const teksLangkah = `Langkah Penyelesaian:
1. Gunakan Rumus Linier: P1(x) = y0 + [(y1 - y0) / (x1 - x0)] * (x - x0)
2. Masukkan Nilai: 
   P1(${xTarget}) = ${y0} + [(${y1} - ${y0}) / (${x1} - ${x0})] * (${xTarget} - ${x0})
   P1(${xTarget}) = ${y0} + [${(y1 - y0).toFixed(2)} / ${(x1 - x0).toFixed(2)}] * ${(xTarget - x0).toFixed(2)}
   P1(${xTarget}) = ${y0} + [${((y1 - y0) / (x1 - x0)).toFixed(4)}] * ${(xTarget - x0).toFixed(2)}
   P1(${xTarget}) = ${hasilY.toFixed(4)}`;

    document.getElementById("langkah-lanjar").innerText = teksLangkah;
}


/* =========================================================================
   3. LOGIKA DINAMIS TABEL POLINOM
   ========================================================================= */
function aturBarisTabelPolinom() {
    // Keterangan: Membaca jumlah baris yang diinginkan user dari input HTML
    const jumlahTitik = parseInt(document.getElementById("jumlah-titik").value);
    const tbody = document.getElementById("body-tabel-polinom");
    
    // Batasi jumlah baris minimal 3 dan maksimal 10 agar performa web dan tampilan tetap ideal
    if (jumlahTitik < 3 || jumlahTitik > 10 || isNaN(jumlahTitik)) {
        alert("Jumlah titik data minimal 3 dan maksimal 10!");
        return;
    }

    // Bersihkan isi tabel lama terlebih dahulu
    tbody.innerHTML = "";

    // Keterangan: Melakukan perulangan untuk membuat baris (tr) dan kolom (td) input baru
    for (let i = 0; i < jumlahTitik; i++) {
        const barisBaru = document.createElement("tr");

        barisBaru.innerHTML = `
            <td>${i}</td>
            <td><input type="number" class="polinom-x" required placeholder="x${i}" step="any"></td>
            <td><input type="number" class="polinom-y" required placeholder="y${i}" step="any"></td>
        `;
        tbody.appendChild(barisBaru);
    }
}


/* =========================================================================
   4. LOGIKA INTERPOLASI POLINOM (LAGRANGE & NEWTON)
   ========================================================================= */
function hitungInterpolasiPolinom() {
    // Keterangan: Mengumpulkan seluruh nilai X dan Y dari baris tabel menggunakan querySelectorAll
    const inputXElements = document.querySelectorAll(".polinom-x");
    const inputYElements = document.querySelectorAll(".polinom-y");
    const xTarget = parseFloat(document.getElementById("x-target-polinom").value);
    const metode = document.getElementById("metode-polinom").value;

    if (isNaN(xTarget)) {
        alert("Mohon isi nilai x yang dicari terlebih dahulu!");
        return;
    }

    let arrayX = [];
    let arrayY = [];
    const n = inputXElements.length;

    // Memasukkan data dari elemen input ke dalam struktur Array JS
    for (let i = 0; i < n; i++) {
        const nilaiX = parseFloat(inputXElements[i].value);
        const nilaiY = parseFloat(inputYElements[i].value);

        if (isNaN(nilaiX) || isNaN(nilaiY)) {
            alert(`Mohon lengkapi data titik ke-${i} pada tabel!`);
            return;
        }
        arrayX.push(nilaiX);
        arrayY.push(nilaiY);
    }

    // Eksekusi berdasarkan metode pilihan user
    if (metode === "lagrange") {
        prosesLagrange(arrayX, arrayY, xTarget, n);
    } else if (metode === "newton") {
        prosesNewton(arrayX, arrayY, xTarget, n);
    }
}

// --- SUB-METODE A: LAGRANGE ---
function prosesLagrange(X, Y, xTarget, n) {
    let hasilAkhirY = 0;
    let teksLangkah = `Metode: Polinom Lagrange Derajat ${n-1}\n\nLangkah-langkah:\n`;

    // Rumus Lagrange: P(x) = Σ (Li(x) * Yi)
    for (let i = 0; i < n; i++) {
        let Li = 1;
        let teksLiAtas = "";
        let teksLiBawah = "";

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                Li *= (xTarget - X[j]) / (X[i] - X[j]);
                teksLiAtas += `(${xTarget} - ${X[j]})`;
                teksLiBawah += `(${X[i]} - ${X[j]})`;
            }
        }
        hasilAkhirY += Li * Y[i];
        teksLangkah += `L${i}(x) = [ ${teksLiAtas} ] / [ ${teksLiBawah} ] = ${Li.toFixed(4)}\n`;
    }

    teksLangkah += `\nHasil Akhir P(${xTarget}) = ` + Y.map((yVal, i) => `(${yVal} * L${i})`).join(" + ") + ` = ${hasilAkhirY.toFixed(4)}`;
    
    // Tampilkan ke halaman HTML
    document.getElementById("output-y-polinom").innerText = hasilAkhirY.toFixed(4);
    document.getElementById("langkah-polinom").innerText = teksLangkah;
}

// --- SUB-METODE B: NEWTON DIVIDED DIFFERENCES ---
function prosesNewton(X, Y, xTarget, n) {
    // Membuat matriks/tabel ST (Selisih Terbagi) ukuran n x n bergaya dinamis
    let ST = Array.from(Array(n), () => Array(n).fill(0));
    
    // Isi kolom pertama tabel ST dengan nilai Y
    for (let i = 0; i < n; i++) {
        ST[i][0] = Y[i];
    }

    // Proses menghitung koefisien tabel selisih terbagi
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            ST[i][j] = (ST[i+1][j-1] - ST[i][j-1]) / (X[i+j] - X[i]);
        }
    }

    // Menghitung hasil interpolasi menggunakan suku-suku Newton
    let hasilAkhirY = ST[0][0];
    let faktorX = 1;
    let teksLangkah = `Metode: Polinom Newton (Selisih Terbagi)\n\nKoefisien (b0, b1, b2, ...):\n`;

    for (let i = 0; i < n; i++) {
        teksLangkah += `b${i} = ${ST[0][i].toFixed(4)}\n`;
    }

    teksLangkah += `\nProses Hitung:\nP(x) = b0 `;
    for (let i = 1; i < n; i++) {
        faktorX *= (xTarget - X[i-1]);
        hasilAkhirY += ST[0][i] * faktorX;
        teksLangkah += `+ [b${i} * ` + X.slice(0, i).map(xVal => `(${xTarget} - ${xVal})`).join("") + `] `;
    }

    teksLangkah += `\nHasil Akhir P(${xTarget}) = ${hasilAkhirY.toFixed(4)}`;

    // Tampilkan ke halaman HTML
    document.getElementById("output-y-polinom").innerText = hasilAkhirY.toFixed(4);
    document.getElementById("langkah-polinom").innerText = teksLangkah;
}