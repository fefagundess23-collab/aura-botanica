import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { NotificationToast } from '../types';

interface ToastProps {
  toasts: NotificationToast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-[#233428]/95 text-[#FBF9F5] border-[#374D3D]'
              : toast.type === 'error'
              ? 'bg-[#4A2018]/95 text-[#FBF9F5] border-[#6E3024]'
              : 'bg-[#F4EFEB]/95 text-[#2A2723] border-[#D4CBBD]'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-[#86EFAC] shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-[#FCA5A5] shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-[#8C6239] shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-sm">
            {toast.title && <h4 className="font-medium mb-0.5">{toast.title}</h4>}
            <p className="opacity-90 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/60 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded"
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
