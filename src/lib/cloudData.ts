import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { INITIAL_PRODUCTS } from '../data/products';
import type { Order, OrderStatus, Product } from '../types';
import { db, isFirebaseConfigured } from './firebase';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

/** Live-subscribe to the shared product catalogue. Returns an unsubscribe function. */
export const subscribeToProducts = (onData: (products: Product[]) => void): (() => void) => {
  if (!isFirebaseConfigured || !db) return () => undefined;

  return onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => onData(snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as Product)),
    (error) => console.error('Erreur de lecture des produits:', error)
  );
};

/** Live-subscribe to shared orders so the admin sees orders from every device. */
export const subscribeToOrders = (onData: (orders: Order[]) => void): (() => void) => {
  if (!isFirebaseConfigured || !db) return () => undefined;

  return onSnapshot(
    collection(db, ORDERS_COLLECTION),
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as Order);
      onData(orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    },
    (error) => console.error('Erreur de lecture des commandes:', error)
  );
};

/** One-time seed of the starter catalogue. Called only after admin login. */
export const seedProductsIfEmpty = async (): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;

  const firestore = db;
  const existing = await getDocs(collection(firestore, PRODUCTS_COLLECTION));
  if (!existing.empty) return;

  const batch = writeBatch(firestore);
  INITIAL_PRODUCTS.forEach((product) => {
    batch.set(doc(firestore, PRODUCTS_COLLECTION, product.id), product);
  });
  await batch.commit();
};

export const saveProduct = async (product: Product): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
};

export const patchProduct = async (id: string, changes: Partial<Product>): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), changes);
};

export const removeProductDoc = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
};

export const saveOrder = async (order: Order): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
};

export const patchOrder = async (id: string, status: OrderStatus): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  await updateDoc(doc(db, ORDERS_COLLECTION, id), { status });
};
