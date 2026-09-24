import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, ProductFormData } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';

const PRODUCTS_COLLECTION = 'products';

export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const products: Product[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          nome: data.nome || '',
          descricao: data.descricao || '',
          descricaoCurta: data.descricaoCurta || '',
          preco: typeof data.preco === 'number' ? data.preco : parseFloat(data.preco) || 0,
          imagem: data.imagem || '',
          disponivel: data.disponivel !== false,
          categoria: data.categoria || 'Geral',
          destaque: Boolean(data.destaque),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
      onUpdate(products);
    },
    (error) => {
      console.error('Erro ao ouvir produtos do Firestore:', error);
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
    }
  );
}

export async function addProduct(data: ProductFormData): Promise<string> {
  const docRef = doc(collection(db, PRODUCTS_COLLECTION));
  const productPayload = {
    nome: data.nome.trim(),
    descricao: data.descricao.trim(),
    descricaoCurta: (data.descricaoCurta || '').trim(),
    preco: Number(data.preco),
    imagem: data.imagem.trim(),
    disponivel: Boolean(data.disponivel),
    categoria: (data.categoria || 'Geral').trim(),
    destaque: Boolean(data.destaque),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, productPayload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${PRODUCTS_COLLECTION}/${docRef.id}`);
  }
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const updatePayload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (data.nome !== undefined) updatePayload.nome = data.nome.trim();
  if (data.descricao !== undefined) updatePayload.descricao = data.descricao.trim();
  if (data.descricaoCurta !== undefined) updatePayload.descricaoCurta = data.descricaoCurta.trim();
  if (data.preco !== undefined) updatePayload.preco = Number(data.preco);
  if (data.imagem !== undefined) updatePayload.imagem = data.imagem.trim();
  if (data.disponivel !== undefined) updatePayload.disponivel = Boolean(data.disponivel);
  if (data.categoria !== undefined) updatePayload.categoria = data.categoria.trim();
  if (data.destaque !== undefined) updatePayload.destaque = Boolean(data.destaque);

  try {
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function toggleProductAvailability(id: string, currentStatus: boolean): Promise<void> {
  return updateProduct(id, { disponivel: !currentStatus });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

export async function seedInitialProducts(): Promise<number> {
  let count = 0;
  for (const item of INITIAL_PRODUCTS) {
    await addProduct({
      nome: item.nome,
      descricao: item.descricao,
      descricaoCurta: item.descricaoCurta,
      preco: item.preco,
      imagem: item.imagem,
      disponivel: item.disponivel,
      categoria: item.categoria,
      destaque: item.destaque,
    });
    count++;
  }
  return count;
}
