import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import app from './firebase';
import { Routine, RoutineFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

const db = getFirestore(app);

function routinesCollection(userId: string) {
  return collection(db, 'users', userId, 'routines');
}

function routineDoc(userId: string, routineId: string) {
  return doc(db, 'users', userId, 'routines', routineId);
}

export function subscribeToRoutines(
  userId: string,
  callback: (routines: Routine[]) => void,
  onError: (error: Error) => void
) {
  const q = query(routinesCollection(userId), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const routines: Routine[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Routine[];
      callback(routines);
    },
    onError
  );
}

export function subscribeToRoutine(
  userId: string,
  routineId: string,
  callback: (routine: Routine | null) => void,
  onError: (error: Error) => void
) {
  return onSnapshot(
    routineDoc(userId, routineId),
    (d) => {
      if (d.exists()) {
        callback({ id: d.id, ...d.data() } as Routine);
      } else {
        callback(null);
      }
    },
    onError
  );
}

export async function createRoutine(
  userId: string,
  data: RoutineFormData
): Promise<string> {
  const q = query(
    routinesCollection(userId),
    orderBy('order', 'desc'),
    limit(1)
  );
  const routinesSnapshot = await getDocs(q);

  const maxOrder = routinesSnapshot.empty
    ? 0
    : (routinesSnapshot.docs[0].data().order ?? 0) + 1;

  const stretches = data.stretches.map((s, index) => ({
    ...s,
    id: s.id || uuidv4(),
    order: index,
  }));

  const docRef = await addDoc(routinesCollection(userId), {
    name: data.name,
    color: data.color,
    order: maxOrder,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stretches,
  });

  return docRef.id;
}

export async function updateRoutine(
  userId: string,
  routineId: string,
  data: Partial<RoutineFormData>
) {
  const updateData: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.stretches !== undefined) {
    updateData.stretches = data.stretches.map((s, index) => ({
      ...s,
      id: s.id || uuidv4(),
      order: index,
    }));
  }

  await updateDoc(routineDoc(userId, routineId), updateData);
}

export async function deleteRoutine(userId: string, routineId: string) {
  await deleteDoc(routineDoc(userId, routineId));
}

export async function reorderRoutines(
  userId: string,
  orderedIds: string[]
) {
  const batch = writeBatch(db);

  orderedIds.forEach((id, index) => {
    const ref = routineDoc(userId, id);
    batch.update(ref, { order: index, updatedAt: serverTimestamp() });
  });

  await batch.commit();
}
