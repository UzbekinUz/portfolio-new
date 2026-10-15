import fs from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// API portini server/.env dagi PORT'dan olamiz (qo'lda sinxronlash shart emas)
function apiPort() {
  try {
    const m = /^PORT=(\d+)/m.exec(fs.readFileSync(new URL('../server/.env', import.meta.url), 'utf8'));
    if (m) return m[1];
  } catch { /* .env yo'q */ }
  return '5000';
}
const target = `http://localhost:${apiPort()}`;

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': target, '/uploads': target },
  },
});
