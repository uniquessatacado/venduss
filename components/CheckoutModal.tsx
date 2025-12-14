
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Truck, Store, Bike, MapPin, CreditCard, Sparkles, Wallet, ArrowLeft, Mail, Loader, CheckCircle } from 'lucide-react';
import UpsellModal from './UpsellModal';
import RouletteModal from './RouletteModal';
import { Prize, Address, Order, UpsellOffer } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'upsell' | 'shipping' | 'identification' | 'address_selection' | 'details' | 'payment' | 'roulette';
type ShippingMethod = 'pickup' | 'motoboy' | 'carrier';
type PaymentMethod = 'pix' | 'credit' | 'on_pickup';

// --- MASK HELPERS ---
const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
};

const formatCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const formatCEP = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{5})(\d{1,3})/, '$1-$2').slice(0, 9);
};

const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf === '' || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { clientCart, settings, addOrder, clearClientCart, currentUser, addToClientCart, underwearSize, loginByEmail, upsellOffers } = useStore();
  
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState('');
  const [useBalance, setUseBalance] = useState(true);
  const [checkoutUpsell, setCheckoutUpsell] = useState<UpsellOffer | null>(null);
  
  // Identification State
  const [emailInput, setEmailInput] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Address Fetching State
  const [loadingCep, setLoadingCep] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    cpf: '',
  });

  const [address, setAddress] = useState<Address>({
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: ''
  });

  // Effect to sync current user data when logged in (or identified)
  useEffect(() => {
      if (currentUser) {
          setCustomerDetails({
              name: currentUser.name,
              phone: currentUser.phone,
              cpf: currentUser.cpf || '',
          });
          if (currentUser.address && currentUser.address.zip) {
              setAddress(currentUser.address);
          }
      }
  }, [currentUser]);

  useEffect(() => {
    // Reset on open
    if (isOpen) {
      setShippingMethod(null);
      setPaymentMethod(null);
      setNotes('');
      setEmailInput('');
      
      // Determine if there is a relevant upsell offer
      // We look for any active offer that matches categories/subcategories in the cart
      const foundOffer = upsellOffers.find(o => 
          o.active && 
          clientCart.some(item => 
              (o.triggerCategoryIds?.includes(item.categoryId)) || 
              (o.triggerSubcategories?.includes(item.subcategoryId || ''))
          )
      );

      if (foundOffer) {
          setCheckoutUpsell(foundOffer);
          setStep('upsell');
      } else {
          setCheckoutUpsell(null);
          setStep('shipping');
      }
    }
  }, [isOpen]);

  const handleUpsellAccept = () => {
    if (checkoutUpsell) {
        // Simple accept logic: add a generic item representing the offer
        // Ideally this would add specific products, but for now we add the offer item
        addToClientCart({
            id: `upsell-${checkoutUpsell.id}`,
            name: `${checkoutUpsell.title} (Oferta)`,
            price: checkoutUpsell.promoPrice,
            category: 'Oferta',
            image: checkoutUpsell.bannerImage,
            costPrice: 0,
            categoryId: 'upsell',
            galleryImages: [],
            variants: []
        });
    }
    setStep('shipping');
  };

  const handleBack = () => {
      if (step === 'details') {
          if (currentUser) return setStep('address_selection'); // Or shipping depending on flow
          return setStep('identification');
      }
      if (step === 'payment') return setStep('details');
      if (step === 'identification') return setStep('shipping');
      if (step === 'address_selection') return setStep('shipping'); // Or back to ID?
      if (step === 'shipping') onClose();
  };

  // --- SMART FLOW LOGIC ---

  const handleShippingSelect = (method: ShippingMethod) => {
      setShippingMethod(method);
      
      // If user is already logged in
      if (currentUser) {
          // If shipping is pickup, skip address
          if (method === 'pickup') {
              setStep('payment');
          } else {
              // If user has address, go to selection, else to details
              if (currentUser.address && currentUser.address.zip) {
                  setStep('address_selection');
              } else {
                  setStep('details');
              }
          }
      } else {
          // Not logged in -> Identify first
          setStep('identification');
      }
  };

  const handleIdentification = async () => {
      if (!emailInput.includes('@')) return alert("Digite um e-mail válido");
      
      setLoadingEmail(true);
      // Simulate network delay for "recognition" feel
      setTimeout(() => {
          const loggedIn = loginByEmail(emailInput);
          setLoadingEmail(false);
          
          if (loggedIn) {
              // User found and logged in automatically!
              // Decide where to go next based on shipping method
              if (shippingMethod === 'pickup') {
                  setStep('payment');
              } else {
                  // Wait for state update to reflect currentUser address
                  // We'll optimistically assume if they are found, they might have address
                  // But safely, let's check the fresh user object from context next render or just go to selection
                  // Since `loginByEmail` updates context, useEffect above will populate `address` state
                  // We can transition to address_selection
                  setStep('address_selection');
              }
          } else {
              // User not found, go to registration (details)
              // Pre-fill email in logic would be handled by storeRegister later
              setStep('details');
          }
      }, 800);
  };

  const handleFetchCep = async () => {
      const cleanCep = address.zip.replace(/\D/g, '');
      if (cleanCep.length !== 8) return;

      setLoadingCep(true);
      try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();
          
          if (!data.erro) {
              setAddress(prev => ({
                  ...prev,
                  street: data.logradouro,
                  neighborhood: data.bairro,
                  city: data.localidade,
                  state: data.uf
              }));
              // Auto focus number field
              setTimeout(() => numberInputRef.current?.focus(), 100);
          } else {
              alert("CEP não encontrado.");
          }
      } catch (error) {
          alert("Erro ao buscar CEP.");
      } finally {
          setLoadingCep(false);
      }
  };

  const handleDetailsSubmit = () => {
      if (!customerDetails.name || !customerDetails.phone) return alert("Preencha nome e telefone.");
      if (shippingMethod !== 'pickup') {
          if (!address.zip || !address.number) return alert("Preencha o endereço completo.");
      }
      
      // Basic CPF Check
      if (customerDetails.cpf && !validateCPF(customerDetails.cpf)) {
          return alert("CPF Inválido.");
      }

      setStep('payment');
  };

  // Calculations
  const cartTotal = clientCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const userBalance = currentUser?.balance || 0;
  const balanceUsed = (useBalance && userBalance > 0) ? Math.min(userBalance, cartTotal) : 0;
  const finalTotal = Math.max(0, cartTotal - balanceUsed);

  const handleFinalizeOrder = (prize: Prize) => {
    const prizeText = prize.categoryMatch ? `🏆 Ganhou Brinde: ${prize.emoji} ${prize.label}` : 'Não ganhou brinde.';
    
    const orderData = {
      customerId: currentUser?.id,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerAddress: shippingMethod !== 'pickup' ? address : undefined,
      items: [...clientCart],
      total: finalTotal,
      discountUsed: balanceUsed,
      shipping: { method: shippingMethod!, cost: 0 },
      paymentMethod: (paymentMethod === 'on_pickup' ? 'on_pickup' : 'whatsapp') as Order['paymentMethod'],
      notes,
      wonPrize: prizeText,
      underwearSize: underwearSize || 'N/A',
      origin: 'online' as const,
    };
    
    addOrder(orderData);

    const storeName = settings.storeName || 'Loja';
    const itemsList = clientCart.map(i => `• ${i.quantity}x ${i.name} ${i.size ? `(${i.size})` : ''} - R$ ${i.price.toFixed(2)}`).join('\n');
    
    let message = `*NOVO PEDIDO ${storeName.toUpperCase()}* 🛍️\n---------------------------\n${itemsList}\n---------------------------\n`;
    if (balanceUsed > 0) {
        message += `Subtotal: R$ ${cartTotal.toFixed(2)}\n`;
        message += `Saldo Utilizado: - R$ ${balanceUsed.toFixed(2)}\n`;
    }
    message += `*TOTAL A PAGAR: R$ ${finalTotal.toFixed(2)}*\n\n*Cliente:* ${customerDetails.name}\n*Telefone:* ${customerDetails.phone}\n\n*Entrega:* ${
      shippingMethod === 'pickup' ? 'Retirar na Loja' : 
      shippingMethod === 'motoboy' ? `Motoboy para ${address.street}, ${address.number}` : 
      `Correios para ${address.street}, ${address.number}`
    }\n\n*Pagamento:* ${
      paymentMethod === 'pix' ? 'PIX' : 
      paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Pagar na Retirada'
    }\n\n*Observações:* ${notes || 'Nenhuma'}\n\n🎰 *Roleta:* ${prizeText}`;

    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    clearClientCart();
    onClose();
  };

  const renderStep = () => {
    switch(step) {
      case 'upsell':
        return (
          <div className="bg-zinc-950">
            <UpsellModal 
              isOpen={true} 
              offer={checkoutUpsell} 
              onAccept={handleUpsellAccept} 
              onClose={() => setStep('shipping')} 
            />
          </div>
        );
      case 'shipping':
        return (
          <>
            <h3 className="text-xl font-bold text-center mb-6">Como deseja receber?</h3>
            <div className="space-y-3">
              <button onClick={() => handleShippingSelect('carrier')} className="w-full flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-white transition-colors">
                <Truck size={24} /> <div><div className="font-bold text-left">Correios / Transportadora</div><div className="text-xs text-zinc-400 text-left">Receba em todo o Brasil</div></div>
              </button>
              <button onClick={() => handleShippingSelect('motoboy')} className="w-full flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-white transition-colors">
                <Bike size={24} /> <div><div className="font-bold text-left">Motoboy</div><div className="text-xs text-zinc-400 text-left">Entrega Rápida Local</div></div>
              </button>
              <button onClick={() => handleShippingSelect('pickup')} className="w-full flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-white transition-colors">
                <Store size={24} /> <div><div className="font-bold text-left">Retirar na Loja</div><div className="text-xs text-zinc-400 text-left">Sem custo de frete</div></div>
              </button>
            </div>
          </>
        );
      case 'identification':
          return (
            <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-center mb-2">Identificação</h3>
                <p className="text-sm text-zinc-400 text-center mb-6">Digite seu e-mail para continuarmos.</p>
                
                <div className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input 
                            type="email" 
                            className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 text-white outline-none focus:border-green-500"
                            placeholder="seu@email.com"
                            value={emailInput}
                            onChange={e => setEmailInput(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button 
                        onClick={handleIdentification}
                        disabled={loadingEmail}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                        {loadingEmail ? <Loader className="animate-spin" size={20}/> : 'Continuar'}
                    </button>
                </div>
            </div>
          );
      case 'address_selection':
          return (
              <div className="animate-fade-in">
                  <h3 className="text-xl font-bold text-center mb-6">Endereço de Entrega</h3>
                  
                  {currentUser?.address?.street ? (
                      <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 mb-4 text-left">
                          <div className="flex items-center gap-2 text-green-400 mb-2 font-bold text-sm uppercase">
                              <MapPin size={16} /> Endereço Salvo
                          </div>
                          <p className="text-white font-medium">{currentUser.address.street}, {currentUser.address.number}</p>
                          <p className="text-zinc-400 text-sm">{currentUser.address.neighborhood} - {currentUser.address.city}/{currentUser.address.state}</p>
                          <p className="text-zinc-500 text-xs mt-1">CEP: {currentUser.address.zip}</p>
                      </div>
                  ) : (
                      <p className="text-zinc-500 text-center mb-4">Nenhum endereço salvo encontrado.</p>
                  )}

                  <div className="space-y-3">
                      {currentUser?.address?.street && (
                          <button onClick={() => setStep('payment')} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors">
                              <CheckCircle size={20} /> Usar este Endereço
                          </button>
                      )}
                      <button onClick={() => setStep('details')} className="w-full bg-zinc-800 text-white font-bold py-3 rounded-xl border border-zinc-700 hover:bg-zinc-700 transition-colors">
                          Cadastrar Novo Endereço
                      </button>
                  </div>
              </div>
          );
      case 'details':
        return (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-center mb-6">Seus Dados</h3>
            <div className="space-y-3 text-left">
              
              <div className="space-y-3">
                  <input value={customerDetails.name} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} placeholder="Nome Completo" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                  <input value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: formatPhone(e.target.value)})} placeholder="WhatsApp (99) 99999-9999" maxLength={15} className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                  <input value={customerDetails.cpf} onChange={e => setCustomerDetails({...customerDetails, cpf: formatCPF(e.target.value)})} placeholder="CPF (000.000.000-00)" maxLength={14} className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
              </div>
              
              {shippingMethod !== 'pickup' && (
                  <div className="pt-4 border-t border-zinc-800 mt-4 animate-slide-up">
                    <h4 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase text-zinc-400"><MapPin size={16}/> Endereço de Entrega</h4>
                    
                    {/* CEP FIRST */}
                    <div className="relative mb-3">
                        <input 
                            value={address.zip} 
                            onChange={e => setAddress({...address, zip: formatCEP(e.target.value)})} 
                            onBlur={handleFetchCep}
                            placeholder="CEP (00000-000)" 
                            maxLength={9}
                            className="w-full bg-black border border-zinc-700 rounded-lg p-3 pr-10 focus:border-green-500 transition-colors"
                        />
                        {loadingCep && <div className="absolute right-3 top-1/2 -translate-y-1/2"><Loader size={16} className="animate-spin text-green-500"/></div>}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <input value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="Rua (Preenchido auto)" className="col-span-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300" readOnly tabIndex={-1} />
                      <input 
                        ref={numberInputRef}
                        value={address.number} 
                        onChange={e => setAddress({...address, number: e.target.value})} 
                        placeholder="Nº" 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:border-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input value={address.neighborhood} onChange={e => setAddress({...address, neighborhood: e.target.value})} placeholder="Bairro" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300" readOnly tabIndex={-1} />
                        <input value={address.complement} onChange={e => setAddress({...address, complement: e.target.value})} placeholder="Comp. (Op)" className="w-full bg-black border border-zinc-700 rounded-lg p-3" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="Cidade" className="col-span-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300" readOnly tabIndex={-1} />
                      <input value={address.state} onChange={e => setAddress({...address, state: e.target.value})} placeholder="UF" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-zinc-300" readOnly tabIndex={-1} />
                    </div>
                  </div>
              )}

              <button onClick={handleDetailsSubmit} className="w-full bg-white text-black py-3 mt-6 rounded-lg font-bold hover:bg-zinc-200 transition-colors">
                  Ir para Pagamento
              </button>
            </div>
          </div>
        );
       case 'payment':
        return (
            <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-center mb-6">Pagamento</h3>
            
            {userBalance > 0 && (
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-green-400 flex items-center gap-2"><Wallet size={16}/> Saldo Disponível</p>
                        <p className="text-xs text-zinc-400">Você tem R$ {userBalance.toFixed(2)}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={useBalance} onChange={e => setUseBalance(e.target.checked)} className="w-5 h-5 accent-green-500" />
                        <span className="text-sm font-bold">Usar</span>
                    </label>
                </div>
            )}

            <div className="bg-zinc-950 p-4 rounded-lg mb-6 border border-zinc-800">
                <div className="flex justify-between mb-2 text-zinc-400">
                    <span>Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                </div>
                {balanceUsed > 0 && (
                    <div className="flex justify-between mb-2 text-green-400">
                        <span>Desconto (Saldo)</span>
                        <span>- R$ {balanceUsed.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between border-t border-zinc-800 pt-2 text-white font-bold text-lg">
                    <span>Total a Pagar</span>
                    <span>R$ {finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <div className="space-y-3">
                {(shippingMethod === 'carrier' || shippingMethod === 'motoboy') && <>
                    <button onClick={() => setPaymentMethod('pix')} className={`w-full text-left p-4 rounded-lg border ${paymentMethod === 'pix' ? 'bg-white text-black border-white' : 'bg-zinc-800 border-zinc-700'}`}>PIX</button>
                    <button onClick={() => setPaymentMethod('credit')} className={`w-full text-left p-4 rounded-lg border ${paymentMethod === 'credit' ? 'bg-white text-black border-white' : 'bg-zinc-800 border-zinc-700'}`}>Cartão de Crédito</button>
                </>}
                 {shippingMethod === 'pickup' && <>
                    <button onClick={() => setPaymentMethod('pix')} className={`w-full text-left p-4 rounded-lg border ${paymentMethod === 'pix' ? 'bg-white text-black border-white' : 'bg-zinc-800 border-zinc-700'}`}>PIX</button>
                    <button onClick={() => setPaymentMethod('credit')} className={`w-full text-left p-4 rounded-lg border ${paymentMethod === 'credit' ? 'bg-white text-black border-white' : 'bg-zinc-800 border-zinc-700'}`}>Cartão de Crédito</button>
                    <button onClick={() => setPaymentMethod('on_pickup')} className={`w-full text-left p-4 rounded-lg border ${paymentMethod === 'on_pickup' ? 'bg-white text-black border-white' : 'bg-zinc-800 border-zinc-700'}`}>Pagar na Retirada</button>
                </>}
                 <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Observações do pedido (opcional)..." className="w-full bg-black border border-zinc-700 rounded-lg p-3 mt-4 min-h-[80px]" />
            </div>
             <button onClick={() => setStep('roulette')} disabled={!paymentMethod} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold mt-6 disabled:opacity-50 transition-transform active:scale-95">
                <Sparkles size={20} className="inline-block mr-2" />
                Finalizar e Tentar a Sorte
            </button>
            </div>
        );
      case 'roulette':
          return <RouletteModal isOpen={true} onClose={() => {}} onSpinEnd={handleFinalizeOrder} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-slide-up shadow-2xl text-center max-h-[90vh] overflow-y-auto">
        
        {step !== 'roulette' && step !== 'upsell' && (
            <>
                <button onClick={handleBack} className="absolute top-4 left-4 p-2 text-zinc-500 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </>
        )}

        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutModal;
