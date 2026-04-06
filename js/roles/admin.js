/* ============================================================
   js/roles/admin.js — Admin Sekolah Role Definition
   ============================================================ */

// Cukup pastikan objek MBG.roles tersedia (tanpa membuat variabel baru)
MBG.roles = MBG.roles || {};

/**
 * Definisi Role Admin Sekolah
 */
MBG.roles['admin.sekolah'] = {
  
  /* ── Identity ── */
  name:        'EVOS Fadhel', 
  label:       'Admin Sekolah',      
  roleTag:     'AS',                  
  initials:    'DEL',                  
  role:        'admin.sekolah',      

  /* ── Credentials ── */
  username:    'admin.sekolah',
  password:    'Sekolah@123',

  /* ── Behavior ── */
  landingPage: 'dashboard',          

  /* ── Authorization ── */
  allowedPages: [
    'dashboard',
    'siswa',
    'menu',
    'sekolah',
    'jadwal',
    'laporan'
  ],

  canEdit: [
    'siswa',
    'menu',
    'jadwal',
    'laporan'
  ],

  /* ── UI Extras ── */
  navBadges: {
    jadwal: '3',
  }
};

// --- BARIS MBG_ROLES DI SINI SUDAH DIHAPUS ---

console.log("Role Admin Sekolah berhasil dimuat.");