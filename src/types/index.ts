export interface Stretch {
  id: string;
  name: string;
  durationSeconds: number;
  mediaUrl: string | null;
  mediaType: 'image' | 'gif' | 'video' | null;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  color: string;
  order: number;
  createdAt: unknown;
  updatedAt: unknown;
  stretches: Stretch[];
}

export interface RoutineFormData {
  name: string;
  color: string;
  stretches: Stretch[];
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export type PlayerState = 'idle' | 'playing' | 'paused' | 'finished';
