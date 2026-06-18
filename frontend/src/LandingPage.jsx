import React from 'react';
import { 
  ShieldCheck, Truck, Utensils, Users, ArrowRight, 
  ClipboardList, CheckCircle, Navigation, Heart, Activity,
  BarChart3, Sparkles, Star, School, Zap, Globe, Award
} from 'lucide-react';

export default function LandingPage({ onNavigateLogin }) {
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans'] text-slate-800 selection:bg-fuchsia-200 selection:text-fuchsia-900 overflow-x-hidden relative">
      
      {/* ── CUSTOM ANIMATIONS & PATTERNS ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes float-fast { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-3deg); } }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animate-blob-delay { animation: blob 12s infinite alternate-reverse; animation-delay: 2s; }
        
        .bg-grid-colorful {
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bg-dots-pattern {
          background-image: radial-gradient(rgba(148, 163, 184, 0.3) 2px, transparent 2px);
          background-size: 24px 24px;
        }
      `}} />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-white/50 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-indigo-50/50 to-fuchsia-50/50 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-2 ring-white relative overflow-hidden group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <Utensils size={22} className="relative z-10 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-['Sora'] font-black text-xl text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                MBG <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">GENK</span>
              </span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5">
                Distribution Hub
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#fitur" onClick={(e) => scrollToSection(e, 'fitur')} className="hover:text-indigo-600 transition-colors">Fitur</a>
            <a href="#cara-kerja" onClick={(e) => scrollToSection(e, 'cara-kerja')} className="hover:text-emerald-600 transition-colors">Cara Kerja</a>
            <a href="#dampak" onClick={(e) => scrollToSection(e, 'dampak')} className="hover:text-amber-600 transition-colors">Dampak</a>
            <a href="#anggota" onClick={(e) => scrollToSection(e, 'anggota')} className="hover:text-fuchsia-600 transition-colors">Tim Kami</a>
          </div>

          <button 
            onClick={onNavigateLogin}
            className="px-6 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-1 flex items-center gap-2 group border border-slate-700"
          >
            Masuk Sistem 
            <ArrowRight size={16} className="group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION (Super Colorful & Ramai) ── */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-10 overflow-hidden bg-white">
        
        {/* Massive Colorful Background Blobs */}
        <div className="absolute inset-0 bg-grid-colorful pointer-events-none"></div>
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-400/30 blur-[100px] rounded-full mix-blend-multiply animate-blob pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-400/30 blur-[120px] rounded-full mix-blend-multiply animate-blob-delay pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-fuchsia-300/20 blur-[130px] rounded-full mix-blend-multiply animate-blob pointer-events-none"></div>
        <div className="absolute top-[10%] left-[40%] w-[400px] h-[400px] bg-amber-300/30 blur-[90px] rounded-full mix-blend-multiply animate-blob-delay pointer-events-none"></div>

        {/* Floating Elements / Badges */}
        <div className="hidden lg:flex absolute top-[25%] left-[5%] animate-float-slow items-center gap-3 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner"><Star size={26} fill="currentColor" /></div>
          <div className="pr-2">
            <p className="text-sm font-extrabold text-slate-900">100% Teruji</p>
            <p className="text-xs font-medium text-slate-500">Standar Gizi Nasional</p>
          </div>
        </div>

        <div className="hidden lg:flex absolute top-[45%] right-[5%] animate-float-fast items-center gap-3 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner"><Globe size={26} /></div>
          <div className="pr-2">
            <p className="text-sm font-extrabold text-slate-900">10,000+ Porsi</p>
            <p className="text-xs font-medium text-slate-500">Didistribusikan Aktif</p>
          </div>
        </div>

        <div className="hidden lg:flex absolute bottom-[15%] left-[10%] animate-float-fast items-center gap-3 bg-white/90 backdrop-blur-xl p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white pr-6">
          <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-100 to-pink-100 rounded-full flex items-center justify-center text-fuchsia-600"><Heart size={20} fill="currentColor" /></div>
          <p className="text-sm font-bold text-slate-800">Tanpa Sisa (Zero Waste)</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 shadow-lg shadow-indigo-500/10 text-indigo-700 text-xs font-black uppercase tracking-widest mb-8 hover:scale-105 transition-transform cursor-default group">
            <Zap size={16} className="text-amber-500 group-hover:rotate-12 transition-transform" fill="currentColor" />
            Revolusi Manajemen Distribusi Gizi
          </div>
          
          <h1 className="font-['Sora'] text-5xl md:text-[5rem] font-black text-slate-900 leading-[1.1] mb-8 max-w-5xl mx-auto tracking-tighter">
            Pantau Distribusi <br className="hidden md:block"/>
            <span className="relative inline-block px-4">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 drop-shadow-sm">
                Makan Bergizi Gratis
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-100 to-indigo-100 blur-xl opacity-50 -z-10 rounded-full"></div>
            </span>
            <br className="hidden md:block"/> Secara Real-Time
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-600/90 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
            Platform manajemen <span className="text-indigo-600 font-bold">cerdas</span> dan <span className="text-emerald-600 font-bold">transparan</span> untuk menjadwalkan, memantau, dan memastikan setiap porsi sampai dengan akurat.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 relative z-20">
            <button onClick={onNavigateLogin} className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] hover:-translate-y-1 flex items-center justify-center gap-3 group text-lg">
              Mulai Dashboard
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button onClick={(e) => scrollToSection(e, 'fitur')} className="w-full sm:w-auto px-10 py-4 bg-white/80 backdrop-blur-md hover:bg-white text-slate-800 font-black rounded-2xl transition-all border-2 border-slate-100 hover:border-indigo-200 shadow-xl shadow-slate-200/50 flex items-center justify-center gap-2 text-lg">
              Pelajari Ekosistem
            </button>
          </div>
        </div>
      </section>

      {/* ── SPONSOR / MITRA SECTION (Berwarna & Ramai) ── */}
      <section className="py-14 bg-gradient-to-r from-emerald-50 via-indigo-50 to-fuchsia-50 border-y border-white relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-10">🌍 Dipercaya Oleh Mitra Strategis Pendidikan & Kesehatan</p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10">
            <SponsorLogo name="Kementerian Kesehatan" icon="🏥" color="text-rose-600" bg="bg-rose-100" />
            <SponsorLogo name="Badan Gizi Nasional" icon="🥗" color="text-emerald-600" bg="bg-emerald-100" />
            <SponsorLogo name="STT Terpadu Nurul Fikri" icon="🎓" color="text-indigo-700" bg="bg-indigo-100" />
            <SponsorLogo name="Dinas Pendidikan" icon="🏛️" color="text-amber-600" bg="bg-amber-100" />
            <SponsorLogo name="TechForGood ID" icon="💻" color="text-fuchsia-600" bg="bg-fuchsia-100" />
          </div>
        </div>
      </section>

      {/* ── FITUR SECTION (Kartu Berwarna Warni) ── */}
      <section id="fitur" className="py-32 bg-slate-50 relative z-20">
        <div className="absolute inset-0 bg-dots-pattern opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm mb-4">✨ Fitur Unggulan</div>
            <h2 className="font-['Sora'] text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Satu Platform, <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Kendali Penuh.</span></h2>
            <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto">Ekosistem digital super lengkap untuk memastikan kelancaran logistik makanan dari hulu ke hilir.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ColorfulFeatureCard 
              accent="emerald"
              icon={<Utensils size={30} />}
              title="Manajemen Gizi"
              desc="Atur komposisi kalori dan variasi menu harian untuk standar gizi optimal dan sehat."
            />
            <ColorfulFeatureCard 
              accent="amber"
              icon={<Truck size={30} />}
              title="Jadwal Distribusi"
              desc="Pantau antrean pengiriman logistik ke berbagai sekolah secara live dari pusat."
            />
            <ColorfulFeatureCard 
              accent="indigo"
              icon={<Users size={30} />}
              title="Database Siswa"
              desc="Sinkronisasi data siswa penerima manfaat secara terpusat, rapi, dan terenkripsi aman."
            />
            <ColorfulFeatureCard 
              accent="fuchsia"
              icon={<ShieldCheck size={30} />}
              title="Validasi Akurat"
              desc="Ulasan, rating, dan unggah foto bukti real-time langsung dari pihak sekolah penerima."
            />
            <ColorfulFeatureCard 
              accent="sky"
              icon={<School size={30} />}
              title="Master Sekolah"
              desc="Kelola master data institusi pendidikan dan atur hak akses masing-masing titik kumpul."
            />
            <ColorfulFeatureCard 
              accent="rose"
              icon={<Activity size={30} />}
              title="Laporan Analitik"
              desc="Dashboard pintar untuk melihat metrik kesuksesan distribusi makanan secara harian."
            />
          </div>
        </div>
      </section>

      {/* ── CARA KERJA SECTION (Lebih interaktif) ── */}
      <section id="cara-kerja" className="py-32 bg-white relative overflow-hidden">
        {/* Dekorasi Gelombang SVG di background */}
        <svg className="absolute top-0 w-full text-slate-50" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,0 C320,120 420,120 720,60 C1020,0 1120,0 1440,60 L1440,0 L0,0 Z"></path>
        </svg>

        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-10">
          <div className="text-center mb-24">
            <h2 className="font-['Sora'] text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Alur Kerja <span className="text-emerald-500">Super Cepat</span></h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Tiga langkah canggih bagaimana sistem kami memastikan makanan sampai dengan selamat, hangat, dan tepat sasaran.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Animated Dashed Line */}
            <div className="hidden md:block absolute top-[5rem] left-[15%] right-[15%] h-1 border-t-4 border-dashed border-slate-200 z-0"></div>
            
            <StepCard color="from-indigo-400 to-indigo-600" shadow="shadow-indigo-200" number="1" icon={<ClipboardList size={36} className="text-white" />} title="Perencanaan Pusat" desc="Admin pusat menyusun menu bergizi harian beserta jadwal pengiriman ke setiap institusi terdaftar." />
            <StepCard color="from-amber-400 to-orange-500" shadow="shadow-amber-200" number="2" icon={<Navigation size={36} className="text-white" />} title="Distribusi Logistik" desc="Status armada logistik di-update real-time dari berstatus 'Mendatang' hingga 'Selesai'." />
            <StepCard color="from-emerald-400 to-teal-500" shadow="shadow-emerald-200" number="3" icon={<CheckCircle size={36} className="text-white" />} title="Validasi Sekolah" desc="Pihak sekolah mengunggah foto bukti makanan dan memberikan rating ulasan kualitas." />
          </div>
        </div>
      </section>

      {/* ── DAMPAK SECTION (Dark Mode Vibrant) ── */}
      <section id="dampak" className="py-32 bg-slate-950 text-white relative overflow-hidden">
        {/* Massive Neon Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/30 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-fuchsia-600/20 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-sm mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">📊 Hasil Pengukuran</div>
          <h2 className="font-['Sora'] text-4xl md:text-6xl font-black mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Dampak Nyata MBG</h2>
          <p className="text-slate-400 text-xl font-medium max-w-3xl mx-auto mb-20 leading-relaxed">Membangun generasi cerdas, kuat, dan sehat melalui kepastian asupan gizi setiap harinya tanpa terkecuali.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <NeonImpactCard 
              color="emerald"
              icon={<Heart size={40} />}
              stat="Gizi Terjamin"
              desc="Setiap paket dikalkulasi secara ilmiah untuk memenuhi kebutuhan kalori spesifik tumbuh kembang anak."
            />
            <NeonImpactCard 
              color="amber"
              icon={<TargetIcon size={40} />}
              stat="Tepat Sasaran"
              desc="Penerapan Zero Waste Policy. Sinkronisasi data memastikan porsi logistik presisi tanpa ada sisa terbuang."
            />
            <NeonImpactCard 
              color="fuchsia"
              icon={<Award size={40} />}
              stat="Kualitas Premium"
              desc="Feedback instan harian memungkinkan vendor melakukan perbaikan kualitas masakan secara real-time."
            />
          </div>
        </div>
      </section>

      {/* ── ANGGOTA SECTION (Aesthetic Patterned) ── */}
      <section id="anggota" className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Dekorasi Wave Transisi dari Dark ke Light */}
        <svg className="absolute top-0 w-full text-slate-950" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,100 C320,0 420,0 720,50 C1020,100 1120,100 1440,50 L1440,0 L0,0 Z"></path>
        </svg>

        <div className="absolute inset-0 bg-dots-pattern opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 pt-16">
          <div className="text-center mb-24">
            <h2 className="font-['Sora'] text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">GENK</span></h2>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Para pemikir, kreator, dan inovator di balik layar ekosistem digital cerdas ini.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-10 md:gap-14">
            <AestheticMemberCard name="Fadhel Yihua Rafael" role="SUPIR LINTAS JABODETABEK" image="/fadel.jpeg" color="indigo" />
            <AestheticMemberCard name="Muhammad Randy Ilham A" role="KEPALA SPPG ANTI KORUPSI #2026GENDUT " image="/randy.jpeg" color="fuchsia" />
            <AestheticMemberCard name="Jonathan Hibran Ramadhan" role="MASAK MENU EKSTRIM DAN PORSI KULI" image="/jojo.jpeg" color="emerald" />
            <AestheticMemberCard name="Muhamad Rizky Nur Awalin" role="PACKING KARENA GANTENG" image="/awalin.jpeg" color="amber" />
            <AestheticMemberCard name="Fadhil Muhammad Zain" role="CUCI OMPRENG BERSIH SAMPE KE INTI BUMI" image="/fadil.jpeg" color="sky" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-fuchsia-500"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] border border-white/20">
                <Utensils size={24} />
              </div>
              <div>
                <h3 className="font-['Sora'] font-black text-2xl text-white tracking-tight">MBG GENK</h3>
                <p className="text-slate-400 font-bold text-xs tracking-widest uppercase mt-1">Smart Distribution</p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-slate-300 font-medium">
              <a href="#" className="hover:text-emerald-400 hover:scale-105 transition-all">Tentang Kami</a>
              <a href="#" className="hover:text-emerald-400 hover:scale-105 transition-all">Pusat Bantuan</a>
              <a href="#" className="hover:text-emerald-400 hover:scale-105 transition-all">Kebijakan Privasi</a>
              <a href="#" className="hover:text-emerald-400 hover:scale-105 transition-all">Syarat & Ketentuan</a>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-medium text-slate-500">© {new Date().getFullYear()} Dibuat dengan 💚 oleh EmBeGe Group.</p>
            <p className="text-sm font-medium text-slate-500">Sistem Terintegrasi v2.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── KOMPONEN KECIL PENUNJANG ── //

