import { useState, useEffect } from 'react';
import { Routine } from '../types';
import { subscribeToRoutines } from '../services/firestore';

export function useRoutines(userId: string | undefined) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setRoutines([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToRoutines(
      userId,
      (data) => {
        setRoutines(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { routines, loading, error };
}
