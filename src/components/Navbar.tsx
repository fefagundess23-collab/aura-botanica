import React, { useState } from 'react';
import { Menu, X, Shield, ExternalLink, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandSettings } from '../types';

interface NavbarProps {
  currentView: 'public' | 'admin';
  onNavigate: (view: 'public' | 'admin') => void;
  brandSettings: BrandSettings;
  onOpenAdminLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  brandSettings,
  onOpenAdminLogin,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      onNavigate(currentView === 'admin' ? 'public' : 'admin');
    } else {
      onOpenAdminLogin();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E2D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div
            onClick={() => onNavigate('public')}
            className="cursor-pointer group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#233428] text-[#FBF9F5] flex items-center justify-center font-editorial text-xl font-bold shadow-sm transition-transform group-hover:scale-105">
              <span>✦</span>
            </div>
            <div>
              <span className="font-editorial text-2xl font-bold tracking-wider text-[#233428] block leading-none">
                {brandSettings.brandName.toUpperCase()}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#8C6239] font-medium block mt-1">
                Ateliê Independente
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (Public View) */}
          {currentView === 'public' && (
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#4A453F]">
              <a
                href="#inicio"
                className="hover:text-[#233428] transition-colors py-1 border-b border-transparent hover:border-[#233428]"
              >
                Início
              </a>
              <a
                href="#produtos"
                className="hover:text-[#233428] transition-colors py-1 border-b border-transparent hover:border-[#233428]"
              >
                Catálogo
              </a>
              <a
                href="#sobre"
                className="hover:text-[#233428] transition-colors py-1 border-b border-transparent hover:border-[#233428]"
              >
                Sobre a Marca
              </a>
              <a
                href="#contato"
                className="hover:text-[#233428] transition-colors py-1 border-b border-transparent hover:border-[#233428]"
              >
                Contato
              </a>
            </nav>
          )}

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentView === 'admin' ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('public')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide uppercase text-[#233428] bg-[#E8E2D8] hover:bg-[#D4CBBD] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver Catálogo Público
                </button>
                {user && (
                  <button
                    onClick={logout}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-[#6B665E] hover:text-[#991B1B] hover:bg-[#FEE2E2]/50 transition-colors"
                    title="Encerrar sessão"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {isAdmin ? (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#233428] text-[#FBF9F5] hover:bg-[#374D3D] shadow-sm transition-all"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#86EFAC]" />
                    Painel do Administrador
                  </button>
                ) : (
                  <button
                    onClick={onOpenAdminLogin}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#6B665E] hover:text-[#233428] hover:bg-[#E8E2D8]/60 transition-colors"
                    title="Área do Administrador"
                  >
                    <Shield className="w-3.5 h-3.5 opacity-70" />
                    Área Restrita
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2A2723] hover:bg-[#E8E2D8] transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FBF9F5] border-b border-[#E8E2D8] px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {currentView === 'public' ? (
            <div className="flex flex-col space-y-3 font-medium text-[#4A453F]">
              <a
                href="#inicio"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#F4EFEB] hover:text-[#233428]"
              >
                Início
              </a>
              <a
                href="#produtos"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#F4EFEB] hover:text-[#233428]"
              >
                Catálogo de Produtos
              </a>
              <a
                href="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#F4EFEB] hover:text-[#233428]"
              >
                Sobre a Marca
              </a>
              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-[#F4EFEB] hover:text-[#233428]"
              >
                Contato & Atendimento
              </a>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onNavigate('public');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg bg-[#E8E2D8] text-[#233428] font-medium"
              >
                ← Ver Catálogo Público
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-[#E8E2D8] flex flex-col gap-2">
            <button
              onClick={handleAdminClick}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#233428] text-[#FBF9F5]"
            >
              <Shield className="w-4 h-4" />
              {isAdmin
                ? currentView === 'admin'
                  ? 'Ir ao Catálogo'
                  : 'Painel Administrativo'
                : 'Login do Administrador'}
            </button>
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm text-[#991B1B] hover:bg-[#FEE2E2]"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
