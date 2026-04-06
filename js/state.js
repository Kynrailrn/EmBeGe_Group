/* ============================================================
   js/state.js — Global Application State
   Single source of truth. Dimuat paling pertama di index.html.
   ============================================================ */

const MBG = {

  /* 1. Sesi User yang sedang aktif (diisi saat login berhasil) */
  currentUser: null,

  /* 2. Status login untuk proteksi navigasi sederhana */
  isLoggedIn: false,

  /* 3. Judul Halaman yang akan muncul di Topbar & Breadcrumb */
  pageTitles: {
    dashboard: 'Dashboard',
    siswa:     'Data Siswa',
    menu:      'Data Menu',
    sekolah:   'Data Sekolah',
    jadwal:    'Jadwal Distribusi',
    laporan:   'Laporan',
    usermgmt:  'User Management',
  },

  /* 4. Registry Path file HTML untuk Lazy-Loading (fetch) */
  pageFiles: {
    dashboard: 'pages/dashboard.html',
    siswa:     'pages/siswa.html',
    menu:      'pages/menu.html',
    sekolah:   'pages/sekolah.html',
    jadwal:    'pages/jadwal.html',
    laporan:   'pages/laporan.html',
    usermgmt:  'pages/usermgmt.html',
  },

  /* 5. Cache untuk menyimpan halaman yang sudah di-load agar tidak fetch ulang */
  loadedPages: {},

  /* 6. Helpers: Fungsi pengecekan Role agar kode di file lain lebih bersih */
  isSuperAdmin() { 
    return this.currentUser?.role === 'superadmin'; 
  },
  
  isAdmin() { 
    // Sesuaikan string 'admin.sekolah' dengan role key di file admin.js
    return this.currentUser?.role === 'admin.sekolah'; 
  },
  
  isOperator() { 
    // Sesuaikan string 'operator.mbg' dengan role key di file operator.js
    return this.currentUser?.role === 'operator.mbg'; 
  },

  /* 7. Role Registry: Wadah penampung data dari folder js/roles/ */
  roles: {} 
};

/**
 * Global Alias: MBG_ROLES
 * Digunakan agar file js/roles/superadmin.js dkk bisa langsung 
 * mengisi data tanpa merusak struktur objek MBG.
 */
const MBG_ROLES = MBG.roles;

// Console log untuk memastikan state sudah siap
console.log("State MBG diinisialisasi.");