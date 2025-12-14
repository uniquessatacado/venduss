
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './', 
    plugins: [react()],
    define: {
      // Injeta a API Key de forma segura. Se não existir, injeta string vazia.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Evita erro de 'process is not defined' em bibliotecas legadas
      'process.env': {}
    },
    server: {
      host: true,
      port: 3000,
      allowedHosts: true
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
            // Removemos @google/genai dos chunks manuais obrigatórios para evitar erros de load se não usado
          }
        }
      }
    }
  };
});
