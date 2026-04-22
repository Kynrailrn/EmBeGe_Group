import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  // LANDING & LOGIN STYLE
  landing: { width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', textAlign: 'center', padding: '20px' },
  loginCard: { background: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px', marginTop: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#334155' },
  heroTitle: { fontSize: '3rem', marginBottom: '10px', color: '#10b981' },
  
  // DASHBOARD STYLE
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' },
  sidebar: { width: '280px', backgroundColor: '#1e293b', color: 'white', padding: '25px', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' },
  navItem: { padding: '18px 20px', cursor: 'pointer', borderRadius: '12px', marginBottom: '10px', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', marginTop: '20px' },
  th: { textAlign: 'left', padding: '16px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9' },
  td: { padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  btnTambah: { padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }
};

export default function App() {
  const [user, setUser] = useState(null); 
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [page, setPage] = useState('menu');
  const [data, setData] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('http://localhost:5000/api/sekolah'); 
      const foundUser = res.data.find(u => u.email === credentials.email && u.password_hash === credentials.password);
      
      if (foundUser) {
        setUser(foundUser);
        if (foundUser.role === 'sekolah') setPage('siswa');
        else setPage('menu');
      } else {
        alert("Email atau Password Salah, Ran!");
      }
    } catch (err) {
      alert("Server Backend Belum Jalan!");
    }
  };

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/${page}`)
        .then(res => {
          // --- LOGIKA FILTER TAMBAHAN ---
          if (page === 'sekolah') {
            // Hanya simpan data yang role-nya BUKAN admin
            const filteredData = res.data.filter(u => u.role !== 'admin');
            setData(filteredData);
          } else {
            setData(res.data);
          }
        })
        .catch(() => setData([]));
    }
  }, [page, user]);

  const menuConfig = {
    menu: { title: 'Daftar Menu Makanan', icon: '🍱', headers: ['Menu', 'Energi', 'Deskripsi'], canCRUD: false, 
      render: (item) => (<><td style={styles.td}><strong>{item.nama_menu}</strong></td><td style={styles.td}><span style={{...styles.badge, backgroundColor: '#dcfce7', color: '#166534'}}>{item.kalori} kkal</span></td><td style={styles.td}>{item.deskripsi || '-'}</td></>)
    },
    siswa: { title: 'Data Daftar Siswa', icon: '👥', headers: ['Nama Siswa', 'Kelas', 'ID Sekolah'], canCRUD: true,
      render: (item) => (<><td style={styles.td}><strong>{item.nama_siswa}</strong></td><td style={styles.td}>{item.kelas}</td><td style={styles.td}><code style={{background: '#f1f5f9', padding: '2px 6px'}}>{item.sekolah_id}</code></td></>)
    },
    sekolah: { title: 'Data Daftar Sekolah', icon: '🏫', headers: ['Nama Sekolah', 'Email', 'Role'], canCRUD: false,
      render: (item) => (<><td style={styles.td}><strong>{item?.nama || 'Tanpa Nama'}</strong></td><td style={styles.td}>{item?.email || '-'}</td><td style={styles.td}><span style={{...styles.badge, backgroundColor: '#fef9c3', color: '#854d0e'}}>{item?.role?.toUpperCase()}</span></td></>)
    },
    jadwal: { title: 'Jadwal Distribusi MBG', icon: '📅', headers: ['ID Jadwal', 'Tanggal Pengiriman', 'ID Menu'], canCRUD: false,
      render: (item) => (<><td style={styles.td}><code>#SCH-{item.id}</code></td><td style={styles.td}><strong>{new Date(item.tanggal).toLocaleDateString('id-ID')}</strong></td><td style={styles.td}>Menu ID: {item.menu_id}</td></>)
    },
    laporan: { title: 'Laporan Feedback', icon: '📊', headers: ['Komentar', 'Rating', 'User'], canCRUD: true,
      render: (item) => (<><td style={styles.td}><em>"{item.komentar}"</em></td><td style={styles.td}>{'⭐'.repeat(item.rating || 0)}</td><td style={styles.td}>ID: {item.user_id}</td></>)
    }
  };

  const isAllowedCRUD = () => {
    if (user?.role === 'admin') return true;
    return menuConfig[page].canCRUD;
  };

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
            {isAllowedCRUD() && <button style={styles.btnTambah}>+ Tambah {page}</button>}
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
              {data.length > 0 ? data.map((item, i) => (
                <tr key={i}>
                  <td style={styles.td}>{i + 1}</td>
                  {menuConfig[page].render(item)}
                  {isAllowedCRUD() && (
                    <td style={styles.td}>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                    </td>
                  )}
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '100px', color: '#94a3b8' }}>Belum ada data di tabel {page}.</td></tr>
              )}
            </tbody>
          </table>
          {!isAllowedCRUD() && (
            <p style={{marginTop: '20px', color: '#94a3b8', fontSize: '12px', fontStyle: 'italic'}}>
              * Anda hanya memiliki akses "View Only" pada halaman ini.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}