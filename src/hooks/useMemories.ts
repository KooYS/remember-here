import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type { Memory, MemoryInput } from '../types/memory';

const COLLECTION = 'memories';

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Memory);
      setMemories(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const addMemory = useCallback(async (input: MemoryInput) => {
    let photoUrl = input.photo;

    if (input.photo && input.photo.startsWith('data:')) {
      const storageRef = ref(storage, `photos/${Date.now()}.jpg`);
      await uploadString(storageRef, input.photo, 'data_url');
      photoUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, COLLECTION), {
      ...input,
      photo: photoUrl,
    });
  }, []);

  const deleteMemory = useCallback(async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  }, []);

  return { memories, loading, addMemory, deleteMemory };
}
