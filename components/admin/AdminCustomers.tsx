import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, DollarSign, Trash2, User, Phone, MapPin, Calendar, TrendingUp, AlertCircle, CheckCircle, ArrowRight, Share2, Sparkles, X, ChevronLeft, LayoutGrid, Heart } from 'lucide-react';
import { Customer, Product } from '../../types';

// --- SUBCOMPONENT: CUSTOMER DETAIL DASHBOARD ---
const CustomerDetailDashboard: React.FC<{ customer: Customer, onClose: () => void }> = ({ customer, onClose }) => {
    const { getCustomerStats, getMatchingProducts, settings } = useStore();
    const stats = getCustomerStats(customer.id);
    const matchData = getMatchingProducts(customer.id);

    const shareMatchLink = () => {
        // Simulating a link share
        const dummyLink = `${window.location.origin}/match/${customer.id}`; // In real app, this would be a real route
        navigator.clipboard.writeText(`Olá ${customer.name}! Preparei uma seleção exclusiva de produtos "Top 1" pra você. Confira: ${dummyLink}`);
        alert("Link copiado para a área de transferência! Cole no WhatsApp.");
    };

    const handleWhatsApp = () => {
        const phone = customer.phone.replace(/\D/g, '');
        window.open(`https://wa.me/55${phone}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="sticky top-0 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 bg-black rounded-full hover:bg-zinc-800 text-white transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {customer.name}
                            {stats.currentDebt > 0 && <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded border border-red-500/30 uppercase">Em Débito</span>}
                        </h2>
                        <p className="text-xs text-zinc-400">{customer.email}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                        <Phone size={16} /> WhatsApp
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                
                {/* 1. KEY METRICS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Última Compra</p>
                        <p className="text-2xl font-bold text-white">{stats.daysSinceLastOrder} dias</p>
                        <p className="text-[10px] text-zinc-600">Atrás</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Frequência</p>
                        <p className="text-2xl font-bold text-white">{stats.frequencyDays} dias</p>
                        <div className={`text-[10px] inline-flex items-center gap-1 px-1.5 rounded ${stats.isFrequent ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'}`}>
                            {stats.isFrequent ? 'Dentro da média' : 'Fora da frequência'}
                        </div>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Lucro Gerado</p>
                        <p className="text-2xl font-bold text-green-400">R$ {stats.totalProfit.toFixed(2)}</p>
                        <p className="text-[10px] text-zinc-600">Total Vendas: R$ {stats.totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 relative overflow-hidden">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Situação Atual</p>
                        {stats.currentDebt > 0 ? (
                            <>
                                <p className="text-2xl font-bold text-red-500">R$ -{stats.currentDebt.toFixed(2)}</p>
                                <p className="text-[10px] text-red-400">Prejuízo Ativo</p>
                            </>
                        ) : (
                            <>
                                <p className="text-2xl font-bold text-green-500">Em dia</p>
                                <p className="text-[10px] text-green-600">Sem pendências</p>
                            </>
                        )}
                    </div>
                </div>

                {/* 2. TOP 1 PROFILE */}
                <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><LayoutGrid size={20} className="text-purple-500"/> Perfil Top 1 do Cliente</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-500 uppercase">Marca Favorita</span>
                            <span className="text-lg font-bold text-white">{stats.topProfile.brand?.name || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-500 uppercase">Categoria Top</span>
                            <span className="text-lg font-bold text-white">{stats.topProfile.category?.name || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-500 uppercase">Cor Mais Comprada</span>
                            <div className="flex items-center gap-2">
                                {stats.topProfile.color?.hex && <div className="w-4 h-4 rounded-full border border-zinc-600" style={{backgroundColor: stats.topProfile.color.hex}}></div>}
                                <span className="text-lg font-bold text-white">{stats.topProfile.color?.name || '-'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-zinc-500 uppercase">Tamanho Padrão</span>
                            <span className="text-lg font-bold text-white">{stats.topProfile.size || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* 3. MATCH SECTION */}
                <div className="bg-zinc-900 border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
                        <div>
                            <h3 className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-3">
                                <Sparkles className="fill-purple-500 text-purple-500" /> PRODUTOS QUE DEU MATCH
                            </h3>
                            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
                                Baseado no perfil Top 1 e no estoque atual. Estes são os produtos com maior chance de venda para este cliente.
                            </p>
                        </div>
                        <button 
                            onClick={shareMatchLink}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-transform active:scale-95"
                        >
                            <Share2 size={18} /> Copiar Link de Match
                        </button>
                    </div>

                    {matchData.products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10">
                            {matchData.products.map(product => (
                                <div key={product.id} className="bg-black p-3 rounded-xl border border-zinc-800 group hover:border-purple-500/50 transition-colors">
                                    <div className="relative aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden mb-3">
                                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-2 right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">MATCH</div>
                                    </div>
                                    <p className="text-xs font-bold text-white line-clamp-1">{product.name}</p>
                                    <p className="text-xs text-zinc-500">{product.category}</p>
                                    <p className="text-sm font-bold text-white mt-1">R$ {product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-black/30 rounded-xl border border-zinc-800 border-dashed relative z-10">
                            <p className="text-zinc-500">Nenhum produto em estoque deu match com o perfil Top 1 (Tamanho/Marca/Cor) deste cliente no momento.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const AdminCustomers: React.FC = () => {
  const { customers, addCustomer } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'debtors' | 'frequent'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Create Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', city: '' });

  // Sorting and Filtering Logic
  const filteredCustomers = useMemo(() => {
      let list = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

      // 1. Sort by Status: Debtors First, then by Name
      list.sort((a, b) => {
          if (a.debt > 0 && b.debt <= 0) return -1;
          if (a.debt <= 0 && b.debt > 0) return 1;
          return a.name.localeCompare(b.name);
      });

      // 2. Apply Tabs
      if (activeTab === 'debtors') {
          list = list.filter(c => c.debt > 0);
      }
      // 'frequent' logic requires calculating stats, omitted for perf in basic filter, handled in display

      return list;
  }, [customers, searchTerm, activeTab]);

  const handleAdd = () => {
    if (!newCustomer.name) return;
    addCustomer({
      id: Date.now().toString(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: `${newCustomer.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      address: {
        street: 'Não informado',
        number: 'S/N',
        neighborhood: 'Não informado',
        city: newCustomer.city,
        state: 'UF',
        zip: '00000-000'
      },
      debt: 0,
      balance: 0,
      history: [],
      unclaimedPrizes: []
    });
    setNewCustomer({ name: '', phone: '', city: '' });
    setShowAddModal(false);
  };

  return (
    <>
        <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2"><User className="text-blue-500" /> Gestão de Clientes</h2>
            
            <div className="flex gap-2">
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded text-xs font-bold uppercase ${activeTab === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>Todos</button>
                    <button onClick={() => setActiveTab('debtors')} className={`px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-1 ${activeTab === 'debtors' ? 'bg-red-900/50 text-red-200' : 'text-zinc-500'}`}>
                        <AlertCircle size={12} /> Prejuízos ({customers.filter(c => c.debt > 0).length})
                    </button>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-zinc-200"
                >
                    <Plus size={16} /> Novo
                </button>
            </div>
        </div>

        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-zinc-600"
            placeholder="Buscar cliente por nome..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map(customer => {
                // Calculate basic stats for the card
                const lastOrder = customer.history.length > 0 ? new Date(customer.history[0].date) : null;
                const daysSince = lastOrder ? Math.floor((new Date().getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24)) : -1;
                const hasDebt = customer.debt > 0;

                return (
                    <div key={customer.id} className={`bg-zinc-900 border p-5 rounded-2xl flex flex-col relative group transition-all hover:border-zinc-600 ${hasDebt ? 'border-red-900/30' : 'border-zinc-800'}`}>
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            {hasDebt ? (
                                <span className="flex items-center gap-1 bg-red-500/10 text-red-500 text-[10px] px-2 py-1 rounded font-bold uppercase border border-red-500/20">
                                    <AlertCircle size={10} /> Atrasado (R$ {customer.debt.toFixed(0)})
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 bg-green-500/10 text-green-500 text-[10px] px-2 py-1 rounded font-bold uppercase border border-green-500/20">
                                    <CheckCircle size={10} /> Em dia
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-white">{customer.name}</h3>
                            <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1">
                                <MapPin size={12} /> {customer.address?.city || 'Cidade N/D'}
                            </div>
                        </div>

                        <div className="bg-black/40 p-3 rounded-lg border border-zinc-800 mb-4">
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="text-zinc-500">Última Compra:</span>
                                <span className={`font-bold ${daysSince > 30 ? 'text-red-400' : 'text-white'}`}>
                                    {daysSince === -1 ? 'Nunca' : `${daysSince} dias atrás`}
                                </span>
                            </div>
                            {daysSince > 30 && daysSince !== -1 && (
                                <p className="text-[10px] text-red-500 mt-1 italic">⚠️ Cliente inativo há muito tempo.</p>
                            )}
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-zinc-800 flex gap-2">
                            <button 
                                onClick={() => {
                                    const phone = customer.phone.replace(/\D/g, '');
                                    window.open(`https://wa.me/55${phone}`, '_blank');
                                }}
                                className="bg-zinc-800 hover:bg-[#25D366] hover:text-white text-zinc-400 p-2 rounded-lg transition-colors"
                                title="WhatsApp"
                            >
                                <Phone size={18} />
                            </button>
                            <button 
                                onClick={() => setSelectedCustomer(customer)}
                                className="flex-1 bg-white hover:bg-zinc-200 text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                            >
                                <User size={14} /> Detalhes do Cliente
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Add Modal */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md animate-slide-up">
                <h3 className="text-xl font-bold mb-4">Novo Cliente</h3>
                <div className="space-y-4">
                <input 
                    placeholder="Nome Completo" 
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                />
                <input 
                    placeholder="Telefone" 
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
                <input 
                    placeholder="Cidade" 
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                    value={newCustomer.city}
                    onChange={e => setNewCustomer({...newCustomer, city: e.target.value})}
                />
                <div className="flex gap-3 mt-6">
                    <button onClick={() => setShowAddModal(false)} className="flex-1 bg-zinc-800 py-3 rounded-lg font-bold text-white">Cancelar</button>
                    <button onClick={handleAdd} className="flex-1 bg-white text-black py-3 rounded-lg font-bold">Salvar</button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>

        {/* Detail Dashboard Overlay */}
        {selectedCustomer && (
            <CustomerDetailDashboard customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
        )}
    </>
  );
};

export default AdminCustomers;