/* ============================================================
   js/roles/superadmin.js — Super Admin Role Definition
   ============================================================ */

// Cukup pastikan objek roles tersedia, jangan buat variabel baru lagi
MBG.roles.superadmin = {
  /* ── Identity ── */
  name:        '- Prince Randy :3 ',
  label:       'Super Administrator', 
  roleTag:     'SA',                  
  initials:    'RAN',
  role:        'superadmin',          

  /* ── Credentials ── */
  username:    'superadmin',
  password:    'Admin@MBG2025',

  /* ── Navigation ── */
  landingPage: 'dashboard',
  allowedPages: [
    'dashboard', 'siswa', 'menu', 'sekolah', 'jadwal', 'laporan', 'usermgmt'
  ],
  canEdit: [
    'siswa', 'menu', 'sekolah', 'jadwal', 'laporan', 'usermgmt'
  ],
  navBadges: {
    jadwal: '3',
  }
};

// BARIS MBG_ROLES DIHAPUS TOTAL AGAR TIDAK ERROR "CONSTANT VARIABLE"