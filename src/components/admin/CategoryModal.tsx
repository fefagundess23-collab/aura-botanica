import React, { useState, useEffect } from 'react';
import { X, Tag, Plus, AlertCircle } from 'lucide-react';
import { Category } from '../../types';

interface CategoryModalProps {
  isOpen: boolean;
  existingCategories: Category[];
  onClose: () => void;
  onSave: (nome: string) => Promise<void>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  existingCategories,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNome('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = nome.trim();
    if (!cleanName) {
      setError('Por favor, informe o nome da categoria.');
      return;
    }

    if (cleanName.length < 2) {
      setError('O nome da categoria deve ter no mínimo 2 caracteres.');
      return;
    }

    if (cleanName.length > 60) {
      setError('O nome da categoria não pode ultrapassar 60 caracteres.');
      return;
    }

    // Check duplicate case-insensitively
    const isDuplicate = existingCategories.some(
      (c) => c.nome.toLowerCase() === cleanName.toLowerCase()
    );
    if (isDuplicate) {
      setError(`A categoria "${cleanName}" já existe.`);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(cleanName);
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      setError(err.message || 'Falha ao salvar categoria no Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#233428]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E8E2D8] z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#6B665E] hover:text-[#233428] hover:bg-[#F4EFEB] transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8E2D8] text-[#233428] flex items-center justify-center shrink-0">
            <Tag className="w-6 h-6 text-[#8C6239]" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#233428]">
              Nova Categoria
            </h3>
            <p className="text-xs text-[#6B665E]">
              Adicione uma nova categoria ao catálogo
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] mb-5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1.5">
              Nome da Categoria *
            </label>
            <input
              type="text"
              autoFocus
              required
              maxLength={60}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Incensos Naturais, Saboaria, Velas em Lata..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all"
            />
            <span className="text-[10px] text-[#8C6239] block mt-1">
              {nome.length}/60 caracteres
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E2D8]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-[#D4CBBD] text-xs font-semibold text-[#6B665E] hover:bg-[#F4EFEB] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#233428] text-white hover:bg-[#374D3D] text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 transition-all"
            >
              <Plus className="w-4 h-4 text-[#86EFAC]" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Categoria'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
