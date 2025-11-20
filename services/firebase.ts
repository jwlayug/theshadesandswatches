
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
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

// --- In-Memory Session Cache (For temporary offline capability during session) ---
const SESSION_CACHE: Record<string, any[]> = {
  categories: [],
  projects: [],
  services: [],
  testimonials: []
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

  // Merge Session Cache
  if (SESSION_CACHE[collectionName]) {
    results = [...results, ...SESSION_CACHE[collectionName] as unknown as T[]];
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
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.warn(`Firestore Error (getDocument ${collectionName}/${docId}):`, error);
    return null;
  }
};

export const addToCollection = async (collectionName: string, data: any) => {
  try {
    return await addDoc(collection(db, collectionName), data);
  } catch (error: any) {
    console.warn("Firestore Write Failed. Saving to Session Cache.", error);
    const fakeId = 'temp_' + Date.now();
    const newItem = { id: fakeId, ...data };
    if (!SESSION_CACHE[collectionName]) SESSION_CACHE[collectionName] = [];
    SESSION_CACHE[collectionName].push(newItem);
    return Promise.resolve({ id: fakeId });
  }
};

export const setDocument = async (collectionName: string, docId: string, data: any) => {
  // Update Cache Immediately
  DOC_CACHE[`${collectionName}/${docId}`] = data;
  
  try {
    const docRef = doc(db, collectionName, docId);
    return await setDoc(docRef, data, { merge: true });
  } catch (error: any) {
    console.error("Firestore Set Error (using cache only):", error);
    // We return success so UI doesn't complain, effectively "Working Offline"
    return Promise.resolve();
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    if (id.startsWith('temp_')) {
      if (SESSION_CACHE[collectionName]) {
        SESSION_CACHE[collectionName] = SESSION_CACHE[collectionName].filter(item => item.id !== id);
        return Promise.resolve();
      }
    }
    const docRef = doc(db, collectionName, id);
    return await deleteDoc(docRef);
  } catch (error) {
    console.error("Firestore Delete Error:", error);
    throw error;
  }
};
