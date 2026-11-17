'use client';

import {
  useState,
  // useEffect,
  useCallback,
  useMemo,
} from 'react';

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  // onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

export default function useFirebaseCRUD(
  collectionName,
  {
    realtime = true,
    orderField = 'created_at',
    orderDirection = 'desc',
  } = {}
) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Collection Reference
  const collectionRef = useMemo(
    () => collection(db, collectionName),
    [collectionName]
  );

  // Query Reference
  const queryRef = useMemo(
    () =>
      orderField
        ? query(
            collectionRef,
            orderBy(orderField, orderDirection)
          )
        : collectionRef,
    [collectionRef, orderField, orderDirection]
  );

  // Snapshot -> Array
  const mapSnapshot = useCallback((snapshot) => {
    return snapshot.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
  }, []);

  // READ - 전체 조회
  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const snapshot = await getDocs(queryRef);
      const result = mapSnapshot(snapshot);

      setData(result);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [queryRef, mapSnapshot]);

  // READ - 단건 조회
  const getById = useCallback(
    async (id) => {
      try {
        setError(null);

        const docRef = doc(db, collectionName, id);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
          return null;
        }

        return {
          ...snapshot.data(),
          id: snapshot.id,
        };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [collectionName]
  );

  // // 실시간 데이터 조회
  // useEffect(() => {
  //   if (!realtime) {
  //     getAll();
  //     // .catch(console.error);
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);

  //   const unsubscribe = onSnapshot(
  //     queryRef,
  //     (snapshot) => {
  //       setData(mapSnapshot(snapshot));
  //       setLoading(false);
  //     },
  //     (err) => {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   );

  //   return () => unsubscribe();
  // }, [realtime, queryRef, getAll, mapSnapshot]);

  // 공통 저장 처리
  const executeMutation = useCallback(
    async (callback) => {
      try {
        setSaving(true);
        setError(null);

        const result = await callback();

        // 실시간 조회를 사용하지 않는 경우 재조회
        if (!realtime) {
          await getAll();
        }

        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [realtime, getAll]
  );

  // CREATE
  const create = useCallback(
    (values) =>
      executeMutation(async () => {
        const docRef = await addDoc(collectionRef, {
          ...values,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });

        return docRef.id;
      }),
    [collectionRef, executeMutation]
  );

  // UPDATE
  const update = useCallback(
    (id, values) =>
      executeMutation(async () => {
        const docRef = doc(db, collectionName, id);

        await updateDoc(docRef, {
          ...values,
          updated_at: serverTimestamp(),
        });

        return id;
      }),
    [collectionName, executeMutation]
  );

  // DELETE
  const remove = useCallback(
    (id) =>
      executeMutation(async () => {
        const docRef = doc(db, collectionName, id);

        await deleteDoc(docRef);

        return id;
      }),
    [collectionName, executeMutation]
  );

  // CREATE or UPDATE
  const save = useCallback(
    (values, id = null) => {
      return id
        ? update(id, values)
        : create(values);
    },
    [create, update]
  );

  // 에러 초기화
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    saving,
    error,

    getAll,
    getById,

    create,
    update,
    remove,
    save,

    refresh: getAll,
    clearError,
  };
}
