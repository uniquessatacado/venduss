
import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
// Note: We need to assume components are now in src/components for this to work
// If the user hasn't moved them, this will fail. But the user asked for structure fix.
import AdminLayout from '../components/admin/AdminLayout';
import PublicStore from '../components/PublicStore';

// --- SAAS PAGES ---
import SaasLogin from '../components/saas/LoginPage';
import SaasRegister from '../components/saas/RegisterPage';
import SuperAdminDashboard from '../components/saas/SuperAdminDashboard';

// --- ROUTER LOGIC ---
const MainRouter: React.FC = () => {
    const { setCurrentTenant, user, saasLogout } = useStore();
    const [view, setView] = useState<'store' | 'saas'>('saas');
    
    // Roteamento Interno para SaaS (Login vs Registro)
    // Usar estado em vez de URL garante estabilidade em ambientes de preview
    const [saasRoute, setSaasRoute] = useState<'login' | 'register'>('login');
    
    // Estado do Modo Admin (Quando visualizando uma loja específica)
    const [isAdminMode, setIsAdminMode] = useState(false);
    
    // Estado do Super Admin (Dashboard vs Loja)
    const [superAdminView, setSuperAdminView] = useState<'dashboard' | 'store'>('dashboard');

    useEffect(() => {
        // Verifica parâmetros de URL apenas para seleção de loja (tenant)
        const params = new URLSearchParams(window.location.search);
        const storeSlug = params.get('store'); // ?store=slug

        if (storeSlug) {
            setCurrentTenant(storeSlug);
            setView('store');
        } else {
            setView('saas');
        }
    }, []);

    // --- Navegação SaaS (Domínio Raiz) ---
    if (view === 'saas') {
        // Rotas Autenticadas
        if (user) {
            if (user.role === 'SUPER_ADMIN') {
                if (superAdminView === 'dashboard') {
                    return <SuperAdminDashboard 
                        onEnterMyStore={() => {
                            setCurrentTenant('uss'); // Força contexto para loja USS
                            setSuperAdminView('store');
                        }} 
                        onSelectTenant={() => setSuperAdminView('store')}
                    />;
                }
                // Super Admin em Modo Loja - Reusa AdminLayout com saída customizada
                return <AdminLayout onExit={() => setSuperAdminView('dashboard')} />;
            }
            if (user.role === 'TENANT_ADMIN') {
                // Se for Admin da Loja, mostra o painel da loja dele imediatamente
                return <AdminLayout onExit={saasLogout} />;
            }
        }

        // Rotas Públicas SaaS (Login / Registro) com navegação via estado
        if (saasRoute === 'register') {
            return <SaasRegister onLoginClick={() => setSaasRoute('login')} />;
        }
        
        return <SaasLogin onRegisterClick={() => setSaasRoute('register')} />;
    }

    // --- Visualização da Loja (Para clientes finais via URL ?store=xyz) ---
    if (isAdminMode) {
        return <AdminLayout onExit={() => setIsAdminMode(false)} />;
    }

    return <PublicStore onAdminEnter={() => setIsAdminMode(true)} />;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainRouter />
    </StoreProvider>
  );
};

export default App;
