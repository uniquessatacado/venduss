import React, { useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { BarChart3, TrendingUp, Package, Layers, Tag, Palette, Ruler, Trophy, ArrowRight } from 'lucide-react';

interface RankItem {
  id: string;
  name: string;
  count: number;
  profit: number;
  currentStock: number;
  image?: string;
  colorHex?: string;
}

const AdminAnalytics: React.FC = () => {
  const { orders, products, categories, brands, colors, getTopTrends } = useStore();
  const trends = getTopTrends();

  const analytics = useMemo(() => {
    // Initialize Accumulators
    const catStats: Record<string, RankItem> = {};
    const subStats: Record<string, RankItem> = {};
    const brandStats: Record<string, RankItem> = {};
    const colorStats: Record<string, RankItem> = {};
    const sizeStats: Record<string, RankItem> = {};

    // 1. Calculate Sales & Profit from Completed Orders
    orders.forEach(order => {
        if (order.status !== 'completed') return;

        order.items.forEach(item => {
            const profit = (item.price - (item.itemCost || item.costPrice || 0)) * item.quantity;
            
            // Category
            if (item.categoryId) {
                if (!catStats[item.categoryId]) {
                    const cat = categories.find(c => c.id === item.categoryId);
                    catStats[item.categoryId] = { id: item.categoryId, name: cat?.name || 'Desconhecida', count: 0, profit: 0, currentStock: 0, image: cat?.image };
                }
                catStats[item.categoryId].count += item.quantity;
                catStats[item.categoryId].profit += profit;
            }

            // Subcategory
            if (item.subcategoryId) {
                if (!subStats[item.subcategoryId]) {
                    subStats[item.subcategoryId] = { id: item.subcategoryId, name: item.subcategoryId, count: 0, profit: 0, currentStock: 0 };
                }
                subStats[item.subcategoryId].count += item.quantity;
                subStats[item.subcategoryId].profit += profit;
            }

            // Brand
            if (item.brandId) {
                if (!brandStats[item.brandId]) {
                    const brand = brands.find(b => b.id === item.brandId);
                    brandStats[item.brandId] = { id: item.brandId, name: brand?.name || 'Desconhecida', count: 0, profit: 0, currentStock: 0 };
                }
                brandStats[item.brandId].count += item.quantity;
                brandStats[item.brandId].profit += profit;
            }

            // Color
            if (item.colorId) {
                if (!colorStats[item.colorId]) {
                    const col = colors.find(c => c.id === item.colorId);
                    colorStats[item.colorId] = { id: item.colorId, name: col?.name || 'Desconhecida', count: 0, profit: 0, currentStock: 0, colorHex: col?.hex };
                }
                colorStats[item.colorId].count += item.quantity;
                colorStats[item.colorId].profit += profit;
            }

            // Size (Item specific variant)
            if (item.size) {
                if (!sizeStats[item.size]) {
                    sizeStats[item.size] = { id: item.size, name: item.size, count: 0, profit: 0, currentStock: 0 };
                }
                sizeStats[item.size].count += item.quantity;
                sizeStats[item.size].profit += profit;
            }
        });
    });

    // 2. Calculate Current Stock from Products
    products.forEach(p => {
        const stock = p.variants?.reduce((acc, v) => acc + v.quantity, 0) || 0;

        if (p.categoryId && catStats[p.categoryId]) catStats[p.categoryId].currentStock += stock;
        if (p.subcategoryId && subStats[p.subcategoryId]) subStats[p.subcategoryId].currentStock += stock;
        if (p.brandId && brandStats[p.brandId]) brandStats[p.brandId].currentStock += stock;
        if (p.colorId && colorStats[p.colorId]) colorStats[p.colorId].currentStock += stock;
        
        // Size stock needs to iterate variants
        if (p.variants) {
            p.variants.forEach(v => {
                if (sizeStats[v.size]) sizeStats[v.size].currentStock += v.quantity;
            });
        }
    });

    // 3. Sort and Slice Top 10
    const sorter = (a: RankItem, b: RankItem) => b.count - a.count;

    return {
        categories: Object.values(catStats).sort(sorter).slice(0, 10),
        subcategories: Object.values(subStats).sort(sorter).slice(0, 10),
        brands: Object.values(brandStats).sort(sorter).slice(0, 10),
        colors: Object.values(colorStats).sort(sorter).slice(0, 10),
        sizes: Object.values(sizeStats).sort(sorter).slice(0, 10),
    };
  }, [orders, products, categories, brands, colors]);

  const RankCard = ({ title, icon: Icon, data, colorClass }: any) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col h-full">
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${colorClass}`}>
            <Icon size={20} /> {title}
        </h3>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[350px]">
            {data.length === 0 ? (
                <p className="text-zinc-500 text-sm">Sem dados de vendas.</p>
            ) : (
                data.map((item: RankItem, idx: number) => (
                    <div key={item.id} className="flex items-center gap-3 border-b border-zinc-800 pb-3 last:border-0">
                        <span className="font-mono text-zinc-600 w-4 font-bold">{idx + 1}</span>
                        {item.image && <img src={item.image} className="w-8 h-8 rounded-full object-cover bg-zinc-800" />}
                        {item.colorHex && <div className="w-4 h-4 rounded-full border border-zinc-600" style={{backgroundColor: item.colorHex}}></div>}
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{item.name}</p>
                            <div className="flex justify-between items-center text-xs mt-1">
                                <span className="text-zinc-400">{item.count} vendidos</span>
                                <span className="text-green-500 font-bold">+R$ {item.profit.toFixed(0)}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-zinc-500 uppercase">Estoque</span>
                            <span className="font-bold text-white text-xs">{item.currentStock}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={32} className="text-purple-500" />
            <h2 className="text-3xl font-bold text-white">Rankings de Desempenho</h2>
        </div>

        {/* --- TOP 1 CHAMPIONS SECTION --- */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-black border border-yellow-500/30 rounded-3xl p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 bg-yellow-500/10 blur-[80px] rounded-full"></div>
           
           <h3 className="text-2xl font-black italic tracking-tighter text-yellow-500 mb-6 flex items-center gap-2">
              <Trophy className="fill-yellow-500 text-yellow-600" /> OS CAMPEÕES DE HOJE (TOP 1)
           </h3>

           <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              <div className="bg-black/50 p-4 rounded-xl border border-yellow-500/20">
                 <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2">Categoria #1</p>
                 <p className="text-lg font-bold text-white truncate">{trends.topCategory?.name || '-'}</p>
                 <p className="text-xs text-green-400">{trends.topCategory?.count || 0} vendas</p>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border border-yellow-500/20">
                 <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2">Subcategoria #1</p>
                 <p className="text-lg font-bold text-white truncate">{trends.topSubcategory?.name || '-'}</p>
                 <p className="text-xs text-green-400">{trends.topSubcategory?.count || 0} vendas</p>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border border-yellow-500/20">
                 <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2">Marca #1</p>
                 <p className="text-lg font-bold text-white truncate">{trends.topBrand?.name || '-'}</p>
                 <p className="text-xs text-green-400">{trends.topBrand?.count || 0} vendas</p>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border border-yellow-500/20">
                 <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2">Cor #1</p>
                 <div className="flex items-center justify-center gap-2">
                    {trends.topColor?.hex && <div className="w-4 h-4 rounded-full" style={{backgroundColor: trends.topColor.hex}}></div>}
                    <p className="text-lg font-bold text-white truncate">{trends.topColor?.name || '-'}</p>
                 </div>
                 <p className="text-xs text-green-400">{trends.topColor?.count || 0} vendas</p>
              </div>
              <div className="bg-black/50 p-4 rounded-xl border border-yellow-500/20">
                 <p className="text-[10px] uppercase text-zinc-500 font-bold mb-2">Tamanho #1</p>
                 <p className="text-lg font-bold text-white truncate">{trends.topSize?.name || '-'}</p>
                 <p className="text-xs text-green-400">{trends.topSize?.count || 0} vendas</p>
              </div>
           </div>

           <div className="mt-6 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 flex items-start gap-3">
              <TrendingUp size={20} className="text-yellow-500 shrink-0 mt-1" />
              <div>
                 <h4 className="font-bold text-yellow-500 text-sm">Dica de Ouro para Reposição</h4>
                 <p className="text-zinc-300 text-xs mt-1">
                    Com base nos dados atuais, a combinação mais quente é <strong>{trends.topBrand?.name}</strong> na cor <strong>{trends.topColor?.name}</strong>. 
                    Verifique o estoque de produtos dessa marca no tamanho <strong>{trends.topSize?.name}</strong> para não perder vendas.
                 </p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RankCard title="Top Categorias" icon={Layers} data={analytics.categories} colorClass="text-blue-400" />
            <RankCard title="Top Subcategorias" icon={Layers} data={analytics.subcategories} colorClass="text-indigo-400" />
            <RankCard title="Top Marcas" icon={Tag} data={analytics.brands} colorClass="text-yellow-400" />
            <RankCard title="Top Cores" icon={Palette} data={analytics.colors} colorClass="text-pink-400" />
            <RankCard title="Top Tamanhos" icon={Ruler} data={analytics.sizes} colorClass="text-green-400" />
            
            {/* Quick Summary Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
               <TrendingUp size={48} className="text-green-500 mb-4" />
               <h3 className="text-xl font-bold text-white">Insight Rápido</h3>
               <p className="text-zinc-400 text-sm mt-2">
                  A categoria <strong>{analytics.categories[0]?.name || '--'}</strong> é o carro chefe da loja, representando a maior fatia do lucro.
               </p>
            </div>
        </div>
    </div>
  );
};

export default AdminAnalytics;