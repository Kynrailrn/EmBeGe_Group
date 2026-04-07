/* ============================================================
   js/login.js — Login Page Logic
   Role dideteksi OTOMATIS dari username + password.
   ============================================================ */

/**
 * Mencari kecocokan kredensial di dalam MBG.roles
 */
function findRoleByCredentials(username, password) {
  const rolesRegistry = MBG.roles || {}; 
  
  for (const roleKey in rolesRegistry) {
    const roleData = rolesRegistry[roleKey];
    if (roleData.username === username && roleData.password === password) {
      return { roleKey, roleData };
    }
  }
  return null;
}

/**
 * Handle submit form login
 */
function doLogin() {
  const usernameInp = document.getElementById('inp-user');
  const passwordInp = document.getElementById('inp-pass');
  
  if (!usernameInp || !passwordInp) return;

  const username = usernameInp.value.trim();
  const password = passwordInp.value;
  
  clearLoginError();

  if (!username || !password) {
    showLoginError('Username dan password wajib diisi.');
    return;
  }

  const match = findRoleByCredentials(username, password);

  if (!match) {
    showLoginError('Akun tidak ditemukan atau password salah.');
    
    const card = document.querySelector('.login-card');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth; 
      card.classList.add('shake');
    }
    return;
  }

  // 3. Simpan ke Global State MBG (HARUS DULUAN)
  const { roleKey, roleData } = match;

  MBG.currentUser = {
    ...roleData,
    role: roleKey 
  };
  MBG.isLoggedIn = true;

  // 4. Transisi UI
  const loginPage = document.getElementById('page-login');
  const appPage = document.getElementById('page-app');
  
  if (loginPage) loginPage.style.display = 'none';
  if (appPage) appPage.classList.add('active');

  // 5. UPDATE UI TOPBAR & SIDEBAR (SUDAH AKTIF)
  // Ini yang bikin nama "Budi Santoso" muncul otomatis pas klik login
  if (typeof updateTopbarUI === 'function') {
      updateTopbarUI();
  }
  
  if (typeof updateSidebarUI === 'function') {
      updateSidebarUI();
  }

  // 6. Navigasi ke Landing Page
  const targetPage = roleData.landingPage || 'dashboard';
  const navEl = document.querySelector(`.nav-item[data-page="${targetPage}"]`);
  
  if (navEl && typeof navigate === 'function') {
    navigate(navEl);
  } else {
    console.warn(`Navigasi otomatis ke ${targetPage} gagal.`);
    if (typeof loadPage === 'function') loadPage(targetPage);
  }
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  if (el) {
    el.innerHTML = `⚠️ &nbsp; ${msg}`;
    el.style.display = 'flex'; 
  }
}

function clearLoginError() {
  const el = document.getElementById('login-error');
  if (el) {
    el.style.display = 'none';
    el.innerHTML = '';
  }
}