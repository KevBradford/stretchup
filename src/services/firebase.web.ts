import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCnnGkBXg0KFT66FGY5dCyTUPgrah2nw4g',
  authDomain: 'stretchup-a143c.firebaseapp.com',
  projectId: 'stretchup-a143c',
  storageBucket: 'stretchup-a143c.firebasestorage.app',
  messagingSenderId: '126966797223',
  appId: '1:126966797223:web:95520e13c611d9925ddc82',
  measurementId: 'G-6WW46DKPM3',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
