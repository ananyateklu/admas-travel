import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

declare module './firebase' {
    export const auth: Auth;
    export const db: Firestore;
    export const app: FirebaseApp;
} 