const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'mediaajarportabel');
const BIN_DIR = path.resolve(DIST_DIR, 'bin');

console.log('==================================================');
console.log('📦 MEMULAI PEMBUATAN PAKET PORTABLE (DIST-LITE)...');
console.log('==================================================\n');

// 1. Jalankan Next.js Build
try {
  console.log('[1/7] Menjalankan kompilasi aplikasi (Next.js Build)...');
  execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
  console.log('✔️  Next.js Build berhasil!\n');
} catch (error) {
  console.error('❌ Gagal menjalankan npm run build!', error);
  process.exit(1);
}

// 2. Bersihkan dan buat folder target
console.log('[2/7] Menyiapkan direktori target dist-lite...');
if (fs.existsSync(DIST_DIR)) {
  console.log('   - Menghapus isi folder dist-lite lama...');
  try {
    const files = fs.readdirSync(DIST_DIR);
    for (const file of files) {
      const filePath = path.join(DIST_DIR, file);
      try {
        fs.rmSync(filePath, { recursive: true, force: true });
      } catch (err) {
        console.log(`   [Peringatan] Gagal menghapus ${file} (sedang digunakan): ${err.message}`);
      }
    }
  } catch (err) {
    console.log(`   [Peringatan] Gagal membersihkan folder lama: ${err.message}`);
  }
}
fs.mkdirSync(DIST_DIR, { recursive: true });
fs.mkdirSync(BIN_DIR, { recursive: true });
console.log('✔️  Direktori berhasil disiapkan!\n');

// 3. Salin file kompilasi standalone
console.log('[3/7] Menyalin file standalone Next.js...');
const standalonePath = path.join(ROOT_DIR, '.next', 'standalone');
if (fs.existsSync(standalonePath)) {
  fs.cpSync(standalonePath, DIST_DIR, { recursive: true });
  console.log('✔️  File standalone berhasil disalin!');
} else {
  console.error('❌ Folder .next/standalone tidak ditemukan! Pastikan output: "standalone" diaktifkan di next.config.ts.');
  process.exit(1);
}

// Salin folder public dan .next/static ke tempatnya
console.log('   - Menyalin folder public...');
const publicSrc = path.join(ROOT_DIR, 'public');
const publicDest = path.join(DIST_DIR, 'public');
if (fs.existsSync(publicSrc)) {
  fs.cpSync(publicSrc, publicDest, { recursive: true });
}

console.log('   - Menyalin folder .next/static...');
const staticSrc = path.join(ROOT_DIR, '.next', 'static');
const staticDest = path.join(DIST_DIR, '.next', 'static');
if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDest, { recursive: true });
}
console.log('✔️  Aset statis berhasil disalin!\n');

// 4. Salin Database SQLite dev.db
console.log('[4/7] Menyalin database SQLite...');
const dbSrc = path.join(ROOT_DIR, 'prisma', 'dev.db');
const dbDest = path.join(DIST_DIR, 'dev.db');
const dbClientDest = path.join(DIST_DIR, 'node_modules', '.prisma', 'client', 'dev.db');
if (fs.existsSync(dbSrc)) {
  fs.copyFileSync(dbSrc, dbDest);
  
  // Salin juga ke folder engine prisma client di standalone
  const dbClientDir = path.dirname(dbClientDest);
  if (!fs.existsSync(dbClientDir)) {
    fs.mkdirSync(dbClientDir, { recursive: true });
  }
  fs.copyFileSync(dbSrc, dbClientDest);
  console.log('✔️  Database dev.db berhasil disalin ke root & client engine!');
} else {
  console.log('⚠️  Database prisma/dev.db tidak ditemukan. Membuat database kosong baru saat dijalankan nanti.');
}
console.log('\n');

// 5. Unduh Node.js Portabel (Windows node.exe)
console.log('[5/7] Mengunduh Node.js Portable untuk Windows...');
const nodeBinaryUrl = 'https://nodejs.org/dist/v20.11.0/win-x64/node.exe';
const nodeBinaryDest = path.join(BIN_DIR, 'node.exe');

