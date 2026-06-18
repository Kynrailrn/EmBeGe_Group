import React from 'react';
import { 
  ShieldCheck, Truck, Utensils, Users, ArrowRight, 
  ClipboardList, CheckCircle, Navigation, Heart, Activity
} from 'lucide-react';

export default function LandingPage({ onNavigateLogin }) {
  // Fungsi halus untuk scroll
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans'] text-slate-800 selection:bg-emerald-200">
      
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
              M
            </div>
            <span className="font-['Sora'] font-bold text-xl text-slate-900 tracking-tight">
              DistriMBG
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#fitur" onClick={(e) => scrollToSection(e, 'fitur')} className="hover:text-emerald-600 transition-colors">Fitur</a>
            <a href="#cara-kerja" onClick={(e) => scrollToSection(e, 'cara-kerja')} className="hover:text-emerald-600 transition-colors">Cara Kerja</a>
            <a href="#dampak" onClick={(e) => scrollToSection(e, 'dampak')} className="hover:text-emerald-600 transition-colors">Dampak</a>
            {/* Menu Anggota Baru */}
            <a href="#anggota" onClick={(e) => scrollToSection(e, 'anggota')} className="hover:text-emerald-600 transition-colors">Anggota</a>
          </div>

          <button 
            onClick={onNavigateLogin}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
          >
            Masuk Sistem <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-400/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistem Aktif & Terpusat
          </div>
          
          <h1 className="font-['Sora'] text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 max-w-4xl mx-auto">
            Pantau Distribusi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Makan Bergizi Gratis</span> Secara Real-Time
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Platform manajemen cerdas untuk menjadwalkan, memantau, dan memastikan setiap porsi makanan sampai ke siswa dengan standar gizi yang tepat.
          </p>
          
          
        </div>
      </section>

      {/* ── FITUR SECTION ── */}
      <section id="fitur" className="py-24 bg-white pt-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-['Sora'] text-3xl md:text-4xl font-bold text-slate-900 mb-4">Integrasi Penuh dalam Satu Platform</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Dari penyusunan menu hingga laporan harian, semuanya dikelola dalam sistem yang transparan dan mudah digunakan.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Utensils size={28} className="text-emerald-500" />}
              title="Manajemen Menu Gizi"
              desc="Atur komposisi kalori dan variasi menu makanan harian untuk memastikan standar gizi terpenuhi."
            />
            <FeatureCard 
              icon={<Truck size={28} className="text-emerald-500" />}
              title="Jadwal Distribusi"
              desc="Pantau antrean pengiriman ke berbagai sekolah secara langsung dari pusat kendali."
            />
            <FeatureCard 
              icon={<Users size={28} className="text-emerald-500" />}
              title="Database Siswa"
              desc="Sinkronisasi data siswa penerima manfaat di setiap sekolah secara terpusat dan akurat."
            />
            <FeatureCard 
              icon={<ShieldCheck size={28} className="text-emerald-500" />}
              title="Laporan & Validasi"
              desc="Sekolah dapat memberikan ulasan, rating, dan bukti foto penerimaan makanan setiap harinya."
            />
          </div>
        </div>
      </section>

      {/* ── CARA KERJA SECTION ── */}
      <section id="cara-kerja" className="py-24 bg-slate-50 pt-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-['Sora'] text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cara Kerja Sistem</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Alur distribusi transparan yang menghubungkan pusat pengelola dengan sekolah penerima manfaat.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Garis penghubung (hanya terlihat di desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 -z-0"></div>

            <StepCard 
              number="1"
              icon={<ClipboardList size={32} className="text-emerald-600" />}
              title="Perencanaan Pusat"
              desc="Admin pusat memasukkan daftar menu bergizi harian beserta jadwal pengiriman untuk setiap sekolah."
            />
            <StepCard 
              number="2"
              icon={<Navigation size={32} className="text-emerald-600" />}
              title="Proses Distribusi"
              desc="Makanan didistribusikan sesuai jadwal. Status di sistem berubah dari 'Mendatang' menjadi 'Selesai'."
            />
            <StepCard 
              number="3"
              icon={<CheckCircle size={32} className="text-emerald-600" />}
              title="Validasi Sekolah"
              desc="Sekolah menerima makanan dan mengunggah bukti foto serta memberikan rating dan komentar ke sistem."
            />
          </div>
        </div>
      </section>

      {/* ── DAMPAK SECTION ── */}
      <section id="dampak" className="py-24 bg-slate-900 text-white relative pt-28">
        {/* Dekorasi Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[80px]"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[80px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="font-['Sora'] text-3xl md:text-4xl font-bold mb-6">Dampak Nyata Program MBG</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-16">
            Membangun masa depan yang lebih cerdas dan sehat melalui kepastian asupan gizi setiap harinya.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <ImpactCard 
              icon={<Heart size={40} className="text-emerald-400" />}
              stat="Gizi Terjamin"
              desc="Setiap paket makanan dikalkulasi kalorinya untuk memenuhi kebutuhan harian siswa."
            />
            <ImpactCard 
              icon={<Users size={40} className="text-emerald-400" />}
              stat="Tepat Sasaran"
              desc="Sinkronisasi data siswa memastikan tidak ada porsi makanan yang terbuang atau kurang."
            />
            <ImpactCard 
              icon={<Activity size={40} className="text-emerald-400" />}
              stat="Evaluasi Harian"
              desc="Sistem feedback real-time memungkinkan perbaikan kualitas makanan secara cepat."
            />
          </div>
        </div>
      </section>

      {/* ── ANGGOTA SECTION ── */}
      <section id="anggota" className="py-24 bg-white pt-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-['Sora'] text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tim Kami</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-16">
            Orang-orang hebat di balik pengembangan sistem DistriMBG.
          </p>

          <div className="flex flex-wrap justify-center gap-10">
            <MemberCard name="Fadhel Yihua Rafael" image="/fadel.jpeg" />
            <MemberCard name="Muhammad Randy Ilham A" image="/randy.jpeg" />
            <MemberCard name="Jonathan Hibran Ramadhan" image="/jojo.jpeg" />
            <MemberCard name="Muhamad Rizky Nur Awalin" image="/awalin.jpeg" />
            <MemberCard name="Fadhil Muhammad Zain" image="/fadil.jpeg" />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="font-['Sora'] font-bold text-lg text-white">DistriMBG Project</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} EmBeGe Group.</p>
        </div>
      </footer>
    </div>
  );
}

// ── KOMPONEN KECIL ── //

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50 transition-all group">
      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-['Sora'] font-bold text-lg text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StepCard({ number, icon, title, desc }) {
  return (
    <div className="relative flex flex-col items-center text-center z-10 group">
      <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl shadow-emerald-100 flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-slate-50">
          {number}
        </div>
        {icon}
      </div>
      <h3 className="font-['Sora'] font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed max-w-xs">{desc}</p>
    </div>
  );
}

function ImpactCard({ icon, stat, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-full bg-emerald-500/10">
          {icon}
        </div>
      </div>
      <h3 className="font-['Sora'] text-2xl font-bold text-white mb-3">{stat}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// Komponen baru untuk foto anggota
function MemberCard({ name, image }) {
  return (
    <div className="text-center group">
      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-slate-100 shadow-md group-hover:border-emerald-200 transition-all">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover bg-slate-200"
          // Jika foto belum ada, otomatis membuat gambar inisial nama sementara
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff`;
          }}
        />
      </div>
      <h3 className="font-['Sora'] font-bold text-slate-900">{name}</h3>
    </div>
  );
}