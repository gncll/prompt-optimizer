import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react';

// Import your Clerk Publishable Key - check REACT_APP_ first for React apps
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(`Missing Publishable Key. 
    Please set REACT_APP_CLERK_PUBLISHABLE_KEY in your environment variables.
    Current env keys: ${Object.keys(process.env).filter(key => key.includes('CLERK')).join(', ')}`)
}

console.log('Clerk Environment Check:', {
  hasReactKey: !!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY,
  hasNextKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  usingKey: PUBLISHABLE_KEY?.substring(0, 20) + '...',
  allClerkKeys: Object.keys(process.env).filter(key => key.includes('CLERK'))
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
