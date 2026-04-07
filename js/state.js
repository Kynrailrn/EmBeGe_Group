/* ============================================================
   js/state.js — Global Application State
   ============================================================ */

const MBG = {
  /* 1. Sesi User aktif */
  currentUser: null,

  /* 2. Status login */
  isLoggedIn: false,

  /* 3. Judul Halaman */
  pageTitles: {
    dashboard: 'Dashboard',
    siswa:     'Data Siswa',
    menu:      'Data Menu',
    sekolah:   'Data Sekolah',
    jadwal:    'Jadwal Distribusi',
    laporan:   'Laporan',
    usermgmt:  'User Management',
  },

  /* 4. Registry Path HTML */
  pageFiles: {
    dashboard: 'pages/dashboard.html',
    siswa:     'pages/siswa.html',
    menu:      'pages/menu.html',
    sekolah:   'pages/sekolah.html',
    jadwal:    'pages/jadwal.html',
    laporan:   'pages/laporan.html',
    usermgmt:  'pages/usermgmt.html',
  },

  /* 5. Cache Halaman */
  loadedPages: {},

  /* 6. Mock Database User */
  userDatabase: {
    'superadmin': {
      name: 'Prince Randy',
      role: 'superadmin',
      // Memiliki 'menu' -> Bisa CRUD
      canEdit: ['dashboard', 'siswa', 'menu', 'sekolah', 'jadwal', 'laporan', 'usermgmt']
    },
    'admin.sekolah': {
      name: 'EVOS Fadhel', // Sesuaikan dengan nama di screenshot kamu
      role: 'admin.sekolah',
      // TIDAK memiliki 'menu' -> Otomatis Read-Only (Tombol tambah & aksi hilang)
      canEdit: ['dashboard', 'siswa', 'jadwal']
    },
    'operator.mbg': {
      name: 'Siti Operator',
      role: 'operator.mbg',
      canEdit: ['dashboard', 'jadwal']
    }
  },

  /* 7. Helpers */
  isSuperAdmin() { return this.currentUser?.role === 'superadmin'; },
  isAdmin() { return this.currentUser?.role === 'admin.sekolah'; },
  isOperator() { return this.currentUser?.role === 'operator.mbg'; },

  /* 8. Role Registry */
  roles: {} 
};

const MBG_ROLES = MBG.roles;
console.log("State MBG diinisialisasi.");