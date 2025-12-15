import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, CartItem, Customer, Installment, Order } from '../../types';
import { Search, Plus, Minus, Trash2, User, CreditCard, ShoppingBag as ShoppingBagIcon, Maximize2, X, Edit3, Calendar, Check, CheckCircle, MessageCircle, ArrowRight, UserPlus, Mail, Phone } from 'lucide-react';

const AdminPOS: React.FC = () => {
  const { products, customers, addOrder, settings, addCustomer, currentTenant } = useStore();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'cash' | 'pix' | 'fiado'>('cash');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // States for Edit Item Modal
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');

  // States for Fiado Modal
  const [showFiadoModal, setShowFiadoModal] = useState(false);
  const [installmentCount, setInstallmentCount] = useState(1);
  const [installments, setInstallments] = useState<Installment[]>([]);

  // States for Success Modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // States for Quick Customer Register
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- Logic for Editing Cart Items ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const openEditModal = (item: CartItem) => {
    setEditingItem(item);
    setEditPrice(item.price.toFixed(2));
    setEditQty(item.quantity.toString());
  };

  const saveEditItem = () => {
    if (!editingItem) return;
    const newPrice = parseFloat(editPrice.replace(',', '.'));
    const newQty = parseInt(editQty);

    if (isNaN(newPrice) || isNaN(newQty) || newQty <= 0) {
      alert("Valores inválidos");
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return { ...item, price: newPrice, quantity: newQty };
      }
      return item;
    }));
    setEditingItem(null);
  };

  const removeEditItem = () => {
    if (!editingItem) return;
    setCart(prev => prev.filter(item => item.id !== editingItem.id));
    setEditingItem(null);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // --- Logic for Fiado Installments ---
  const createInstallments = (count: number, totalValue: number): Installment[] => {
    if (count < 1) return [];
    const valuePerInstallment = totalValue / count;
    const newInstallments: Installment[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + (30 * (i + 1))); 
      
      newInstallments.push({
        id: `inst-temp-${i}`,
        number: i + 1,
        totalInstallments: count,
        value: valuePerInstallment,
        dueDate: dueDate.toISOString().split('T')[0], 
        status: 'pending'
      });
    }
    return newInstallments;
  };

  const updateInstallmentDate = (index: number, date: string) => {
    const updated = [...installments];
    updated[index].dueDate = date;
    setInstallments(updated);
  };

  const handleInstallmentCountChange = (newCount: number) => {
    let count = newCount;
    if (count < 1) count = 1;
    if (count > 24) count = 24;
    
    setInstallmentCount(count);
    const newInst = createInstallments(count, total);
    setInstallments(newInst);
  };

  // --- Quick Register Logic ---
  const handleQuickRegister = () => {
    if (!newClient.name || !newClient.email) {
      alert("Nome e Email são obrigatórios.");
      return;
    }

    const emailExists = customers.some(c => c.email.toLowerCase() === newClient.email.toLowerCase());
    if (emailExists) {
      alert("Este email já está cadastrado.");
      return;
    }

    const newCustomerObj: Customer = {
      id: `c-quick-${Date.now()}`,
      tenantId: currentTenant?.id || 'unknown',
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      debt: 0,
      balance: 0,
      history: [],
      unclaimedPrizes: [],
      incompleteProfile: true, // Marks that this user needs to complete data on website
      preferences: {}
    };

    addCustomer(newCustomerObj);
    setSelectedCustomer(newCustomerObj);
    
    setNewClient({ name: '', email: '', phone: '' });
    setShowQuickRegister(false);
  };

  // --- Checkout Process ---
  const handlePreCheckout = () => {
    if (cart.length === 0) {
        alert("O carrinho está vazio.");
        return;
    }
    
    if (paymentMethod === 'fiado') {
      if (!selectedCustomer) {
        alert("Selecione um cliente para vender fiado!");
        return;
      }
      const initialInstallments = createInstallments(installmentCount, total);
      setInstallments(initialInstallments);
      setShowFiadoModal(true);
    } else {
      finishSale();
    }
  };

  const finishSale = (fiadoData?: Installment[]) => {
    const newOrder = addOrder({
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Cliente Balcão',
      customerPhone: selectedCustomer?.phone,
      items: cart,
      total: total,
      paymentMethod,
      status: 'completed',
      origin: 'pos',
      shipping: { method: 'pickup', cost: 0 },
      installments: fiadoData
    });

    setLastOrder(newOrder);
    setShowSuccessModal(true);

    // Reset UI
    setCart([]);
    setSelectedCustomer(null);
    setPaymentMethod('cash');
    setShowFiadoModal(false);
    setInstallmentCount(1);
    setInstallments([]);
  };

  const sendReceipt = () => {
    if (!lastOrder) return;

    // Use current settings.storeName for the receipt header
    const storeName = settings.storeName || 'Loja';

    const itemsList = lastOrder.items.map(i => `• ${i.quantity}x ${i.name} - R$ ${i.price.toFixed(2)}`).join('\n');
    let message = `*RECIBO DE VENDA - ${storeName.toUpperCase()}* ✅\n\n`;
    message += `Olá *${lastOrder.customerName}*, aqui está o resumo da sua compra:\n`;
    message += `---------------------------\n${itemsList}\n---------------------------\n`;
    message += `*Total: R$ ${lastOrder.total.toFixed(2)}*\n\n`;
    message += `*Pagamento:* ${lastOrder.paymentMethod.toUpperCase()}\n`;
    
    if (lastOrder.installments && lastOrder.installments.length > 0) {
        message += `\n*Parcelas (Fiado):*\n`;
        lastOrder.installments.forEach(inst => {
            const date = new Date(inst.dueDate).toLocaleDateString('pt-BR');
            message += `${inst.number}/${inst.totalInstallments} - R$ ${inst.value.toFixed(2)} (${date})\n`;
        });
    }

    message += `\nObrigado pela preferência! 🙌`;

    const phone = lastOrder.customerPhone ? lastOrder.customerPhone.replace(/\D/g, '') : '';
    if (phone) {
        window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
        alert("Cliente sem telefone cadastrado. O recibo foi gerado mas não pode ser enviado.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 relative">
      
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-h-0 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar produto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white transition-colors text-base"
            />
          </div>
        </div>
        
        {/* GRID DE PRODUTOS */}
        <div className="flex-1 overflow-y-auto p-3 bg-black">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm hover:border-zinc-500 transition-colors group relative"
                >
                  <div className="relative aspect-[3/4] w-full bg-zinc-800">
                     <img 
                       src={product.image} 
                       alt={product.name} 
                       className="w-full h-full object-cover" 
                     />
                     <button 
                       onClick={(e) => { e.stopPropagation(); setZoomedImage(product.image); }}
                       className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/90 transition-colors z-10"
                     >
                        <Maximize2 size={16} />
                     </button>
                     <div 
                        onClick={() => addToCart(product)}
                        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-end justify-center cursor-pointer h-24 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                     >
                        <div className="bg-white text-black font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg transform active:scale-95 transition-transform">
                          <Plus size={18} /> <span className="text-xs uppercase">Adicionar</span>
                        </div>
                     </div>
                  </div>
                  <div 
                    onClick={() => addToCart(product)}
                    className="p-3 cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-colors flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-start gap-2">
                       <h4 className="font-bold text-sm text-zinc-100 line-clamp-2 leading-tight">{product.name}</h4>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-zinc-500">{product.category}</span>
                      <span className="text-white font-black text-lg">R$ {product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="w-full lg:w-[380px] flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl h-[40vh] lg:h-auto">
        <div className="p-3 border-b border-zinc-800 bg-zinc-950 flex gap-2">
            <div className="relative flex-1">
               <select 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 appearance-none pl-3"
                onChange={(e) => setSelectedCustomer(customers.find(c => c.id === e.target.value) || null)}
                value={selectedCustomer?.id || ''}
              >
                <option value="">👤 Cliente Balcão</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.debt > 0 ? `(R$ -${c.debt})` : ''}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={() => setShowQuickRegister(true)}
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:bg-zinc-700 hover:border-zinc-500 transition-colors"
              title="Novo Cadastro Rápido"
            >
               <Plus size={18} />
            </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-zinc-900">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600">
              <ShoppingBagIcon size={32} className="opacity-30 mb-2" />
              <p className="text-sm font-medium">Carrinho vazio</p>
            </div>
          ) : (
            cart.map(item => (
              <div 
                key={item.id} 
                onClick={() => openEditModal(item)} // OPEN EDIT MODAL ON CLICK
                className="flex gap-2 bg-zinc-950/50 p-2 rounded-lg border border-zinc-800/50 hover:border-zinc-500 cursor-pointer transition-colors group relative"
              >
                <img src={item.image} className="w-10 h-12 object-cover rounded bg-zinc-800" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                     <p className="font-bold text-xs text-zinc-200 truncate pr-2 group-hover:text-white">{item.name}</p>
                     <p className="font-bold text-xs text-white whitespace-nowrap">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Unit: {item.price.toFixed(2)}</span>
                        <Edit3 size={10} className="text-zinc-600 group-hover:text-blue-400" />
                    </div>
                    <div className="flex items-center bg-zinc-800 rounded px-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-zinc-400 hover:text-white"><Minus size={10}/></button>
                        <span className="text-xs font-mono w-4 text-center text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-zinc-400 hover:text-white"><Plus size={10}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Totals */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800">
           <div className="flex justify-between items-end mb-3">
             <span className="text-zinc-400 text-xs font-medium">Total</span>
             <span className="text-2xl font-bold text-white">R$ {total.toFixed(2)}</span>
           </div>
           
           <div className="grid grid-cols-3 gap-1 mb-2">
             {['cash', 'card', 'pix'].map((method) => (
               <button 
                key={method}
                onClick={() => setPaymentMethod(method as any)}
                className={`py-2 rounded text-[10px] font-bold uppercase border transition-all ${
                  paymentMethod === method 
                    ? 'bg-white text-black border-white' 
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
               >
                 {method === 'card' ? 'Cartão' : method === 'cash' ? 'Dinheiro' : 'PIX'}
               </button>
             ))}
           </div>
           
           <div className="flex gap-2">
              <button 
                onClick={() => setPaymentMethod('fiado')}
                className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                    paymentMethod === 'fiado' ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-900 text-red-500 border-zinc-800'
                }`}
              >
                Fiado
              </button>
              <button 
                type="button"
                onClick={handlePreCheckout}
                disabled={cart.length === 0}
                className="flex-[2] bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white py-3 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                FINALIZAR
              </button>
           </div>
        </div>
      </div>
      
      {/* --- MODALS --- */}

      {/* 1. Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setZoomedImage(null)}>
           <button className="absolute top-4 right-4 text-white p-2 bg-zinc-800 rounded-full"> <X size={32} /> </button>
           <img src={zoomedImage} className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-zinc-700" />
        </div>
      )}

      {/* 2. Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-scale-in text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <Check size={40} className="text-black stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Venda Realizada!</h3>
                <p className="text-zinc-400 mb-8">O pedido foi registrado com sucesso no sistema.</p>

                <button 
                  onClick={sendReceipt}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-3 shadow-lg transition-transform active:scale-95"
                >
                   <MessageCircle size={20} /> Enviar Recibo WhatsApp
                </button>
                
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-xl font-bold"
                >
                   Fechar e Nova Venda
                </button>
            </div>
        </div>
      )}

      {/* 3. Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg text-white">Editar Item</h3>
               <button onClick={() => setEditingItem(null)}><X size={20} className="text-zinc-500 hover:text-white" /></button>
             </div>
             
             <div className="flex gap-4 mb-4">
               <img src={editingItem.image} className="w-16 h-20 object-cover rounded bg-zinc-800" />
               <div>
                  <p className="font-bold text-sm text-zinc-200">{editingItem.name}</p>
                  <p className="text-xs text-zinc-500">{editingItem.category}</p>
               </div>
             </div>

             <div className="space-y-4">
               <div>
                 <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Preço Unitário (R$)</label>
                 <input 
                    type="number" 
                    step="0.01"
                    className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white text-lg font-bold focus:border-white focus:outline-none"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                 />
               </div>
               <div>
                 <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Quantidade</label>
                 <div className="flex items-center gap-2">
                   <button onClick={() => setEditQty(String(Math.max(1, parseInt(editQty) - 1)))} className="p-3 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700"><Minus size={16} /></button>
                   <input 
                      type="number" 
                      className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-white text-center font-bold focus:border-white focus:outline-none"
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                   />
                   <button onClick={() => setEditQty(String(parseInt(editQty) + 1))} className="p-3 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700"><Plus size={16} /></button>
                 </div>
               </div>
             </div>

             <div className="flex gap-2 mt-6">
                <button onClick={removeEditItem} className="p-3 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40"><Trash2 size={20} /></button>
                <button onClick={saveEditItem} className="flex-1 bg-white text-black font-bold rounded-lg hover:bg-zinc-200">Salvar Alterações</button>
             </div>
          </div>
        </div>
      )}

      {/* 4. Fiado Config Modal */}
      {showFiadoModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
             <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
               <div>
                 <h3 className="font-bold text-xl text-white flex items-center gap-2">
                    <Calendar size={20} className="text-red-500"/> Configurar Fiado
                 </h3>
                 <p className="text-xs text-zinc-400 mt-1">Cliente: <span className="text-white font-bold">{selectedCustomer?.name}</span></p>
               </div>
               <button onClick={() => setShowFiadoModal(false)}><X size={24} className="text-zinc-500 hover:text-white" /></button>
             </div>

             <div className="mb-4 bg-black/30 p-4 rounded-xl border border-zinc-800">
                <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Quantidade de Parcelas</label>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => handleInstallmentCountChange(installmentCount - 1)}
                     className="p-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700"
                   >
                     <Minus size={20} />
                   </button>
                   <div className="flex-1 text-center bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold text-xl">
                      {installmentCount}
                   </div>
                   <button 
                     onClick={() => handleInstallmentCountChange(installmentCount + 1)}
                     className="p-2 bg-zinc-800 rounded-lg text-white hover:bg-zinc-700"
                   >
                     <Plus size={20} />
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2 max-h-[300px]">
                <h4 className="text-xs font-bold text-zinc-500 uppercase mb-2">Datas de Vencimento</h4>
                {installments.length === 0 && <p className="text-zinc-500 text-xs">Nenhuma parcela gerada.</p>}
                {installments.map((inst, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                     <span className="text-sm font-bold text-zinc-500 w-6">{inst.number}º</span>
                     <div className="flex-1">
                        <input 
                          type="date" 
                          value={inst.dueDate}
                          onChange={(e) => updateInstallmentDate(idx, e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 text-white text-sm font-medium focus:outline-none w-full p-2 rounded"
                        />
                     </div>
                     <div className="text-right w-24">
                        <span className="text-sm font-bold text-white">R$ {inst.value.toFixed(2)}</span>
                     </div>
                  </div>
                ))}
             </div>

             <div className="border-t border-zinc-800 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-zinc-400">Total da Venda</span>
                   <span className="text-2xl font-bold text-white">R$ {total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => finishSale(installments)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Check size={20} /> Confirmar e Finalizar
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 5. Quick Register Modal */}
      {showQuickRegister && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg text-white flex items-center gap-2"><UserPlus size={20} /> Cadastro Rápido</h3>
               <button onClick={() => setShowQuickRegister(false)}><X size={20} className="text-zinc-500 hover:text-white" /></button>
             </div>
             
             <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Nome do Cliente</label>
                  <div className="relative">
                     <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                     <input 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white"
                        placeholder="Ex: João da Silva"
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                     />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Email (Para acesso ao site)</label>
                  <div className="relative">
                     <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                     <input 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white"
                        placeholder="email@cliente.com"
                        value={newClient.email}
                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                     />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">WhatsApp</label>
                  <div className="relative">
                     <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                     <input 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 pl-10 text-white"
                        placeholder="(00) 00000-0000"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                     />
                  </div>
               </div>
               
               <p className="text-[10px] text-zinc-500 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                 ℹ️ O cliente poderá completar o cadastro (senha, endereço) ao acessar o site com este email.
               </p>

               <button 
                 onClick={handleQuickRegister}
                 className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors"
               >
                 Cadastrar e Selecionar
               </button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminPOS;