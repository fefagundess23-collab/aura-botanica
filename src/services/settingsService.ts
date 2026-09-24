import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { BrandSettings } from '../types';
import { DEFAULT_BRAND_SETTINGS } from '../data/initialData';

const SETTINGS_DOC_PATH = 'settings/brand';

export function subscribeToBrandSettings(
  onUpdate: (settings: BrandSettings) => void,
  onError?: (error: Error) => void
) {
  const docRef = doc(db, 'settings', 'brand');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate({
          brandName: data.brandName || DEFAULT_BRAND_SETTINGS.brandName,
          tagline: data.tagline || DEFAULT_BRAND_SETTINGS.tagline,
          whatsappNumber: data.whatsappNumber || DEFAULT_BRAND_SETTINGS.whatsappNumber,
          whatsappMessage: data.whatsappMessage || DEFAULT_BRAND_SETTINGS.whatsappMessage,
          instagramHandle: data.instagramHandle || DEFAULT_BRAND_SETTINGS.instagramHandle,
          aboutText: data.aboutText || DEFAULT_BRAND_SETTINGS.aboutText,
          emailContact: data.emailContact || DEFAULT_BRAND_SETTINGS.emailContact,
          cityState: data.cityState || DEFAULT_BRAND_SETTINGS.cityState,
          updatedAt: data.updatedAt,
        });
      } else {
        onUpdate(DEFAULT_BRAND_SETTINGS);
      }
    },
    (error) => {
      console.warn('Configurações da marca ainda não criadas no Firestore, usando padrão:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, SETTINGS_DOC_PATH);
    }
  );
}

export async function saveBrandSettings(settings: BrandSettings): Promise<void> {
  const docRef = doc(db, 'settings', 'brand');
  try {
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SETTINGS_DOC_PATH);
  }
}
