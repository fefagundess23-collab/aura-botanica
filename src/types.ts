export interface Product {
  id: string;
  nome: string;
  descricao: string;
  descricaoCurta?: string;
  preco: number;
  imagem: string;
  disponivel: boolean;
  categoria?: string;
  destaque?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  nome: string;
  createdAt?: any;
}

export interface ProductFormData {
  nome: string;
  descricao: string;
  descricaoCurta: string;
  preco: number;
  imagem: string;
  disponivel: boolean;
  categoria: string;
  destaque: boolean;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  whatsappMessage: string;
  instagramHandle: string;
  aboutText: string;
  emailContact: string;
  cityState: string;
  updatedAt?: any;
}

export interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}
