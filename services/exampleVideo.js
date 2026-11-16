import { db } from '@/lib/firebase';

import {
  collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore';

const exampleCollectionName = 'videos';

const exampleCollection = collection(db, exampleCollectionName);

// CREATE
export const createVideo = async (data) => {
  return await addDoc(exampleCollection, {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
};

// READ - 실시간 조회
export const subscribeVideos = (callback, onError) => {
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
export const updateVideo = async (id, data) => {
  return await updateDoc(doc(db, exampleCollectionName, id), {
    ...data,
    updated_at: serverTimestamp(),
  });
};

// DELETE
export const deleteVideo = async (id) => {
  return await deleteDoc(doc(db, exampleCollectionName, id));
};