function downloadNodeBinary(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        downloadNodeBinary(response.headers.location, dest).then(resolve);
        return;
      }
      if (response.statusCode !== 200) {
        console.log(`⚠️  Gagal mengunduh Node.js portable (Status HTTP: ${response.statusCode}).`);
        file.close();
        fs.unlinkSync(dest);
        resolve(false);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('✔️  Node.js Portable berhasil diunduh!');
          resolve(true);
        });
      });
    }).on('error', (err) => {
      console.log('⚠️  Koneksi internet bermasalah saat mengunduh Node.js:', err.message);
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

// Jalankan unduh biner Node.js
downloadNodeBinary(nodeBinaryUrl, nodeBinaryDest).then((downloadSuccess) => {
  if (!downloadSuccess) {
    console.log('💡 Tips: Silakan unduh node.exe secara manual dari https://nodejs.org/dist/v20.11.0/win-x64/node.exe');
    console.log('   lalu taruh di dalam folder: dist-lite/bin/node.exe');
  }
  console.log('\n');

  // 6. Buat file berkas pendukung (launcher.js, start_lms.bat, start_lms.sh)
  console.log('[6/7] Membuat berkas launcher & runner...');

  // 6.a Launcher.js
  const launcherCode = `const os = require('os');
const path = require('path');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const candidates = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (iface.address.startsWith('10.') || iface.address.startsWith('192.168.')) {
          return iface.address;
        }
        candidates.push(iface.address);
      }
    }
  }
  return candidates[0] || 'localhost';
}

const localIp = getLocalIp();
const port = process.env.PORT || '3000';
const nextAuthUrl = 'http://' + localIp + ':' + port;

// Atur variabel environment esensial secara dinamis
process.env.PORT = port;
process.env.HOSTNAME = '0.0.0.0'; // Dengarkan seluruh network adapter (WiFi/LAN)
process.env.NEXTAUTH_URL = nextAuthUrl;
process.env.DATABASE_URL = 'file:' + path.resolve(__dirname, 'dev.db');
process.env.NODE_ENV = 'production';

// Salin token rahasia NextAuth default jika belum diatur
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = 'IPA_SMP_SECRET_KEY_2026';
}

console.log('==================================================');
console.log('🚀 LMS MODUL AJAR DIGITAL BERHASIL DIJALANKAN!');
console.log('==================================================');
console.log('📡 Akses dari HP/Tablet Lain : ' + nextAuthUrl);
console.log('💻 Akses dari Komputer ini   : http://localhost:' + port);
console.log('--------------------------------------------------');
console.log('📢 INFO: Pastikan HP/Tablet Anda terhubung ke');
console.log('         jaringan WiFi/LAN yang SAMA dengan PC ini.');
console.log('⚠️ PENTING: JANGAN TUTUP jendela ini selama');
console.log('           aplikasi sedang digunakan guru/siswa!');
console.log('==================================================\\n');

// Panggil server utama Next.js Standalone
require('./server.js');
`;
  fs.writeFileSync(path.join(DIST_DIR, 'launcher.js'), launcherCode);
  console.log('   - launcher.js berhasil dibuat.');

  // 6.b start_lms.bat (Windows)
  const batCode = `@echo off
title Server Modul Ajar Digital
cd /d "%~dp0"
echo Menjalankan Server Modul Ajar...
start http://localhost:3000
if exist "bin\\node.exe" (
    bin\\node.exe launcher.js
) else (
    echo [Peringatan] Node.js portabel tidak ditemukan di bin\\node.exe.
    echo Mencoba memanggil Node.js sistem...
    node launcher.js
)
if %errorlevel% neq 0 (
    echo Terjadi error saat menjalankan server.
    pause
)
`;
  fs.writeFileSync(path.join(DIST_DIR, 'start_lms.bat'), batCode);
  console.log('   - start_lms.bat (Windows) berhasil dibuat.');

  // 6.c start_lms.sh (Linux)
  const shCode = `#!/bin/bash
cd "$(dirname "$0")"
echo "Menjalankan Server Modul Ajar..."
if [ -f "./bin/node" ]; then
    ./bin/node launcher.js
else
    echo "[Peringatan] Node.js portabel tidak ditemukan. Menggunakan Node.js sistem..."
    node launcher.js
fi
`;
  fs.writeFileSync(path.join(DIST_DIR, 'start_lms.sh'), shCode);
  // Tambah izin eksekusi jika di OS Linux/Mac
  try {
    execSync(`chmod +x "${path.join(DIST_DIR, 'start_lms.sh')}"`);
  } catch (e) {}
  console.log('   - start_lms.sh (Linux) berhasil dibuat.');

  // 6.d Salin berkas .env opsional dan bersihkan DATABASE_URL agar tidak menimpa path lokal Prisma
  const envSrc = path.join(ROOT_DIR, '.env');
  const envDest = path.join(DIST_DIR, '.env');
  if (fs.existsSync(envSrc)) {
    let envContent = fs.readFileSync(envSrc, 'utf8');
    // Hapus baris DATABASE_URL agar prisma menggunakan fallback database lokalnya yang sudah kita isi data
    envContent = envContent.replace(/^DATABASE_URL=.*$/m, '');
    fs.writeFileSync(envDest, envContent);
  }
  console.log('✔️  Semua berkas pendukung berhasil disiapkan!\n');

  // 7. Selesai
  console.log('==================================================');
  console.log('🎉 PROSES SELESAI! APLIKASI RAMPING BERHASIL DIBUAT');
  console.log('==================================================');
  console.log(`📂 Lokasi Folder : ${DIST_DIR}`);
  console.log('💡 Cara Menggunakan untuk Guru:');
  console.log('   1. Copy folder "dist-lite" ke komputer tujuan.');
  console.log('   2. Klik ganda berkas "start_lms.bat" untuk Windows.');
  console.log('   3. Siap digunakan dan diakses via WiFi/LAN!');
  console.log('==================================================');
});
