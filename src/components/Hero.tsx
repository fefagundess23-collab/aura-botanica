import React from 'react';
import { ArrowDown, MessageCircle, Sparkles, Leaf, HeartHandshake } from 'lucide-react';
import { BrandSettings } from '../types';
import { cleanPhone } from '../utils/formatters';

interface HeroProps {
  brandSettings: BrandSettings;
}

export const Hero: React.FC<HeroProps> = ({ brandSettings }) => {
  const whatsappUrl = `https://wa.me/${cleanPhone(brandSettings.whatsappNumber)}?text=${encodeURIComponent(
    'Olá! Estive olhando o catálogo do ateliê e gostaria de conversar com vocês.'
  )}`;

  return (
    <section id="inicio" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background soft ambient accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E8E2D8]/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Subtle top pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAE5DC] border border-[#D4CBBD] text-xs uppercase tracking-widest text-[#233428] font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#8C6239]" />
            <span>Curadoria Artesanal & Feito à Mão</span>
          </div>

          {/* Main Title */}
          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#233428] tracking-tight leading-[1.08] mb-6">
            {brandSettings.brandName}
          </h1>

          {/* Tagline / Subtitle */}
          <p className="text-lg sm:text-xl text-[#5A554E] font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            {brandSettings.tagline}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#produtos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide bg-[#233428] text-[#FBF9F5] hover:bg-[#374D3D] shadow-sm hover:shadow transition-all"
            >
              <span>Ver Catálogo</span>
              <ArrowDown className="w-4 h-4 text-[#C49A6C]" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide bg-[#FBF9F5] text-[#233428] border border-[#D4CBBD] hover:bg-[#F4EFEB] transition-all"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Falar no WhatsApp</span>
            </a>
          </div>

          {/* Trust Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-[#E8E2D8]/80 text-left">
            <div className="flex items-start gap-3.5 p-2">
              <div className="p-2.5 rounded-xl bg-[#E8E2D8]/60 text-[#233428] shrink-0 mt-0.5">
                <Leaf className="w-5 h-5 text-[#374D3D]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#233428]">100% Vegetal & Puro</h4>
                <p className="text-xs text-[#6B665E] mt-0.5 leading-relaxed">
                  Sem parafinas ou aditivos químicos prejudiciais à saúde.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2">
              <div className="p-2.5 rounded-xl bg-[#E8E2D8]/60 text-[#233428] shrink-0 mt-0.5">
                <HeartHandshake className="w-5 h-5 text-[#8C6239]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#233428]">Produção em Lotes</h4>
                <p className="text-xs text-[#6B665E] mt-0.5 leading-relaxed">
                  Cada peça é vertida ou moldada à mão com atenção aos detalhes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-2">
              <div className="p-2.5 rounded-xl bg-[#E8E2D8]/60 text-[#233428] shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-[#A85A3A]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#233428]">Design & Afeto</h4>
                <p className="text-xs text-[#6B665E] mt-0.5 leading-relaxed">
                  Peças que transformam o cotidiano e acolhem os ambientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
