import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  landing: { width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', textAlign: 'center', padding: '20px' },
  loginCard: { background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', marginTop: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#334155' },
  heroTitle: { fontSize: '3rem', marginBottom: '10px', color: '#10b981' },
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#1e293b', color: 'white', padding: '25px', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' },
  navItem: { padding: '18px 20px', cursor: 'pointer', borderRadius: '12px', marginBottom: '10px', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', marginTop: '20px' },
  th: { textAlign: 'left', padding: '16px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9' },
  td: { padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  btnTambah: { padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
};

export default function App() {
  const [user, setUser] = useState(null); 
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [page, setPage] = useState('menu');
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/${page}`);
      // Filter role admin sudah ditangani Backend, tapi kita jaga-jaga di sini juga boleh
      setData(res.data);
    } catch (err) {
      setData([]);
    }
  };

  useEffect(() => { if (user) fetchData(); }, [page, user]);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await axios.delete(`${API_URL}/${page}/${id}`);
        fetchData();
      } catch (err) {
        alert('Gagal menghapus data');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validasi rating agar 1-5 saja
    if (formData.rating > 5) {
      alert("Rating maksimal 5!");
      return;
    }
    const uploadData = new FormData();
    uploadData.append('user_id', user.id); // Ambil dari user yang login
    uploadData.append('rating', formData.rating);
    uploadData.append('komentar', formData.komentar);
    uploadData.append('foto', file); // 'file' adalah state yang lo buat tadi

    try {
      await axios.post(`${API_URL}/laporan`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowModal(false);
      setFormData({});
      fetchData(); // Refresh tabel
    } catch (err) {
      alert('Gagal Upload: ' + (err.response?.data?.error || err.message));
    }
  };

  // --- FUNGSI BARU UNTUK CRUD MENU, SISWA, DLL ---
  const handleSimpan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/${page}`, formData); 
      setShowModal(false);
      setFormData({});
      fetchData(); // Refresh tabel setelah berhasil
    } catch (err) {
      alert('Gagal Simpan: ' + (err.response?.data?.error || err.message));
    }
  };

  // --- LOGIKA LOGIN YANG SUDAH DIPERBAIKI ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: credentials.email,
        password: credentials.password
      }); 
      
      if (res.data) {
        setUser(res.data);
        setPage(res.data.role === 'sekolah' ? 'siswa' : 'menu');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Email atau Password Salah, Ran!");
      } else {
        alert("Server Backend Belum Jalan!");
      }
    }
  };

  const menuConfig = {
    menu: { 
      title: 'Daftar Menu Makanan', icon: '🍱', headers: ['Menu', 'Energi', 'Deskripsi'], canCRUD: true, 
      fields: ['nama_menu', 'kalori', 'deskripsi'],
      render: (item) => (
        <>
          <td style={styles.td}><strong>{item.nama_menu}</strong></td>
          <td style={styles.td}><span style={{...styles.badge, backgroundColor: '#dcfce7', color: '#166534'}}>{item.kalori} kkal</span></td>
          <td style={styles.td}>{item.deskripsi || '-'}</td>
        </>
      )
    },
    siswa: { 
      title: 'Data Daftar Siswa', icon: '👥', headers: ['Nama Siswa', 'Kelas', 'ID Sekolah'], canCRUD: true,
      fields: ['nama_siswa', 'kelas', 'sekolah_id'],
      render: (item) => (
        <>
          <td style={styles.td}><strong>{item.nama_siswa}</strong></td>
          <td style={styles.td}>{item.kelas}</td>
          <td style={styles.td}><code style={{background: '#f1f5f9', padding: '2px 6px'}}>{item.sekolah_id}</code></td>
        </>
      )
    },
    sekolah: { 
      title: 'Data Daftar Sekolah', icon: '🏫', headers: ['Nama Sekolah', 'Email', 'Role'], canCRUD: false,
      render: (item) => (
        <>
          <td style={styles.td}><strong>{item?.nama || 'Tanpa Nama'}</strong></td>
          <td style={styles.td}>{item?.email || '-'}</td>
          <td style={styles.td}><span style={{...styles.badge, backgroundColor: '#fef9c3', color: '#854d0e'}}>{item?.role?.toUpperCase()}</span></td>
        </>
      )
    },
    jadwal: { 
      title: 'Jadwal Distribusi MBG', icon: '📅', headers: ['ID Jadwal', 'Tanggal Pengiriman', 'ID Menu'], canCRUD: false,
      render: (item) => (
        <>
          <td style={styles.td}><code>#SCH-{item.id}</code></td>
          <td style={styles.td}><strong>{new Date(item.tanggal).toLocaleDateString('id-ID')}</strong></td>
          <td style={styles.td}>Menu ID: {item.menu_id}</td>
        </>
      )
    },
    laporan: { 
      title: 'Laporan Feedback', icon: '📊', 
      headers: ['Sekolah', 'Komentar', 'Rating', 'Bukti'], 
      canCRUD: true, 
      fields: ['komentar', 'rating', 'foto'], 
      render: (item) => (
        <>
          <td style={styles.td}><strong>{item.nama_sekolah}</strong></td> 
          <td style={styles.td}><em>"{item.komentar}"</em></td>
          <td style={styles.td}>
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < item.rating ? '#fbbf24' : '#e2e8f0' }}>★</span>
            ))}
          </td>
          <td style={styles.td}>
            {item.foto_bukti_url ? (
              <a href={`http://localhost:5000/${item.foto_bukti_url.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer">Lihat Bukti</a>
            ) : '-'}
          </td>
        </>
      )
    }
  };

  const isAllowedCRUD = () => user?.role === 'admin' || menuConfig[page].canCRUD;

  if (!user) {
    return (
      <div style={styles.landing}>
        <h1 style={styles.heroTitle}>MBG Project</h1>
        <div style={styles.loginCard}>
          <h3 style={{color: '#1e293b', marginBottom: '20px'}}>Sistem Login</h3>
          <form onSubmit={handleLogin}>
            <input style={styles.input} type="email" placeholder="Email (admin@mbg.com)" required onChange={e => setCredentials({...credentials, email: e.target.value})} />
            <input style={styles.input} type="password" placeholder="Password" required onChange={e => setCredentials({...credentials, password: e.target.value})} />
            <button type="submit" style={{...styles.btnTambah, width: '100%'}}>Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={{...styles.loginCard, marginTop: 0}}>
            <h3 style={{marginBottom: '20px', color: '#1e293b'}}>Tambah {page}</h3>
            {/* LOGIKA FORM ONSUBMIT YANG DIPERBAIKI */}
            <form onSubmit={page === 'laporan' ? handleUpload : handleSimpan}>
              {menuConfig[page].fields?.map(f => (
                f === 'foto' ? (
                  <input 
                    key={f} 
                    type="file" 
                    onChange={(e) => setFile(e.target.files[0])} 
                  />
                ) : f === 'rating' ? (
                  <select 
                    key={f} 
                    style={styles.input} 
                    required
                    onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                  >
                    <option value="">PILIH RATING</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{'★'.repeat(num)}</option>
                    ))}
                  </select>
                ) : (
                  <input 
                    key={f} 
                    style={styles.input} 
                    placeholder={f.replace('_', ' ').toUpperCase()} 
                    type={f === 'kalori' || f.includes('_id') ? 'number' : 'text'}
                    required 
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({
                        ...formData, 
                        [f]: (f === 'kalori' || f.includes('_id')) ? parseInt(val) : val 
                      });
                    }} 
                  />
                )
              ))}
              <div style={{display: 'flex', gap: '10px'}}>
                <button type="button" onClick={() => setShowModal(false)} style={{...styles.btnTambah, backgroundColor: '#94a3b8', flex: 1, boxShadow: 'none'}}>Batal</button>
                <button type="submit" style={{...styles.btnTambah, flex: 1}}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <aside style={styles.sidebar}>
        <div style={{ padding: '0 0 20px 0', textAlign: 'center' }}>
          <h1 style={{ color: '#10b981', fontSize: '24px' }}>MBG Group</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Halo, {user.nama} ({user.role})</p>
          <span onClick={() => setUser(null)} style={{fontSize: '10px', cursor: 'pointer', color: '#ef4444'}}>Logout</span>
        </div>
        {Object.keys(menuConfig).map((key) => (
          <div key={key} style={{...styles.navItem, backgroundColor: page === key ? '#334155' : 'transparent', color: page === key ? '#10b981' : 'white'}} onClick={() => setPage(key)}>
            <span style={{fontSize: '20px'}}>{menuConfig[key].icon}</span>
            {menuConfig[key].title.split(' ')[1]} {menuConfig[key].title.split(' ')[2] || ''}
          </div>
        ))}
      </aside>

      <main style={styles.main}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2>Manajemen {menuConfig[page].title}</h2>
            {isAllowedCRUD() && <button onClick={() => { setFormData({}); setShowModal(true); }} style={styles.btnTambah}>+ Tambah {page}</button>}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>No</th>
                {menuConfig[page].headers.map(h => <th key={h} style={styles.th}>{h}</th>)}
                {isAllowedCRUD() && <th style={styles.th}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={item.id || i}>
                  <td style={styles.td}>{i + 1}</td>
                  {menuConfig[page].render(item)}
                  
                  {isAllowedCRUD() && (
                    <td style={styles.td}>
                      {(user.role === 'admin' || user.id === item.user_id) ? (
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '18px' }}
                        >
                          🗑️
                        </button>
                      ) : (
                        <span style={{color: '#cbd5e1', fontSize: '12px'}}>Dikunci</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!isAllowedCRUD() && <p style={{color: '#94a3b8', fontSize: '12px', marginTop: '10px'}}>* Anda hanya memiliki akses baca (View Only) di halaman ini.</p>}
        </div>
      </main>
    </div>
  );
}