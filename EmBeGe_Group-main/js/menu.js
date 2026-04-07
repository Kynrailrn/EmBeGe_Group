/* ============================================================
   js/menu.js — Logika CRUD untuk Modul Menu Makanan
   ============================================================ */

const API_MENU = 'http://localhost:3000/api/menu';

/**
 * 1. Fungsi Mengambil Data dari Database (READ)
 */
window.fetchMenus = async function() {
    try {
        const response = await fetch(API_MENU);
        const menus = await response.json();
        renderMenuTable(menus);
        
        // Update statistik di dashboard menu
        const statCount = document.getElementById('stat-menu-count');
        if (statCount) statCount.innerText = menus.length;
    } catch (error) {
        console.error("Gagal mengambil data menu:", error);
    }
}

/**
 * 2. Fungsi Menampilkan Data ke Tabel HTML
 */
function renderMenuTable(data) {
    const tableBody = document.getElementById('menu-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Kosongkan tabel dulu

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        
        // Tentukan class badge untuk status
        const statusClass = item.status === 'Tersedia' ? 'tersedia' : 'habis';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.nama_menu}</strong></td>
            <td>${item.deskripsi ? item.deskripsi.split(' - ')[0] : '-'}</td>
            <td>${item.deskripsi ? item.deskripsi.split(' - ')[1] : '-'}</td>
            <td>${item.kalori} kkal</td>
            <td>${item.protein} g</td>
            <td><span class="td-badge ${statusClass}">${item.status}</span></td>
            <td>
                <div style="display:flex; gap:8px;">
                    <button class="tbl-btn del" onclick="deleteMenu(${item.id})">🗑️</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * 3. Fungsi Tambah/Simpan Menu (CREATE)
 */
async function saveMenuData() {
    const nama = document.getElementById('menu-nama').value;
    const jenjang = document.getElementById('menu-jenjang').value;
    const hari = document.getElementById('menu-hari').value;
    const kalori = document.getElementById('menu-kalori').value;
    const protein = document.getElementById('menu-protein').value;

    if (!nama || !kalori) {
        alert("Nama Menu dan Kalori wajib diisi!");
        return;
    }

    const dataBaru = {
        nama_menu: nama,
        deskripsi: `${jenjang} - ${hari}`,
        kalori: parseInt(kalori),
        protein: parseInt(protein),
        status: 'Tersedia'
    };

    try {
        const response = await fetch(API_MENU, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataBaru)
        });

        if (response.ok) {
            alert("✅ Menu Berhasil Disimpan ke Database!");
            closeMenuModal();
            fetchMenus(); // Refresh tabel
            // Reset form manual
            document.getElementById('menu-nama').value = '';
            document.getElementById('menu-kalori').value = '';
            document.getElementById('menu-protein').value = '';
        }
    } catch (error) {
        alert("Gagal terhubung ke server!");
    }
}

/**
 * 4. Fungsi Hapus Menu (DELETE)
 */
async function deleteMenu(id) {
    if (confirm("Yakin ingin menghapus menu ini?")) {
        try {
            const response = await fetch(`${API_MENU}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchMenus();
            }
        } catch (error) {
            alert("Gagal menghapus data.");
        }
    }
}

/**
 * 5. Fungsi Kontrol Modal (UI)
 */
function openAddMenu() {
    const modal = document.getElementById('modal-menu');
    if (modal) modal.style.display = 'flex';
}

function closeMenuModal() {
    const modal = document.getElementById('modal-menu');
    if (modal) modal.style.display = 'none';
}

/**
 * 6. Fitur Pencarian (Filter)
 */
function filterMenuTable() {
    const searchVal = document.getElementById('search-menu').value.toLowerCase();
    const rows = document.querySelectorAll('#menu-table-body tr');

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(searchVal) ? '' : 'none';
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchMenus);