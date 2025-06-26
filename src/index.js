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

// Add debugging wrapper
function DebugWrapper({ children }) {
  React.useEffect(() => {
    console.log('DebugWrapper: Component mounted');
    
    // Listen for Clerk events
    const handleClerkReady = () => {
      console.log('Clerk: Ready event fired');
    };
    
    const handleUserChanged = (user) => {
      console.log('Clerk: User changed', user ? 'User exists' : 'No user', user?.id);
    };
    
    const handleSessionChanged = (session) => {
      console.log('Clerk: Session changed', session ? 'Session exists' : 'No session', session?.id);
    };
    
    // More comprehensive event listening
    window.addEventListener('clerk:ready', handleClerkReady);
    window.addEventListener('clerk:user', handleUserChanged);
    window.addEventListener('clerk:session', handleSessionChanged);
    
    // Also check if Clerk is already loaded
    if (window.Clerk) {
      console.log('Clerk already available:', {
        user: window.Clerk.user ? 'User exists' : 'No user',
        session: window.Clerk.session ? 'Session exists' : 'No session'
      });
    }
    
    return () => {
      window.removeEventListener('clerk:ready', handleClerkReady);
      window.removeEventListener('clerk:user', handleUserChanged);
      window.removeEventListener('clerk:session', handleSessionChanged);
    };
  }, []);
  
  return children;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <DebugWrapper>
        <App />
      </DebugWrapper>
    </ClerkProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
