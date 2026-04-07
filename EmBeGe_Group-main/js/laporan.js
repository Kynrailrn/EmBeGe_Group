// js/laporan.js
var API_LAPORAN = 'http://localhost:3000/api/laporan';

// Gunakan 'window.' agar fungsi ini bisa dipanggil dari dalam file HTML manapun
window.fetchLaporan = async function() {
    try {
        const res = await fetch('http://localhost:3000/api/laporan');
        const data = await res.json();
        const tableBody = document.getElementById('table-laporan-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = data.map(repo => `
            <tr style="${repo.is_emergency ? 'background:#fff1f2;' : ''}">
                <td>${repo.tanggal}</td>
                <td><strong>${repo.nama_sekolah}</strong></td>
                <td>${repo.rating} ⭐</td>
                <td>${repo.komentar || '-'}</td>
                <td>${repo.foto_bukti ? 'Ada' : '-'}</td>
                <td>${repo.status}</td>
            </tr>
        `).join('');

        if (document.getElementById('stat-emergency')) {
            document.getElementById('stat-emergency').innerText = data.filter(d => d.is_emergency).length;
        }
    } catch (e) { console.error("Gagal muat tabel:", e); }
};

window.sendLaporan = async function(event) {
    if (event) event.preventDefault(); 
    
    const formData = new FormData();
    formData.append('tanggal', document.getElementById('lp-tgl').value);
    formData.append('nama_sekolah', document.getElementById('lp-sekolah').value);
    formData.append('jumlah_porsi', document.getElementById('lp-porsi').value);
    formData.append('komentar', document.getElementById('lp-komentar').value);
    formData.append('rating', document.querySelector('input[name="rating"]:checked')?.value || 5);
    
    const fileInput = document.getElementById('lp-foto');
    if (fileInput.files[0]) formData.append('foto', fileInput.files[0]);

    try {
        const res = await fetch(API_LAPORAN, { method: 'POST', body: formData });
        if (res.ok) {
            alert("✅ Laporan Berhasil!");
            closeLaporanModal(); 
            window.fetchLaporan(); // Panggil ulang tabel
        }
    } catch (error) { alert("Gagal koneksi!"); }
};
window.openLaporanModal = function() {
    const m = document.getElementById('modal-laporan');
    if(m) m.style.display = 'flex';
}

window.closeLaporanModal = function() {
    const m = document.getElementById('modal-laporan');
    if(m) m.style.display = 'none';
};