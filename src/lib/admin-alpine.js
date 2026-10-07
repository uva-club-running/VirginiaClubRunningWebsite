// Imported only by the admin page: public pages do not load Alpine or Firebase.
import Alpine from 'alpinejs';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase.js';
import { adminRequest } from './admin-client.js';
import { createAdminSession } from './admin-session.js';
import { createContentForm } from './admin-forms.js';

Alpine.data('adminSession', () => createAdminSession({
  observeAuth: callback => onAuthStateChanged(auth, callback),
  signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  signOut: () => signOut(auth),
  request: adminRequest,
}));
Alpine.data('contentForm', (collection, operation = 'create') => createContentForm(collection, operation, adminRequest));
Alpine.start();
