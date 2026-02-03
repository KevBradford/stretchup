import firestore from '@react-native-firebase/firestore';
import { Routine, Stretch, RoutineFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';

function routinesCollection(userId: string) {
  return firestore().collection('users').doc(userId).collection('routines');
}

export function subscribeToRoutines(
  userId: string,
  callback: (routines: Routine[]) => void,
  onError: (error: Error) => void
) {
  return routinesCollection(userId)
    .orderBy('order', 'asc')
    .onSnapshot(
      (snapshot) => {
        const routines: Routine[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
  return routinesCollection(userId)
    .doc(routineId)
    .onSnapshot(
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as Routine);
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
  const routinesSnapshot = await routinesCollection(userId)
    .orderBy('order', 'desc')
    .limit(1)
    .get();

  const maxOrder = routinesSnapshot.empty
    ? 0
    : (routinesSnapshot.docs[0].data().order ?? 0) + 1;

  const stretches = data.stretches.map((s, index) => ({
    ...s,
    id: s.id || uuidv4(),
    order: index,
  }));

  const doc = await routinesCollection(userId).add({
    name: data.name,
    color: data.color,
    order: maxOrder,
    createdAt: firestore.FieldValue.serverTimestamp(),
    updatedAt: firestore.FieldValue.serverTimestamp(),
    stretches,
  });

  return doc.id;
}

export async function updateRoutine(
  userId: string,
  routineId: string,
  data: Partial<RoutineFormData>
) {
  const updateData: Record<string, unknown> = {
    updatedAt: firestore.FieldValue.serverTimestamp(),
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

  await routinesCollection(userId).doc(routineId).update(updateData);
}

export async function deleteRoutine(userId: string, routineId: string) {
  await routinesCollection(userId).doc(routineId).delete();
}

export async function reorderRoutines(
  userId: string,
  orderedIds: string[]
) {
  const batch = firestore().batch();

  orderedIds.forEach((id, index) => {
    const ref = routinesCollection(userId).doc(id);
    batch.update(ref, { order: index, updatedAt: firestore.FieldValue.serverTimestamp() });
  });

  await batch.commit();
}
