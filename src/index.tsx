import { initializeApp } from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const firebaseConfig = {
    apiKey: 'AIzaSyDLwllUWihlRAe7UBNKa5cFCW7NsO3RGFE',
    authDomain: 'mgs-parents-evening.firebaseapp.com',
    projectId: 'mgs-parents-evening',
    storageBucket: 'mgs-parents-evening.appspot.com',
    messagingSenderId: '852715115216',
    appId: '1:852715115216:web:7a01f9244276bed14304d5',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
