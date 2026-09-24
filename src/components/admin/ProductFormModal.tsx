import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Image as ImageIcon, Eye, Check, AlertCircle } from 'lucide-react';
import { Product, ProductFormData } from '../../types';
import { SAMPLE_ARTISANAL_IMAGES, formatCurrency } from '../../utils/formatters';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(productToEdit);

  const [formData, setFormData] = useState<ProductFormData>({
    nome: '',
    descricao: '',
    descricaoCurta: '',
    preco: 0,
    imagem: '',
    disponivel: true,
    categoria: 'Velas Botânicas',
    destaque: false,
  });

  const [showGallery, setShowGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nome: productToEdit.nome,
        descricao: productToEdit.descricao,
        descricaoCurta: productToEdit.descricaoCurta || '',
        preco: productToEdit.preco,
        imagem: productToEdit.imagem,
        disponivel: productToEdit.disponivel,
        categoria: productToEdit.categoria || 'Velas Botânicas',
        destaque: Boolean(productToEdit.destaque),
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        descricaoCurta: '',
        preco: 75.0,
        imagem: SAMPLE_ARTISANAL_IMAGES[0].url,
        disponivel: true,
        categoria: 'Velas Botânicas',
        destaque: false,
      });
    }
    setFormError(null);
    setShowGallery(false);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 1.5MB for Base64 preview)
    if (file.size > 2 * 1024 * 1024) {
      setFormError('A imagem selecionada é muito pesada (máximo 2MB). Escolha outra foto ou use uma URL.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setFormData((prev) => ({ ...prev, imagem: result }));
      setFormError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.nome.trim()) {
      setFormError('O nome do produto é obrigatório.');
      return;
    }
    if (!formData.descricao.trim()) {
      setFormError('A descrição detalhada do produto é obrigatória.');
      return;
    }
    if (formData.preco < 0 || isNaN(formData.preco)) {
      setFormError('Informe um valor de preço válido.');
      return;
    }
    if (!formData.imagem.trim()) {
      setFormError('Insira uma foto para o produto.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar produto:', err);
      setFormError(err.message || 'Falha ao salvar produto no Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#233428]/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#FBF9F5] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D8] z-10 my-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FFFFFF] border-b border-[#E8E2D8] flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#233428]">
              {isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h3>
            <p className="text-xs text-[#6B665E]">
              {isEditing
                ? 'Atualize as informações que aparecerão no catálogo público.'
                : 'Preencha os dados do novo item artesanal para exibi-lo no catálogo.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#6B665E] hover:text-[#233428] hover:bg-[#F4EFEB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {formError && (
            <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Inputs (Left) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1.5">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Vela Botânica Lavanda & Cedro"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all"
                  />
                </div>

                {/* Categoria e Preço */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1.5">
                      Categoria
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all"
                    >
                      <option value="Velas Botânicas">Velas Botânicas</option>
                      <option value="Aromaterapia">Aromaterapia</option>
                      <option value="Cerâmica Artesanal">Cerâmica Artesanal</option>
                      <option value="Autocuidado">Autocuidado</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1.5">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      required
                      value={formData.preco || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="89.00"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all"
                    />
                  </div>
                </div>

                {/* Descrição Curta */}
                <div>
                  <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1.5">
                    Descrição Curta (para o card da vitrine)
                  </label>
                  <input
                    type="text"
                    maxLength={140}
                    value={formData.descricaoCurta}
                    onChange={(e) => setFormData({ ...formData, descricaoCurta: e.target.value })}
                    placeholder="Resumo de 1 frase destacando aroma, material ou proposta..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all"
                  />
                  <span className="text-[10px] text-[#8C6239] block mt-1">
                    {formData.descricaoCurta.length}/140 caracteres
                  </span>
                </div>

                {/* Descrição Completa */}
                <div>
                  <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider mb-1.5">
                    Descrição Detalhada & Modo de Uso *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva os componentes, processo de feitura, benefícios, peso, tempo de queima ou dimensões..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all resize-y"
                  />
                </div>

                {/* Imagem URL & Opções */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#233428] uppercase tracking-wider">
                      Foto do Produto *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGallery(!showGallery)}
                      className="text-xs font-semibold text-[#8C6239] hover:text-[#233428] flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {showGallery ? 'Fechar Galeria' : 'Escolher da Biblioteca Artesanal'}
                    </button>
                  </div>

                  <input
                    type="url"
                    value={formData.imagem}
                    onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                    placeholder="https://... ou faça upload do computador"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] text-xs text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all font-mono"
                  />

                  {/* Upload file trigger */}
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D4CBBD] bg-[#FFFFFF] hover:bg-[#F4EFEB] text-xs text-[#233428] cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#8C6239]" />
                      <span>Carregar imagem do computador</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-[#6B665E]">
                      JPG ou PNG (máx. 2MB)
                    </span>
                  </div>

                  {/* Sample gallery popout */}
                  {showGallery && (
                    <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] space-y-2 animate-in fade-in-50">
                      <span className="text-xs font-bold text-[#233428] block">
                        Fotos de Amostra com Curadoria:
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {SAMPLE_ARTISANAL_IMAGES.map((sample, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setFormData({ ...formData, imagem: sample.url });
                              setShowGallery(false);
                            }}
                            className="group relative aspect-square rounded-lg overflow-hidden border border-[#E8E2D8] cursor-pointer hover:border-[#233428] transition-all"
                            title={sample.title}
                          >
                            <img
                              src={sample.url}
                              alt={sample.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                            {formData.imagem === sample.url && (
                              <div className="absolute inset-0 bg-[#233428]/50 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Disponibilidade & Destaque Toggles */}
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#233428] block">
                        Status de Estoque
                      </span>
                      <span className="text-[11px] text-[#6B665E]">
                        {formData.disponivel
                          ? 'Item disponível para envio imediato.'
                          : 'Item esgotado ou produzido apenas sob encomenda.'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, disponivel: !formData.disponivel })
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData.disponivel ? 'bg-[#233428]' : 'bg-[#D4CBBD]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.disponivel ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[#F4EFEB] flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="destaque"
                      checked={formData.destaque}
                      onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                      className="w-4 h-4 text-[#233428] rounded border-[#D4CBBD] focus:ring-[#233428]"
                    />
                    <label htmlFor="destaque" className="text-xs text-[#2A2723] cursor-pointer">
                      Destacar este produto no topo da vitrine
                    </label>
                  </div>
                </div>
              </div>

              {/* Card Live Preview (Right) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full sticky top-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C6239] uppercase tracking-wider">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pré-visualização na Vitrine</span>
                  </div>

                  {/* Simulated Card */}
                  <div className="w-full bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E8E2D8] shadow-md">
                    <div className="aspect-square bg-[#F4EFEB] relative overflow-hidden">
                      {formData.imagem ? (
                        <img
                          src={formData.imagem}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#8C6239] p-4 text-center">
                          <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                          <span className="text-xs">Insira a imagem para pré-visualizar</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            formData.disponivel
                              ? 'bg-[#233428] text-white'
                              : 'bg-[#7F1D1D] text-white'
                          }`}
                        >
                          {formData.disponivel ? 'Disponível' : 'Sob Encomenda'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FBF9F5]/90 text-[#6B665E] font-medium">
                          {formData.categoria}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-editorial text-lg font-medium text-[#233428] line-clamp-1">
                        {formData.nome || 'Nome do Produto'}
                      </h4>
                      <p className="text-xs text-[#6B665E] line-clamp-2">
                        {formData.descricaoCurta ||
                          formData.descricao ||
                          'Breve descrição do produto artesanal...'}
                      </p>
                      <div className="pt-2 border-t border-[#F4EFEB] flex items-center justify-between">
                        <span className="text-base font-bold text-[#233428]">
                          {formatCurrency(formData.preco)}
                        </span>
                        <span className="text-[11px] text-[#25D366] font-semibold">
                          Tenho interesse →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-t border-[#E8E2D8] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border border-[#D4CBBD] text-xs font-semibold text-[#6B665E] hover:bg-[#F4EFEB] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#233428] text-[#FBF9F5] hover:bg-[#374D3D] text-xs font-semibold tracking-wide shadow-sm disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? (
              <span>Salvando no Firestore...</span>
            ) : (
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
