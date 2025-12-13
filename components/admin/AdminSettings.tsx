
import React, { useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ToggleLeft, ToggleRight, Percent, Upload, Image as ImageIcon, Trash2, User, Save, MapPin, Plus, X } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings, currentTenant, updateTenantLogo, user, updateUser } = useStore();
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit States
  const [profileData, setProfileData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      whatsapp: user?.whatsapp || '',
      password: user?.password || ''
  });

  // Social Proof States
  const [newLocation, setNewLocation] = useState({ name: '', percentage: 0 });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateTenantLogo(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleUpdateProfile = () => {
      updateUser(profileData);
      alert("Dados atualizados com sucesso!");
  };

  const addLocation = () => {
      if (!newLocation.name) return;
      const currentTotal = settings.socialProofLocations?.reduce((a, b) => a + b.percentage, 0) || 0;
      
      // Simple check, in real app might need strict 100% enforcement
      const updatedLocations = [...(settings.socialProofLocations || []), newLocation];
      updateSettings({ socialProofLocations: updatedLocations });
      setNewLocation({ name: '', percentage: 0 });
  };

  const removeLocation = (index: number) => {
      const updated = settings.socialProofLocations?.filter((_, i) => i !== index);
      updateSettings({ socialProofLocations: updated });
  };

  const ToggleItem = ({ label, description, value, field }: any) => (
    <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
      <div>
        <h4 className="font-bold text-white">{label}</h4>
        <p className="text-zinc-500 text-sm mt-1">{description}</p>
      </div>
      <button 
        onClick={() => updateSettings({ [field]: !value })}
        className={`transition-colors ${value ? 'text-green-500' : 'text-zinc-600'}`}
      >
        {value ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <h2 className="text-2xl font-bold">Ajustes da Loja</h2>
      
      {/* 1. ADMIN PROFILE (Meus Dados) */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h4 className="font-bold text-white mb-6 flex items-center gap-2"><User size={20} className="text-blue-500"/> Meus Dados (Admin)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Nome Completo</label>
                  <input className="input-field" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
              </div>
              <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">E-mail de Acesso</label>
                  <input className="input-field" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} />
              </div>
              <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">WhatsApp (Contato)</label>
                  <input className="input-field" value={profileData.whatsapp} onChange={e => setProfileData({...profileData, whatsapp: e.target.value})} placeholder="(00) 00000-0000" />
              </div>
              <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Senha</label>
                  <input className="input-field" type="password" value={profileData.password} onChange={e => setProfileData({...profileData, password: e.target.value})} placeholder="Nova senha..." />
              </div>
          </div>
          <button onClick={handleUpdateProfile} className="mt-4 bg-white text-black px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-colors">
              <Save size={16} /> Salvar Alterações
          </button>
      </div>

      {/* 2. BRANDING */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <h4 className="font-bold text-white mb-4 flex items-center gap-2"><ImageIcon size={20} className="text-purple-500"/> Identidade Visual</h4>
          <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="h-24 w-24 bg-black rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden relative group shrink-0">
                  {currentTenant?.logo ? (
                      <img src={currentTenant.logo} className="h-full w-full object-contain" alt="Logo" />
                  ) : (
                      <ImageIcon className="text-zinc-600" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => logoInputRef.current?.click()} className="text-white text-xs font-bold">Alterar</button>
                  </div>
              </div>
              <div className="flex-1 w-full">
                  <div className="mb-4">
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Nome da Loja</label>
                      <input 
                          type="text"
                          value={settings.storeName}
                          onChange={(e) => updateSettings({ storeName: e.target.value })}
                          className="input-field"
                      />
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => logoInputRef.current?.click()} className="bg-zinc-800 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-zinc-700 transition-colors flex items-center gap-2"><Upload size={14}/> Upload Logo</button>
                      {currentTenant?.logo && <button onClick={() => updateTenantLogo('')} className="bg-red-900/20 text-red-500 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-900/30 transition-colors"><Trash2 size={14}/></button>}
                  </div>
                  <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
              </div>
          </div>
      </div>

      {/* 3. FEATURES TOGGLES */}
      <div className="space-y-4">
        <ToggleItem label="Letreiro Digital (Ticker)" description="Barra de anúncios no topo." value={settings.showTicker} field="showTicker" />
        <ToggleItem label="Flash Sale" description="Banner de contagem regressiva." value={settings.showFlashSale} field="showFlashSale" />
        <ToggleItem label="Assistente I.A." description="Chatbot flutuante." value={settings.showAiAssistant} field="showAiAssistant" />
        <ToggleItem label="Prova Social (Pop-ups)" description="Notificações de compra." value={settings.showSocialProof} field="showSocialProof" />
      </div>

      {/* 4. SOCIAL PROOF ADVANCED CONFIG */}
      {settings.showSocialProof && (
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl animate-fade-in">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2"><MapPin size={20} className="text-green-500"/> Configuração de Prova Social</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Tempo Mínimo (seg)</label>
                      <input type="number" className="input-field" value={settings.socialProofMinTime || 60} onChange={e => updateSettings({ socialProofMinTime: parseInt(e.target.value) })} />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Tempo Máximo (seg)</label>
                      <input type="number" className="input-field" value={settings.socialProofMaxTime || 120} onChange={e => updateSettings({ socialProofMaxTime: parseInt(e.target.value) })} />
                  </div>
              </div>

              <div className="mb-4">
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Locais e Probabilidade</label>
                  <div className="flex gap-2 mb-2">
                      <input placeholder="Cidade/Estado (Ex: Itatuba, PB)" className="input-field flex-[2]" value={newLocation.name} onChange={e => setNewLocation({...newLocation, name: e.target.value})} />
                      <input type="number" placeholder="%" className="input-field flex-1" value={newLocation.percentage || ''} onChange={e => setNewLocation({...newLocation, percentage: parseInt(e.target.value)})} />
                      <button onClick={addLocation} className="bg-white text-black rounded-lg px-3 hover:bg-zinc-200"><Plus/></button>
                  </div>
                  
                  <div className="space-y-2 mt-2">
                      {settings.socialProofLocations?.map((loc, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-black p-3 rounded-lg border border-zinc-800">
                              <span className="text-sm text-white">{loc.name}</span>
                              <div className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-green-500">{loc.percentage}%</span>
                                  <button onClick={() => removeLocation(idx)} className="text-zinc-600 hover:text-red-500"><X size={14}/></button>
                              </div>
                          </div>
                      ))}
                      {(!settings.socialProofLocations || settings.socialProofLocations.length === 0) && <p className="text-zinc-500 text-xs italic">Nenhum local configurado. Usará padrão.</p>}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2">A soma das porcentagens define a chance de cada local aparecer nas notificações.</p>
              </div>
          </div>
      )}

      {/* 5. FIADO SETTINGS */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
         <h4 className="font-bold text-white mb-4 flex items-center gap-2"><Percent size={20} /> Taxas do Fiado</h4>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Multa Atraso (%)</label>
               <input type="number" value={settings.finePercentage} onChange={(e) => updateSettings({ finePercentage: parseFloat(e.target.value) })} className="input-field" />
            </div>
            <div>
               <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Juros Diários (%)</label>
               <input type="number" step="0.1" value={settings.interestDailyPercentage} onChange={(e) => updateSettings({ interestDailyPercentage: parseFloat(e.target.value) })} className="input-field" />
            </div>
         </div>
      </div>
      
      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm text-center">
        <p>⚠️ Alterações salvas automaticamente.</p>
      </div>

      <style>{`
        .input-field {
            width: 100%;
            background-color: #000;
            border: 1px solid #3f3f46;
            border-radius: 0.5rem;
            padding: 0.75rem;
            color: white;
            outline: none;
            transition: border-color 0.2s;
        }
        .input-field:focus {
            border-color: #a855f7;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
