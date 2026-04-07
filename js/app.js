/* ============================================================
   js/app.js — App Orchestrator & CRUD Logic (Enhanced)
   ============================================================ */

/**
 * 1. DATABASE & PERSISTENCE
 * Mengambil data dari LocalStorage atau default jika kosong.
 */
const DEFAULT_MENU = [
    { id: 1, nama: "Nasi Ayam Kecap + Sayur Bayam", jenjang: "SD", hari: "Senin", kalori: 580, protein: 22 },
    { id: 2, nama: "Nasi Ikan Goreng + Tempe + Buah", jenjang: "SD", hari: "Selasa", kalori: 610, protein: 28 },
    { id: 3, nama: "Nasi Rendang + Sayur Lodeh", jenjang: "SMP", hari: "Rabu", kalori: 680, protein: 32 }
];

let dataMenu = JSON.parse(localStorage.getItem('mbg_data_menu')) || DEFAULT_MENU;

function saveToLocalStorage() {
    localStorage.setItem('mbg_data_menu', JSON.stringify(dataMenu));
    updateMenuStats(); // Update angka di kotak statistik setiap kali data berubah
}

/**
 * 2. PERMISSIONS & UI ORCHESTRATION
 */
function applyUser() {
    if (typeof updateSidebarUI === 'function') updateSidebarUI(); 
    if (typeof updateTopbarUI === 'function') updateTopbarUI();
}

function checkPermission(pageKey) {
    const u = MBG.currentUser;
    if (!u) return false;
    return (u.canEdit || []).includes(pageKey);
}

function applyPagePermissions(pageKey) {
    const u = MBG.currentUser;
    if (!u) return;

    const isEditable = checkPermission(pageKey);

    // Notice Read-only
    const notice = document.querySelector(`#page-${pageKey} .readonly-notice`);
    if (notice) notice.style.display = isEditable ? 'none' : 'flex';

    // Tombol Tambah
    const addBtn = document.querySelector(`#page-${pageKey} .btn-add-record`);
    if (addBtn) addBtn.style.display = isEditable ? 'block' : 'none';

    // Kolom Aksi
    const actionCols = document.querySelectorAll(`#page-${pageKey} .action-col`);
    actionCols.forEach(col => col.style.display = isEditable ? '' : 'none');

    if (pageKey === 'dashboard') injectRoleBanner();
    if (pageKey === 'menu') {
        renderMenuTable();
        updateMenuStats();
    }
}

/**
 * 3. LOGIKA CRUD MENU
 */
