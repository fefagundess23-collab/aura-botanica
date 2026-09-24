import React, { useEffect } from 'react';
import { X, MessageCircle, Check, Clock, Sparkles, Share2 } from 'lucide-react';
import { Product, BrandSettings } from '../types';
import { formatCurrency, buildWhatsAppLink } from '../utils/formatters';

interface ProductModalProps {
  product: Product | null;
  brandSettings: BrandSettings;
  onClose: () => void;
  onToast: (message: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  brandSettings,
  onClose,
  onToast,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const whatsappUrl = buildWhatsAppLink(
    brandSettings.whatsappNumber,
    brandSettings.whatsappMessage,
    product.nome
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.nome} • ${brandSettings.brandName}`,
          text: product.descricaoCurta || product.descricao,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      onToast('Link copiado para a área de transferência!');
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
      <div className="relative w-full max-w-3xl bg-[#FBF9F5] rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D8] z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#FBF9F5]/90 hover:bg-[#E8E2D8] text-[#2A2723] transition-colors shadow-xs"
          aria-label="Fechar detalhes do produto"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Container */}
          <div className="relative aspect-square md:aspect-auto md:h-full bg-[#F4EFEB] overflow-hidden min-h-[320px]">
            <img
              src={product.imagem}
              alt={product.nome}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute bottom-4 left-4 z-10">
              {product.disponivel ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#233428] text-[#FBF9F5] shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#86EFAC]" />
                  Pronta Entrega
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide bg-[#7F1D1D] text-[#FEE2E2] shadow-md">
                  <Clock className="w-3.5 h-3.5 text-[#FCA5A5]" />
                  Feito sob Encomenda
                </span>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-[#8C6239] font-semibold">
                  {product.categoria || 'Artigo de Ateliê'}
                </span>
                <button
                  onClick={handleShare}
                  className="p-1.5 text-[#6B665E] hover:text-[#233428] rounded-md transition-colors"
                  title="Compartilhar produto"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title */}
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#233428] mb-4 leading-snug">
                {product.nome}
              </h2>

              {/* Price */}
              <div className="p-3.5 rounded-xl bg-[#F4EFEB] border border-[#E8E2D8] mb-6 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-[#6B665E] font-medium">
                  Valor Unitário
                </span>
                <span className="text-2xl font-bold text-[#233428]">
                  {formatCurrency(product.preco)}
                </span>
              </div>

              {/* Full Description */}
              <div className="mb-6 space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-[#8C6239] font-bold">
                  Sobre a peça & Modo de Usar
                </h4>
                <div className="text-sm text-[#4A453F] leading-relaxed whitespace-pre-line font-light">
                  {product.descricao}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-6 border-t border-[#E8E2D8] space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-semibold tracking-wide bg-[#233428] text-[#FBF9F5] hover:bg-[#374D3D] active:scale-[0.99] transition-all shadow-md"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>Tenho interesse • Conversar no WhatsApp</span>
              </a>

              <p className="text-center text-[11px] text-[#6B665E]">
                Atendimento personalizado diretamente com nossa equipe pelo WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
