
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual (development/production)
  // O terceiro argumento '' carrega todas as variáveis, não apenas as com prefixo VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    // Garante que os caminhos dos assets sejam relativos (./) e não absolutos (/)
    // Isso resolve o problema de tela preta/branca em produção/Docker onde a raiz pode não ser '/'
    base: './',
    
    plugins: [react()],
    define: {
      // Previne o erro "process is not defined" no navegador substituindo pelo valor em tempo de build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Define um objeto vazio para outras chamadas process.env para evitar crash
      'process.env': {}
    },
    server: {
      host: true, // Permite acesso externo (útil para Docker)
      port: 3000
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
