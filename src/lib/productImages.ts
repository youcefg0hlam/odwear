import { deleteObject, getDownloadURL, ref, uploadString } from 'firebase/storage';
import { isFirebaseConfigured, storage } from './firebase';

/** Upload a base64 data URL to Firebase Storage and return its public URL. */
export const uploadProductImage = async (dataUrl: string, productId: string): Promise<string> => {
  if (!isFirebaseConfigured || !storage || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  const imageRef = ref(storage, `products/${productId}.jpg`);
  await uploadString(imageRef, dataUrl, 'data_url', { contentType: 'image/jpeg' });
  return getDownloadURL(imageRef);
};

/** Remove a product image from Firebase Storage (best effort). */
export const deleteProductImage = async (productId: string): Promise<void> => {
  if (!isFirebaseConfigured || !storage) return;

  try {
    await deleteObject(ref(storage, `products/${productId}.jpg`));
  } catch {
    // Missing images are fine - the product was still removed.
  }
};
