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

  .mbg-logo-box { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.05s; }
  .mbg-hero-title { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.15s; }
  .mbg-hero-sub { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.22s; }
  .mbg-card { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.32s; }
  .mbg-footer { animation: fadeIn 0.8s ease both; animation-delay: 0.6s; }

  .mbg-input-field {
    width: 100%; padding: 11px 14px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.9);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.88rem; outline: none;
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
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white; border: none; border-radius: 11px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.92rem; font-weight: 600; cursor: pointer;
    margin-top: 8px; letter-spacing: 0.01em;
    box-shadow: 0 4px 20px rgba(16,185,129,0.3);
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease, opacity 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
  }
  .mbg-btn-login:not(:disabled):hover { transform: scale(1.035) translateY(-1px); box-shadow: 0 8px 28px rgba(16,185,129,0.5); }
  .mbg-btn-login:not(:disabled):active { transform: scale(0.97); }
  .mbg-btn-login:disabled { cursor: not-allowed; opacity: 0.8; }
  .mbg-btn-login::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
    background-size: 200% 100%; opacity: 0; transition: opacity 0.2s;
  }
  .mbg-btn-login:not(:disabled):hover::after { opacity: 1; animation: shimmer 0.8s linear; }

  .mbg-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
    border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0;
  }

  .orb { position: absolute; border-radius: 50%; pointer-events: none; animation: floatOrb linear infinite; }

  .food-float {
    position: absolute; pointer-events: none; user-select: none;
    opacity: 0.2; animation: floatFood ease-in-out infinite;
    font-size: 1.7rem; line-height: 1;
  }

  .dash-btn {
    padding: 12px 24px; background-color: #10b981; color: white;
    border: none; border-radius: 11px; cursor: pointer; font-weight: 600;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(16,185,129,0.2);
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s;
  }
  .dash-btn:hover { transform: scale(1.04) translateY(-1px); box-shadow: 0 8px 24px rgba(16,185,129,0.4); }

  /* ── Stats & Toolbar ── */
  .siswa-stat-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px;
  }
  .siswa-stat-card {
    background: #f8fafc; border-radius: 14px; padding: 16px 18px;
    border: 1px solid #e2e8f0;
  }
  .siswa-stat-label { font-size: 11px; color: #94a3b8; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; }
  .siswa-stat-val { font-size: 26px; font-weight: 700; color: #0f172a; font-family: 'Sora', sans-serif; }
  .siswa-stat-sub { font-size: 11px; color: #cbd5e1; margin-top: 2px; }

  .siswa-toolbar {
    display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap;
  }
  .siswa-search {
    flex: 1; min-width: 180px; padding: 9px 14px 9px 36px;
    border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif; color: #334155; outline: none;
    background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 12px center;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .siswa-search:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
  .siswa-filter {
    padding: 9px 12px; border: 1px solid #e2e8f0; border-radius: 10px;
    font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
    color: #334155; background: #f8fafc; outline: none; cursor: pointer;
  }

  /* ── Table ── */
  .siswa-table { width: 100%; border-collapse: collapse; }
  .siswa-th {
    text-align: left; padding: 10px 14px; font-size: 11px; font-weight: 600;
    color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em;
    border-bottom: 2px solid #f1f5f9;
  }
  .siswa-td { padding: 13px 14px; border-bottom: 1px solid #f8fafc; font-size: 13px; color: #334155; vertical-align: middle; }
  .siswa-row:hover td { background: #f8fafc; }
  .siswa-row:last-child td { border-bottom: none; }

  .siswa-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; margin-right: 10px; flex-shrink: 0;
  }
  .siswa-name-cell { display: flex; align-items: center; }
  .siswa-kelas-badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    background: #dcfce7; color: #166534;
  }
  .badge-school-admin { background: #fef9c3; color: #854d0e; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-school-user  { background: #e0f2fe; color: #075985; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }

  .siswa-del-btn {
    background: none; border: none; cursor: pointer; color: #cbd5e1;
    font-size: 16px; padding: 4px 8px; border-radius: 8px; transition: 0.15s;
  }
  .siswa-del-btn:hover { background: #fee2e2; color: #ef4444; }
  .siswa-edit-btn {
    background: none; border: none; cursor: pointer; color: #cbd5e1;
    font-size: 16px; padding: 4px 8px; border-radius: 8px; transition: 0.15s;
  }
  .siswa-edit-btn:hover { background: #dbeafe; color: #1d4ed8; }

  .siswa-empty {
    text-align: center; padding: 48px 20px; color: #94a3b8; font-size: 14px;
  }

  /* ── Pagination ── */
  .pg-wrap { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; flex-wrap: wrap; gap: 10px; }
  .pg-info { font-size: 12px; color: #94a3b8; }
  .pg-btns { display: flex; gap: 4px; align-items: center; }
  .pg-btn {
    min-width: 34px; height: 34px; border: 1px solid #e2e8f0; border-radius: 8px;
    background: white; color: #334155; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; padding: 0 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .pg-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
  .pg-btn.active { background: #10b981; color: white; border-color: #10b981; font-weight: 600; }
  .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .pg-dots { padding: 0 4px; color: #cbd5e1; font-size: 13px; }

  /* ── Menu Card View ── */
  .menu-card-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 8px;
  }
  .menu-card {
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;
    padding: 20px 18px; display: flex; flex-direction: column; gap: 10px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .menu-card:hover { box-shadow: 0 8px 24px rgba(16,185,129,0.12); transform: translateY(-2px); }
  .menu-card-name { font-size: 14px; font-weight: 600; color: #0f172a; }
  .menu-card-energy {
    display: inline-flex; align-items: center; gap: 6px;
    background: #dcfce7; color: #166534;
    padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
    width: fit-content;
  }
  .menu-card-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; border-top: 1px solid #f1f5f9; }
  .menu-card-btn {
    flex: 1; padding: 7px; border-radius: 10px; border: none; font-size: 12px;
    font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
    transition: all 0.15s;
  }
  .menu-card-btn.edit { background: #dbeafe; color: #1d4ed8; }
  .menu-card-btn.edit:hover { background: #bfdbfe; }
  .menu-card-btn.del  { background: #fee2e2; color: #dc2626; }
  .menu-card-btn.del:hover  { background: #fecaca; }
  .menu-view-toggle { display: flex; gap: 6px; }
  .menu-toggle-btn {
    padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 10px;
    background: #f8fafc; color: #64748b; cursor: pointer; font-size: 13px;
    transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .menu-toggle-btn.active { background: #10b981; color: white; border-color: #10b981; }

  /* ── Modal Form ── */
  .modal-label {
    display: block; font-size: 11px; font-weight: 600; color: #64748b;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px;
  }
  .modal-input {
    width: 100%; padding: 10px 12px; margin-bottom: 16px;
    border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a;
    background: #f8fafc; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .modal-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); background: white; }
  .modal-btn-row { display: flex; gap: 8px; margin-top: 4px; }
  .modal-btn-cancel {
    flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px;
    background: #f8fafc; color: #64748b; cursor: pointer; font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;
    transition: background 0.15s;
  }
  .modal-btn-cancel:hover { background: #f1f5f9; }
  .modal-btn-save {
    flex: 1; padding: 10px; border: none; border-radius: 10px;
    background: #10b981; color: white; cursor: pointer; font-size: 13px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
    box-shadow: 0 4px 12px rgba(16,185,129,0.25);
    transition: background 0.15s, transform 0.15s;
  }
  .modal-btn-save:hover { background: #059669; transform: translateY(-1px); }
`;

// --- UTILS ---
const AVATAR_COLORS = [
  { bg: '#E6F1FB', color: '#0C447C' }, { bg: '#E1F5EE', color: '#085041' },
  { bg: '#EEEDFE', color: '#3C3489' }, { bg: '#FAEEDA', color: '#633806' },
  { bg: '#FAECE7', color: '#712B13' }, { bg: '#EAF3DE', color: '#27500A' },
];
function avatarColor(id) { return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length]; }
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}
function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

const PER_PAGE = 10;

// --- COMPONENTS ---
function OrbBackground() {
  const ORBS = [
    { w: 420, h: 420, top: '-100px', left: '-100px', color: 'rgba(16,185,129,0.13)', dur: '18s', delay: '0s' },
    { w: 320, h: 320, top: 'auto', left: 'auto', bottom: '-80px', right: '-80px', color: 'rgba(16,185,129,0.09)', dur: '22s', delay: '-7s' },
  ];
  const FOOD_EMOJIS = [
    { emoji: '🍱', top: '8%',  left: '5%',  dur: '14s', rotate: '-12deg' },
    { emoji: '🥗', top: '15%', left: '88%', dur: '17s', rotate: '8deg' },
    { emoji: '🥛', top: '80%', left: '82%', dur: '16s', rotate: '-8deg' },
  ];
  return (
    <>
      {ORBS.map((o, i) => (
        <div key={`orb-${i}`} className="orb" style={{
          width: o.w, height: o.h,
          top: o.top || 'auto', left: o.left || 'auto',
          bottom: o.bottom || 'auto', right: o.right || 'auto',
          background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          animationDuration: o.dur, animationDelay: o.delay,
        }} />
      ))}
      {FOOD_EMOJIS.map((f, i) => (
        <div key={`food-${i}`} className="food-float" style={{
          top: f.top, left: f.left,
          animationDuration: f.dur,
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
    const card = cardRef.current; const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    glow.style.background = `radial-gradient(260px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(16,185,129,0.12), transparent 70%)`;
    glow.style.opacity = '1';
  }, []);
  const handleMouseLeave = useCallback(() => { if (glowRef.current) glowRef.current.style.opacity = '0'; }, []);
  useEffect(() => {
    const card = cardRef.current; if (!card) return;
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);
  return (
    <div ref={glowRef} style={{ position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none', opacity: 0, transition: 'opacity 0.3s', zIndex: 0 }} />
  );
}

// --- PAGE: MENU (FULL CRUD) ---
function MenuPage({ data, onDelete, onEdit, onTambah, user }) {
  const [search, setSearch]           = useState('');
  const [view, setView]               = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [jadwalData, setJadwalData]   = useState([]);

  useEffect(() => { setCurrentPage(1); }, [data, search]);

  // Fetch jadwal untuk hitung top pesanan
  useEffect(() => {
    axios.get('http://localhost:5000/api/jadwal')
      .then(res => setJadwalData(res.data || []))
      .catch(() => setJadwalData([]));
  }, []);

  // Hitung frekuensi tiap nama_menu dari jadwal
  const topPesanan = Object.entries(
    jadwalData.reduce((acc, j) => {
      const name = j.nama_menu || 'Tidak diketahui';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // ambil top 3

  const filtered = data.filter(m =>
    !search || (m.nama_menu || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData   = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const startIdx   = (currentPage - 1) * PER_PAGE;

  const MEDAL = ['🥇', '🥈', '🥉'];
  const MEDAL_COLORS = [
    { bg: '#fef9c3', color: '#854d0e', bar: '#fbbf24' },
    { bg: '#f1f5f9', color: '#334155', bar: '#94a3b8' },
    { bg: '#fef3c7', color: '#92400e', bar: '#d97706' },
  ];
  const maxCount = topPesanan[0]?.[1] || 1;

  return (
    <>
      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '24px' }}>
        {/* Total Menu card */}
        <div className="siswa-stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="siswa-stat-label">Total Menu</div>
          <div className="siswa-stat-val">{data.length}</div>
          <div className="siswa-stat-sub">tersedia</div>
        </div>

        {/* Top Pesanan card */}
        <div className="siswa-stat-card" style={{ padding: '16px 20px' }}>
          <div className="siswa-stat-label" style={{ marginBottom: '12px' }}>🏆 Top Pesanan Terbanyak</div>
          {topPesanan.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#cbd5e1', fontStyle: 'italic' }}>
              Belum ada data jadwal distribusi.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topPesanan.map(([nama, count], i) => {
                const mc = MEDAL_COLORS[i] || MEDAL_COLORS[2];
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={nama} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{MEDAL[i]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{
                          fontSize: '12px', fontWeight: 600, color: '#0f172a',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          maxWidth: '65%',
                        }}>{nama}</span>
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          background: mc.bg, color: mc.color,
                          padding: '1px 8px', borderRadius: '20px',
                        }}>{count}x</span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: mc.bar, borderRadius: '4px',
                          transition: 'width 0.6s ease',
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="siswa-toolbar">
        <input
          className="siswa-search"
          type="text"
          placeholder="Cari nama menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="menu-view-toggle">
          <button
            className={`menu-toggle-btn${view === 'table' ? ' active' : ''}`}
            onClick={() => setView('table')}
            title="Tampilan Tabel"
          >☰ Tabel</button>
          <button
            className={`menu-toggle-btn${view === 'card' ? ' active' : ''}`}
            onClick={() => setView('card')}
            title="Tampilan Kartu"
          >⊞ Kartu</button>
        </div>
        {user?.role === 'admin' && (
          <button
            className="dash-btn"
            style={{ padding: '9px 18px', fontSize: '13px' }}
            onClick={onTambah}
          >
            + Tambah Menu
          </button>
        )}
      </div>

      {/* Table View */}
      {view === 'table' && (
        <table className="siswa-table">
          <thead>
            <tr>
              <th className="siswa-th" style={{ width: '48px' }}>No</th>
              <th className="siswa-th">Nama Menu & Isi Paket</th>
              <th className="siswa-th" style={{ width: '130px' }}>Energi (kkal)</th>
              {user?.role === 'admin' && (
                <th className="siswa-th" style={{ width: '100px' }}>Aksi</th>
              )}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={4} className="siswa-empty">Menu tidak ditemukan.</td></tr>
            ) : pageData.map((item, i) => {
              const ac = avatarColor(item.id);
              // parse deskripsi: jika ada koma/titik koma, tampilkan sebagai tags
              const deskripsiBullets = item.deskripsi
                ? item.deskripsi.split(/[,;]+/).map(s => s.trim()).filter(Boolean)
                : [];
              return (
                <tr key={item.id || i} className="siswa-row">
                  <td className="siswa-td" style={{ color: '#94a3b8', verticalAlign: 'top', paddingTop: '16px' }}>{startIdx + i + 1}</td>
                  <td className="siswa-td">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div
                        className="siswa-avatar"
                        style={{ background: ac.bg, color: ac.color, borderRadius: '10px', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}
                      >
                        🍽️
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: deskripsiBullets.length ? '6px' : 0 }}>
                          {item.nama_menu}
                        </div>
                        {deskripsiBullets.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {deskripsiBullets.map((b, bi) => (
                              <span key={bi} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                background: '#f1f5f9', color: '#475569',
                                fontSize: '11px', fontWeight: 500,
                                padding: '3px 9px', borderRadius: '20px',
                                border: '1px solid #e2e8f0',
                              }}>
                                <span style={{ color: '#10b981', fontSize: '10px' }}>●</span> {b}
                              </span>
                            ))}
                          </div>
                        )}
                        {!item.deskripsi && (
                          <span style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic' }}>
                            Belum ada deskripsi isi paket
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="siswa-td" style={{ verticalAlign: 'top', paddingTop: '16px' }}>
                    <span className="siswa-kelas-badge">{item.kalori} kkal</span>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="siswa-td" style={{ verticalAlign: 'top', paddingTop: '12px' }}>
                      <button className="siswa-edit-btn" onClick={() => onEdit(item)} title="Edit">✏️</button>
                      <button className="siswa-del-btn"  onClick={() => onDelete(item.id)} title="Hapus">🗑️</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Card View */}
      {view === 'card' && (
        <div className="menu-card-grid">
          {pageData.length === 0 ? (
            <p className="siswa-empty">Menu tidak ditemukan.</p>
          ) : pageData.map((item) => {
            const deskripsiBullets = item.deskripsi
              ? item.deskripsi.split(/[,;]+/).map(s => s.trim()).filter(Boolean)
              : [];
            return (
              <div key={item.id} className="menu-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '26px' }}>🍽️</div>
                  <span className="menu-card-energy">⚡ {item.kalori} kkal</span>
                </div>
                <div className="menu-card-name">{item.nama_menu}</div>
                {deskripsiBullets.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                    {deskripsiBullets.map((b, bi) => (
                      <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#475569' }}>
                        <span style={{ color: '#10b981', fontSize: '10px', flexShrink: 0 }}>●</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic' }}>
                    Belum ada deskripsi isi paket
                  </div>
                )}
                {user?.role === 'admin' && (
                  <div className="menu-card-actions">
                    <button className="menu-card-btn edit" onClick={() => onEdit(item)}>✏️ Edit</button>
                    <button className="menu-card-btn del"  onClick={() => onDelete(item.id)}>🗑️ Hapus</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pg-wrap">
          <span className="pg-info">
            Menampilkan {startIdx + 1}–{Math.min(startIdx + PER_PAGE, filtered.length)} dari {filtered.length} menu
          </span>
          <div className="pg-btns">
            <button className="pg-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
            {buildPages(currentPage, totalPages).map((p, i) =>
              p === '...'
                ? <span key={`d${i}`} className="pg-dots">…</span>
                : <button key={p} className={`pg-btn${p === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
            )}
            <button className="pg-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      )}
    </>
  );
}

// --- PAGE: SISWA ---
function SiswaPage({ data, onDelete, onEdit, onTambah, user }) {
  const [search, setSearch]           = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [data, search, filterKelas]);

  const kelasList = [...new Set(data.map(d => d.kelas).filter(Boolean))].sort();
  const sekolahSet = new Set(data.map(d => d.sekolah_id).filter(Boolean));

  const filtered = data.filter(s => {
    const matchSearch = !search || (s.nama_siswa || '').toLowerCase().includes(search.toLowerCase());
    const matchKelas  = !filterKelas || s.kelas === filterKelas;
    return matchSearch && matchKelas;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData   = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const startIdx   = (currentPage - 1) * PER_PAGE;

  return (
    <>
      <div className="siswa-stat-grid">
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Siswa</div>
          <div className="siswa-stat-val">{data.length}</div>
          <div className="siswa-stat-sub">terdaftar</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Kelas</div>
          <div className="siswa-stat-val">{kelasList.length}</div>
          <div className="siswa-stat-sub">kelas aktif</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Sekolah</div>
          <div className="siswa-stat-val">{sekolahSet.size}</div>
          <div className="siswa-stat-sub">sekolah</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Halaman</div>
          <div className="siswa-stat-val">{currentPage}</div>
          <div className="siswa-stat-sub">dari {totalPages}</div>
        </div>
      </div>

      <div className="siswa-toolbar">
        <input className="siswa-search" type="text" placeholder="Cari nama siswa..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="siswa-filter" value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
          <option value="">Semua Kelas</option>
          {kelasList.map(k => <option key={k} value={k}>Kelas {k}</option>)}
        </select>
        {user?.role === 'admin' && (
          <button className="dash-btn" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={onTambah}>
            + Tambah Siswa
          </button>
        )}
      </div>

      <table className="siswa-table">
        <thead>
          <tr>
            <th className="siswa-th" style={{ width: '48px' }}>No</th>
            <th className="siswa-th">Nama Siswa</th>
            <th className="siswa-th">Kelas</th>
            <th className="siswa-th">ID Sekolah</th>
            {user?.role === 'admin' && <th className="siswa-th" style={{ width: '90px' }}>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><td colSpan={5} className="siswa-empty">Data tidak ditemukan.</td></tr>
          ) : pageData.map((item, i) => {
            const ac = avatarColor(item.id);
            return (
              <tr key={item.id || i} className="siswa-row">
                <td className="siswa-td" style={{ color: '#94a3b8' }}>{startIdx + i + 1}</td>
                <td className="siswa-td">
                  <div className="siswa-name-cell">
                    <div className="siswa-avatar" style={{ background: ac.bg, color: ac.color }}>{getInitials(item.nama_siswa)}</div>
                    <span style={{ fontWeight: 500 }}>{item.nama_siswa}</span>
                  </div>
                </td>
                <td className="siswa-td"><span className="siswa-kelas-badge">Kelas {item.kelas}</span></td>
                <td className="siswa-td"><code style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>{item.sekolah_id}</code></td>
                {user?.role === 'admin' && (
                  <td className="siswa-td">
                    <button className="siswa-edit-btn" onClick={() => onEdit(item)}>✏️</button>
                    <button className="siswa-del-btn" onClick={() => onDelete(item.id)}>🗑️</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pg-wrap">
          <span className="pg-info">
            Menampilkan {startIdx + 1}–{Math.min(startIdx + PER_PAGE, filtered.length)} dari {filtered.length} siswa
          </span>
          <div className="pg-btns">
            <button className="pg-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
            {buildPages(currentPage, totalPages).map((p, i) =>
              p === '...'
                ? <span key={`d${i}`} className="pg-dots">…</span>
                : <button key={p} className={`pg-btn${p === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
            )}
            <button className="pg-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      )}
    </>
  );
}

// --- PAGE: SEKOLAH ---
function SekolahPage({ data, onDelete, onTambah, user }) {
  const [search, setSearch]           = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = data.filter(s =>
    !search ||
    (s.nama  || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData   = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const startIdx   = (currentPage - 1) * PER_PAGE;

  return (
    <>
      <div className="siswa-stat-grid">
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Institusi</div>
          <div className="siswa-stat-val">{data.length}</div>
          <div className="siswa-stat-sub">terdaftar</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Admin Pusat</div>
          <div className="siswa-stat-val">{data.filter(s => s.role === 'admin').length}</div>
          <div className="siswa-stat-sub">pengelola</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Sekolah Aktif</div>
          <div className="siswa-stat-val">{data.filter(s => s.role === 'sekolah').length}</div>
          <div className="siswa-stat-sub">pengguna</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Status</div>
          <div className="siswa-stat-val" style={{ color: '#10b981' }}>Live</div>
          <div className="siswa-stat-sub">server normal</div>
        </div>
      </div>

      <div className="siswa-toolbar">
        <input className="siswa-search" type="text" placeholder="Cari sekolah atau email..." value={search} onChange={e => setSearch(e.target.value)} />
        {user?.role === 'admin' && (
          <button className="dash-btn" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={onTambah}>
            + Tambah Sekolah
          </button>
        )}
      </div>

      <table className="siswa-table">
        <thead>
          <tr>
            <th className="siswa-th" style={{ width: '48px' }}>No</th>
            <th className="siswa-th">Informasi Institusi</th>
            <th className="siswa-th">Email Kontak</th>
            <th className="siswa-th">Akses Sistem</th>
            {user?.role === 'admin' && <th className="siswa-th" style={{ width: '60px' }}>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><td colSpan={5} className="siswa-empty">Data tidak ditemukan.</td></tr>
          ) : pageData.map((item, i) => {
            const ac = avatarColor(item.id + 5);
            return (
              <tr key={item.id || i} className="siswa-row">
                <td className="siswa-td" style={{ color: '#94a3b8' }}>{startIdx + i + 1}</td>
                <td className="siswa-td">
                  <div className="siswa-name-cell">
                    <div className="siswa-avatar" style={{ background: ac.bg, color: ac.color, borderRadius: '10px' }}>{getInitials(item.nama)}</div>
                    <span style={{ fontWeight: 600 }}>{item.nama || 'Tanpa Nama'}</span>
                  </div>
                </td>
                <td className="siswa-td"><span style={{ color: '#64748b' }}>{item.email}</span></td>
                <td className="siswa-td">
                  <span className={item.role === 'admin' ? 'badge-school-admin' : 'badge-school-user'}>
                    {item.role?.toUpperCase()}
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td className="siswa-td">
                    <button className="siswa-del-btn" onClick={() => onDelete(item.id)}>🗑️</button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// --- MODAL FORM CONFIG ---
const MODAL_FIELDS = {
  menu: [
    { key: 'nama_menu',  label: 'Nama Menu',     placeholder: 'Contoh: Ayam Bakar', type: 'text' },
    { key: 'kalori',     label: 'Energi (kkal)', placeholder: 'Contoh: 400',        type: 'number' },
    { key: 'deskripsi',  label: 'Isi Paket (pisahkan dengan koma)', placeholder: 'Contoh: Nasi putih, Ayam bakar, Tempe goreng, Sayur lodeh, Buah jeruk', type: 'textarea' },
  ],
  siswa: [
    { key: 'nama_siswa', label: 'Nama Siswa', placeholder: 'Nama lengkap siswa', type: 'text' },
    { key: 'kelas',      label: 'Kelas',      placeholder: 'Contoh: 5A',         type: 'text' },
    { key: 'sekolah_id', label: 'ID Sekolah', placeholder: 'ID sekolah',         type: 'number' },
  ],
  sekolah: [
    { key: 'nama',          label: 'Nama Sekolah', placeholder: 'Nama institusi', type: 'text' },
    { key: 'email',         label: 'Email',        placeholder: 'email@sekolah.id', type: 'email' },
    { key: 'password_hash', label: 'Password',     placeholder: 'Password',       type: 'password' },
    { key: 'role',          label: 'Role',         placeholder: 'sekolah',        type: 'text' },
  ],
  jadwal:  [{ key: 'tanggal', label: 'Tanggal', placeholder: 'YYYY-MM-DD', type: 'date' }],
  laporan: [
    { key: 'komentar', label: 'Komentar', placeholder: 'Tulis komentar...', type: 'text' },
    { key: 'rating',   label: 'Rating',   placeholder: '1–5',               type: 'number' },
  ],
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

// --- MAIN APP ---
export default function App() {
  const [user, setUser]               = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading]     = useState(false);
  const [page, setPage]               = useState('menu');
  const [data, setData]               = useState([]);
  const [showModal, setShowModal]     = useState(false);
  const [editId, setEditId]           = useState(null);
  const [formData, setFormData]       = useState({});

  const cardRef  = useRef(null);
  const API_URL  = 'http://localhost:5000/api';

  // inject global CSS once
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => { try { document.head.removeChild(el); } catch {} };
  }, []);

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
}
