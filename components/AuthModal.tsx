import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Lock, Mail, Phone, FileText } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      onClose();
    } else {
      setError('E-mail ou senha inválidos.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    const newUser = register({ name, email, phone, cpf, password });
    if (newUser) {
      onClose();
    } else {
      // Error is handled inside register function with an alert for now
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-slide-up shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">{isLoginView ? 'Acesse sua Conta' : 'Crie sua Conta'}</h2>
        <p className="text-zinc-400 text-sm text-center mb-6">
          {isLoginView ? 'Bem-vindo de volta!' : 'Rápido e fácil, vamos começar!'}
        </p>

        {error && <p className="bg-red-500/20 text-red-400 text-xs text-center p-2 rounded-lg mb-4 border border-red-500/30">{error}</p>}

        {isLoginView ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
            <button type="submit" className="w-full bg-white text-black py-3 rounded-lg font-bold">Entrar</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
             <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
             <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="tel" placeholder="WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
            <div className="relative">
              <FileText size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="password" placeholder="Crie uma Senha" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="password" placeholder="Confirme a Senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white" />
            </div>
            <button type="submit" className="w-full bg-white text-black py-3 rounded-lg font-bold">Criar Conta</button>
          </form>
        )}

        <p className="text-center text-xs text-zinc-500 mt-6">
          {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button onClick={() => setIsLoginView(!isLoginView)} className="font-bold text-white underline ml-1">
            {isLoginView ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
