import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes floatOrb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(40px, -30px) scale(1.08); }
    66%       { transform: translate(-25px, 20px) scale(0.95); }
  }
  @keyframes floatFood {
    0%, 100% { transform: translateY(0px) rotate(var(--food-rotate)); }
    50%       { transform: translateY(-14px) rotate(var(--food-rotate)); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
    50%       { box-shadow: 0 0 24px 6px rgba(16,185,129,0.18); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .mbg-logo-box {
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.05s;
  }
  .mbg-hero-title {
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.15s;
  }
  .mbg-hero-sub {
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.22s;
  }
  .mbg-card {
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.32s;
  }
  .mbg-footer {
    animation: fadeIn 0.8s ease both;
    animation-delay: 0.6s;
  }

  .mbg-input-field {
    width: 100%;
    padding: 11px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.9);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.88rem;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
    margin-bottom: 15px;
  }
  .mbg-input-field::placeholder { color: rgba(148,163,184,0.4); }
  .mbg-input-field:focus {
    border-color: rgba(16,185,129,0.6);
    background: rgba(255,255,255,0.09);
    box-shadow: 0 0 0 3px rgba(16,185,129,0.15), 0 0 18px rgba(16,185,129,0.1);
  }

  .mbg-btn-login {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 11px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 20px rgba(16,185,129,0.3);
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease, opacity 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
  }
  .mbg-btn-login:not(:disabled):hover {
    transform: scale(1.035) translateY(-1px);
    box-shadow: 0 8px 28px rgba(16,185,129,0.5);
  }
  .mbg-btn-login:not(:disabled):active {
    transform: scale(0.97);
  }
  .mbg-btn-login:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
  .mbg-btn-login::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .mbg-btn-login:not(:disabled):hover::after {
    opacity: 1;
    animation: shimmer 0.8s linear;
  }

  .mbg-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: floatOrb linear infinite;
  }

  .food-float {
    position: absolute;
    pointer-events: none;
    user-select: none;
    opacity: 0.2;
    animation: floatFood ease-in-out infinite;
    font-size: 1.7rem;
    line-height: 1;
  }

  .dash-btn {
    padding: 12px 24px;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 11px;
    cursor: pointer;
    font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(16,185,129,0.2);
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s;
  }
  .dash-btn:hover {
    transform: scale(1.04) translateY(-1px);
    box-shadow: 0 8px 24px rgba(16,185,129,0.4);
  }
`;

function useGlobalStyle(css) {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}

const ORBS = [
  { w: 420, h: 420, top: '-100px', left: '-100px', color: 'rgba(16,185,129,0.13)', dur: '18s', delay: '0s' },
  { w: 320, h: 320, top: 'auto', left: 'auto', bottom: '-80px', right: '-80px', color: 'rgba(16,185,129,0.09)', dur: '22s', delay: '-7s' },
  { w: 200, h: 200, top: '40%', left: '60%', color: 'rgba(16,185,129,0.07)', dur: '15s', delay: '-4s' },
  { w: 140, h: 140, top: '20%', left: '10%', color: 'rgba(16,185,129,0.06)', dur: '20s', delay: '-11s' },
];

const FOOD_EMOJIS = [
  { emoji: '🍱', top: '8%',  left: '5%',  dur: '14s', delay: '0s',   rotate: '-12deg' },
  { emoji: '🥗', top: '15%', left: '88%', dur: '17s', delay: '-3s',  rotate: '8deg'   },
  { emoji: '🍚', top: '72%', left: '6%',  dur: '19s', delay: '-6s',  rotate: '15deg'  },
  { emoji: '🥛', top: '80%', left: '82%', dur: '16s', delay: '-9s',  rotate: '-8deg'  },
  { emoji: '🍗', top: '45%', left: '92%', dur: '20s', delay: '-2s',  rotate: '20deg'  },
  { emoji: '🥦', top: '55%', left: '2%',  dur: '13s', delay: '-5s',  rotate: '-18deg' },
  { emoji: '🍌', top: '30%', left: '94%', dur: '18s', delay: '-11s', rotate: '5deg'   },
  { emoji: '🥕', top: '88%', left: '45%', dur: '22s', delay: '-7s',  rotate: '-10deg' },
  { emoji: '🍎', top: '5%',  left: '50%', dur: '15s', delay: '-4s',  rotate: '12deg'  },
  { emoji: '🥚', top: '65%', left: '70%', dur: '21s', delay: '-13s', rotate: '-5deg'  },
  { emoji: '🍞', top: '25%', left: '18%', dur: '16s', delay: '-8s',  rotate: '18deg'  },
  { emoji: '🧆', top: '92%', left: '18%', dur: '12s', delay: '-1s',  rotate: '-22deg' },
];

function OrbBackground() {
  return (
    <>
      {ORBS.map((o, i) => (
        <div key={`orb-${i}`} className="orb" style={{
          width: o.w, height: o.h,
          top: o.top || 'auto', left: o.left || 'auto',
          bottom: o.bottom || 'auto', right: o.right || 'auto',
          background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          animationDuration: o.dur,
          animationDelay: o.delay,
        }} />
      ))}

      {FOOD_EMOJIS.map((f, i) => (
        <div key={`food-${i}`} className="food-float" style={{
          top: f.top,
          left: f.left,
          animationDuration: f.dur,
          animationDelay: f.delay,
          '--food-rotate': f.rotate,
        }}>
          {f.emoji}
        </div>
      ))}
    </>
  );
}

function CursorGlow({ cardRef }) {
  const glowRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.background = `radial-gradient(260px circle at ${x}px ${y}px, rgba(16,185,129,0.12), transparent 70%)`;
    glow.style.opacity = '1';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div ref={glowRef} style={{
      position: 'absolute', inset: 0, borderRadius: '20px',
      pointerEvents: 'none', opacity: 0,
      transition: 'opacity 0.3s',
      zIndex: 0,
    }} />
  );
}

const ds = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" },
  sidebar: { width: '280px', backgroundColor: '#1e293b', color: 'white', padding: '25px', boxShadow: '4px 0 10px rgba(0,0,0,0.05)' },
  navItem: { padding: '18px 20px', cursor: 'pointer', borderRadius: '12px', marginBottom: '10px', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', marginTop: '20px' },
  th: { textAlign: 'left', padding: '16px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid #f1f5f9' },
  td: { padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { background: 'white', padding: '32px 28px', borderRadius: '20px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalInput: { width: '100%', padding: '11px 14px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#334155', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.88rem', outline: 'none' },
};

export default function App() {
  useGlobalStyle(GLOBAL_CSS);

  const [user, setUser]               = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading]     = useState(false);
  const [page, setPage]               = useState('menu');
  const [data, setData]               = useState([]);
  const [showModal, setShowModal]     = useState(false);
  const [formData, setFormData]       = useState({});
  const [file, setFile]               = useState(null);
  const [listMenu, setListMenu]       = useState([]);
  const [listSekolah, setListSekolah] = useState([]);

  const cardRef = useRef(null);
  const API_URL = 'http://localhost:5000/api';

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/${page}`);
      setData(res.data);
      if (page === 'jadwal') {
        const [rm, rs] = await Promise.all([
          axios.get(`${API_URL}/menu`),
          axios.get(`${API_URL}/sekolah`),
        ]);
        setListMenu(rm.data);
        setListSekolah(rs.data);
      }
    } catch { setData([]); }
  };

  useEffect(() => { if (user) fetchData(); }, [page, user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await axios.delete(`${API_URL}/${page}/${id}`);
      fetchData();
    } catch { alert('Gagal menghapus data'); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (formData.rating > 5) return alert('Rating maksimal 5!');
    const fd = new FormData();
    fd.append('user_id', user.id);
    fd.append('rating', formData.rating);
    fd.append('komentar', formData.komentar);
    fd.append('foto', file);
    try {
      await axios.post(`${API_URL}/laporan`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowModal(false); setFormData({}); fetchData();
    } catch { alert('Gagal Upload'); }
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/${page}`, formData);
      setShowModal(false); setFormData({}); fetchData();
    } catch (err) { alert('Gagal Simpan: ' + (err.response?.data?.error || err.message)); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      if (res.data) {
        setUser(res.data);
        setPage(res.data.role === 'sekolah' ? 'siswa' : 'menu');
      }
    } catch { alert('Email atau Password Salah!'); }
    finally { setIsLoading(false); }
  };

  const menuConfig = {
    menu: {
      title: 'Daftar Menu Makanan', icon: '🍱',
      headers: ['Menu', 'Energi', 'Deskripsi'], canCRUD: true,
      fields: ['nama_menu', 'kalori', 'deskripsi'],
      render: (item) => (<>
        <td style={ds.td}><strong>{item.nama_menu}</strong></td>
        <td style={ds.td}><span style={{...ds.badge, backgroundColor: '#dcfce7', color: '#166534'}}>{item.kalori} kkal</span></td>
        <td style={ds.td}>{item.deskripsi || '-'}</td>
      </>)
    },
    siswa: {
      title: 'Data Daftar Siswa', icon: '👥',
      headers: ['Nama Siswa', 'Kelas', 'ID Sekolah'], canCRUD: true,
      fields: ['nama_siswa', 'kelas', 'sekolah_id'],
      render: (item) => (<>
        <td style={ds.td}><strong>{item.nama_siswa}</strong></td>
        <td style={ds.td}>{item.kelas}</td>
        <td style={ds.td}><code style={{background: '#f1f5f9', padding: '2px 6px'}}>{item.sekolah_id}</code></td>
      </>)
    },
    sekolah: {
      title: 'Data Daftar Sekolah', icon: '🏫',
      headers: ['Nama Sekolah', 'Email', 'Role'], canCRUD: false,
      render: (item) => (<>
        <td style={ds.td}><strong>{item?.nama || 'Tanpa Nama'}</strong></td>
        <td style={ds.td}>{item?.email || '-'}</td>
        <td style={ds.td}><span style={{...ds.badge, backgroundColor: '#fef9c3', color: '#854d0e'}}>{item?.role?.toUpperCase()}</span></td>
      </>)
    },
    jadwal: {
      title: 'Jadwal Distribusi MBG', icon: '🚚',
      headers: ['Hari & Tanggal', 'Sekolah Tujuan', 'Menu Dikirim', 'Total Porsi'], canCRUD: false,
      fields: ['tanggal', 'sekolah_id', 'menu_id'],
      render: (item) => (<>
        <td style={ds.td}><strong>{new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></td>
        <td style={ds.td}><strong>{item.nama_sekolah}</strong></td>
        <td style={ds.td}>{item.nama_menu || 'Menu Tidak Ditemukan'}<br/><span style={{fontSize:'11px',color:'#64748b'}}>ID Menu: {item.menu_id}</span></td>
        <td style={ds.td}><span style={{...ds.badge, backgroundColor:'#dbeafe',color:'#1e40af',fontSize:'14px',padding:'8px 15px'}}>📦 {item.jumlah_porsi} Porsi</span></td>
      </>)
    },
    laporan: {
      title: 'Laporan Feedback', icon: '📊',
      headers: ['Sekolah', 'Komentar', 'Rating', 'Bukti'], canCRUD: true,
      fields: ['komentar', 'rating', 'foto'],
      render: (item) => (<>
        <td style={ds.td}><strong>{item.nama_sekolah}</strong></td>
        <td style={ds.td}><em>"{item.komentar}"</em></td>
        <td style={ds.td}>{[...Array(5)].map((_, i) => <span key={i} style={{color: i < item.rating ? '#fbbf24' : '#e2e8f0'}}>★</span>)}</td>
        <td style={ds.td}>{item.foto_bukti_url ? <a href={`http://localhost:5000/${item.foto_bukti_url.replace(/\\/g, '/')}`} target="_blank" rel="noreferrer">Lihat Bukti</a> : '-'}</td>
      </>)
    },
  };

  const isAllowedCRUD = () => user?.role === 'admin' || menuConfig[page].canCRUD;

  if (!user) {
    return (
      <div style={{
        width: '100vw', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a1628 0%, #0f1f38 35%, #0a1e2e 70%, #051812 100%)',
        color: 'white', textAlign: 'center', padding: '20px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        position: 'relative', overflow: 'hidden',
      }}>

        <OrbBackground />

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        <div className="mbg-logo-box" style={{ marginBottom: '18px', zIndex: 1 }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 700, color: 'white',
            margin: '0 auto',
            fontFamily: "'Sora', sans-serif", letterSpacing: '-0.5px',
            boxShadow: '0 8px 32px rgba(16,185,129,0.4), 0 0 0 1px rgba(16,185,129,0.2)',
            animation: 'pulse-glow 3s ease-in-out infinite',
          }}>
            MBG
          </div>
        </div>

        <h1 className="mbg-hero-title" style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
          fontWeight: 700, color: '#10b981',
          letterSpacing: '-0.5px', marginBottom: '6px', zIndex: 1,
        }}>
          MBG Project
        </h1>

        <p className="mbg-hero-sub" style={{
          fontSize: '0.75rem', color: 'rgba(148,163,184,0.65)',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          fontWeight: 500, marginBottom: '32px', zIndex: 1,
        }}>
          Makan Bergizi Gratis &mdash; Sistem Manajemen
        </p>

        <div ref={cardRef} className="mbg-card" style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.11)',
          padding: '34px 30px 28px',
          borderRadius: '24px',
          width: '100%', maxWidth: '390px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
          zIndex: 1,
        }}>
          <CursorGlow cardRef={cardRef} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: '1.15rem', fontWeight: 600,
              color: 'rgba(255,255,255,0.92)', marginBottom: '4px',
            }}>
              Selamat Datang
            </h2>
            <p style={{
              fontSize: '0.78rem', color: 'rgba(148,163,184,0.65)',
              marginBottom: '26px', fontWeight: 400,
            }}>
              Masuk ke akun Anda untuk melanjutkan
            </p>

            <form onSubmit={handleLogin}>
              <label style={{
                display: 'block', fontSize: '0.7rem', fontWeight: 600,
                color: 'rgba(148,163,184,0.75)', letterSpacing: '0.08em',
                textTransform: 'uppercase', marginBottom: '6px',
              }}>Email</label>
              <input
                className="mbg-input-field"
                type="email"
                placeholder="admin@mbg.com"
                required
                disabled={isLoading}
                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              />

              <label style={{
                display: 'block', fontSize: '0.7rem', fontWeight: 600,
                color: 'rgba(148,163,184,0.75)', letterSpacing: '0.08em',
                textTransform: 'uppercase', marginBottom: '6px',
              }}>Password</label>
              <input
                className="mbg-input-field"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              />

              <button
                type="submit"
                className="mbg-btn-login"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mbg-spinner" />
                    Memverifikasi...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>
            </form>

            <p style={{
              textAlign: 'center', fontSize: '0.68rem',
              color: 'rgba(100,116,139,0.5)', marginTop: '16px',
            }}>
              admin@mbg.com &nbsp;·&nbsp; sekolah@mbg.com
            </p>
          </div>
        </div>

        <p className="mbg-footer" style={{
          marginTop: '28px', fontSize: '0.68rem',
          color: 'rgba(100,116,139,0.4)', letterSpacing: '0.04em', zIndex: 1,
        }}>
          © 2025 MBG Group &nbsp;·&nbsp; v1.0 &nbsp;·&nbsp; Sistem Distribusi MBG
        </p>
      </div>
    );
  }

  return (
    <div style={ds.container}>

      {showModal && (
        <div style={ds.modalOverlay}>
          <div style={ds.modalCard}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', fontFamily: "'Sora', sans-serif" }}>
              Tambah {page}
            </h3>
            <form onSubmit={page === 'laporan' ? handleUpload : handleSimpan}>
              {menuConfig[page].fields?.map(f =>
                f === 'foto' ? (
                  <input key={f} type="file" onChange={e => setFile(e.target.files[0])} style={{ marginBottom: '15px' }} />
                ) : f === 'rating' ? (
                  <select key={f} style={ds.modalInput} required onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                    <option value="">PILIH RATING</option>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
                  </select>
                ) : f === 'sekolah_id' && page === 'jadwal' ? (
                  <select key={f} style={ds.modalInput} required onChange={e => setFormData({ ...formData, [f]: parseInt(e.target.value) })}>
                    <option value="">PILIH SEKOLAH TUJUAN</option>
                    {listSekolah.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                  </select>
                ) : f === 'menu_id' && page === 'jadwal' ? (
                  <select key={f} style={ds.modalInput} required onChange={e => setFormData({ ...formData, [f]: parseInt(e.target.value) })}>
                    <option value="">PILIH MENU DIKIRIM</option>
                    {listMenu.map(m => <option key={m.id} value={m.id}>{m.nama_menu}</option>)}
                  </select>
                ) : (
                  <input
                    key={f} style={ds.modalInput}
                    placeholder={f.replace('_', ' ').toUpperCase()}
                    type={f === 'kalori' || f.includes('_id') ? 'number' : f === 'tanggal' ? 'date' : 'text'}
                    required
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({ ...formData, [f]: (f === 'kalori' || f.includes('_id')) ? parseInt(val) : val });
                    }}
                  />
                )
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="dash-btn" onClick={() => setShowModal(false)} style={{ backgroundColor: '#94a3b8', flex: 1, boxShadow: 'none' }}>Batal</button>
                <button type="submit" className="dash-btn" style={{ flex: 1 }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <aside style={ds.sidebar}>
        <div style={{ padding: '0 0 20px 0', textAlign: 'center' }}>
          <h1 style={{ color: '#10b981', fontSize: '24px', fontFamily: "'Sora', sans-serif" }}>MBG Group</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8' }}>Halo, {user.nama} ({user.role})</p>
          <span onClick={() => setUser(null)} style={{ fontSize: '10px', cursor: 'pointer', color: '#ef4444' }}>Logout</span>
        </div>
        {Object.keys(menuConfig).map(key => (
          <div
            key={key}
            style={{ ...ds.navItem, backgroundColor: page === key ? '#334155' : 'transparent', color: page === key ? '#10b981' : 'white' }}
            onClick={() => setPage(key)}
          >
            <span style={{ fontSize: '20px' }}>{menuConfig[key].icon}</span>
            {menuConfig[key].title.split(' ')[1]} {menuConfig[key].title.split(' ')[2] || ''}
          </div>
        ))}
      </aside>

      <main style={ds.main}>
        <div style={ds.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif" }}>Manajemen {menuConfig[page].title}</h2>
            {isAllowedCRUD() && (
              <button className="dash-btn" onClick={() => { setFormData({}); setShowModal(true); }}>
                + Tambah {page}
              </button>
            )}
          </div>
          <table style={ds.table}>
            <thead>
              <tr>
                <th style={ds.th}>No</th>
                {menuConfig[page].headers.map(h => <th key={h} style={ds.th}>{h}</th>)}
                {isAllowedCRUD() && <th style={ds.th}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={`${item.id || 'x'}-${i}`}>
                  <td style={ds.td}>{i + 1}</td>
                  {menuConfig[page].render(item)}
                  {isAllowedCRUD() && (
                    <td style={ds.td}>
                      {(user.role === 'admin' || user.id === item.user_id) ? (
                        <button onClick={() => handleDelete(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '18px' }}>🗑️</button>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Dikunci</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!isAllowedCRUD() && (
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px' }}>
              * Anda hanya memiliki akses baca (View Only) di halaman ini.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}