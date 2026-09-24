import React from 'react';
import { MessageCircle, Eye, CheckCircle2, Clock } from 'lucide-react';
import { Product, BrandSettings } from '../types';
import { formatCurrency, buildWhatsAppLink } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  brandSettings: BrandSettings;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  brandSettings,
  onOpenDetails,
}) => {
  const whatsappUrl = buildWhatsAppLink(
    brandSettings.whatsappNumber,
    brandSettings.whatsappMessage,
    product.nome
  );

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E8E2D8] hover:border-[#D4CBBD] hover:shadow-lg transition-all duration-300">
      {/* Product Image Frame */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative w-full aspect-square overflow-hidden bg-[#F4EFEB] cursor-pointer"
      >
        <img
          src={product.imagem}
          alt={product.nome}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            // Fallback image if broken
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {product.disponivel ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-[#233428]/90 text-[#FBF9F5] backdrop-blur-sm shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#86EFAC] animate-pulse" />
              Disponível
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-[#7F1D1D]/90 text-[#FEE2E2] backdrop-blur-sm shadow-sm">
              <Clock className="w-3 h-3 text-[#FCA5A5]" />
              Sob Encomenda
            </span>
          )}
        </div>

        {/* Category tag */}
        {product.categoria && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#FBF9F5]/90 text-[#6B665E] backdrop-blur-sm shadow-xs">
              {product.categoria}
            </span>
          </div>
        )}

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-[#233428]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF9F5]/95 text-[#233428] text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Ver Detalhes
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onOpenDetails(product)}
            className="font-editorial text-xl font-medium text-[#233428] hover:text-[#374D3D] cursor-pointer line-clamp-1 mb-1 transition-colors"
            title={product.nome}
          >
            {product.nome}
          </h3>

          <p className="text-xs text-[#6B665E] line-clamp-2 leading-relaxed mb-4">
            {product.descricaoCurta || product.descricao}
          </p>
        </div>

        <div>
          {/* Price & Action */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F4EFEB] mb-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8C6239] block font-medium">
                Valor
              </span>
              <span className="text-lg font-semibold text-[#233428]">
                {formatCurrency(product.preco)}
              </span>
            </div>

            <button
              onClick={() => onOpenDetails(product)}
              className="text-xs font-medium text-[#6B665E] hover:text-[#233428] underline underline-offset-4 decoration-[#D4CBBD]"
            >
              Saiba mais
            </button>
          </div>

          {/* Action Button WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-xs ${
              product.disponivel
                ? 'bg-[#233428] text-[#FBF9F5] hover:bg-[#374D3D] active:scale-[0.98]'
                : 'bg-[#F4EFEB] text-[#4A453F] hover:bg-[#E8E2D8] border border-[#D4CBBD]'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Tenho interesse</span>
          </a>
        </div>
      </div>
    </div>
  );
};
