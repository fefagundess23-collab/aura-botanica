import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Product, BrandSettings, Category } from '../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  categories?: Category[];
  brandSettings: BrandSettings;
  loading: boolean;
  error: Error | null;
  onOpenDetails: (product: Product) => void;
  onRetry?: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories = [],
  brandSettings,
  loading,
  error,
  onOpenDetails,
  onRetry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  // Extract unique categories from Firestore categories collection and products
  const categoryNames = useMemo(() => {
    const list = new Set<string>();
    if (categories && categories.length > 0) {
      categories.forEach((c) => {
        if (c.nome && c.nome.trim()) list.add(c.nome.trim());
      });
    }
    products.forEach((p) => {
      if (p.categoria && p.categoria.trim()) {
        list.add(p.categoria.trim());
      }
    });
    return Array.from(list);
  }, [categories, products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.categoria && product.categoria.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || product.categoria === selectedCategory;

      const matchAvailability = !onlyAvailable || product.disponivel;

      return matchSearch && matchCategory && matchAvailability;
    });
  }, [products, searchTerm, selectedCategory, onlyAvailable]);

  return (
    <section id="produtos" className="py-16 md:py-24 bg-[#FBF9F5] border-t border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs uppercase tracking-widest text-[#8C6239] font-bold block mb-2">
            Coleção & Lotes Atuais
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-medium text-[#233428] leading-tight mb-4">
            Catálogo de Criações
          </h2>
          <p className="text-sm sm:text-base text-[#6B665E] leading-relaxed">
            Navegue por nossas peças artesanais, aromaterapia e cerâmicas. Cada criação é
            produzida em tiragem reduzida com foco em qualidade, acolhimento e sustentabilidade.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E8E2D8] shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C6239] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, aroma ou ingredientes..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] placeholder-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8C6239] hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Availability Filter Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#4A453F] select-none py-1.5 px-3 rounded-xl hover:bg-[#F4EFEB] transition-colors border border-transparent hover:border-[#E8E2D8]">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#233428] rounded border-[#D4CBBD] focus:ring-[#233428]"
                />
                <span>Apenas Pronta Entrega</span>
              </label>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-[#8C6239] font-medium text-xs mr-1 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtrar:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#233428] text-[#FBF9F5]'
                  : 'bg-[#F4EFEB] text-[#5A554E] hover:bg-[#E8E2D8]'
              }`}
            >
              Todos ({products.length})
            </button>
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#233428] text-[#FBF9F5]'
                    : 'bg-[#F4EFEB] text-[#5A554E] hover:bg-[#E8E2D8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] rounded-2xl p-4 border border-[#E8E2D8] animate-pulse space-y-4"
              >
                <div className="aspect-square bg-[#E8E2D8] rounded-xl" />
                <div className="h-5 bg-[#E8E2D8] rounded w-3/4" />
                <div className="h-4 bg-[#F4EFEB] rounded w-full" />
                <div className="h-8 bg-[#E8E2D8] rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-[#DC2626] mx-auto mb-3" />
            <h3 className="font-editorial text-2xl font-bold text-[#991B1B] mb-2">
              Erro ao carregar o catálogo
            </h3>
            <p className="text-sm text-[#7F1D1D] mb-5 leading-relaxed">
              Não foi possível sincronizar os produtos do banco de dados neste momento.
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#DC2626] text-white text-xs font-semibold hover:bg-[#B91C1C] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar novamente
              </button>
            )}
          </div>
        )}

        {/* Empty Collection State */}
        {!loading && !error && products.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] max-w-xl mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#E8E2D8] text-[#233428] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-[#8C6239]" />
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-[#233428] mb-2">
              Nenhum produto cadastrado
            </h3>
            <p className="text-sm text-[#6B665E] leading-relaxed mb-6">
              O catálogo está sendo preparado pelo ateliê. Acesse a área administrativa para cadastrar
              seus primeiros produtos ou semear as criações de demonstração.
            </p>
          </div>
        )}

        {/* Filtered Empty State */}
        {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
          <div className="p-10 text-center rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] max-w-md mx-auto">
            <p className="text-base font-medium text-[#233428] mb-2">
              Nenhum produto encontrado
            </p>
            <p className="text-xs text-[#6B665E] mb-4">
              Tente ajustar sua busca ou limpar os filtros selecionados.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setOnlyAvailable(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-[#E8E2D8] text-[#233428] hover:bg-[#D4CBBD] transition-colors"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                brandSettings={brandSettings}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
