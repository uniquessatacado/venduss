import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { TrendingUp, Users, AlertCircle, DollarSign, Package, Calendar, Award } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { getFinancialStats, getCustomerRanking, orders } = useStore();
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'week' | 'month' | 'all'>('today');

  // Determine dates based on selection
  let startDate = new Date();
  let endDate = new Date();

  if (dateRange === 'today') {
      startDate.setHours(0,0,0,0); // Início de hoje
      // endDate é agora
  } else if (dateRange === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1);
      startDate.setHours(0,0,0,0);
      
      endDate = new Date();
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(23,59,59,999); // Final de ontem
  } else if (dateRange === 'week') {
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0,0,0,0);
  } else if (dateRange === 'month') {
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0,0,0,0);
  } else if (dateRange === 'all') {
      startDate = new Date(0); // Desde o início
  }

  const financial = getFinancialStats(startDate, endDate);
  const customerRanking = getCustomerRanking().slice(0, 5); // Top 5

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl font-bold">Visão Financeira</h2>
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 overflow-x-auto max-w-full">
             {(['today', 'yesterday', 'week', 'month', 'all'] as const).map(r => (
                 <button 
                   key={r}
                   onClick={() => setDateRange(r)}
                   className={`px-4 py-2 rounded-md text-xs font-bold uppercase whitespace-nowrap transition-colors ${dateRange === r ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                 >
                    {r === 'today' ? 'Hoje' : 
                     r === 'yesterday' ? 'Ontem' : 
                     r === 'week' ? '7 Dias' : 
                     r === 'month' ? '30 Dias' : 'Geral'}
                 </button>
             ))}
          </div>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-500"><DollarSign size={24} /></div>
              <span className="text-xs text-zinc-500 uppercase font-bold">Faturamento (Vendas)</span>
           </div>
           <p className="text-3xl font-bold text-white">R$ {financial.revenue.toFixed(2)}</p>
           <p className="text-xs text-zinc-500 mt-2">{financial.orderCount} pedidos pagos</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-red-500/20 text-red-500"><AlertCircle size={24} /></div>
              <span className="text-xs text-zinc-500 uppercase font-bold">Custo das Mercadorias</span>
           </div>
           <p className="text-3xl font-bold text-white">R$ {financial.cost.toFixed(2)}</p>
           <p className="text-xs text-zinc-500 mt-2">Custo base dos produtos vendidos</p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl border border-green-500/30 relative overflow-hidden group">
           <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
           <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-green-500 text-black"><TrendingUp size={24} /></div>
                    <span className="text-xs text-green-400 uppercase font-bold">Lucro Líquido</span>
                </div>
                <p className="text-4xl font-black text-white">R$ {financial.profit.toFixed(2)}</p>
                <p className="text-xs text-green-400 mt-2 font-bold">Margem: {financial.revenue > 0 ? ((financial.profit / financial.revenue) * 100).toFixed(1) : 0}%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Customers */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Award className="text-yellow-400"/> Clientes Mais Lucrativos (Geral)</h3>
            <div className="space-y-4">
               {customerRanking.map((rank, i) => (
                   <div key={rank.customer.id} className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                         <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-white'}`}>{i + 1}</span>
                         <div>
                            <p className="font-bold text-sm">{rank.customer.name}</p>
                            <p className="text-xs text-zinc-500">{rank.customer.history.filter(o => o.status === 'completed').length} compras</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-green-400">+ R$ {rank.totalProfit.toFixed(2)}</p>
                         <p className="text-[10px] text-zinc-500 uppercase">Lucro Gerado</p>
                      </div>
                   </div>
               ))}
               {customerRanking.length === 0 && <p className="text-zinc-500 text-sm text-center py-4">Nenhum dado financeiro disponível.</p>}
            </div>
         </div>

         {/* Sales Log (Simplified) */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Package className="text-purple-400"/> Últimas Vendas Pagas</h3>
             <div className="space-y-3">
                 {orders.filter(o => o.status === 'completed').slice(0, 5).map(order => (
                     <div key={order.id} className="flex justify-between items-center bg-black p-3 rounded-lg">
                        <div>
                           <p className="font-bold text-sm text-white">Pedido #{order.id.slice(-4)}</p>
                           <p className="text-xs text-zinc-500">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-white">R$ {order.total.toFixed(2)}</p>
                           <p className="text-[10px] text-zinc-500">Lucro: <span className="text-green-500">R$ {(order.total - (order.totalCost || 0)).toFixed(2)}</span></p>
                        </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;