import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Category } from '../types';

const CATEGORIES_COLLECTION = 'categories';

export const INITIAL_DEFAULT_CATEGORIES = [
  'Velas Botânicas',
  'Aromaterapia',
  'Cerâmica Artesanal',
  'Autocuidado',
];

export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('nome', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const categories: Category[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          nome: data.nome || '',
          createdAt: data.createdAt,
        };
      });
      onUpdate(categories);
    },
    (error) => {
      console.error('Erro ao ouvir categorias do Firestore:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, CATEGORIES_COLLECTION);
    }
  );
}

export async function addCategory(nome: string): Promise<string> {
  const cleanName = nome.trim();
  if (cleanName.length < 2) {
    throw new Error('O nome da categoria deve ter pelo menos 2 caracteres.');
  }
  if (cleanName.length > 60) {
    throw new Error('O nome da categoria deve ter no máximo 60 caracteres.');
  }

  const docRef = doc(collection(db, CATEGORIES_COLLECTION));
  const payload = {
    nome: cleanName,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${CATEGORIES_COLLECTION}/${docRef.id}`);
  }
}

export async function ensureDefaultCategories(existingProductCategories: string[] = []): Promise<void> {
  // Merge default categories with any category used by existing products
  const allNeeded = new Set<string>();
  INITIAL_DEFAULT_CATEGORIES.forEach((cat) => allNeeded.add(cat));
  existingProductCategories.forEach((cat) => {
    if (cat && cat.trim()) allNeeded.add(cat.trim());
  });

  for (const catName of Array.from(allNeeded)) {
    try {
      await addCategory(catName);
    } catch (err) {
      console.warn('Categoria já existente ou erro ao inicializar:', catName, err);
    }
  }
}
