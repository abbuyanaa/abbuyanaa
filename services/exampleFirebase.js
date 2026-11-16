import { db } from '@/lib/firebase';

import {
  collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';

const exampleCollectionName = 'example';

const exampleCollection = collection(db, exampleCollectionName);

// CREATE
export const createExample = async (data) => {
  return await addDoc(exampleCollection, {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
};

// READ - 실시간 조회
export const subscribeExamples = (callback, onError) => {
  const q = query(
    exampleCollection,
    orderBy('created_at', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const examples = snapshot.docs.map((item) => ({
        ...item.data(),
        id: item.id,
      }));

      callback(examples);
    },
    onError
  );
};

// UPDATE
export const updateExample = async (id, data) => {
  return await updateDoc(doc(db, exampleCollectionName, id), {
    ...data,
    updated_at: serverTimestamp(),
  });
};

// DELETE
export const deleteExample = async (id) => {
  return await deleteDoc(doc(db, exampleCollectionName, id));
};
