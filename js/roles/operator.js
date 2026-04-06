/* ============================================================
   js/roles/operator.js — Operator Role Definition
   ============================================================ */

// Pastikan objek MBG.roles tersedia tanpa mendeklarasikan variabel baru
MBG.roles = MBG.roles || {};

/**
 * Definisi Role Operator
 */
MBG.roles['operator.mbg'] = {
  
  /* ── Identity ── */
  name:        'RRQ Jonathan',    
  label:       'Operator Lapangan', 
  roleTag:     'OP',               
  initials:    'JHR',               
  role:        'operator.mbg',     

  /* ── Credentials ── */
  username:    'operator.mbg',
  password:    'Operator@456',

  /* ── Behavior ── */
  landingPage: 'jadwal', 

  /* ── Authorization ── */
  allowedPages: [
    'dashboard',
    'siswa',
    'menu',
    'sekolah',
    'jadwal',
    'laporan',
  ],

  canEdit: [
    'jadwal',
  ],

  /* ── UI Extras ── */
  navBadges: {
    jadwal: '3',
  }
};

// --- BARIS MBG_ROLES DI SINI SUDAH DIHAPUS TOTAL ---

console.log("Role Operator Lapangan berhasil dimuat.");