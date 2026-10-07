import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseConfig } from './lib/firebase-config.js';

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
