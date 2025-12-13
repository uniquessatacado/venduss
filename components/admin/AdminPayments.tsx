import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CreditCard, QrCode, Percent } from 'lucide-react';

const AdminPayments: React.FC = () => {
  const { settings, updateSettings } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="text-green-500"/> Configurações de Pagamento</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PIX Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
           <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2"><QrCode size={20} /> Configuração PIX</h3>
           
           <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Chave PIX</label>
              <input 
                 className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                 value={settings.pixKey}
                 onChange={e => updateSettings({ pixKey: e.target.value })}
                 placeholder="CPF, CNPJ, Email..."
              />
           </div>

           <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Tipo de Chave</label>
              <select 
                 className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                 value={settings.pixKeyType}
                 onChange={e => updateSettings({ pixKeyType: e.target.value as any })}
              >
                 <option value="cpf">CPF</option>
                 <option value="cnpj">CNPJ</option>
                 <option value="email">E-mail</option>
                 <option value="phone">Telefone</option>
                 <option value="random">Aleatória</option>
              </select>
           </div>
        </div>

        {/* Credit Card Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
           <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2"><CreditCard size={20} /> Cartão de Crédito</h3>
           
           <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Máximo de Parcelas Sem Juros</label>
              <div className="flex items-center gap-3">
                 <input 
                    type="number"
                    className="w-20 bg-black border border-zinc-700 rounded-lg p-3 text-white text-center font-bold"
                    value={settings.maxInstallmentsNoInterest}
                    onChange={e => updateSettings({ maxInstallmentsNoInterest: parseInt(e.target.value) })}
                 />
                 <span className="text-sm text-zinc-400">x (vezes)</span>
              </div>
           </div>
           
           <div className="p-4 bg-black/40 rounded-lg border border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">Simulação de Parcelamento (R$ 1.000,00):</p>
              <div className="space-y-1 text-xs text-zinc-300">
                 <p>1x R$ 1.000,00</p>
                 <p>{settings.maxInstallmentsNoInterest}x R$ {(1000 / settings.maxInstallmentsNoInterest).toFixed(2)} (Sem juros)</p>
                 <p>{settings.maxInstallmentsNoInterest + 1}x (Com juros do gateway)</p>
              </div>
           </div>
        </div>

        {/* Fiado Settings (Moved from general settings for better grouping) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 md:col-span-2">
           <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2"><Percent size={20} /> Juros e Multas (Fiado)</h3>
           <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Multa por Atraso (%)</label>
                    <input 
                        type="number"
                        value={settings.finePercentage}
                        onChange={(e) => updateSettings({ finePercentage: parseFloat(e.target.value) })}
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                    />
                </div>
                <div>
                    <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Juros ao Dia (%)</label>
                    <input 
                        type="number"
                        step="0.1"
                        value={settings.interestDailyPercentage}
                        onChange={(e) => updateSettings({ interestDailyPercentage: parseFloat(e.target.value) })}
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                    />
                </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPayments;