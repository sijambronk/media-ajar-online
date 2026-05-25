import { spawn } from 'node:child_process';
import os from 'node:os';

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const candidates: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioritize 10.x.x.x and 192.168.x.x (Real Local Networks)
        if (iface.address.startsWith('10.') || iface.address.startsWith('192.168.')) {
          return iface.address;
        }
        candidates.push(iface.address);
      }
    }
  }
  return candidates[0] || 'localhost';
}

// Parse arguments for port
const args = process.argv.slice(2);
const portArgIndex = args.indexOf('-p');
const portFromArg = portArgIndex !== -1 ? args[portArgIndex + 1] : undefined;

const currentIp = getLocalIp();
const protocol = 'http';
const port = portFromArg || process.env.PORT || '2000'; // Default to 2000 to match batch file

const nextAuthUrl = `${protocol}://${currentIp}:${port}`;

console.log('--------------------------------------------------');
console.log('🚀 DINAMIS: Deteksi Network Adapter Selesai!');
console.log(`📡 IP Terdeteksi: ${currentIp}`);
console.log(`🔐 Konfigurasi NextAuth: ${nextAuthUrl}`);
console.log('--------------------------------------------------');

// Set NEXT_PUBLIC_ALLOWED_ORIGIN so next.config.ts can read it
const env = { 
  ...process.env, 
  NEXTAUTH_URL: nextAuthUrl,
  NEXT_PUBLIC_DEV_IP: currentIp
};

const nextProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', port], {
  stdio: 'inherit',
  shell: true,
  env: env
});

nextProcess.on('close', (code) => {
  process.exit(code || 0);
});

