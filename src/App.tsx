import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, BrandSettings, ProductFormData, NotificationToast } from './types';
import { DEFAULT_BRAND_SETTINGS } from './data/initialData';
import {
  subscribeToProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
  seedInitialProducts,
} from './services/productsService';
import {
  subscribeToBrandSettings,
  saveBrandSettings,
} from './services/settingsService';
import { testFirestoreConnection } from './firebase';

// Public Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { ToastContainer } from './components/Toast';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductFormModal } from './components/admin/ProductFormModal';
import { DeleteConfirmModal } from './components/admin/DeleteConfirmModal';
import { BrandSettingsModal } from './components/admin/BrandSettingsModal';

function MainApp() {
  const { user, isAdmin } = useAuth();

  // Navigation state
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  // Firestore Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<Error | null>(null);

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);

  // Modals state
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [productDetailsModal, setProductDetailsModal] = useState<Product | null>(null);
  const [productFormModalOpen, setProductFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [brandSettingsModalOpen, setBrandSettingsModalOpen] = useState(false);

  // Toast feedback state
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success', title?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Test Firestore Connection on App Mount
  useEffect(() => {
    testFirestoreConnection().catch((err) => {
      console.warn('Conexão inicial com Firestore:', err);
    });
  }, []);

  // Real-time Firestore Listeners
  useEffect(() => {
    const unsubProducts = subscribeToProducts(
      (newProducts) => {
        setProducts(newProducts);
        setProductsLoading(false);
        setProductsError(null);
      },
      (err) => {
        console.error('Erro no listener de produtos:', err);
        setProductsLoading(false);
        setProductsError(err);
      }
    );

    const unsubSettings = subscribeToBrandSettings(
      (newSettings) => {
        setBrandSettings(newSettings);
      },
      (err) => {
        console.warn('Erro nas configurações da marca:', err);
      }
    );

    return () => {
      unsubProducts();
      unsubSettings();
    };
  }, []);

  // CRUD Actions
  const handleSaveProduct = async (data: ProductFormData) => {
    if (productToEdit) {
      await updateProduct(productToEdit.id, data);
      addToast(
        `O produto "${data.nome}" foi atualizado com sucesso no catálogo.`,
        'success',
        'Produto Atualizado'
      );
    } else {
      await addProduct(data);
      addToast(
        `O produto "${data.nome}" foi cadastrado e já está visível na vitrine.`,
        'success',
        'Produto Cadastrado'
      );
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      await toggleProductAvailability(product.id, product.disponivel);
      const newStatus = !product.disponivel ? 'Disponível' : 'Sob Encomenda';
      addToast(
        `Status de "${product.nome}" alterado para ${newStatus}.`,
        'info',
        'Disponibilidade Alterada'
      );
    } catch (err: any) {
      addToast(
        'Não foi possível alterar a disponibilidade.',
        'error',
        'Erro ao Atualizar'
      );
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      addToast('O produto foi removido permanentemente do catálogo.', 'success', 'Produto Excluído');
    } catch (err: any) {
      addToast('Não foi possível excluir o produto.', 'error', 'Erro ao Excluir');
      throw err;
    }
  };

  const handleSaveBrandSettings = async (newSettings: BrandSettings) => {
    try {
      await saveBrandSettings(newSettings);
      addToast(
        'As informações da marca e número do WhatsApp foram atualizadas.',
        'success',
        'Configurações Salvas'
      );
    } catch (err: any) {
      addToast('Erro ao salvar configurações da marca.', 'error', 'Falha no Firestore');
      throw err;
    }
  };

  const handleSeedData = async () => {
    try {
      const count = await seedInitialProducts();
      addToast(
        `${count} produtos de amostra foram inseridos com sucesso no Firestore!`,
        'success',
        'Catálogo Semeado'
      );
    } catch (err: any) {
      addToast(
        'Falha ao semear produtos. Verifique suas permissões de administrador.',
        'error',
        'Erro ao Semear'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C2926] flex flex-col font-sans selection:bg-[#233428] selection:text-white">
      {/* Toast Feedbacks */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Main Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        brandSettings={brandSettings}
        onOpenAdminLogin={() => setAdminLoginOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'admin' && isAdmin ? (
          <AdminDashboard
            products={products}
            brandSettings={brandSettings}
            onOpenAddModal={() => {
              setProductToEdit(null);
              setProductFormModalOpen(true);
            }}
            onOpenEditModal={(product) => {
              setProductToEdit(product);
              setProductFormModalOpen(true);
            }}
            onOpenDeleteModal={(product) => {
              setProductToDelete(product);
              setDeleteConfirmModalOpen(true);
            }}
            onToggleAvailability={handleToggleAvailability}
            onOpenSettingsModal={() => setBrandSettingsModalOpen(true)}
            onSeedInitialData={handleSeedData}
            onNavigateToPublic={() => setCurrentView('public')}
          />
        ) : (
          <>
            <Hero brandSettings={brandSettings} />
            <ProductCatalog
              products={products}
              brandSettings={brandSettings}
              loading={productsLoading}
              error={productsError}
              onOpenDetails={(p) => setProductDetailsModal(p)}
              onRetry={() => window.location.reload()}
            />
            <AboutSection brandSettings={brandSettings} />
            <ContactSection brandSettings={brandSettings} />
            <Footer
              brandSettings={brandSettings}
              onOpenAdmin={() => {
                if (isAdmin) setCurrentView('admin');
                else setAdminLoginOpen(true);
              }}
            />
          </>
        )}
      </main>

      {/* Admin Login Dialog */}
      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={() => {
          setAdminLoginOpen(false);
          setCurrentView('admin');
          addToast('Login realizado com sucesso. Bem-vindo ao painel!', 'success', 'Conectado');
        }}
      />

      {/* Product Details Modal (Public view) */}
      <ProductModal
        product={productDetailsModal}
        brandSettings={brandSettings}
        onClose={() => setProductDetailsModal(null)}
        onToast={(msg) => addToast(msg, 'info')}
      />

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={productFormModalOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setProductFormModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirmModalOpen}
        product={productToDelete}
        onClose={() => {
          setDeleteConfirmModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteProduct}
      />

      {/* Brand Settings & WhatsApp Modal */}
      <BrandSettingsModal
        isOpen={brandSettingsModalOpen}
        settings={brandSettings}
        onClose={() => setBrandSettingsModalOpen(false)}
        onSave={handleSaveBrandSettings}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
