import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react';

// Import your Clerk Publishable Key
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Don't throw error if Clerk key is missing, just log it
if (!PUBLISHABLE_KEY) {
  console.warn('Missing Clerk Publishable Key - authentication features will be disabled');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        navigate={(to) => window.history.pushState(null, '', to)}
      >
        <App />
      </ClerkProvider>
    ) : (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <h1>Missing Clerk Configuration</h1>
        <p>Please configure REACT_APP_CLERK_PUBLISHABLE_KEY environment variable.</p>
        <App />
      </div>
    )}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
