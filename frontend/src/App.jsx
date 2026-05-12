import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  // Tambahkan ini di dalam objek styles lo yang sudah ada
  commentBox: {
    fontStyle: 'italic',
    color: '#475569',
    backgroundColor: '#f8fafc',
    padding: '10px 15px',
    borderRadius: '10px',
    borderLeft: '4px solid #10b981',
    display: 'inline-block',
    fontSize: '13px',
    lineHeight: '1.5'
  },
  schoolTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1e293b',
    fontWeight: '700'
  },
  ratingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  linkBukti: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    transition: '0.3s'
  }
};

// --- DASHBOARD STYLES ---
const ds = {
  container:    { display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f0fdf8', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  sidebar:      { width: '280px', backgroundColor: '#1e293b', color: 'white', padding: '25px', display: 'flex', flexDirection: 'column' },
  main:         { flex: 1, padding: '40px', height: '100vh', overflowY: 'auto', position: 'relative' },
  navItem:      { padding: '18px 20px', cursor: 'pointer', borderRadius: '12px', marginBottom: '10px', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '500' },
  card:         { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)', position: 'relative', zIndex: 1 },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' },
  modalCard:    { background: 'white', padding: '32px 28px', borderRadius: '20px', width: '460px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' },
};

  const API_URL = 'http://localhost:5173/api';

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/${page}`);
      setData(res.data);
    } catch { setData([]); }
  };

  useEffect(() => { if (user) fetchData(); }, [page, user]);

  // ── CRUD handlers ──
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await axios.delete(`${API_URL}/${page}/${id}`);
      fetchData();
    } catch { alert('Gagal menghapus data.'); }
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${page}/${editId}`, formData);
      } else {
        await axios.post(`${API_URL}/${page}`, formData);
      }
      setShowModal(false);
      setFormData({});
      setEditId(null);
      fetchData();
    } catch { alert('Gagal menyimpan data.'); }
  };

  const openTambah = (defaultData = {}) => {
    setEditId(null);
    setFormData(defaultData);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setFormData({ ...item });
    setShowModal(true);
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
    } catch { alert('Email atau Password salah!'); }
    finally { setIsLoading(false); }
  };

  const menuConfig = {
    menu:    { title: 'Daftar Menu Makanan',    icon: '🍱' },
    siswa:   { title: 'Manajemen Data Siswa',   icon: '👥' },
    sekolah: { title: 'Manajemen Data Sekolah', icon: '🏫' },
    jadwal:  { title: 'Jadwal Distribusi MBG',  icon: '🚚',
      headers: ['Tanggal', 'Sekolah', 'Menu'],
      render: (it) => <><td style={{ padding: '16px', fontSize: '14px' }}>{it.tanggal}</td><td style={{ padding: '16px', fontSize: '14px' }}>{it.nama_sekolah}</td><td style={{ padding: '16px', fontSize: '14px' }}>{it.nama_menu}</td></>,
    },
    laporan: { title: 'Feedback & Laporan',     icon: '📊',
      headers: ['Sekolah', 'Komentar', 'Rating'],
      render: (it) => <><td style={{ padding: '16px', fontSize: '14px' }}>{it.nama_sekolah}</td><td style={{ padding: '16px', fontSize: '14px' }}>{it.komentar}</td><td style={{ padding: '16px', fontSize: '14px' }}>{it.rating} ★</td></>,
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
  title: 'Laporan Feedback', 
  icon: '📊', 
  headers: ['Sekolah', 'Komentar', 'Rating', 'Bukti'], 
  canCRUD: true, 
  fields: ['komentar', 'rating', 'foto'], 
  render: (item) => {
    const getStatusColor = (rating) => {
      if (rating <= 2) return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
      if (rating === 3) return { bg: '#fffbeb', border: '#f59e0b', text: '#854d0e' };
      return { bg: '#f0fdf4', border: '#10b981', text: '#166534' };
    };

    const colors = getStatusColor(item.rating);

    return (
      <>
        {/* 1. Kolom Sekolah/Pengirim (LOGIKA ICON DI SINI) */}
        <td style={styles.td}>
          <div style={styles.schoolTag}>
            {/* Jika yang ngirim punya role admin (ID biasanya 1 atau cek nama), kasih icon beda */}
            <span style={{fontSize: '18px'}}>
              {item.user_id === 1 ? '🛡️' : '🏫'} 
            </span>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <span>{item.nama_sekolah || `ID: ${item.user_id}`}</span>
              {item.user_id === 1 && (
                <small style={{color: '#6366f1', fontSize: '10px'}}>OFFICIAL ADMIN</small>
              )}
            </div>
          </div>
        </td> 

        {/* 2. Kolom Komentar */}
        <td style={styles.td}>
          <div style={{
            ...styles.commentBox,
            backgroundColor: colors.bg,
            borderLeftColor: colors.border,
            color: colors.text
          }}>
            "{item.komentar}"
          </div>
        </td>

        {/* ... sisa kolom Rating dan Bukti tetap sama seperti sebelumnya ... */}
        <td style={styles.td}>
          <div style={styles.ratingWrapper}>
            <div>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < item.rating ? colors.border : '#e2e8f0', fontSize: '18px' }}>★</span>
              ))}
            </div>
            <small style={{ color: '#94a3b8', fontWeight: '500' }}>Skor: {item.rating}/5</small>
          </div>
        </td>

        <td style={styles.td}>
          {item.foto_bukti_url ? (
            <a href={`http://localhost:5173/${item.foto_bukti_url}`} target="_blank" rel="noreferrer" style={styles.linkBukti}>
              🖼️ Lihat Bukti
            </a>
          ) : (
            <span style={{ color: '#cbd5e1', fontSize: '13px' }}>🚫 Tanpa Foto</span>
          )}
        </td>
      </>
    );
  }
}
  };

  // ── Login Screen ──
  if (!user) {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a1628', color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
        <OrbBackground />
        <div className="mbg-logo-box" style={{ marginBottom: '18px', zIndex: 1 }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, animation: 'pulse-glow 3s infinite' }}>MBG</div>
        </div>
        <h1 className="mbg-hero-title" style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.4rem', color: '#10b981', zIndex: 1 }}>MBG Project</h1>
        <div ref={cardRef} className="mbg-card" style={{ position: 'relative', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.11)', padding: '34px 30px', borderRadius: '24px', width: '390px', zIndex: 1 }}>
          <CursorGlow cardRef={cardRef} />
          <h2 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Selamat Datang</h2>
          <p style={{ fontSize: '0.78rem', color: 'rgba(148,163,184,0.65)', marginBottom: '26px' }}>Masuk untuk mengakses sistem</p>
          <form onSubmit={handleLogin}>
            <input className="mbg-input-field" type="email" placeholder="Email" required onChange={e => setCredentials({ ...credentials, email: e.target.value })} />
            <input className="mbg-input-field" type="password" placeholder="Password" required onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
            <button type="submit" className="mbg-btn-login" disabled={isLoading}>
              {isLoading ? <><div className="mbg-spinner" /> Memuat...</> : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  const fields = MODAL_FIELDS[page] || [];
  const modalTitle = editId
    ? `Edit ${menuConfig[page]?.title || page}`
    : `Tambah ${menuConfig[page]?.title || page}`;

  return (
    <div style={ds.container}>
      {/* ── Modal ── */}
      {showModal && (
        <div style={ds.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={ds.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#0f172a' }}>
              {modalTitle}
            </h3>
            <form onSubmit={handleSimpan}>
              {fields.map(f => (
                <div key={f.key}>
                  <label className="modal-label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="modal-input"
                      placeholder={f.placeholder}
                      value={formData[f.key] || ''}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      rows={3}
                      style={{ resize: 'vertical', lineHeight: '1.5' }}
                    />
                  ) : (
                    <input
                      className="modal-input"
                      type={f.type || 'text'}
                      placeholder={f.placeholder}
                      value={formData[f.key] || ''}
                      onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                      required={f.key !== 'deskripsi'}
                    />
                  )}
                </div>
              ))}
              <div className="modal-btn-row">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="modal-btn-save">
                  {editId ? '💾 Simpan Perubahan' : '+ Tambah Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <div style={ds.sidebar}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '40px' }}>MBG Group</div>
        {Object.entries(menuConfig).map(([key, cfg]) => (
          <div
            key={key}
            onClick={() => setPage(key)}
            style={{ ...ds.navItem, backgroundColor: page === key ? '#10b981' : 'transparent', color: page === key ? 'white' : '#94a3b8' }}
          >
            {cfg.icon} {cfg.title}
          </div>
        ))}
        <div onClick={() => setUser(null)} style={{ ...ds.navItem, marginTop: 'auto', color: '#f87171' }}>
          🚪 Keluar
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={ds.main}>
        <div style={ds.card}>
          <h2 style={{ marginBottom: '25px', fontFamily: "'Sora', sans-serif" }}>
            {menuConfig[page].title}
          </h2>

          {page === 'menu' ? (
            <MenuPage
              data={data}
              user={user}
              onDelete={handleDelete}
              onTambah={() => openTambah()}
              onEdit={openEdit}
            />
          ) : page === 'siswa' ? (
            <SiswaPage
              data={data}
              user={user}
              onDelete={handleDelete}
              onTambah={() => openTambah()}
              onEdit={openEdit}
            />
          ) : page === 'sekolah' ? (
            <SekolahPage
              data={data}
              user={user}
              onDelete={handleDelete}
              onTambah={() => openTambah({ role: 'sekolah' })}
            />
          ) : (
            /* Jadwal & Laporan — generic table */
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="siswa-th" style={{ width: '48px' }}>No</th>
                  {menuConfig[page].headers?.map(h => <th key={h} className="siswa-th">{h}</th>)}
                  <th className="siswa-th" style={{ width: '80px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan={10} className="siswa-empty">Data tidak ditemukan.</td></tr>
                ) : data.map((it, i) => (
                  <tr key={i} className="siswa-row">
                    <td className="siswa-td" style={{ color: '#94a3b8' }}>{i + 1}</td>
                    {menuConfig[page].render(it)}
                    <td className="siswa-td">
                      <button className="siswa-del-btn" onClick={() => handleDelete(it.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

