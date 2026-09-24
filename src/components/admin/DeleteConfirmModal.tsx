import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Product } from '../../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(product.id);
      onClose();
    } catch (err) {
      console.error('Falha ao excluir produto:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#233428]/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8E2D8] z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#6B665E] hover:text-[#233428] hover:bg-[#F4EFEB] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-editorial text-xl font-bold text-[#233428]">
              Excluir Produto
            </h3>
            <span className="text-xs text-[#DC2626] font-semibold">
              Esta ação é permanente
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#5A554E] leading-relaxed mb-6">
          Você tem certeza que deseja remover o produto{' '}
          <strong className="text-[#233428]">"{product.nome}"</strong> do catálogo? Ele não será
          mais visível para os visitantes.
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D8]">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-[#D4CBBD] text-xs font-semibold text-[#6B665E] hover:bg-[#F4EFEB] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isDeleting ? 'Removendo do Firestore...' : 'Sim, Excluir Produto'}
          </button>
        </div>
      </div>
    </div>
  );
};
