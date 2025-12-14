
import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import AdminLayout from './components/admin/AdminLayout';
import PublicStore from './components/PublicStore';

// --- SAAS PAGES ---
import SaasLogin from './components/saas/LoginPage';
import SaasRegister from './components/saas/RegisterPage';
import SuperAdminDashboard from './components/saas/SuperAdminDashboard';

// --- ROUTER LOGIC ---
const MainRouter: React.FC = () => {
    const { setCurrentTenant, user, saasLogout } = useStore();
    const [view, setView] = useState<'store' | 'saas'>('store'); // PADRÃO ALTERADO PARA 'store'
    
    // Roteamento Interno para SaaS (Login vs Registro)
    const [saasRoute, setSaasRoute] = useState<'login' | 'register'>('login');
    
    // Estado do Modo Admin (Quando visualizando uma loja específica)
    const [isAdminMode, setIsAdminMode] = useState(false);
    
    // Estado do Super Admin (Dashboard vs Loja)
    const [superAdminView, setSuperAdminView] = useState<'dashboard' | 'store'>('dashboard');

    useEffect(() => {
        // Verifica parâmetros de URL
        const params = new URLSearchParams(window.location.search);
        const storeSlug = params.get('store'); // ?store=slug
        const mode = params.get('mode'); // ?mode=admin

        if (storeSlug) {
            setCurrentTenant(storeSlug);
            setView('store');
        } else if (mode === 'admin') {
            setView('saas');
        } else {
            // COMPORTAMENTO PADRÃO: Abrir a loja demo 'abn' se nada for especificado
            // Isso evita a tela preta de login para quem só quer ver o front
            setCurrentTenant('abn');
            setView('store');
        }
    }, []);

    // --- Navegação SaaS (Painel Admin) ---
    if (view === 'saas') {
        // Rotas Autenticadas
        if (user) {
            if (user.role === 'SUPER_ADMIN') {
                if (superAdminView === 'dashboard') {
                    return <SuperAdminDashboard 
                        onEnterMyStore={() => {
                            setCurrentTenant('uss'); // Força contexto para loja USS
                            setSuperAdminView('store');
                            setView('store');
                        }} 
                        onSelectTenant={() => {
                            setSuperAdminView('store');
                            setView('store');
                        }}
                    />;
                }
                return <AdminLayout onExit={() => setSuperAdminView('dashboard')} />;
            }
            if (user.role === 'TENANT_ADMIN') {
                return <AdminLayout onExit={saasLogout} />;
            }
        }

        // Rotas Públicas SaaS
        if (saasRoute === 'register') {
            return <SaasRegister onLoginClick={() => setSaasRoute('login')} />;
        }
        
        return <SaasLogin onRegisterClick={() => setSaasRoute('register')} />;
    }

    // --- Visualização da Loja (Cliente Final) ---
    if (isAdminMode) {
        return <AdminLayout onExit={() => setIsAdminMode(false)} />;
    }

    return <PublicStore onAdminEnter={() => {
        // Se já estiver logado como admin, vai pro painel, senão vai pro login
        if (user) {
            setIsAdminMode(true);
        } else {
            setView('saas');
        }
    }} />;
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <MainRouter />
    </StoreProvider>
  );
};

export default App;
