
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, ShoppingBag, Phone, Mail, Lock, ArrowRight, Eye, EyeOff, Globe, MessageCircle, FileText, CheckCircle2, Rocket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { User as UserType, Tenant } from '../../types';

interface RegisterPageProps {
    onLoginClick: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLoginClick }) => {
  const { saasRegister, completeRegistration } = useStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<{user: UserType, tenant: Tenant} | null>(null);
  
  // Form Data
  const [storeName, setStoreName] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Gera o slug preview em tempo real
  const generatedSlug = storeName ? `venduss.com.br/${storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}` : 'venduss.com.br/sua-loja';

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFinalSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
          alert("As senhas não coincidem!");
          return;
      }
      setLoading(true);
      
      const result = await saasRegister({
          fullName, storeName, whatsapp, email, password
      });

      if (result.success && result.user && result.tenant) {
          setCreatedAccount({ user: result.user, tenant: result.tenant });
          setLoading(false);
          setStep(4); // Success Step
      } else {
          setLoading(false);
          alert("Erro ao criar conta.");
      }
  };

  const enterDashboard = () => {
      if (createdAccount) {
          completeRegistration(createdAccount.user, createdAccount.tenant);
      }
  };

  const renderStep = () => {
      switch(step) {
          case 1: // Store Info
              return (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <ShoppingBag className="text-purple-400" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Qual o nome da sua Loja?</h2>
                        <p className="text-zinc-400 text-sm">Este será o coração da sua marca e seu endereço na internet.</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Nome da Loja</label>
                        <div className="relative">
                            <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                            <input 
                                required 
                                autoFocus
                                placeholder="Ex: Boutique da Moda" 
                                className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 text-white focus:border-purple-500 outline-none text-lg transition-all shadow-inner" 
                                value={storeName}
                                onChange={e => setStoreName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Cards Explicativos */}
                    <div className="bg-zinc-950/50 rounded-xl p-5 border border-zinc-800 space-y-5">
                        <div className="flex gap-4 items-start">
                            <div className="bg-blue-500/10 p-2 rounded-lg"><Globe className="text-blue-400 shrink-0" size={20} /></div>
                            <div>
                                <p className="text-sm font-bold text-white">Seu Link Exclusivo</p>
                                <p className="text-xs text-zinc-500 mt-1">O site da sua loja será acessado através deste endereço:</p>
                                <p className="text-green-400 font-mono text-sm mt-1 bg-green-900/10 inline-block px-2 py-1 rounded border border-green-500/20">{generatedSlug}</p>
                            </div>
                        </div>
                        <div className="h-px bg-zinc-800" />
                        <div className="flex gap-4 items-start">
                            <div className="bg-yellow-500/10 p-2 rounded-lg"><FileText className="text-yellow-400 shrink-0" size={20} /></div>
                            <div>
                                <p className="text-sm font-bold text-white">Identidade nos Pedidos</p>
                                <p className="text-xs text-zinc-500 mt-1">Este nome aparecerá nos recibos digitais enviados no WhatsApp e no cabeçalho dos pedidos para seus clientes.</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={nextStep}
                        disabled={!storeName}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        Continuar <ArrowRight size={20} />
                    </button>
                </div>
              );
          
          case 2: // Personal Info
              return (
                <div className="space-y-6 animate-slide-up">
                    <button onClick={prevStep} className="text-zinc-500 hover:text-white flex items-center gap-1 text-sm mb-2 transition-colors"><ArrowLeft size={16}/> Voltar</button>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="text-green-400" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Quem é o dono?</h2>
                        <p className="text-zinc-400 text-sm">Precisamos saber quem está no comando para o suporte.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Seu Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                <input 
                                    required 
                                    autoFocus
                                    placeholder="Seu nome" 
                                    className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 text-white focus:border-green-500 outline-none transition-all" 
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">WhatsApp para Contato</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                <input 
                                    required 
                                    type="tel"
                                    placeholder="(00) 90000-0000" 
                                    className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 text-white focus:border-green-500 outline-none transition-all" 
                                    value={whatsapp}
                                    onChange={e => setWhatsapp(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-3">
                        <MessageCircle className="text-green-500 shrink-0 mt-1" size={24} />
                        <div>
                            <p className="text-sm font-bold text-white">Por que o WhatsApp?</p>
                            <ul className="text-xs text-zinc-400 mt-2 space-y-1 list-disc list-inside">
                                <li>Seus clientes enviarão pedidos para este número.</li>
                                <li>Nosso suporte da VENDUSS entrará em contato com você por aqui.</li>
                                <li>Você receberá notificações de vendas aqui.</li>
                            </ul>
                        </div>
                    </div>

                    <button 
                        onClick={nextStep}
                        disabled={!fullName || !whatsapp}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        Próximo Passo <ArrowRight size={20} />
                    </button>
                </div>
              );

          case 3: // Credentials
              return (
                <div className="space-y-6 animate-slide-up">
                    <button onClick={prevStep} className="text-zinc-500 hover:text-white flex items-center gap-1 text-sm mb-2 transition-colors"><ArrowLeft size={16}/> Voltar</button>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="text-blue-400" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Acesso Seguro</h2>
                        <p className="text-zinc-400 text-sm">Defina como você vai entrar no painel administrativo.</p>
                    </div>

                    <form onSubmit={handleFinalSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">E-mail de Login</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                <input 
                                    required 
                                    type="email" 
                                    placeholder="seu@melhoremail.com" 
                                    className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-yellow-500 mt-2 flex items-center gap-1 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                                <ShieldCheck size={12} /> <strong>Importante:</strong> Use um e-mail que você saiba e não vá esquecer.
                            </p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Crie uma Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                <input 
                                    required 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 pr-12 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Confirme a Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                <input 
                                    required 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 pr-12 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading || !email || !password || !confirmPassword}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            {loading ? 'Finalizando...' : 'Concluir Cadastro'} <CheckCircle2 size={20} />
                        </button>
                    </form>
                </div>
              );

          case 4: // Success
              return (
                <div className="text-center space-y-8 animate-scale-in py-4">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-purple-600 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-full shadow-2xl relative z-10 border-4 border-black">
                            <Rocket size={64} className="text-white fill-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 uppercase leading-tight">
                            Bem-vindo à Revolução!
                        </h1>
                        <p className="text-zinc-300 text-lg max-w-sm mx-auto leading-relaxed">
                            Você agora faz parte do <span className="text-purple-400 font-bold">maior sistema de e-commerce</span> do Brasil.
                        </p>
                    </div>

                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-left space-y-4 max-w-sm mx-auto shadow-xl">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Suas ferramentas exclusivas:</p>
                        <div className="flex items-center gap-3 text-white font-medium bg-black/40 p-2 rounded-lg border border-zinc-800/50">
                            <CheckCircle2 size={18} className="text-green-500"/> I.A. Estilista Virtual
                        </div>
                        <div className="flex items-center gap-3 text-white font-medium bg-black/40 p-2 rounded-lg border border-zinc-800/50">
                            <CheckCircle2 size={18} className="text-green-500"/> Sorteios Automáticos
                        </div>
                        <div className="flex items-center gap-3 text-white font-medium bg-black/40 p-2 rounded-lg border border-zinc-800/50">
                            <CheckCircle2 size={18} className="text-green-500"/> Sistema de Fiado Inteligente
                        </div>
                        <div className="flex items-center gap-3 text-white font-medium bg-black/40 p-2 rounded-lg border border-zinc-800/50">
                            <CheckCircle2 size={18} className="text-green-500"/> Checkout Transparente
                        </div>
                    </div>

                    <button 
                        onClick={enterDashboard}
                        className="w-full bg-white text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] mt-4 flex items-center justify-center gap-2"
                    >
                        Acessar Minha Loja Agora <Rocket size={20} className="text-purple-600"/>
                    </button>
                </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        
        {/* Progress Bar (Only 1-3) */}
        {step < 4 && (
            <div className="mb-8 flex justify-center gap-2">
                <div className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-zinc-800'}`}></div>
                <div className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-zinc-800'}`}></div>
                <div className={`h-1.5 w-16 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-zinc-800'}`}></div>
            </div>
        )}

        {/* Modal Container */}
        <div className={`bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl transition-all duration-500 ${step === 4 ? 'p-0 border-none bg-transparent shadow-none' : 'p-8'}`}>
            {renderStep()}
        </div>

        {step < 4 && (
            <div className="mt-8 text-center">
                <p className="text-zinc-500 text-sm">Já tem uma conta?</p>
                <button onClick={onLoginClick} className="text-white font-bold hover:underline transition-colors mt-1 bg-transparent border-none cursor-pointer">
                    Fazer Login
                </button>
            </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default RegisterPage;
