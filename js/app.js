/* ============================================================
   js/app.js — App Orchestrator
   Dipanggil setelah login untuk menghubungkan semua komponen.
   ============================================================ */

/**
 * Menghubungkan sesi user ke semua elemen UI (Topbar & Sidebar).
 * Dipanggil di akhir fungsi doLogin() pada login.js
 */
function applyUser() {
  // Update UI Sidebar (Menu & Profil)
  if (typeof updateSidebarUI === 'function') {
    updateSidebarUI(); 
  } else {
    // Fallback jika nama fungsinya berbeda
    updateSidebarUser();
    updateSidebarForRole();
  }

  // Update UI Topbar (Nama & Avatar kanan atas)
  if (typeof updateTopbarUI === 'function') {
    updateTopbarUI();
  }
}

/**
 * Penegakan Izin (Enforcement)
 * Dipanggil setiap kali halaman baru selesai di-load di sidebar.js
 */
function applyPagePermissions(pageKey) {
  const u = MBG.currentUser;
  if (!u) return;

  const canEditList = u.canEdit || [];
  const isEditable = canEditList.includes(pageKey);

  // 1. Notice Read-only (Gembok Kuning)
  const notice = document.querySelector(`#page-${pageKey} .readonly-notice`);
  if (notice) {
    // Tampilkan jika TIDAK bisa edit
    notice.style.display = isEditable ? 'none' : 'flex';
  }

  // 2. Tombol Tambah Data
  const addBtn = document.querySelector(`#page-${pageKey} .btn-add-record`);
  if (addBtn) {
    addBtn.style.display = isEditable ? 'block' : 'none';
  }

  // 3. Kolom Aksi di Tabel (Edit/Hapus)
  // Menyembunyikan seluruh kolom aksi jika role tidak punya izin edit
  const actionCols = document.querySelectorAll(`#page-${pageKey} .action-col`);
  actionCols.forEach(col => {
    col.style.display = isEditable ? '' : 'none';
  });

  // 4. Khusus Dashboard: Pasang Banner Role
  if (pageKey === 'dashboard') {
    injectRoleBanner();
  }
}

/**
 * Menyisipkan banner informasi role di bagian paling atas Dashboard.
 */
function injectRoleBanner() {
  const dashPage = document.getElementById('page-dashboard');
  if (!dashPage || dashPage.querySelector('.role-banner')) return;

  const u = MBG.currentUser;
  const roleKey = u.role;

  // Mapping Icon & Pesan (Sesuaikan dengan role key di state.js)
  const icons = { 
    'superadmin': '👑', 
    'admin.sekolah': '🏫', 
    'operator.mbg': '🚚' 
  };
  
  const msgs = {
    'superadmin': 'Anda masuk sebagai <strong>Super Admin</strong>. Akses penuh ke semua modul sistem.',
    'admin.sekolah': 'Anda masuk sebagai <strong>Admin Sekolah</strong>. Beberapa data bersifat hanya-baca.',
    'operator.mbg': 'Anda masuk sebagai <strong>Operator</strong>. Fokus utama pada manajemen Jadwal Distribusi.',
  };

  const banner = document.createElement('div');
  // Styling banner langsung via JS agar aman
  banner.className = `role-banner ${roleKey}`;
  banner.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    color: white;
    font-size: 13px;
    margin-bottom: 20px;
  `;

  banner.innerHTML = `
    <span style="font-size: 20px;">${icons[roleKey] || '👤'}</span>
    <span>${msgs[roleKey] || 'Selamat datang di sistem MBG.'}</span>
  `;

  // Masukkan di urutan pertama (paling atas) di dashboard
  dashPage.insertBefore(banner, dashPage.firstChild);
}

// Inisialisasi event global (jika diperlukan)
document.addEventListener('DOMContentLoaded', () => {
  console.log("MBG Application Orchestrator Ready.");
});

// Memastikan Topbar terisi saat pertama kali masuk Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (MBG.isLoggedIn && typeof updateTopbarUI === 'function') {
        updateTopbarUI();
    }
});