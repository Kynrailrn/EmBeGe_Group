/* ============================================================
   js/sidebar.js — Sidebar & Navigation
   ============================================================ */

function updateSidebarUser() {
  const u = MBG.currentUser;
  if (!u) return;
  // Menyesuaikan ID dengan index.html
  const avaEl = document.getElementById('sidebar-ava');
  const nameEl = document.getElementById('sidebar-name');
  const roleEl = document.getElementById('sidebar-role');

  if (avaEl) avaEl.textContent = u.roleTag || u.initials; // Gunakan SA/OP tag jika ada
  if (nameEl) nameEl.textContent = u.name;
  if (roleEl) roleEl.textContent = u.label || u.roleName;
}

function updateSidebarUI() {
  const allowed = MBG.currentUser?.allowedPages || [];
  const rolesRegistry = MBG.roles || {};
  const roleData = rolesRegistry[MBG.currentUser?.role] || {};

  /* Show/hide nav items berdasarkan allowedPages */
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    const page = item.dataset.page;
    item.style.display = allowed.includes(page) ? 'flex' : 'none';
  });

  /* Update badges (misal angka '3' di jadwal) */
  const badges = roleData.navBadges || {};
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    const page = item.dataset.page;
    const badgeEl = item.querySelector('.nav-badge');
    if (badgeEl) {
      if (badges[page]) {
        badgeEl.textContent = badges[page];
        badgeEl.style.display = 'inline-block';
      } else {
        badgeEl.style.display = 'none';
      }
    }
  });

  // Update profil user di sidebar
  updateSidebarUser();
}

async function navigateTo(pageKey) {
  const allowed = MBG.currentUser?.allowedPages || [];
  if (!allowed.includes(pageKey)) return;

  /* Update highlight menu aktif */
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.querySelector(`.nav-item[data-page="${pageKey}"]`);
  if (navEl) navEl.classList.add('active');

  /* Update topbar Title & Breadcrumb */
  const title = MBG.pageTitles[pageKey] || pageKey;
  const tbTitle = document.getElementById('tb-title');
  const tbBread = document.getElementById('tb-breadcrumb');
  if (tbTitle) tbTitle.textContent = title;
  if (tbBread) tbBread.textContent = title;

  /* Load fragment HTML jika belum ada di cache */
  await loadPage(pageKey);

  /* Tampilkan halaman yang dipilih, sembunyikan yang lain */
  const wrap = document.getElementById('content-wrap');
  if (wrap) {
    const pages = wrap.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none'); // Sembunyikan semua
    
    const targetPage = document.getElementById('page-' + pageKey);
    if (targetPage) {
      targetPage.style.display = 'block'; // Tampilkan target
      applyPagePermissions(pageKey);
    }
  }
}

function navigate(el) {
  navigateTo(el.dataset.page);
}

async function loadPage(pageKey) {
  if (MBG.loadedPages[pageKey]) return;

  const filePath = MBG.pageFiles[pageKey];
  if (!filePath) return;

  const wrap = document.getElementById('content-wrap');

  try {
    const res = await fetch(filePath);
    const html = await res.text();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const pageContent = tempDiv.firstElementChild;
    wrap.appendChild(pageContent);

    MBG.loadedPages[pageKey] = true;
  } catch (e) {
    console.error('Gagal memuat halaman:', filePath, e);
  }
}

/**
 * Fungsi tambahan untuk mengatur tombol Edit/Tambah 
 * berdasarkan properti canEdit di role definition.
 */
function applyPagePermissions(pageKey) {
  const canEditList = MBG.currentUser?.canEdit || [];
  const hasAccess = canEditList.includes(pageKey);
  
  // Cari tombol tambah atau notice readonly di halaman yang baru di-load
  const activePage = document.getElementById('page-' + pageKey);
  if (!activePage) return;

  const addBtn = activePage.querySelector('.btn-add-record');
  const readonlyNotice = activePage.querySelector('.readonly-notice');

  if (hasAccess) {
    if (addBtn) addBtn.style.display = 'block';
    if (readonlyNotice) readonlyNotice.style.display = 'none';
  } else {
    if (addBtn) addBtn.style.display = 'none';
    if (readonlyNotice) readonlyNotice.style.display = 'flex';
    
    // Nonaktifkan tombol aksi di tabel (Edit/Hapus) jika tidak punya akses edit
    activePage.querySelectorAll('.tbl-btn.edit, .tbl-btn.del').forEach(btn => {
      btn.style.opacity = '0.5';
      btn.style.pointerEvents = 'none';
    });
  }
}