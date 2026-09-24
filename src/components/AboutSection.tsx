import React from 'react';
import { Sparkles, Sprout, Compass, Award } from 'lucide-react';
import { BrandSettings } from '../types';

interface AboutSectionProps {
  brandSettings: BrandSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ brandSettings }) => {
  return (
    <section id="sobre" className="py-20 md:py-32 bg-[#F4EFEB] border-t border-[#E8E2D8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Images Mosaic */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/5] border border-[#E8E2D8]">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
                alt="Processo artesanal do ateliê"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#233428]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FBF9F5]">
                <span className="text-[11px] uppercase tracking-widest text-[#C49A6C] font-semibold block mb-1">
                  Ateliê Vivo
                </span>
                <p className="font-editorial text-xl italic font-light">
                  "Produzimos em pequenos lotes para preservar a alma e a qualidade de cada criação."
                </p>
              </div>
            </div>

            {/* Small Floating Accent Card */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#FFFFFF] p-5 rounded-2xl shadow-xl border border-[#E8E2D8] max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#233428] text-[#FBF9F5] flex items-center justify-center font-bold text-sm">
                  100%
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#233428] uppercase tracking-wide">
                    Livre de Parafina
                  </h4>
                  <p className="text-[11px] text-[#6B665E]">
                    Cera vegetal de coco, palma sustentável e óleos botânicos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAE5DC] text-[#233428] text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3 h-3 text-[#8C6239]" />
              <span>Manifesto do Ateliê</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-5xl font-medium text-[#233428] leading-[1.15]">
              O valor do que é feito com calma, mãos e propósito.
            </h2>

            <p className="text-base sm:text-lg text-[#5A554E] leading-relaxed font-light">
              {brandSettings.aboutText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#D4CBBD]/60">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#233428]">
                  <Sprout className="w-4 h-4 text-[#374D3D]" />
                  <h4 className="text-sm font-semibold">Matérias-Primas Éticas</h4>
                </div>
                <p className="text-xs text-[#6B665E] leading-relaxed">
                  Trabalhamos exclusivamente com produtores responsáveis, óleos essenciais puros
                  e argilas naturais de jazidas controladas.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#233428]">
                  <Compass className="w-4 h-4 text-[#8C6239]" />
                  <h4 className="text-sm font-semibold">Design Sensorial</h4>
                </div>
                <p className="text-xs text-[#6B665E] leading-relaxed">
                  Objetos que harmonizam aromas, texturas táteis e elegância atemporal para
                  transformar a sua casa em um refúgio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