function renderMenuTable() {
    const tbody = document.getElementById("menu-table-body");
    if (!tbody) return;

    const isEditable = checkPermission('menu');
    tbody.innerHTML = "";
    
    if (dataMenu.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#999;">Belum ada data menu.</td></tr>`;
        return;
    }

    dataMenu.forEach((item, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${item.nama}</strong></td>
                <td>${item.jenjang}</td>
                <td>${item.hari}</td>
                <td>${item.kalori} kkal</td>
                <td>${item.protein}g</td>
                <td><span class="td-badge aktif">Aktif</span></td>
                <td class="action-col" style="${isEditable ? '' : 'display:none'}">
                    <div style="display:flex; gap:5px;">
                        <button class="tbl-btn" onclick="openEditMenu(${item.id})" title="Edit">✏️</button>
                        <button class="tbl-btn del" onclick="deleteMenu(${item.id})" title="Hapus">🗑️</button>
                    </div>
                </td>
            </tr>`;
    });
}

function openAddMenu() {
    if (!checkPermission('menu')) return;
    
    document.getElementById('modal-title').innerText = "Tambah Menu Baru";
    document.getElementById('menu-id').value = "";
    document.getElementById('menu-nama').value = "";
    document.getElementById('menu-kalori').value = "";
    document.getElementById('menu-protein').value = "";
    document.getElementById('modal-menu').style.display = 'flex';
}

function openEditMenu(id) {
    if (!checkPermission('menu')) return;

    const item = dataMenu.find(m => m.id === id);
    if (!item) return;

    document.getElementById('modal-title').innerText = "Edit Menu";
    document.getElementById('menu-id').value = item.id;
    document.getElementById('menu-nama').value = item.nama;
    document.getElementById('menu-jenjang').value = item.jenjang;
    document.getElementById('menu-hari').value = item.hari;
    document.getElementById('menu-kalori').value = item.kalori;
    document.getElementById('menu-protein').value = item.protein;
    document.getElementById('modal-menu').style.display = 'flex';
}

function closeMenuModal() {
    document.getElementById('modal-menu').style.display = 'none';
}

function saveMenuData() {
    if (!checkPermission('menu')) return;

    const id = document.getElementById('menu-id').value;
    const nama = document.getElementById('menu-nama').value.trim();
    const kalori = document.getElementById('menu-kalori').value;
    const protein = document.getElementById('menu-protein').value;
    
    if (!nama || !kalori || !protein) {
        alert("Semua field (Nama, Kalori, Protein) wajib diisi!");
        return;
    }

    const payload = {
        id: id ? parseInt(id) : Date.now(),
        nama: nama,
        jenjang: document.getElementById('menu-jenjang').value,
        hari: document.getElementById('menu-hari').value,
        kalori: parseInt(kalori),
        protein: parseInt(protein)
    };

    if (id) {
        const idx = dataMenu.findIndex(m => m.id === parseInt(id));
        if (idx !== -1) dataMenu[idx] = payload;
    } else {
        dataMenu.push(payload);
    }

    saveToLocalStorage();
    closeMenuModal();
    renderMenuTable();
}

function deleteMenu(id) {
    if (!checkPermission('menu')) return;

    if (confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
        dataMenu = dataMenu.filter(m => m.id !== id);
        saveToLocalStorage();
        renderMenuTable();
    }
}

/**
 * 4. FITUR TAMBAHAN: STATISTIK & FILTER
 */
function updateMenuStats() {
    // Update jumlah menu aktif di kotak ringkasan
    const activeMenuEl = document.querySelector('#page-menu .card:nth-child(1) div:nth-child(2)');
    if (activeMenuEl) activeMenuEl.textContent = dataMenu.length;

    // Update rata-rata kalori
    const avgCalEl = document.querySelector('#page-menu .card:nth-child(2) div:nth-child(2)');
    if (avgCalEl && dataMenu.length > 0) {
        const totalCal = dataMenu.reduce((sum, item) => sum + (parseInt(item.kalori) || 0), 0);
        const avg = Math.round(totalCal / dataMenu.length);
        avgCalEl.innerHTML = `${avg} <span style="font-size:14px;font-weight:500;">kkal</span>`;
    }
}

function filterMenuTable() {
    const q = document.getElementById('search-menu').value.toLowerCase();
    const j = document.getElementById('filter-jenjang').value;
    const h = document.getElementById('filter-hari').value;
    
    const rows = document.querySelectorAll("#menu-table-body tr");
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        // Cek apakah baris mengandung kata kunci pencarian, jenjang, dan hari
        const matchesSearch = text.includes(q);
        const matchesJenjang = (j === "Semua Jenjang" || j === "" || text.includes(j.toLowerCase()));
        const matchesHari = (h === "Semua Hari" || h === "" || text.includes(h.toLowerCase()));
        
        row.style.display = (matchesSearch && matchesJenjang && matchesHari) ? "" : "none";
    });
}

/**
 * 5. DASHBOARD UTILS
 */
function injectRoleBanner() {
    const dashPage = document.getElementById('page-dashboard');
    if (!dashPage || dashPage.querySelector('.role-banner')) return;

    const u = MBG.currentUser;
    const banner = document.createElement('div');
    banner.className = `role-banner ${u.role}`;
    banner.style.cssText = `display:flex; align-items:center; gap:12px; padding:12px 20px; background:rgba(255,255,255,0.1); border-radius:12px; margin-bottom:20px; color:white; font-size:13px; border:1px solid rgba(255,255,255,0.2); backdrop-filter:blur(5px);`;
    
    const icon = u.role === 'superadmin' ? '👑' : '🏫';
    const roleText = u.role === 'superadmin' ? 'Super Admin' : 'Admin Sekolah';
    
    banner.innerHTML = `<span>${icon}</span> <span>Masuk sebagai <strong>${roleText}</strong>. Anda memiliki akses ${u.canEdit.includes('menu') ? 'penuh' : 'terbatas'}.</span>`;
    dashPage.insertBefore(banner, dashPage.firstChild);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("MBG System Online & Persistence Ready.");
});