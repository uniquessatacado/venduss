
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
    onRegisterClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onRegisterClick }) => {
  const { saasLogin } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await saasLogin(email, password);
    if (!user) {
        setError('Credenciais inválidas. Tente ussloja@gmail.com / 137900');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
            <h1 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-2">VENDUSS</h1>
            <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Plataforma de E-commerce SaaS</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Lock className="text-purple-500"/> Acesso ao Painel</h2>
            
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">E-mail</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input 
                            type="email" 
                            className="w-full bg-black border border-zinc-700 rounded-xl p-3 pl-10 text-white focus:border-white outline-none transition-colors"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="w-full bg-black border border-zinc-700 rounded-xl p-3 pl-10 pr-10 text-white focus:border-white outline-none transition-colors"
                            placeholder="••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                    Entrar <ArrowRight size={18} />
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
                <p className="text-sm text-zinc-400">Ainda não tem uma loja?</p>
                <button onClick={onRegisterClick} className="text-white font-bold hover:underline mt-1 bg-transparent border-none cursor-pointer">
                    Criar E-commerce
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
