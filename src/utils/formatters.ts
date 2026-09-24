export function formatCurrency(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppLink(
  phoneNumber: string,
  templateMessage: string,
  productName: string
): string {
  const digits = cleanPhone(phoneNumber);
  const formattedText = templateMessage.replace(/\[NOME DO PRODUTO\]/gi, productName);
  const encodedText = encodeURIComponent(formattedText);
  return `https://wa.me/${digits}?text=${encodedText}`;
}

export const SAMPLE_ARTISANAL_IMAGES = [
  {
    title: 'Vela Botânica Âmbar',
    url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    category: 'Velas Botânicas',
  },
  {
    title: 'Vela de Soja Concreto',
    url: 'https://images.unsplash.com/photo-1572726729437-370d645eb93b?auto=format&fit=crop&w=800&q=80',
    category: 'Velas Botânicas',
  },
  {
    title: 'Home Spray Vidro Âmbar',
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    category: 'Aromaterapia',
  },
  {
    title: 'Difusor de Varetas Elegante',
    url: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80',
    category: 'Aromaterapia',
  },
  {
    title: 'Óleos Essenciais Puros',
    url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    category: 'Aromaterapia',
  },
  {
    title: 'Caneca Cerâmica Rústica',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    category: 'Cerâmica Artesanal',
  },
  {
    title: 'Vaso Cerâmica Wabi-Sabi',
    url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    category: 'Cerâmica Artesanal',
  },
  {
    title: 'Incensário Folha Cerâmica',
    url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    category: 'Cerâmica Artesanal',
  },
  {
    title: 'Sais de Banho & Botânica',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    category: 'Autocuidado',
  },
  {
    title: 'Sabonete Artesanal Vegetal',
    url: 'https://images.unsplash.com/photo-1607006314644-8c8f5336f0aa?auto=format&fit=crop&w=800&q=80',
    category: 'Autocuidado',
  },
  {
    title: 'Bálsamo e Creme Botânico',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    category: 'Autocuidado',
  },
];
