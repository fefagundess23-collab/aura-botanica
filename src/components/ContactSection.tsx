import React from 'react';
import { MessageCircle, Instagram, Mail, MapPin, Sparkles, Send } from 'lucide-react';
import { BrandSettings } from '../types';
import { cleanPhone } from '../utils/formatters';

interface ContactSectionProps {
  brandSettings: BrandSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ brandSettings }) => {
  const whatsappUrl = `https://wa.me/${cleanPhone(brandSettings.whatsappNumber)}?text=${encodeURIComponent(
    'Olá! Gostaria de falar com o atendimento da Aura Botânica.'
  )}`;

  const instagramUrl = `https://instagram.com/${brandSettings.instagramHandle.replace('@', '')}`;

  return (
    <section id="contato" className="py-20 bg-[#FBF9F5] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-[#8C6239] font-bold block mb-2">
            Estamos por aqui
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-medium text-[#233428] mb-4">
            Entre em Contato com o Ateliê
          </h2>
          <p className="text-sm sm:text-base text-[#6B665E] leading-relaxed">
            Dúvidas sobre fragrâncias, encomendas corporativas personalizadas ou presentes especiais?
            Adoramos conversar e acolher suas ideias.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp Card */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#25D366] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8EE] text-[#25D366] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#233428] mb-1">
                WhatsApp
              </h3>
              <p className="text-xs text-[#6B665E] leading-relaxed mb-4">
                Atendimento rápido para tirar dúvidas, pedidos sob medida e pronta entrega.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#25D366] group-hover:underline">
              <span>Iniciar conversa</span>
              <Send className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#E1306C] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FCE8F0] text-[#E1306C] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#233428] mb-1">
                Instagram
              </h3>
              <p className="text-xs text-[#6B665E] leading-relaxed mb-4">
                Acompanhe os bastidores da produção, processos no torno e novos lançamentos.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E1306C] group-hover:underline">
              <span>{brandSettings.instagramHandle}</span>
            </div>
          </a>

          {/* Email / Location Card */}
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E8E2D8] text-[#233428] flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-[#8C6239]" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#233428] mb-1">
                E-mail & Ateliê
              </h3>
              <p className="text-xs text-[#6B665E] leading-relaxed mb-4">
                Para parcerias, fornecedores e eventos de bem-estar.
              </p>
            </div>
            <div className="space-y-1 text-xs text-[#4A453F]">
              <a
                href={`mailto:${brandSettings.emailContact}`}
                className="font-medium text-[#233428] hover:underline block truncate"
              >
                {brandSettings.emailContact}
              </a>
              <span className="text-[11px] text-[#8C6239] block">
                {brandSettings.cityState}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
