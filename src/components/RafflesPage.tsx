
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Gift, Calendar, CheckCircle, XCircle, Lock, ArrowLeft, Trophy } from 'lucide-react';
import AuthModal from './AuthModal';

const RafflesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { raffles, currentUser, checkRaffleEligibility } = useStore();
  const [showAuth, setShowAuth] = useState(false);

  // Show only active raffles to clients
  const activeRaffles = raffles.filter(r => r.status === 'active');

  const checkStatus = (raffle: any) => {
      if (!currentUser) return 'login_required';
      const isEligible = checkRaffleEligibility(raffle.id, currentUser.id);
      return isEligible ? 'eligible' : 'not_eligible';
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
       {/* Hero */}
       <div className="relative bg-gradient-to-b from-purple-900/20 to-black border-b border-zinc-800 pt-16 pb-12 px-4 text-center">
          <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
             <ArrowLeft size={20} /> Voltar
          </button>
          
          <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-full border border-purple-500/30 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
             <Gift size={48} className="text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-purple-400 mb-4">
             SORTEIOS EXCLUSIVOS
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-lg">
             Compre na loja e concorra a prêmios incríveis. Verifique abaixo se você já está participando!
          </p>
       </div>

       <div className="max-w-5xl mx-auto px-4 py-12">
          {activeRaffles.length === 0 ? (
              <div className="text-center py-24 border border-zinc-800 rounded-3xl bg-zinc-900/50">
                  <Trophy size={48} className="text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500 font-bold text-lg">Nenhum sorteio ativo no momento.</p>
                  <p className="text-zinc-600 text-sm">Fique ligado em nossas redes sociais!</p>
              </div>
          ) : (
              <div className="grid gap-8">
                  {activeRaffles.map(raffle => {
                      const status = checkStatus(raffle);
                      
                      return (
                          <div key={raffle.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden md:flex shadow-2xl group hover:border-zinc-700 transition-all">
                              {/* Image Section */}
                              <div className="h-64 md:h-auto md:w-2/5 relative bg-zinc-800 overflow-hidden">
                                  <img 
                                    src={raffle.prizeImage} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                    alt={raffle.title}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent md:bg-gradient-to-r"></div>
                                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                     <span className="text-xs font-bold text-white flex items-center gap-2">
                                        <Calendar size={14} /> Sorteio: {new Date(raffle.drawDate).toLocaleDateString('pt-BR')}
                                     </span>
                                  </div>
                              </div>

                              {/* Content Section */}
                              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                  <h3 className="text-3xl font-black text-white mb-3 italic uppercase tracking-wide">{raffle.title}</h3>
                                  <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                    {raffle.description || 'Um prêmio incrível esperando por você. Participe comprando em nossa loja.'}
                                  </p>
                                  
                                  <div className="bg-black/40 p-4 rounded-xl border border-zinc-800 mb-6">
                                     <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Como participar:</p>
                                     <p className="text-sm text-zinc-300">Ter pelo menos uma compra <strong>paga</strong> nos últimos <span className="text-white font-bold">{raffle.ruleDays} dias</span>.</p>
                                  </div>

                                  <div className="mt-auto">
                                      {status === 'login_required' && (
                                          <button 
                                            onClick={() => setShowAuth(true)}
                                            className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                          >
                                              <Lock size={18} /> Entre para verificar se está participando
                                          </button>
                                      )}
                                      
                                      {status === 'eligible' && (
                                          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-1 text-center">
                                              <div className="flex items-center gap-2 text-green-400 font-black text-lg uppercase">
                                                  <CheckCircle size={24} /> Você está participando!
                                              </div>
                                              <p className="text-xs text-green-400/70">Boa sorte! O resultado será divulgado na data do sorteio.</p>
                                          </div>
                                      )}

                                      {status === 'not_eligible' && (
                                          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
                                              <div className="flex items-center gap-2 text-red-400 font-bold mb-1 justify-center">
                                                  <XCircle size={20} /> Ainda não está participando
                                              </div>
                                              <p className="text-xs text-zinc-400">
                                                  Você precisa realizar uma nova compra para entrar neste sorteio.
                                              </p>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}
       </div>

       <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
};

export default RafflesPage;
