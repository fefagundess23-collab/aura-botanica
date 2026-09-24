import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Settings,
  ExternalLink,
  Package,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Database,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Product, BrandSettings } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

interface AdminDashboardProps {
  products: Product[];
  brandSettings: BrandSettings;
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
  onOpenDeleteModal: (product: Product) => void;
  onToggleAvailability: (product: Product) => void;
  onOpenSettingsModal: () => void;
  onSeedInitialData: () => Promise<void>;
  onNavigateToPublic: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  brandSettings,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onToggleAvailability,
  onOpenSettingsModal,
  onSeedInitialData,
  onNavigateToPublic,
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isSeeding, setIsSeeding] = useState(false);

  // Metrics
  const totalProducts = products.length;
  const availableCount = products.filter((p) => p.disponivel).length;
  const unavailableCount = totalProducts - availableCount;

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.categoria) set.add(p.categoria);
    });
    return Array.from(set);
  }, [products]);

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.categoria && item.categoria.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'available' && item.disponivel) ||
        (statusFilter === 'unavailable' && !item.disponivel);

      const matchesCategory =
        categoryFilter === 'all' || item.categoria === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await onSeedInitialData();
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E8E2D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span className="text-[11px] uppercase tracking-widest text-[#8C6239] font-bold">
                Painel Administrativo • Firestore Conectado
              </span>
            </div>
            <h1 className="font-editorial text-3xl font-bold text-[#233428]">
              Gestão de Produtos da Marca
            </h1>
            <p className="text-xs text-[#6B665E] mt-0.5">
              Conectado como <span className="font-medium text-[#233428]">{user?.email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSettingsModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D4CBBD] bg-[#FFFFFF] hover:bg-[#F4EFEB] text-xs font-semibold text-[#233428] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#8C6239]" />
              <span>Configurações & WhatsApp</span>
            </button>

            <button
              onClick={onNavigateToPublic}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D4CBBD] bg-[#FFFFFF] hover:bg-[#F4EFEB] text-xs font-semibold text-[#233428] transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-[#8C6239]" />
              <span>Ver Catálogo Público</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#233428] hover:bg-[#374D3D] text-[#FBF9F5] text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#86EFAC]" />
              <span>+ Adicionar produto</span>
            </button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D8] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4EFEB] text-[#233428] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-[#233428]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B665E] font-medium block">
                Total de Produtos
              </span>
              <span className="text-2xl font-bold text-[#233428]">{totalProducts}</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D8] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F8EE] text-[#16A34A] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B665E] font-medium block">
                Pronta Entrega
              </span>
              <span className="text-2xl font-bold text-[#16A34A]">{availableCount}</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D8] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-[#DC2626]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B665E] font-medium block">
                Sob Encomenda / Esgotados
              </span>
              <span className="text-2xl font-bold text-[#DC2626]">{unavailableCount}</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D8] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F4EFEB] text-[#8C6239] flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6 text-[#8C6239]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B665E] font-medium block">
                Categorias Ativas
              </span>
              <span className="text-2xl font-bold text-[#8C6239]">{categories.length}</span>
            </div>
          </div>
        </div>

        {/* Empty Collection Helper */}
        {totalProducts === 0 && (
          <div className="p-8 rounded-3xl bg-[#FFFFFF] border-2 border-dashed border-[#D4CBBD] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#E8E2D8] text-[#233428] flex items-center justify-center mx-auto">
              <Database className="w-7 h-7 text-[#8C6239]" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-editorial text-2xl font-bold text-[#233428] mb-1">
                Catálogo Vazio no Firestore
              </h3>
              <p className="text-xs text-[#6B665E] leading-relaxed mb-4">
                Você pode cadastrar itens manualmente com o botão acima ou carregar a coleção inicial
                de amostras artesanais para ver a vitrine completa em poucos segundos.
              </p>
              <button
                onClick={handleSeed}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#233428] text-white text-xs font-semibold hover:bg-[#374D3D] transition-colors shadow-sm disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#86EFAC]" />
                <span>
                  {isSeeding
                    ? 'Inserindo produtos no Firestore...'
                    : 'Semear Produtos Iniciais da Marca'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E8E2D8] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C6239] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por nome, categoria ou descrição..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-sm text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20 focus:border-[#233428]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-xs font-medium text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20"
            >
              <option value="all">Todos os Status</option>
              <option value="available">Apenas Disponíveis</option>
              <option value="unavailable">Apenas Esgotados / Sob Encomenda</option>
            </select>

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-[#FBF9F5] border border-[#E8E2D8] text-xs font-medium text-[#2A2723] focus:outline-none focus:ring-2 focus:ring-[#233428]/20"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Products Table / Cards */}
        {filteredProducts.length > 0 && (
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4EFEB] border-b border-[#E8E2D8] text-[#233428] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">Produto</th>
                    <th className="py-4 px-4">Categoria</th>
                    <th className="py-4 px-4">Preço</th>
                    <th className="py-4 px-4">Disponibilidade</th>
                    <th className="py-4 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D8]">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#FBF9F5] transition-colors"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imagem}
                            alt={product.nome}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E8E2D8] shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div>
                            <span className="font-editorial text-base font-semibold text-[#233428] block line-clamp-1">
                              {product.nome}
                            </span>
                            <span className="text-[11px] text-[#6B665E] line-clamp-1">
                              {product.descricaoCurta || product.descricao}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium bg-[#E8E2D8] text-[#233428]">
                          {product.categoria || 'Geral'}
                        </span>
                      </td>

                      {/* Preço */}
                      <td className="py-4 px-4 font-semibold text-[#233428]">
                        {formatCurrency(product.preco)}
                      </td>

                      {/* Disponibilidade com Toggle Rápido */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => onToggleAvailability(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium cursor-pointer transition-all ${
                            product.disponivel
                              ? 'bg-[#E8F8EE] text-[#16A34A] hover:bg-[#D1F2DD]'
                              : 'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FCD2D2]'
                          }`}
                          title="Clique para alternar disponibilidade no catálogo"
                        >
                          {product.disponivel ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                              <span>Disponível</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-[#DC2626]" />
                              <span>Sob Encomenda</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Ações: Editar e Excluir */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => onOpenEditModal(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#D4CBBD] bg-[#FFFFFF] hover:bg-[#F4EFEB] text-xs font-medium text-[#233428] transition-colors"
                          title="Editar este produto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => onOpenDeleteModal(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#FCA5A5] bg-[#FFFFFF] hover:bg-[#FEE2E2] text-xs font-medium text-[#DC2626] transition-colors"
                          title="Excluir este produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
