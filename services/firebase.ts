
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// !!! REPLACE WITH YOUR FIREBASE CONFIG !!!
const firebaseConfig = {
  apiKey: "AIzaSyDiRg78OUXfTsGlMX9zf2HB_836fwM1FbQ",
  authDomain: "theshadesandswatches-9f63d.firebaseapp.com",
  projectId: "theshadesandswatches-9f63d",
  storageBucket: "theshadesandswatches-9f63d.firebasestorage.app",
  messagingSenderId: "788643081472",
  appId: "1:788643081472:web:cfa9ba08c4e7824d97d7e5",
  measurementId: "G-LXP7EDTH1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// --- In-Memory Session Cache (For optimistic UI updates & offline capability) ---
const SESSION_CACHE: Record<string, any[]> = {
  categories: [],
  projects: [],
  services: [],
  testimonials: [],
  clients: []
};

const DOC_CACHE: Record<string, any> = {};

// --- Helper Functions ---

export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  let results: T[] = [];
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.warn(`Firestore Error (getCollection ${collectionName}):`, error);
    results = [];
  }

  // Merge Session Cache (items added in this session that might not be in DB yet or if DB failed)
  if (SESSION_CACHE[collectionName]) {
    // Avoid duplicates by ID
    const existingIds = new Set(results.map((r: any) => r.id));
    const sessionItems = SESSION_CACHE[collectionName].filter(item => !existingIds.has(item.id));
    results = [...results, ...sessionItems as unknown as T[]];
  }
  
  return results;
};

export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  // Check Session Doc Cache First (for instant updates on Admin side)
  const cacheKey = `${collectionName}/${docId}`;
  if (DOC_CACHE[cacheKey]) return DOC_CACHE[cacheKey] as T;

  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as T;
      DOC_CACHE[cacheKey] = data; // Cache it
      return data;
    }
    return null;
  } catch (error) {
    console.warn(`Firestore Error (getDocument ${collectionName}/${docId}):`, error);
    return null;
  }
};

export const addToCollection = async (collectionName: string, data: any) => {
  // Optimistically add to session cache
  const fakeId = 'temp_' + Date.now();
  const newItem = { id: fakeId, ...data };
  
  if (!SESSION_CACHE[collectionName]) SESSION_CACHE[collectionName] = [];
  SESSION_CACHE[collectionName].push(newItem);

  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    // Update the cached item with the real ID
    const index = SESSION_CACHE[collectionName].findIndex(item => item.id === fakeId);
    if (index !== -1) {
      SESSION_CACHE[collectionName][index] = { id: docRef.id, ...data };
    }
    return docRef;
  } catch (error: any) {
    console.warn("Firestore Write Failed. Kept in Session Cache.", error);
    return { id: fakeId };
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  // 1. Optimistic Update: Session Cache (Array lists)
  if (SESSION_CACHE[collectionName]) {
    const index = SESSION_CACHE[collectionName].findIndex(item => item.id === docId);
    if (index !== -1) {
      SESSION_CACHE[collectionName][index] = { ...SESSION_CACHE[collectionName][index], ...data };
    }
  }

  // 2. Optimistic Update: Doc Cache (Single docs)
  const cacheKey = `${collectionName}/${docId}`;
  if (DOC_CACHE[cacheKey]) {
    DOC_CACHE[cacheKey] = { ...DOC_CACHE[cacheKey], ...data };
  } else {
    DOC_CACHE[cacheKey] = data;
  }

  // 3. Real Firestore Update
  try {
    const docRef = doc(db, collectionName, docId);
    // We use updateDoc for strict updates, but since we might be dealing with "temp" ids or partial data
    // in a prototype, we'll use setDoc with merge to be safe and robust.
    return await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error("Firestore Update Error:", error);
    // Don't throw, keep optimistic UI state
  }
};

export const setDocument = async (collectionName: string, docId: string, data: any) => {
  // Alias for updateDocument logic for singletons, but implies "Create or Replace"
  return updateDocument(collectionName, docId, data);
};

export const deleteDocument = async (collectionName: string, id: string) => {
  // 1. Optimistic Delete
  if (SESSION_CACHE[collectionName]) {
    SESSION_CACHE[collectionName] = SESSION_CACHE[collectionName].filter(item => item.id !== id);
  }
  delete DOC_CACHE[`${collectionName}/${id}`];

  // 2. Real Firestore Delete
  try {
    if (!id.startsWith('temp_')) {
        const docRef = doc(db, collectionName, id);
        return await deleteDoc(docRef);
    }
  } catch (error) {
    console.error("Firestore Delete Error:", error);
    throw error;
  }
};
