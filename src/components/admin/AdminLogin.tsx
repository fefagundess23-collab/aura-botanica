import React, { useState } from 'react';
import { X, Shield, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ADMIN_EMAILS } from '../../firebase';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle, user, logout, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unauthorizedError, setUnauthorizedError] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setUnauthorizedError(false);
    clearError();

    const isAuthorized = await loginWithGoogle();
    setIsSubmitting(false);

    if (isAuthorized) {
      onSuccess();
    } else {
      setUnauthorizedError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#233428]/70 backdrop-blur-sm transition-opacity"
      />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E2D8] z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#6B665E] hover:text-[#233428] hover:bg-[#F4EFEB] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#E8E2D8] text-[#233428] flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Shield className="w-7 h-7 text-[#233428]" />
          </div>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#233428]">
            Área do Administrador
          </h3>
          <p className="text-xs sm:text-sm text-[#6B665E] mt-1.5 leading-relaxed">
            Painel restrito para cadastro, edição de estoque e gestão de produtos da marca.
          </p>
        </div>

        {/* Informative Security Callout */}
        <div className="p-4 rounded-2xl bg-[#F4EFEB] border border-[#E8E2D8] text-xs text-[#5A554E] leading-relaxed mb-6 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#233428]">
            <Lock className="w-3.5 h-3.5 text-[#8C6239]" />
            <span>Acesso Autorizado</span>
          </div>
          <p>
            O acesso a este painel é protegido por Firebase Authentication.
            Apenas as contas de administradores autorizados possuem permissão de edição:
          </p>
          <div className="space-y-0.5 pt-1">
            {ADMIN_EMAILS.map((email) => (
              <div key={email} className="font-mono text-[#8C6239] font-medium text-[11px] flex items-center gap-1">
                <span>•</span>
                <span>{email}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Feedback */}
        {(error || unauthorizedError) && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] mb-6 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">
                {error ? 'Aviso de Autenticação' : 'Usuário não autorizado'}
              </p>
              <p className="leading-relaxed">
                {error ||
                  `A conta conectada (${user?.email || 'visitante'}) não tem privilégios de administrador. Faça login com uma das contas autorizadas (${ADMIN_EMAILS.join(' ou ')}).`}
              </p>
              {user && (
                <button
                  onClick={logout}
                  className="mt-2 text-xs font-semibold underline text-[#B91C1C] hover:text-[#7F1D1D]"
                >
                  Desconectar conta atual
                </button>
              )}
            </div>
          </div>
        )}

        {/* Google Sign-in button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl border border-[#D4CBBD] bg-[#FFFFFF] hover:bg-[#FBF9F5] hover:border-[#233428] text-sm font-semibold text-[#2A2723] shadow-xs active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {/* Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isSubmitting ? 'Conectando...' : 'Entrar com Conta Google'}</span>
        </button>

        <div className="mt-6 pt-5 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#6B665E]">
          <button
            onClick={onClose}
            className="hover:text-[#233428] flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao catálogo
          </button>
          <span>Aura Botânica</span>
        </div>
      </div>
    </div>
  );
};
