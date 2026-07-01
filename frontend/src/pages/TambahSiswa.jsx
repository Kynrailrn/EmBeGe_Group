import React, { useState, useEffect } from 'react';

const TambahSiswa = () => {
  // State untuk menyimpan data inputan form
  const [formData, setFormData] = useState({
    nama_siswa: '',
    kelas: '',
    sekolah_id: ''
  });

  // State untuk menampung daftar sekolah dari database
  const [sekolahList, setSekolahList] = useState([]);

  // Mengambil data sekolah secara otomatis saat komponen dimuat
  useEffect(() => {
    const fetchSekolah = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/sekolah');
        const data = await response.json();
        setSekolahList(data);
      } catch (error) {
        console.error("Gagal mengambil data sekolah:", error);
      }
    };
    fetchSekolah();
  }, []);

  // Fungsi untuk menangani perubahan pada input (saat user mengetik/memilih)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fungsi untuk mengirim data ke backend saat form di-submit
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch('http://localhost:8000/api/siswa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Data siswa berhasil ditambahkan!');
        // Kosongkan form setelah berhasil
        setFormData({ nama_siswa: '', kelas: '', sekolah_id: '' });
      } else {
        const errorData = await response.json();
        alert(`Gagal: ${errorData.message || errorData.error}`);
      }
    } catch (error) {
      console.error("Error POST:", error);
      alert('Terjadi kesalahan saat menyimpan data. Cek koneksi backend.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-teal-500 mb-6">Tambah Daftar Siswa</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Input Nama Siswa */}
        <div className="mb-4">
          <label className="block text-gray-500 text-xs font-bold mb-2 uppercase">
            Nama Siswa
          </label>
          <input 
            type="text" 
            name="nama_siswa" 
            value={formData.nama_siswa} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
            placeholder="Masukkan nama siswa"
            required 
          />
        </div>

        {/* Input Kelas */}
        <div className="mb-4">
          <label className="block text-gray-500 text-xs font-bold mb-2 uppercase">
            Kelas
          </label>
          <input 
            type="text" 
            name="kelas" 
            value={formData.kelas} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
            placeholder="Contoh: 7B"
            required 
          />
        </div>

        {/* Dropdown Sekolah */}
        <div className="mb-8">
          <label className="block text-gray-500 text-xs font-bold mb-2 uppercase">
            Sekolah
          </label>
          <select 
            name="sekolah_id" 
            value={formData.sekolah_id} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white"
            required
          >
            <option value="" disabled>-- Pilih Sekolah --</option>
            {sekolahList.map((sekolah) => (
              <option key={sekolah.id} value={sekolah.id}>
                {sekolah.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol Aksi */}
        <div className="flex justify-between gap-4">
          <button 
            type="button" 
            className="w-full py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50"
            onClick={() => setFormData({ nama_siswa: '', kelas: '', sekolah_id: '' })}
          >
            Batal
          </button>
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600"
          >
            + Tambah Data
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahSiswa;