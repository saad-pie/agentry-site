import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import configJson from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || configJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || configJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || configJson.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || configJson.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || configJson.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || configJson.appId,
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function formatAuthError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before finishing.';
    case 'auth/popup-blocked':
      return 'Popup was blocked by your browser. Redirecting instead...';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider);
      throw new Error('Redirecting to Google...');
    }
    throw error;
  }
}

export async function checkRedirectResult() {
  try {
    return await getRedirectResult(auth);
  } catch (err) {
    console.error('Error handling redirect login:', err);
    return null;
  }
}

export async function registerWithEmail(email: string, pass: string, name?: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (name && cred.user) {
    await updateProfile(cred.user, { displayName: name });
  }
  return cred.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function provisionChatSession(user: User): Promise<{ ok: boolean; url?: string; error?: string; isNetworkOr404?: boolean }> {
  try {
    const idToken = await user.getIdToken();
    const res = await fetch('https://saadpie1-deepseek-harness.hf.space/api/auth/provision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idToken,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'User',
      }),
    });

    if (res.status === 404) {
      return { ok: false, error: 'Chat service is being set up. Try again shortly.', isNetworkOr404: true };
    }

    if (!res.ok) {
      return { ok: false, error: `Provision server returned status ${res.status}`, isNetworkOr404: res.status >= 500 };
    }

    const data = await res.json();
    if (data.ok && data.url) {
      return { ok: true, url: data.url };
    }
    return { ok: false, error: data.error || 'Provision endpoint returned invalid payload.' };
  } catch (err: any) {
    return {
      ok: false,
      error: 'Chat service is being set up. Try again shortly.',
      isNetworkOr404: true,
    };
  }
}
