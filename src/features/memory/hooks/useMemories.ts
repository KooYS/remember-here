import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../shared/lib/firebase';
import type { Memory, MemoryInput } from '../types';

const COLLECTION = 'memories';
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTION),
      orderBy('createdAt', 'desc'),
      firestoreLimit(100),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Memory[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            photo: data.photo ?? null,
            text: data.text ?? '',
            link: data.link ?? '',
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            address: data.address ?? '',
            createdAt: data.createdAt ?? '',
          };
        });
        setMemories(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Firestore 구독 에러:', err);
        setError('데이터를 불러올 수 없습니다.');
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const addMemory = useCallback(async (input: MemoryInput) => {
    let photoUrl = input.photo;

    if (input.photo && input.photo.startsWith('data:')) {
      const base64Length = input.photo.length * 0.75;
      if (base64Length > MAX_PHOTO_BYTES) {
        throw new Error('이미지 크기는 5MB를 초과할 수 없습니다.');
      }

      const storageRef = ref(storage, `photos/${crypto.randomUUID()}.jpg`);
      await uploadString(storageRef, input.photo, 'data_url');
      photoUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, COLLECTION), {
      text: input.text,
      link: input.link ?? '',
      latitude: input.latitude,
      longitude: input.longitude,
      address: input.address,
      photo: photoUrl ?? null,
      createdAt: input.createdAt,
    });
  }, []);

  const deleteMemory = useCallback(async (id: string) => {
    await deleteDoc(doc(db, COLLECTION, id));
  }, []);

  return { memories, loading, error, addMemory, deleteMemory };
}
