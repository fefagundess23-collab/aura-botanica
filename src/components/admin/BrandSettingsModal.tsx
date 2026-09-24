import React, { useState, useEffect } from 'react';
import { X, Save, MessageCircle, Instagram, Store, Mail, MapPin, Sparkles } from 'lucide-react';
import { BrandSettings } from '../../types';

interface BrandSettingsModalProps {
  isOpen: boolean;
  settings: BrandSettings;
  onClose: () => void;
  onSave: (settings: BrandSettings) => Promise<void>;
}

export const BrandSettingsModal: React.FC<BrandSettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<BrandSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(settings);
    setSaveSuccess(false);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#233428]/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-[#FBF9F5] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D8] z-10 my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FFFFFF] border-b border-[#E8E2D8] flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#233428]">
              Configurações da Marca & Contato
            </h3>
            <p className="text-xs text-[#6B665E]">
              Altere o número de WhatsApp, mensagens de atendimento e dados institucionais.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B665E] hover:text-[#233428] hover:bg-[#F4EFEB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          id="brand-settings-form"
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-6"
        >
          {/* Seção WhatsApp */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#233428]">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Atendimento via WhatsApp</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                Número do WhatsApp (com código do país e DDD) *
              </label>
              <input
                type="text"
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="5511987654321"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] font-mono"
              />
              <span className="text-[11px] text-[#6B665E] mt-1 block">
                Exemplo: 5511999999999 (55 para Brasil + DDD + 9 dígitos).
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                Mensagem Padrão Pré-preenchida
              </label>
              <textarea
                rows={2}
                value={formData.whatsappMessage}
                onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                placeholder="Olá! Tenho interesse no produto [NOME DO PRODUTO]. Gostaria de saber mais informações."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
              />
              <span className="text-[11px] text-[#8C6239] mt-1 block">
                Dica: O texto <strong className="font-mono text-[#233428]">[NOME DO PRODUTO]</strong> será substituído automaticamente pelo nome do item selecionado pelo cliente.
              </span>
            </div>
          </div>

          {/* Seção Identidade & Redes Sociais */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#233428]">
              <Store className="w-4 h-4 text-[#8C6239]" />
              <span>Identidade & Redes Sociais</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                  Nome da Marca
                </label>
                <input
                  type="text"
                  required
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                  Perfil no Instagram
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                  placeholder="@marca.atelie"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                Frase de Destaque (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                  E-mail de Contato
                </label>
                <input
                  type="email"
                  value={formData.emailContact}
                  onChange={(e) => setFormData({ ...formData, emailContact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                  Localização / Cidade
                </label>
                <input
                  type="text"
                  value={formData.cityState}
                  onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1">
                Sobre a Marca (História & Manifesto)
              </label>
              <textarea
                rows={3}
                value={formData.aboutText}
                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
              />
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-t border-[#E8E2D8] flex items-center justify-between shrink-0">
          <div>
            {saveSuccess && (
              <span className="text-xs font-semibold text-[#22C55E]">
                Configurações salvas no Firestore!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-[#D4CBBD] text-xs font-semibold text-[#6B665E] hover:bg-[#F4EFEB]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="brand-settings-form"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#233428] text-white hover:bg-[#374D3D] text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Salvando no Firestore...' : 'Salvar Configurações'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
