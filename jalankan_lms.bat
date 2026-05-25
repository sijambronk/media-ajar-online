@echo off
setlocal enabledelayedexpansion

echo ##########################################
echo #    Modul Ajar Digital - Windows Runner #
echo ##########################################
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan! Silakan instal Node.js terlebih dahulu.
    pause
    exit /b
)

:: Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Menginstal dependensi pertama kali...
    call npm install
)

:: Run Prisma migration/generation
echo [INFO] Menyiapkan database...
call npx prisma generate

echo.
echo Pilih Perintah yang Ingin Dijalankan:
echo 1. Mode Pengembangan (Dev Mode - Bisa Edit Kode)
echo 2. Kompilasi & Pemaketan Portable Ramping (Build mediaajarportabel)
echo 3. Jalankan Server Portable Ramping (Run mediaajarportabel)
echo.

choice /c 123 /t 10 /d 3 /m "Masukkan pilihan (Otomatis ke Pilihan 3 dlm 10 detik)"
set mode=%errorlevel%

if "%mode%"=="1" goto dev
if "%mode%"=="2" goto build
if "%mode%"=="3" goto run
goto end

:dev
echo [INFO] Menjalankan server pengembangan di port 2000...
echo [INFO] Bisa diakses dari perangkat lain via IP Lokal Anda.
start http://localhost:2000
call npm run dev
goto end

:build
echo [INFO] Membuat paket aplikasi portable ramping (mediaajarportabel)...
call node scripts/build-lite.js
goto end

:run
if exist "mediaajarportabel\start_lms.bat" (
    echo [INFO] Menjalankan server portable ramping dari mediaajarportabel...
    cd mediaajarportabel
    call start_lms.bat
) else (
    echo [ERROR] Folder mediaajarportabel belum dibuat! Silakan pilih opsi 2 terlebih dahulu.
    pause
)
goto end

:end
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Terjadi kesalahan saat menjalankan perintah.
    pause
)