// Custom Icon for Target
function TargetIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

function SponsorLogo({ name, icon, color, bg }) {
  return (
    <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:-translate-y-1 transition-all duration-300 cursor-default select-none bg-white py-3 px-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md">
      <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${bg} text-2xl`}>{icon}</span>
      <span className={`font-['Sora'] font-extrabold text-[15px] ${color}`}>{name}</span>
    </div>
  );
}

function ColorfulFeatureCard({ icon, title, desc, accent }) {
  // Mapping warna accent tailwind untuk kartu
  const colorMap = {
    emerald: 'from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600 hover:shadow-emerald-900/10 hover:border-emerald-300',
    amber: 'from-amber-50 to-orange-50 border-amber-100 text-amber-600 hover:shadow-amber-900/10 hover:border-amber-300',
    indigo: 'from-indigo-50 to-blue-50 border-indigo-100 text-indigo-600 hover:shadow-indigo-900/10 hover:border-indigo-300',
    fuchsia: 'from-fuchsia-50 to-pink-50 border-fuchsia-100 text-fuchsia-600 hover:shadow-fuchsia-900/10 hover:border-fuchsia-300',
    sky: 'from-sky-50 to-cyan-50 border-sky-100 text-sky-600 hover:shadow-sky-900/10 hover:border-sky-300',
    rose: 'from-rose-50 to-red-50 border-rose-100 text-rose-600 hover:shadow-rose-900/10 hover:border-rose-300',
  };
  
  const iconBgMap = {
    emerald: 'bg-emerald-500 text-white',
    amber: 'bg-amber-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    fuchsia: 'bg-fuchsia-500 text-white',
    sky: 'bg-sky-500 text-white',
    rose: 'bg-rose-500 text-white',
  };

  return (
    <div className={`p-8 rounded-[2rem] bg-gradient-to-br border hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group ${colorMap[accent]}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 ${iconBgMap[accent]}`}>
        {icon}
      </div>
      <h3 className="font-['Sora'] font-black text-2xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, icon, title, desc, color, shadow }) {
  return (
    <div className="relative flex flex-col items-center text-center z-10 group">
      <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${color} border-[10px] border-white shadow-2xl ${shadow} flex items-center justify-center mb-8 relative group-hover:-translate-y-4 transition-transform duration-500`}>
        <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xl border-4 border-white">
          {number}
        </div>
        <div className="transform group-hover:scale-125 transition-transform duration-300 drop-shadow-md">
          {icon}
        </div>
      </div>
      <h3 className="font-['Sora'] font-black text-2xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed max-w-sm">{desc}</p>
    </div>
  );
}

