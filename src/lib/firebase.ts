import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  Auth,
  User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'wooriban1.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'wooriban1',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'wooriban1.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

if (typeof window !== 'undefined') {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
  }
}

export { app, auth, googleProvider };

export const getFirebaseAuth = (): Auth | null => {
  if (!auth && typeof window !== 'undefined') {
    try {
      app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
      auth = getAuth(app);
    } catch (err) {
      console.warn('getFirebaseAuth init failed:', err);
    }
  }
  return auth;
};

/**
 * Friendly Error Message Formatter for Firebase Auth errors
 */
export function formatAuthError(errorCode: string, defaultMsg: string = ''): string {
  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return 'Firebase 콘솔의 [Authentication > Settings > 승인된 도메인]에 현재 도메인이 등록되어 있지 않습니다. hanup-platform.vercel.app 을 추가해 주세요.';
    case 'auth/user-not-found':
      return '등록되지 않은 이메일 계정입니다. [회원가입] 탭에서 새로 등록해 주세요.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.';
    case 'auth/email-already-in-use':
      return '이미 가입된 이메일 계정입니다. [로그인] 탭을 이용해 주세요.';
    case 'auth/weak-password':
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    case 'auth/invalid-email':
      return '올바른 이메일 형식이 아닙니다 (예: student@example.com).';
    case 'auth/popup-closed-by-user':
      return '구글 로그인 창이 닫혔습니다. 다시 시도해 주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결이 불안정합니다. 인터넷 연결을 확인해 주세요.';
    case 'auth/operation-not-allowed':
      return 'Firebase 콘솔의 [Authentication > Sign-in method]에서 해당 로그인 제공자(Google 또는 이메일/비밀번호)가 활성화되어 있지 않습니다.';
    default:
      return defaultMsg || '인증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  }
}

/**
 * 1. Google 1-Click Popup Login
 */
export async function signInWithGoogle(): Promise<{
  user: FirebaseUser | null;
  error?: string;
}> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    return { user: null, error: 'Firebase 인증 시스템이 초기화되지 않았습니다.' };
  }
  try {
    const result = await signInWithPopup(currentAuth, googleProvider);
    return { user: result.user };
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    return { user: null, error: formatAuthError(err.code, err.message) };
  }
}

/**
 * 2. Email / Password Login
 */
export async function signInWithEmail(
  email: string,
  pass: string
): Promise<{ user: FirebaseUser | null; error?: string }> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    return { user: null, error: 'Firebase 인증 시스템이 초기화되지 않았습니다.' };
  }
  try {
    const result = await signInWithEmailAndPassword(currentAuth, email.trim(), pass);
    return { user: result.user };
  } catch (err: any) {
    console.error('Email Sign-In Error:', err);
    return { user: null, error: formatAuthError(err.code, err.message) };
  }
}

/**
 * 3. Email / Password Registration
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<{ user: FirebaseUser | null; error?: string }> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    return { user: null, error: 'Firebase 인증 시스템이 초기화되지 않았습니다.' };
  }
  try {
    const result = await createUserWithEmailAndPassword(currentAuth, email.trim(), pass);
    if (displayName.trim()) {
      await updateProfile(result.user, { displayName: displayName.trim() });
    }
    return { user: result.user };
  } catch (err: any) {
    console.error('Email Sign-Up Error:', err);
    return { user: null, error: formatAuthError(err.code, err.message) };
  }
}

/**
 * 4. Sign Out
 */
export async function logOut(): Promise<{ success: boolean; error?: string }> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) return { success: true };
  try {
    await signOut(currentAuth);
    return { success: true };
  } catch (err: any) {
    console.error('Sign Out Error:', err);
    return { success: false, error: err.message };
  }
}
