import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import LandingPage from './LandingPage'; 

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

  .sidebar-bg {
    width: 280px;
    background-color: #0f172a;
    background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px);
    background-size: 32px 32px;
    background-position: 0 0;
    color: white;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
    z-index: 10;
  }

  .sidebar-nav-item {
    padding: 16px 20px;
    cursor: pointer;
    border-radius: 16px;
    margin-bottom: 8px;
    transition: all 0.25s ease;
    display: flex;
    align-items: center;
    gap: 16px;
    font-weight: 500;
    font-size: 15px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #f8fafc;
    text-decoration: none;
  }

  .sidebar-nav-item.active {
    background-color: #2c3e56; 
    color: #10b981; 
    font-weight: 600;
  }

  .sidebar-nav-item:not(.active):hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .logout-link {
    color: #ef4444;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
    display: inline-block;
    padding: 4px 8px;
  }
  .logout-link:hover { opacity: 0.7; }

  .mbg-logo-box { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.05s; }
  .mbg-hero-title { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.15s; }
  .mbg-hero-sub { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.22s; }
  .mbg-card { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.32s; }

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

  .siswa-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .siswa-stat-card { background: #f8fafc; border-radius: 14px; padding: 16px 18px; border: 1px solid #e2e8f0; }
  .siswa-stat-label { font-size: 11px; color: #94a3b8; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px; }
  .siswa-stat-val { font-size: 26px; font-weight: 700; color: #0f172a; font-family: 'Sora', sans-serif; }
  .siswa-stat-sub { font-size: 11px; color: #cbd5e1; margin-top: 2px; }

  .siswa-toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
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
  .siswa-kelas-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #dcfce7; color: #166534; }
  .badge-school-admin { background: #fef9c3; color: #854d0e; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .badge-school-user  { background: #e0f2fe; color: #075985; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }

  .siswa-del-btn, .siswa-edit-btn { background: none; border: none; cursor: pointer; color: #cbd5e1; font-size: 16px; padding: 4px 8px; border-radius: 8px; transition: 0.15s; }
  .siswa-del-btn:hover { background: #fee2e2; color: #ef4444; }
  .siswa-edit-btn:hover { background: #dbeafe; color: #1d4ed8; }
  .siswa-empty { text-align: center; padding: 48px 20px; color: #94a3b8; font-size: 14px; }

  .pg-wrap { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; flex-wrap: wrap; gap: 10px; }
  .pg-info { font-size: 12px; color: #94a3b8; }
  .pg-btns { display: flex; gap: 4px; align-items: center; }
  .pg-btn {
    min-width: 34px; height: 34px; border: 1px solid #e2e8f0; border-radius: 8px;
    background: white; color: #334155; font-size: 13px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; padding: 0 8px;
    font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s, border-color 0.15s;
  }
  .pg-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
  .pg-btn.active { background: #10b981; color: white; border-color: #10b981; font-weight: 600; }
  .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .pg-dots { padding: 0 4px; color: #cbd5e1; font-size: 13px; }

  .menu-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 8px; }
  .menu-card {
    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px;
    padding: 20px 18px; display: flex; flex-direction: column; gap: 10px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .menu-card:hover { box-shadow: 0 8px 24px rgba(16,185,129,0.12); transform: translateY(-2px); }
  .menu-card-name { font-size: 14px; font-weight: 600; color: #0f172a; }
  .menu-card-energy { display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; width: fit-content; }
  .menu-card-actions { display: flex; gap: 8px; margin-top: auto; padding-top: 10px; border-top: 1px solid #f1f5f9; }
  .menu-card-btn { flex: 1; padding: 7px; border-radius: 10px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.15s; }
  .menu-card-btn.edit { background: #dbeafe; color: #1d4ed8; }
  .menu-card-btn.edit:hover { background: #bfdbfe; }
  .menu-card-btn.del  { background: #fee2e2; color: #dc2626; }
  .menu-card-btn.del:hover  { background: #fecaca; }
  .menu-view-toggle { display: flex; gap: 6px; }
  .menu-toggle-btn { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; color: #64748b; cursor: pointer; font-size: 13px; transition: all 0.15s; font-family: 'Plus Jakarta Sans', sans-serif; }
  .menu-toggle-btn.active { background: #10b981; color: white; border-color: #10b981; }

  .modal-label { display: block; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 5px; }
  .modal-input { width: 100%; padding: 10px 12px; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; color: #0f172a; background: #f8fafc; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .modal-input:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); background: white; }
  .modal-btn-row { display: flex; gap: 8px; margin-top: 4px; }
  .modal-btn-cancel { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; color: #64748b; cursor: pointer; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; transition: background 0.15s; }
  .modal-btn-cancel:hover { background: #f1f5f9; }
  .modal-btn-save { flex: 1; padding: 10px; border: none; border-radius: 10px; background: #10b981; color: white; cursor: pointer; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; box-shadow: 0 4px 12px rgba(16,185,129,0.25); transition: background 0.15s, transform 0.15s; }
  .modal-btn-save:hover { background: #059669; transform: translateY(-1px); }
`;

// --- UTILS & GLOBAL CSS ---
function useGlobalStyle(css) {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [css]);
}

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
const API_URL = 'http://localhost:5173/api';

const styles = {
  td: { padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#334155' },
  badge: { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
  commentBox: { fontStyle: 'italic', color: '#475569', backgroundColor: '#f8fafc', padding: '10px 15px', borderRadius: '10px', borderLeft: '4px solid #10b981', display: 'inline-block', fontSize: '13px', lineHeight: '1.5' },
  schoolTag: { display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: '700' },
  ratingWrapper: { display: 'flex', flexDirection: 'column', gap: '2px' },
  linkBukti: { color: '#2563eb', textDecoration: 'none', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', backgroundColor: '#eff6ff', borderRadius: '8px', transition: '0.3s' }
};

// --- ANIMATION COMPONENTS ---
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

// ==========================================
// 1. CONTEXT API (SPRINT 13 - GLOBAL STATE)
// ==========================================

export const AuthContext = createContext();
export const LaporanContext = createContext();

function AuthProvider({ children }) {
  // Global State Management untuk Session User
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('auth_token')) || null);

  const login = (userData) => {
    localStorage.setItem('auth_token', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function LaporanProvider({ children }) {
  // Global State Management Khusus Laporan/Feedback
  const [laporanData, setLaporanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLaporan = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/laporan`);
      setLaporanData(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  return (
    <LaporanContext.Provider value={{ laporanData, fetchLaporan, isLoading, error }}>
      {children}
    </LaporanContext.Provider>
  );
}

// ==========================================
// 2. PROTECTED ROUTE (SPRINT 13)
// ==========================================
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// ==========================================
// 3. PAGE COMPONENTS (TETAP SAMA SEPERTI SEBELUMNYA)
// ==========================================

function MenuPage({ data, onDelete, onEdit, onTambah, user }) {
  const [search, setSearch]           = useState('');
  const [view, setView]               = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [jadwalData, setJadwalData]   = useState([]);

  useEffect(() => { setCurrentPage(1); }, [data, search]);

  useEffect(() => {
    axios.get('http://localhost:5173/api/jadwal')
      .then(res => setJadwalData(res.data || []))
      .catch(() => setJadwalData([]));
  }, []);

  const topPesanan = Object.entries(
    jadwalData.reduce((acc, j) => {
      const name = j.nama_menu || 'Tidak diketahui';
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '24px' }}>
        <div className="siswa-stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="siswa-stat-label">Total Menu</div>
          <div className="siswa-stat-val">{data.length}</div>
          <div className="siswa-stat-sub">tersedia</div>
        </div>
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

      <div className="siswa-toolbar">
        <input
          className="siswa-search"
          type="text"
          placeholder="Cari nama menu..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="menu-view-toggle">
          <button className={`menu-toggle-btn${view === 'table' ? ' active' : ''}`} onClick={() => setView('table')}>☰ Tabel</button>
          <button className={`menu-toggle-btn${view === 'card' ? ' active' : ''}`} onClick={() => setView('card')}>⊞ Kartu</button>
        </div>
        {user?.role === 'admin' && (
          <button className="dash-btn" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={onTambah}>
            + Tambah Menu
          </button>
        )}
      </div>

      {view === 'table' && (
        <table className="siswa-table">
          <thead>
            <tr>
              <th className="siswa-th" style={{ width: '48px' }}>No</th>
              <th className="siswa-th">Nama Menu & Isi Paket</th>
              <th className="siswa-th" style={{ width: '130px' }}>Energi (kkal)</th>
              {user?.role === 'admin' && <th className="siswa-th" style={{ width: '100px' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr><td colSpan={4} className="siswa-empty">Menu tidak ditemukan.</td></tr>
            ) : pageData.map((item, i) => {
              const ac = avatarColor(item.id);
              const deskripsiBullets = item.deskripsi ? item.deskripsi.split(/[,;]+/).map(s => s.trim()).filter(Boolean) : [];
              return (
                <tr key={item.id || i} className="siswa-row">
                  <td className="siswa-td" style={{ color: '#94a3b8', verticalAlign: 'top', paddingTop: '16px' }}>{startIdx + i + 1}</td>
                  <td className="siswa-td">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div className="siswa-avatar" style={{ background: ac.bg, color: ac.color, borderRadius: '10px', fontSize: '16px', flexShrink: 0, marginTop: '2px' }}>🍽️</div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: deskripsiBullets.length ? '6px' : 0 }}>{item.nama_menu}</div>
                        {deskripsiBullets.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {deskripsiBullets.map((b, bi) => (
                              <span key={bi} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#10b981', fontSize: '10px' }}>●</span> {b}
                              </span>
                            ))}
                          </div>
                        )}
                        {!item.deskripsi && <span style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic' }}>Belum ada deskripsi isi paket</span>}
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

      {view === 'card' && (
        <div className="menu-card-grid">
          {pageData.length === 0 ? (
            <p className="siswa-empty">Menu tidak ditemukan.</p>
          ) : pageData.map((item) => {
            const deskripsiBullets = item.deskripsi ? item.deskripsi.split(/[,;]+/).map(s => s.trim()).filter(Boolean) : [];
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
                        <span style={{ color: '#10b981', fontSize: '10px', flexShrink: 0 }}>●</span><span>{b}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic' }}>Belum ada deskripsi isi paket</div>
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

      {totalPages > 1 && (
        <div className="pg-wrap">
          <span className="pg-info">Menampilkan {startIdx + 1}–{Math.min(startIdx + PER_PAGE, filtered.length)} from {filtered.length} menu</span>
          <div className="pg-btns">
            <button className="pg-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
            {buildPages(currentPage, totalPages).map((p, i) => p === '...' ? <span key={`d${i}`} className="pg-dots">…</span> : <button key={p} className={`pg-btn${p === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>)}
            <button className="pg-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      )}
    </>
  );
}

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
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Kelas</div>
          <div className="siswa-stat-val">{kelasList.length}</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Sekolah</div>
          <div className="siswa-stat-val">{sekolahSet.size}</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Halaman</div>
          <div className="siswa-stat-val">{currentPage} / {totalPages}</div>
        </div>
      </div>

      <div className="siswa-toolbar">
        <input className="siswa-search" type="text" placeholder="Cari nama siswa..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="siswa-filter" value={filterKelas} onChange={e => setFilterKelas(e.target.value)}>
          <option value="">Semua Kelas</option>
          {kelasList.map(k => <option key={k} value={k}>Kelas {k}</option>)}
        </select>
        {user?.role === 'admin' && (
          <button className="dash-btn" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={onTambah}>+ Tambah Siswa</button>
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
          <span className="pg-info">Menampilkan {startIdx + 1}–{Math.min(startIdx + PER_PAGE, filtered.length)} dari {filtered.length} siswa</span>
          <div className="pg-btns">
            <button className="pg-btn" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>‹</button>
            {buildPages(currentPage, totalPages).map((p, i) => p === '...' ? <span key={`d${i}`} className="pg-dots">…</span> : <button key={p} className={`pg-btn${p === currentPage ? ' active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>)}
            <button className="pg-btn" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      )}
    </>
  );
}

function SekolahPage({ data, onDelete, onTambah, user }) {
  const [search, setSearch]           = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = data.filter(s =>
    !search || (s.nama  || '').toLowerCase().includes(search.toLowerCase()) || (s.email || '').toLowerCase().includes(search.toLowerCase())
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
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Admin Pusat</div>
          <div className="siswa-stat-val">{data.filter(s => s.role === 'admin').length}</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Sekolah Aktif</div>
          <div className="siswa-stat-val">{data.filter(s => s.role === 'sekolah').length}</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Status</div>
          <div className="siswa-stat-val" style={{ color: '#10b981' }}>Live</div>
        </div>
      </div>

      <div className="siswa-toolbar">
        <input className="siswa-search" type="text" placeholder="Cari sekolah atau email..." value={search} onChange={e => setSearch(e.target.value)} />
        {user?.role === 'admin' && <button className="dash-btn" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={onTambah}>+ Tambah Sekolah</button>}
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
                <td className="siswa-td"><span className={item.role === 'admin' ? 'badge-school-admin' : 'badge-school-user'}>{item.role?.toUpperCase()}</span></td>
                {user?.role === 'admin' && <td className="siswa-td"><button className="siswa-del-btn" onClick={() => onDelete(item.id)}>🗑️</button></td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function JadwalPage({ data, onDelete, onEdit, onTambah, user, menuList, sekolahList }) {
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage]   = useState(1);

  useEffect(() => { setCurrentPage(1); }, [data, search, filterStatus]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Selesai':    return { bg: '#dcfce7', color: '#166634', icon: '✅' };
      case 'Mendatang':  return { bg: '#e0f2fe', color: '#0369a1', icon: '⏳' };
      case 'Belum Siap': return { bg: '#fee2e2', color: '#991b1b', icon: '⚠️' };
      default:           return { bg: '#f1f5f9', color: '#64748b', icon: '❓' };
    }
  };

  const filtered = data.filter(j => {
    const statusData = j.status || 'Belum Siap';
    const namaMenuFilter   = menuList.find(m => m.id === j.menu_id)?.nama_menu   || j.nama_menu   || '';
    const namaSekolahFilter = sekolahList.find(s => s.id === j.sekolah_id)?.nama || j.nama_sekolah || '';
    const matchSearch = !search || namaSekolahFilter.toLowerCase().includes(search.toLowerCase()) || namaMenuFilter.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || statusData === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData   = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const startIdx   = (currentPage - 1) * PER_PAGE;

  return (
    <>
      <div className="siswa-stat-grid" style={{ marginBottom: '24px' }}>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Jadwal</div>
          <div className="siswa-stat-val">{data.length}</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Akan Datang</div>
          <div className="siswa-stat-val" style={{ color: '#0369a1' }}>{data.filter(d => (d.status || 'Belum Siap') === 'Mendatang').length}</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Belum Siap</div>
          <div className="siswa-stat-val" style={{ color: '#991b1b' }}>{data.filter(d => (d.status || 'Belum Siap') === 'Belum Siap').length}</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Selesai</div>
          <div className="siswa-stat-val" style={{ color: '#166634' }}>{data.filter(d => (d.status || 'Belum Siap') === 'Selesai').length}</div>
        </div>
      </div>

      <div className="siswa-toolbar">
        <input className="siswa-search" type="text" placeholder="Cari nama sekolah atau nama menu..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="siswa-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="Belum Siap">Belum Siap</option>
          <option value="Mendatang">Mendatang</option>
          <option value="Selesai">Selesai</option>
        </select>
        {user?.role === 'admin' && (
          <button className="dash-btn" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={() => onTambah({ status: 'Belum Siap' })}>+ Buat Jadwal</button>
        )}
      </div>

      <table className="siswa-table">
        <thead>
          <tr>
            <th className="siswa-th" style={{ width: '48px' }}>No</th>
            <th className="siswa-th">Jadwal & Menu</th>
            <th className="siswa-th">Target Sekolah</th>
            <th className="siswa-th">Status</th>
            {user?.role === 'admin' && <th className="siswa-th" style={{ width: '90px' }}>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr><td colSpan={5} className="siswa-empty">Data jadwal tidak ditemukan.</td></tr>
          ) : pageData.map((item, i) => {
            const status  = item.status || 'Belum Siap';
            const styling = getStatusStyle(status);
            const namaMenuSekarang    = menuList.find(m => m.id === item.menu_id)?.nama_menu || item.nama_menu   || 'Menu Dihapus / Tidak Valid';
            const namaSekolahSekarang = sekolahList.find(s => s.id === item.sekolah_id)?.nama || item.nama_sekolah || 'Sekolah Dihapus / Tidak Valid';

            return (
              <tr key={item.id || i} className="siswa-row">
                <td className="siswa-td" style={{ color: '#94a3b8', verticalAlign: 'top', paddingTop: '16px' }}>{startIdx + i + 1}</td>
                <td className="siswa-td">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>ID: #{item.id}</span>
                      <span>•</span><span>Menu: <strong>{namaMenuSekarang}</strong></span>
                    </div>
                  </div>
                </td>
                <td className="siswa-td">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🏫</div>
                    <div style={{ fontWeight: 500, color: '#334155' }}>{namaSekolahSekarang}</div>
                  </div>
                </td>
                <td className="siswa-td">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: styling.bg, color: styling.color, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                    {styling.icon} {status}
                  </span>
                </td>
                {user?.role === 'admin' && (
                  <td className="siswa-td" style={{ verticalAlign: 'middle' }}>
                    <button className="siswa-edit-btn" onClick={() => onEdit(item)} title="Edit">✏️</button>
                    <button className="siswa-del-btn"  onClick={() => onDelete(item.id)} title="Hapus">🗑️</button>
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

// --- PAGE: LAPORAN (SPRINT 13 - CONSUMING GLOBAL STATE CONTEXT API) ---
function LaporanPage({ onTambah, onEdit }) {
  // SPRINT 13: Panggil Data Laporan dari Context API
  const { laporanData, isLoading, error, fetchLaporan } = useContext(LaporanContext);
  const { user } = useContext(AuthContext); // SPRINT 13: Autentikasi Pengguna di Frontend[cite: 5]

  const getStatusColor = (rating) => {
    if (rating <= 2) return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
    if (rating === 3) return { bg: '#fffbeb', border: '#f59e0b', text: '#854d0e' };
    return { bg: '#f0fdf4', border: '#10b981', text: '#166534' };
  };

  const handleDeleteLocal = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await axios.delete(`http://localhost:5173/api/laporan/${id}`);
      fetchLaporan(); // Global state refresh
    } catch (err) {
      alert('Gagal menghapus data.');
    }
  };

  if (isLoading) return <p style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>Loading mengambil data laporan dari Global State...</p>;
  if (error) return <p style={{textAlign: 'center', padding: '20px', color: '#ef4444'}}>Error: {error}</p>;

  return (
    <>
      <div className="siswa-stat-grid" style={{ marginBottom: '20px' }}>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Total Ulasan</div>
          <div className="siswa-stat-val">{laporanData.length}</div>
          <div className="siswa-stat-sub">masuk ke sistem</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Rata-rata Rating</div>
          <div className="siswa-stat-val">
            {laporanData.length > 0 ? (laporanData.reduce((acc, curr) => acc + (curr.rating || 0), 0) / laporanData.length).toFixed(1) : '0.0'}
            <span style={{ fontSize: '16px', color: '#f59e0b', marginLeft: '4px' }}>★</span>
          </div>
          <div className="siswa-stat-sub">dari 5 bintang</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Ulasan Positif</div>
          <div className="siswa-stat-val" style={{ color: '#10b981' }}>{laporanData.filter(d => (d.rating || 0) >= 4).length}</div>
          <div className="siswa-stat-sub">rating 4 & 5</div>
        </div>
        <div className="siswa-stat-card">
          <div className="siswa-stat-label">Perlu Perhatian</div>
          <div className="siswa-stat-val" style={{ color: '#ef4444' }}>{laporanData.filter(d => (d.rating || 0) <= 2).length}</div>
          <div className="siswa-stat-sub">rating 1 & 2</div>
        </div>
      </div>

      <div className="siswa-toolbar" style={{ justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Daftar rincian feedback dari masing-masing instansi.</p>
        <button className="dash-btn" style={{ padding: '9px 18px', fontSize: '13px' }} onClick={() => onTambah()}>+ Tambah Data</button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th className="siswa-th" style={{ width: '48px' }}>No</th>
            <th className="siswa-th">Sekolah</th>
            <th className="siswa-th">Komentar</th>
            <th className="siswa-th">Rating</th>
            <th className="siswa-th">Bukti</th>
            <th className="siswa-th" style={{ width: '80px', textAlign: 'center' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {laporanData.length === 0 ? (
            <tr><td colSpan={6} className="siswa-empty">Data tidak ditemukan.</td></tr>
          ) : laporanData.map((item, i) => {
            const colors = getStatusColor(item.rating || 5);
            return (
              <tr key={item.id || i} className="siswa-row">
                <td className="siswa-td" style={{ color: '#94a3b8' }}>{i + 1}</td>
                <td style={styles.td}>
                  <div style={styles.schoolTag}>
                    <span style={{fontSize: '18px'}}>{item.user_id === 1 ? '🛡️' : '🏫'}</span>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      <span>{item.nama_sekolah || `ID: ${item.user_id}`}</span>
                      {item.user_id === 1 && <small style={{color: '#6366f1', fontSize: '10px'}}>OFFICIAL ADMIN</small>}
                    </div>
                  </div>
                </td> 
                <td style={styles.td}><div style={{ ...styles.commentBox, backgroundColor: colors.bg, borderLeftColor: colors.border, color: colors.text }}>"{item.komentar}"</div></td>
                <td style={styles.td}>
                  <div style={styles.ratingWrapper}>
                    <div>{[...Array(5)].map((_, i) => (<span key={i} style={{ color: i < (item.rating||0) ? colors.border : '#e2e8f0', fontSize: '18px' }}>★</span>))}</div>
                    <small style={{ color: '#94a3b8', fontWeight: '500' }}>Skor: {item.rating || 0}/5</small>
                  </div>
                </td>
                <td style={styles.td}>
                  {item.foto_bukti_url ? <a href={`http://localhost:5173/${item.foto_bukti_url}`} target="_blank" rel="noreferrer" style={styles.linkBukti}>🖼️ Lihat Bukti</a> : <span style={{ color: '#cbd5e1', fontSize: '13px' }}>🚫 Tanpa Foto</span>}
                </td>
                <td className="siswa-td" style={{ textAlign: 'center' }}>
                  {(user?.role === 'admin' || user?.id === item.user_id) ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                      <button className="siswa-edit-btn" onClick={() => onEdit(item)} title="Edit">✏️</button>
                      <button className="siswa-del-btn" onClick={() => handleDeleteLocal(item.id)} title="Hapus">🗑️</button>
                    </div>
                  ) : <span style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '500' }}>🔒 Terkunci</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// --- MODAL FIELDS CONFIG ---
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
    { key: 'nama',          label: 'Nama Sekolah', placeholder: 'Nama institusi',   type: 'text' },
    { key: 'email',         label: 'Email',        placeholder: 'email@sekolah.id', type: 'email' },
    { key: 'password_hash', label: 'Password',     placeholder: 'Password',         type: 'password' },
    { key: 'role',          label: 'Role',         placeholder: 'sekolah',          type: 'text' },
  ],
  jadwal: [
    { key: 'tanggal',    label: 'Tanggal Pengiriman', type: 'date' },
    { key: 'menu_id',    label: 'Paket Menu Makanan', type: 'select_menu' },
    { key: 'sekolah_id', label: 'Target Sekolah',     type: 'select_sekolah' },
    { key: 'status',     label: 'Status Distribusi',  type: 'select', options: ['Belum Siap', 'Mendatang', 'Selesai'] },
  ],
  laporan: [
    { key: 'komentar', label: 'Komentar', placeholder: 'Tulis komentar...', type: 'textarea' },
    { key: 'rating',   label: 'Rating',   type: 'rating' },
    { key: 'foto',     label: 'Upload Bukti (Opsional)', type: 'file' },
  ],
};

const ds = {
  container:    { display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f0fdf8', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  main:         { flex: 1, padding: '40px', height: '100vh', overflowY: 'auto', position: 'relative' },
  card:         { backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)', position: 'relative', zIndex: 1 },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(2px)' },
  modalCard:    { background: 'white', padding: '32px 28px', borderRadius: '20px', width: '460px', boxShadow: '0 24px 48px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' },
};

// ==========================================
// 4. MAIN APP CONTENT (SPRINT 11 - ROUTER & LAYOUT)
// ==========================================

function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const { fetchLaporan } = useContext(LaporanContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.replace('/', '') || 'laporan'; // Routing extraction

  const [data, setData]               = useState([]);
  const [menuList, setMenuList]       = useState([]);
  const [sekolahList, setSekolahList] = useState([]);
  const [showModal, setShowModal]     = useState(false);
  const [editId, setEditId]           = useState(null);
  const [formData, setFormData]       = useState({});

  const fetchData = useCallback(async () => {
    try {
      if (page === 'laporan') return; // Laporan dihandle Global State[cite: 5]
      const res = await axios.get(`${API_URL}/${page}`);
      setData(res.data);
    } catch { setData([]); }
  }, [page]);

  useEffect(() => { if (user) fetchData(); }, [page, user, fetchData]);

  const fetchMasterData = useCallback(async () => {
    try {
      const [resSekolah, resMenu] = await Promise.all([ axios.get(`${API_URL}/sekolah`), axios.get(`${API_URL}/menu`) ]);
      setSekolahList(resSekolah.data || []);
      setMenuList(resMenu.data || []);
    } catch {
      setSekolahList([]); setMenuList([]);
    }
  }, []);

  useEffect(() => { if (user) fetchMasterData(); }, [user, fetchMasterData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await axios.delete(`${API_URL}/${page}/${id}`);
      fetchData(); fetchMasterData();
    } catch { alert('Gagal menghapus data.'); }
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    try {
      const hasFile = Object.values(formData).some(val => val instanceof File);
      let dataToSend = { ...formData };
      let config = {};

      if (page === 'jadwal') {
        delete dataToSend.nama_sekolah; delete dataToSend.nama_menu; delete dataToSend.nama; delete dataToSend.jumlah_porsi;
        const menuId = Number(dataToSend.menu_id); const sekolahId = Number(dataToSend.sekolah_id);
        if (!menuId || isNaN(menuId)) { alert('Pilih Menu!'); return; }
        if (!sekolahId || isNaN(sekolahId)) { alert('Pilih Sekolah!'); return; }
        dataToSend.menu_id = menuId; dataToSend.sekolah_id = sekolahId;
        if (dataToSend.tanggal) dataToSend.tanggal = String(dataToSend.tanggal).split('T')[0];
        if (!editId) delete dataToSend.id;

      } else if (page === 'laporan' || hasFile) {
        const fd = new FormData();
        for (const key in dataToSend) {
          if (dataToSend[key] !== undefined && dataToSend[key] !== null) fd.append(key, dataToSend[key]);
        }
        fd.append('user_id', user.id);
        dataToSend = fd;
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      }

      if (editId) await axios.put(`${API_URL}/${page}/${editId}`, dataToSend, config);
      else await axios.post(`${API_URL}/${page}`, dataToSend, config);

      setShowModal(false); setFormData({}); setEditId(null);
      
      fetchData(); fetchMasterData();
      if (page === 'laporan') fetchLaporan(); // Global State Laporan Refresh[cite: 5]

    } catch (error) {
      alert(`Gagal menyimpan data! Server: ${error.response?.data?.message || error.message}`);
    }
  };

  const openTambah = (defaultData = {}) => { setEditId(null); setFormData(defaultData); setShowModal(true); };
  const openEdit = (item) => {
    setEditId(item.id);
    let cleanItem = { ...item };
    if (page === 'jadwal') {
      cleanItem = { id: item.id, tanggal: item.tanggal ? String(item.tanggal).split('T')[0] : '', menu_id: item.menu_id != null ? Number(item.menu_id) : '', sekolah_id: item.sekolah_id != null ? Number(item.sekolah_id) : '', status: item.status || 'Belum Siap' };
    } else {
      if (cleanItem.menu_id != null) cleanItem.menu_id = Number(cleanItem.menu_id);
      if (cleanItem.sekolah_id != null) cleanItem.sekolah_id = Number(cleanItem.sekolah_id);
      if (cleanItem.tanggal) cleanItem.tanggal = String(cleanItem.tanggal).split('T')[0];
    }
    setFormData(cleanItem); setShowModal(true);
  };

  const handleLogout = () => { logout(); navigate('/'); }; // SPRINT 13: Logout routing[cite: 3, 5]

  const menuConfig = {
    menu:    { title: 'Menu Makanan',   icon: '🍱', path: '/menu' },
    siswa:   { title: 'Daftar Siswa',   icon: '👥', path: '/siswa' },
    sekolah: { title: 'Daftar Sekolah', icon: '🏫', path: '/sekolah' },
    jadwal:  { title: 'Distribusi MBG', icon: '🚚', path: '/jadwal', canCRUD: true },
    laporan: { title: 'Feedback',       icon: '📊', path: '/laporan' },
  };

  const activeFields = MODAL_FIELDS[page] || [];
  const modalTitle = editId ? `Edit ${menuConfig[page]?.title || page}` : `Tambah ${menuConfig[page]?.title || page}`;

  return (
    <div style={ds.container}>
      {showModal && (
        <div style={ds.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={ds.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '20px', fontFamily: "'Sora', sans-serif", fontSize: '18px', color: '#0f172a' }}>{modalTitle}</h3>
            <form onSubmit={handleSimpan}>
              {activeFields.map(f => (
                <div key={f.key}>
                  <label className="modal-label">{f.label}</label>
                  {f.type === 'textarea' ? <textarea className="modal-input" placeholder={f.placeholder} value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} rows={3} style={{ resize: 'vertical', lineHeight: '1.5' }} /> :
                   f.type === 'rating' ? <div style={{ display: 'flex', gap: '8px', fontSize: '28px', cursor: 'pointer', marginBottom: '16px' }}>{[1, 2, 3, 4, 5].map(star => (<span key={star} onClick={() => setFormData({ ...formData, [f.key]: star })} style={{ color: (formData[f.key] || 0) >= star ? '#f59e0b' : '#e2e8f0', transition: '0.2s' }}>★</span>))}</div> :
                   f.type === 'file' ? <input className="modal-input" type="file" accept="image/*" onChange={e => setFormData({ ...formData, [f.key]: e.target.files[0] })} style={{ padding: '8px', background: 'transparent', border: '1px dashed #cbd5e1' }} /> :
                   f.type === 'select' ? <select className="modal-input" value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} required><option value="" disabled>Pilih {f.label}</option>{f.options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}</select> :
                   f.type === 'select_menu' ? <select className="modal-input" value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value ? Number(e.target.value) : '' })} required><option value="" disabled>-- Pilih Menu --</option>{menuList.map(m => (<option key={m.id} value={m.id}>{m.nama_menu}</option>))}</select> :
                   f.type === 'select_sekolah' ? <select className="modal-input" value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value ? Number(e.target.value) : '' })} required><option value="" disabled>-- Pilih Sekolah Target --</option>{sekolahList.map(s => (<option key={s.id} value={s.id}>{s.nama || s.email}</option>))}</select> :
                   <input className="modal-input" type={f.type || 'text'} placeholder={f.placeholder} value={formData[f.key] || ''} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} required={f.key !== 'deskripsi' && f.type !== 'file'} />
                  }
                </div>
              ))}
              <div className="modal-btn-row">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="modal-btn-save">{editId ? '💾 Simpan Perubahan' : '+ Tambah Data'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Sidebar (Routing Link) ── */}
      <div className="sidebar-bg">
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', fontFamily: "'Sora', sans-serif", marginBottom: '8px' }}>MBG Group</div>
          <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '10px' }}>Halo, {user.nama} ({user.role})</div>
          <div className="logout-link" onClick={handleLogout}>Logout</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {Object.entries(menuConfig).map(([key, cfg]) => (
            <Link key={key} to={cfg.path} className={`sidebar-nav-item ${page === key ? 'active' : ''}`}>
              <span style={{ fontSize: '20px' }}>{cfg.icon}</span><span>{cfg.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main Content Area ── */}
      <div style={ds.main}>
        <div style={ds.card}>
          <div style={{ marginBottom: '25px' }}>
            <h2 style={{ margin: '0 0 6px 0', fontFamily: "'Sora', sans-serif", color: '#0f172a' }}>{menuConfig[page]?.title}</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Pengaturan sistem MBG area {page}.</p>
          </div>

          <Routes>
            <Route path="menu" element={<MenuPage data={data} user={user} onDelete={handleDelete} onTambah={() => openTambah()} onEdit={openEdit} />} />
            <Route path="siswa" element={<SiswaPage data={data} user={user} onDelete={handleDelete} onTambah={() => openTambah()} onEdit={openEdit} />} />
            <Route path="sekolah" element={<SekolahPage data={data} user={user} onDelete={handleDelete} onTambah={() => openTambah({ role: 'sekolah' })} />} />
            <Route path="jadwal" element={<JadwalPage data={data} user={user} menuList={menuList} sekolahList={sekolahList} onDelete={handleDelete} onTambah={(def) => openTambah(defaultData)} onEdit={openEdit} />} />
            <Route path="laporan" element={<LaporanPage onTambah={() => openTambah()} onEdit={openEdit} />} />
            <Route path="*" element={<Navigate to="/laporan" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. ROOT INJECTION
// ==========================================

export default function App() {
  useGlobalStyle(GLOBAL_CSS);
  const cardRef = useRef(null);
  
  // SPRINT 11 & 13: Wrapping Provider & Router[cite: 3, 5]
  return (
    <Router>
      <AuthProvider>
        <LaporanProvider>
          <AppRoutes cardRef={cardRef} />
        </LaporanProvider>
      </AuthProvider>
    </Router>
  );
}

function AppRoutes({ cardRef }) {
  const { user, login } = useContext(AuthContext); // SPRINT 13: Consume Auth State[cite: 5]
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoadingLogin(true);
    try {
      const res = await axios.post(`${API_URL}/login`, credentials);
      if (res.data) {
        login(res.data); // SPRINT 13: Set Global User State[cite: 5]
        navigate(res.data.role === 'sekolah' ? '/siswa' : '/laporan'); // SPRINT 11: Routing setelah login[cite: 3]
      }
    } catch { alert('Email atau Password salah!'); }
    finally { setIsLoadingLogin(false); }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigateLogin={() => navigate('/login')} />} />
      <Route path="/login" element={
        user ? <Navigate to="/laporan" replace /> : (
          <div style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a1628', color: 'white', position: 'relative', overflow: 'hidden' }}>
            <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '30px', left: '30px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', zIndex: 10, padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
              ← Kembali Beranda
            </button>
            <OrbBackground />
            <div className="mbg-logo-box" style={{ marginBottom: '18px', zIndex: 1 }}><div style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, animation: 'pulse-glow 3s infinite' }}>MBG</div></div>
            <div ref={cardRef} className="mbg-card" style={{ position: 'relative', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.11)', padding: '34px 30px', borderRadius: '24px', width: '390px', zIndex: 1 }}>
              <CursorGlow cardRef={cardRef} />
              <h2 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Selamat Datang</h2>
              <form onSubmit={handleLogin}>
                <input className="mbg-input-field" type="email" placeholder="Email" required onChange={e => setCredentials({ ...credentials, email: e.target.value })} />
                <input className="mbg-input-field" type="password" placeholder="Password" required onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
                <button type="submit" className="mbg-btn-login" disabled={isLoadingLogin}>{isLoadingLogin ? 'Memuat...' : 'Masuk'}</button>
              </form>
            </div>
          </div>
        )
      } />
      <Route path="/*" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
}