
import { Pool } from 'pg';

// Validação de Segurança: Garantir que variáveis existem antes de tentar conectar
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
  console.warn(`⚠️  AVISO DE PRODUÇÃO: Variáveis de ambiente de banco ausentes: ${missingVars.join(', ')}. A conexão pode falhar.`);
}

// Database Connection Configuration
// Conexão Pura via Variáveis de Ambiente (Zero Hardcode)
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const checkConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ BACKEND PRONTO: Conexão com PostgreSQL estabelecida com sucesso via Docker.');
    console.log(`📡 Host: ${process.env.DB_HOST} | Database: ${process.env.DB_NAME}`);
    return true;
  } catch (err) {
    console.error('❌ ERRO CRÍTICO: Falha na conexão com o banco de dados.');
    console.error('Verifique se o container "postgres" está rodando e se as variáveis no docker-compose.yml estão corretas.');
    console.error(err);
    return false;
  }
};
