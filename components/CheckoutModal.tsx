
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ArrowRight, Truck, Store, Bike, MapPin, CreditCard, Sparkles, Wallet } from 'lucide-react';
import UpsellModal from './UpsellModal';
import RouletteModal from './RouletteModal';
import { Prize, Address, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = 'upsell' | 'shipping' | 'details' | 'payment' | 'roulette';
type ShippingMethod = 'pickup' | 'motoboy' | 'carrier';
type PaymentMethod = 'pix' | 'credit' | 'on_pickup';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { clientCart, settings, addOrder, clearClientCart, currentUser, addToClientCart, underwearSize } = useStore();
  
  const [step, setStep] = useState<CheckoutStep>('upsell');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState('');
  const [useBalance, setUseBalance] = useState(true); // Default to using balance if available
  
  const [customerDetails, setCustomerDetails] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    cpf: currentUser?.cpf || '',
  });

  const [address, setAddress] = useState<Address>(currentUser?.address || {
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: ''
  });

  useEffect(() => {
    // Reset on open
    if (isOpen) {
      setStep('upsell');
      setShippingMethod(null);
      setPaymentMethod(null);
      setNotes('');
      // Pre-fill user data if they are logged in
      setCustomerDetails({ name: currentUser?.name || '', phone: currentUser?.phone || '', cpf: currentUser?.cpf || '' });
      setAddress(currentUser?.address || { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' });
    }
  }, [isOpen, currentUser]);

  const handleUpsellAccept = () => {
    addToClientCart({
      id: 'kit-upsell', name: `Kit 3 Cuecas ${underwearSize} (Oferta)`,
      price: 49.90, category: 'Accessories', image: 'https://picsum.photos/300/200?random=underwear',
      costPrice: 20.00,
      categoryId: 'upsell',
      galleryImages: [],
      variants: []
    });
    setStep('shipping');
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
      total: finalTotal, // Store the amount the customer actually pays
      discountUsed: balanceUsed, // Track used balance
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
            <UpsellModal isOpen={true} onAccept={handleUpsellAccept} onClose={() => setStep('shipping')} />
          </div>
        );
      case 'shipping':
        return (
          <>
            <h3 className="text-xl font-bold text-center mb-6">Como deseja receber seu pedido?</h3>
            <div className="space-y-3">
              <button onClick={() => { setShippingMethod('carrier'); setStep('details'); }} className="w-full flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-white">
                <Truck size={24} /> <div><div className="font-bold text-left">Correios / Transportadora</div><div className="text-xs text-zinc-400 text-left">Receba em todo o Brasil</div></div>
              </button>
              <button onClick={() => { setShippingMethod('motoboy'); setStep('details'); }} className="w-full flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-white">
                <Bike size={24} /> <div><div className="font-bold text-left">Motoboy</div><div className="text-xs text-zinc-400 text-left">Apenas para Indaiatuba-SP</div></div>
              </button>
              <button onClick={() => { setShippingMethod('pickup'); setStep('details'); }} className="w-full flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-white">
                <Store size={24} /> <div><div className="font-bold text-left">Retirar na Loja</div><div className="text-xs text-zinc-400 text-left">Sem custo de frete</div></div>
              </button>
            </div>
          </>
        );
      case 'details':
        return (
          <>
            <h3 className="text-xl font-bold text-center mb-6">Seus Dados</h3>
            <div className="space-y-3 text-left">
              {!currentUser && <p className="text-xs text-center text-yellow-400 bg-yellow-400/10 p-2 rounded-lg border border-yellow-400/20 mb-4">Você não está logado. Crie uma senha no final para salvar seus dados!</p>}
              <input value={customerDetails.name} onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})} placeholder="Nome Completo" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
              <input value={customerDetails.phone} onChange={e => setCustomerDetails({...customerDetails, phone: e.target.value})} placeholder="WhatsApp" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
              {(shippingMethod === 'carrier') && <input value={customerDetails.cpf} onChange={e => setCustomerDetails({...customerDetails, cpf: e.target.value})} placeholder="CPF" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>}
              
              {shippingMethod !== 'pickup' && <div className="pt-4 border-t border-zinc-800 mt-4"><h4 className="font-bold mb-2">Endereço de Entrega</h4></div>}
              {shippingMethod !== 'pickup' && <>
                <div className="grid grid-cols-3 gap-3">
                  <input value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="Rua" className="col-span-2 w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                  <input value={address.number} onChange={e => setAddress({...address, number: e.target.value})} placeholder="Nº" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                </div>
                <input value={address.complement} onChange={e => setAddress({...address, complement: e.target.value})} placeholder="Complemento (Opcional)" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                <input value={address.neighborhood} onChange={e => setAddress({...address, neighborhood: e.target.value})} placeholder="Bairro" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                <div className="grid grid-cols-3 gap-3">
                  <input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="Cidade" className="col-span-2 w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                  <input value={address.state} onChange={e => setAddress({...address, state: e.target.value})} placeholder="UF" className="w-full bg-black border border-zinc-700 rounded-lg p-3"/>
                </div>
              </>}
              <button onClick={() => setStep('payment')} className="w-full bg-white text-black py-3 mt-4 rounded-lg font-bold">Continuar</button>
            </div>
          </>
        );
       case 'payment':
        return (
            <>
            <h3 className="text-xl font-bold text-center mb-6">Pagamento</h3>
            
            {/* Wallet Usage */}
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
             <button onClick={() => setStep('roulette')} disabled={!paymentMethod} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold mt-6 disabled:opacity-50">
                <Sparkles size={20} className="inline-block mr-2" />
                Finalizar e Tentar a Sorte
            </button>
            </>
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
        {step !== 'roulette' && step !== 'upsell' && <button onClick={onClose} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"><X size={20} /></button>}
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutModal;