function NeonImpactCard({ icon, stat, desc, color }) {
  const glowMap = {
    emerald: 'hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    amber: 'hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] text-amber-400 bg-amber-400/10 border-amber-400/20',
    fuchsia: 'hover:border-fuchsia-400/50 hover:shadow-[0_0_30px_rgba(232,121,249,0.3)] text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/20',
  };

  return (
    <div className={`p-10 rounded-[2.5rem] bg-slate-900/50 backdrop-blur-md border border-slate-700 hover:-translate-y-2 transition-all duration-300 group ${glowMap[color].split(' hover:')[0]}`}>
      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-300 ${glowMap[color]}`}>
        {icon}
      </div>
      <h3 className="font-['Sora'] text-3xl font-black text-white mb-4">{stat}</h3>
      <p className="text-slate-400 font-medium leading-relaxed text-lg">{desc}</p>
    </div>
  );
}

function AestheticMemberCard({ name, role, image, color }) {
  const bgColors = {
    indigo: 'from-indigo-500 to-blue-500',
    fuchsia: 'from-fuchsia-500 to-pink-500',
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
    sky: 'from-sky-400 to-blue-500'
  };

  const textColors = {
    indigo: 'text-indigo-600',
    fuchsia: 'text-fuchsia-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    sky: 'text-sky-600'
  };

  return (
    <div className="text-center group w-56 flex flex-col items-center">
      <div className={`w-48 h-48 rounded-full p-1.5 bg-gradient-to-br ${bgColors[color]} mb-6 shadow-xl shadow-${color}-500/20 group-hover:-translate-y-4 transition-all duration-500`}>
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative bg-white">
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700 relative z-0"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${name}&background=f8fafc&color=334155&size=200`;
            }}
          />
        </div>
      </div>
      <h3 className="font-['Sora'] font-black text-xl text-slate-900 leading-tight mb-2 px-2">{name}</h3>
      <div className={`inline-block px-4 py-1.5 rounded-full bg-${color}-50 border border-${color}-100`}>
        <p className={`text-xs font-black uppercase tracking-widest ${textColors[color]}`}>{role}</p>
      </div>
    </div>
  );
}