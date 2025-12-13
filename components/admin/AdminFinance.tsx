import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer, Installment } from '../../types';
import { Calendar, AlertCircle, CheckCircle, Clock, Search, DollarSign, X } from 'lucide-react';

const AdminFinance: React.FC = () => {
  const { customers, payInstallment, settings } = useStore();
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'week' | 'future'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Payment Modal
  const [selectedPayment, setSelectedPayment] = useState<{customer: Customer, installment: Installment, orderId: string} | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [newDate, setNewDate] = useState('');

  // Helpers
  const getDaysLate = (dueDate: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(dueDate);
    due.setHours(0,0,0,0);
    const diffTime = today.getTime() - due.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateTotalWithFees = (value: number, dueDate: string) => {
    const daysLate = getDaysLate(dueDate);
    if (daysLate <= 0) return value;
    
    const fine = value * (settings.finePercentage / 100);
    const interest = value * ((settings.interestDailyPercentage / 100) * daysLate);
    return value + fine + interest;
  };

  // Flatten installments from all customers
  const allInstallments = customers.flatMap(customer => 
    customer.history
      .filter(order => order.paymentMethod === 'fiado' && order.installments)
      .flatMap(order => order.installments!.map(inst => ({
        ...inst,
        customerName: customer.name,
        customerId: customer.id,
        orderId: order.id
      })))
  ).filter(inst => inst.status !== 'paid');

  // Filter Logic
  const filteredInstallments = allInstallments.filter(inst => {
    const matchesSearch = inst.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(inst.dueDate);
    due.setHours(0,0,0,0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (filter === 'overdue') return diffDays < 0;
    if (filter === 'today') return diffDays === 0;
    if (filter === 'week') return diffDays >= 0 && diffDays <= 7;
    if (filter === 'future') return diffDays > 7;
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const openPaymentModal = (inst: any) => {
    const fullCustomer = customers.find(c => c.id === inst.customerId);
    if (!fullCustomer) return;
    
    const totalDue = calculateTotalWithFees(inst.value, inst.dueDate);
    setSelectedPayment({ customer: fullCustomer, installment: inst, orderId: inst.orderId });
    setPaymentAmount(totalDue.toFixed(2));
    
    // Suggest next month for partial
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setNewDate(nextMonth.toISOString().split('T')[0]);
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
        alert("Valor inválido");
        return;
    }

    payInstallment(
        selectedPayment.customer.id, 
        selectedPayment.orderId, 
        selectedPayment.installment.id, 
        amount, 
        newDate
    );

    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><DollarSign size={24} className="text-green-500" /> Contas a Receber</h2>
        
        <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {(['all', 'overdue', 'today', 'week', 'future'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${filter === f ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {f === 'all' ? 'Todas' : f === 'overdue' ? 'Atrasadas' : f === 'today' ? 'Hoje' : f === 'week' ? 'Esta Semana' : 'Futuras'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
        <input 
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-zinc-600"
          placeholder="Buscar por nome do cliente..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredInstallments.length === 0 ? (
           <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800 border-dashed text-zinc-500">
              <CheckCircle size={48} className="mx-auto mb-2 opacity-20" />
              <p>Nenhuma parcela encontrada para este filtro.</p>
           </div>
        ) : (
          filteredInstallments.map((inst, idx) => {
            const daysLate = getDaysLate(inst.dueDate);
            const totalDue = calculateTotalWithFees(inst.value, inst.dueDate);
            const isLate = daysLate > 0;

            return (
              <div key={idx} className={`bg-zinc-900 border p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 group ${isLate ? 'border-red-900/50 bg-red-900/5' : 'border-zinc-800'}`}>
                 <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                       <div>
                          <h4 className="font-bold text-white text-lg">{inst.customerName}</h4>
                          <p className="text-xs text-zinc-500">Parcela {inst.number}/{inst.totalInstallments}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xs text-zinc-400 mb-1">Vencimento</p>
                          <p className={`font-bold ${isLate ? 'text-red-500' : 'text-white'}`}>
                            {new Date(inst.dueDate).toLocaleDateString('pt-BR')}
                          </p>
                       </div>
                    </div>
                    
                    {isLate && (
                       <div className="mt-2 text-xs flex gap-3 text-red-400 bg-red-900/20 p-2 rounded-lg inline-flex">
                          <span className="flex items-center gap-1"><AlertCircle size={12}/> {daysLate} dias atraso</span>
                          <span>+ R$ {(totalDue - inst.value).toFixed(2)} juros/multa</span>
                       </div>
                    )}
                 </div>

                 <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
                    <div className="text-right">
                       <p className="text-xs text-zinc-500">Valor Original</p>
                       <p className="text-xl font-bold text-zinc-300">R$ {inst.value.toFixed(2)}</p>
                       {isLate && <p className="text-xs text-red-400 font-bold">Total: R$ {totalDue.toFixed(2)}</p>}
                    </div>
                    <button 
                      onClick={() => openPaymentModal(inst)}
                      className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg whitespace-nowrap flex-1 md:flex-none"
                    >
                      Receber
                    </button>
                 </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {selectedPayment && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
               <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                  <h3 className="font-bold text-xl text-white">Receber Pagamento</h3>
                  <button onClick={() => setSelectedPayment(null)}><X size={24} className="text-zinc-500" /></button>
               </div>

               <div className="mb-6">
                  <p className="text-zinc-400 text-sm">Cliente: <span className="text-white font-bold">{selectedPayment.customer.name}</span></p>
                  <p className="text-zinc-400 text-sm">Parcela: <span className="text-white">{selectedPayment.installment.number}/{selectedPayment.installment.totalInstallments}</span></p>
                  <p className="text-zinc-400 text-sm">Vencimento: <span className="text-white">{new Date(selectedPayment.installment.dueDate).toLocaleDateString('pt-BR')}</span></p>
               </div>

               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Valor a Receber (R$)</label>
                     <input 
                        type="number" 
                        step="0.01"
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white text-2xl font-bold focus:border-green-500 outline-none"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                     />
                     <p className="text-xs text-zinc-500 mt-1">
                        Original: R$ {selectedPayment.installment.value.toFixed(2)} 
                        {parseFloat(paymentAmount) > selectedPayment.installment.value && <span className="text-green-500 ml-2">(Com Juros/Multa)</span>}
                     </p>
                  </div>

                  {parseFloat(paymentAmount) < calculateTotalWithFees(selectedPayment.installment.value, selectedPayment.installment.dueDate) && (
                     <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg animate-fade-in">
                        <p className="text-yellow-500 text-xs font-bold mb-2 flex items-center gap-1"><Clock size={12}/> Pagamento Parcial Detectado</p>
                        <label className="text-xs font-bold text-zinc-400 uppercase mb-1 block">Data para o Restante</label>
                        <input 
                           type="date"
                           className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white"
                           value={newDate}
                           onChange={(e) => setNewDate(e.target.value)}
                        />
                     </div>
                  )}

                  <button 
                     onClick={handleConfirmPayment}
                     className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 mt-4"
                  >
                     <CheckCircle size={20} /> Confirmar Recebimento
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminFinance;