/* ============================================================
   js/topbar.js — Logika untuk Mengupdate Topbar
   ============================================================ */

function updateTopbarUI() {
    // 1. Ambil data user yang sedang login dari state.js
    const user = MBG.currentUser;

    // Jika data user belum ada (belum login), jangan lanjut
    if (!user) {
        console.warn("Topbar: Data user tidak ditemukan.");
        return;
    }

    // 2. Hubungkan ke elemen HTML di index.html pakai ID
    const elUsername = document.getElementById('tb-username'); // Nama Panjang
    const elRoleTag  = document.getElementById('tb-role-tag'); // Kode Role (SA/AS/OP)
    const elAvatar   = document.getElementById('tb-avatar');   // Inisial (BS/SR/DP)

    // 3. Masukkan datanya ke tampilan
    
    // Update Nama (Hijau Putih)
    if (elUsername) {
        elUsername.textContent = user.name;
    }

    // Update Role Tag (Hijau Gelap)
    if (elRoleTag) {
        elRoleTag.textContent = user.roleTag;
    }

    // Update Avatar (Inisial Kotak)
    if (elAvatar) {
        elAvatar.textContent = user.initials;
        
        // Kasih warna khusus kalau Super Admin
        if (user.role === 'superadmin') {
            elAvatar.style.backgroundColor = '#f1c40f'; // Kuning
            elAvatar.style.color = '#1a3c34';         // Hijau Tua
        }
    }
    
    console.log("Topbar berhasil diupdate untuk:", user.name);
}

// Fungsi Logout
function doLogout() {
    if (confirm("Keluar dari sistem?")) {
        window.location.reload(); 
    }
}

console.log("File topbar.js siap digunakan.");