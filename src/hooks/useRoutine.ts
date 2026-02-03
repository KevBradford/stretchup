import { useState, useEffect } from 'react';
import { Routine } from '../types';
import { subscribeToRoutine } from '../services/firestore';

export function useRoutine(userId: string | undefined, routineId: string | undefined) {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !routineId) {
      setRoutine(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToRoutine(
      userId,
      routineId,
      (data) => {
        setRoutine(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId, routineId]);

  return { routine, loading, error };
}
