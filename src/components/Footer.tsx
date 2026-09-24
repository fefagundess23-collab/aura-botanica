import React from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { BrandSettings } from '../types';

interface FooterProps {
  brandSettings: BrandSettings;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ brandSettings, onOpenAdmin }) => {
  return (
    <footer className="bg-[#233428] text-[#FBF9F5] pt-16 pb-12 border-t border-[#374D3D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#374D3D]/80">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-editorial text-2xl font-bold tracking-widest text-[#FBF9F5]">
                {brandSettings.brandName.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#E8E2D8]/80 leading-relaxed max-w-sm font-light">
              Catálogo oficial de produtos artesanais, cerâmicas e aromaterapia vegetal.
              Cada item é único e concebido com calma e carinho.
            </p>
            <p className="text-[11px] text-[#C49A6C]">
              {brandSettings.cityState}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C49A6C] font-semibold">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-[#E8E2D8]/90">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#produtos" className="hover:text-white transition-colors">
                  Catálogo Completo
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Manifesto & Ateliê
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Independent Brand Statement & Admin Access */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C49A6C] font-semibold">
              Gestão da Marca
            </h4>
            <p className="text-xs text-[#E8E2D8]/70 leading-relaxed">
              Área restrita para a equipe do ateliê cadastrar produtos, ajustar preços e disponibilidade.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#374D3D] hover:bg-[#4A6451] text-xs font-medium text-white transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#86EFAC]" />
              Painel do Administrador
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8E2D8]/60">
          <p>© {new Date().getFullYear()} {brandSettings.brandName}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            <span>Desenvolvido com carinho para marcas independentes</span>
            <Sparkles className="w-3 h-3 text-[#C49A6C]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
