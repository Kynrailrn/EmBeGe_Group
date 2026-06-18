import { useState, useEffect } from 'react';

export default function DistribusiMBG() {
  const [jadwal, setJadwal] = useState([]);
  const [menus, setMenus] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ tanggal: '', menu_id: '' });
  const [loading, setLoading] = useState(false);

  const fetchJadwal = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jadwal');
      const data = await res.json();
      setJadwal(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal load jadwal:", err);
      setJadwal([]);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/menu');
      const data = await res.json();
      setMenus(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal load menu:", err);
    }
  };

  useEffect(() => {
    fetchJadwal();
    fetchMenus();
  }, []);

  const bukaModalTambah = () => {
    setEditItem(null);
    setFormData({ tanggal: '', menu_id: '' });
    setIsModalOpen(true);
  };

  const bukaModalEdit = (item) => {
    setEditItem(item);
    setFormData({
      tanggal: item.tanggal ? item.tanggal.substring(0, 10) : '',
      menu_id: item.menu_id ? String(item.menu_id) : ''
    });
    setIsModalOpen(true);
  };

  const tutupModal = () => {
    setIsModalOpen(false);
    setEditItem(null);
    setFormData({ tanggal: '', menu_id: '' });
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    if (!formData.tanggal || !formData.menu_id) {
      alert("Tanggal dan Menu wajib diisi!");
      return;
    }
    setLoading(true);
    try {
      const isEdit = editItem !== null;
      const url = isEdit
        ? `http://localhost:5000/api/jadwal/${editItem.id}`
        : 'http://localhost:5000/api/jadwal';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tanggal: formData.tanggal,
          menu_id: parseInt(formData.menu_id)
        })
      });

      const result = await res.json();
      if (res.ok) {
        alert(isEdit ? "Jadwal berhasil diupdate!" : "Jadwal berhasil ditambahkan!");
        tutupModal();
        fetchJadwal();
      } else {
        alert("Gagal: " + (result.error || JSON.stringify(result)));
      }
    } catch (err) {
      alert("Koneksi ke backend gagal! Pastikan server.js jalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleHapus = async (id) => {
    if (!confirm('Yakin ingin hapus jadwal ini?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jadwal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchJadwal();
      } else {
        alert("Gagal menghapus!");
      }
    } catch (err) {
      alert("Koneksi ke backend gagal!");
    }
  };

  const getNamaMenu = (menu_id) => {
    const found = menus.find(m => m.id === menu_id || m.id === parseInt(menu_id));
    return found ? found.nama_menu : `Menu #${menu_id}`;
  };

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    const d = new Date(tanggal);
    if (isNaN(d.getTime())) return tanggal;
    return d.toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Manajemen Jadwal Distribusi MBG
        </h2>
        <button
          onClick={bukaModalTambah}
          className="bg-[#00c875] text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-[#00a85d] transition-colors"
        >
          + Tambah Jadwal
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4 text-center">NO</th>
              <th className="p-4">ID JADWAL</th>
              <th className="p-4">TANGGAL PENGIRIMAN</th>
              <th className="p-4">MENU</th>
              <th className="p-4 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 text-sm">
                  Belum ada jadwal distribusi. Klik "+ Tambah Jadwal" untuk mulai.
                </td>
              </tr>
            ) : (
              jadwal.map((item, index) => (
                <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-center text-gray-600">{index + 1}</td>
                  <td className="p-4 font-mono text-sm text-gray-700">#SCH-{item.id}</td>
                  <td className="p-4 font-medium text-gray-800">{formatTanggal(item.tanggal)}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {getNamaMenu(item.menu_id)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => bukaModalEdit(item)}
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleHapus(item.id)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              {editItem ? '✏️ Edit Jadwal' : '➕ Tambah Jadwal'}
            </h3>

            <form onSubmit={handleSimpan} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Tanggal Pengiriman
                </label>
                <input
                  type="date"
                  className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00c875] text-gray-700"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">
                  Menu Makanan
                </label>
                <select
                  className="border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00c875] text-gray-700 bg-white"
                  value={formData.menu_id}
                  onChange={(e) => setFormData({ ...formData, menu_id: e.target.value })}
                  required
                >
                  <option value="">-- Pilih Menu --</option>
                  {menus.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nama_menu}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={tutupModal}
                  className="flex-1 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#00c875] text-white p-3 rounded-xl font-bold shadow-lg hover:bg-[#00a85d] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : (editItem ? 'Update' : 'Simpan')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}