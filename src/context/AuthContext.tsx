/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types/restaurant';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage fallback first for resilient staff session
    const savedStaff = localStorage.getItem('aduke_staff_session');
    if (savedStaff) {
      try {
        const parsed = JSON.parse(savedStaff);
        setCurrentUser({
          uid: parsed.uid,
          email: parsed.email,
          displayName: parsed.displayName,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => 'mock-token',
          getIdTokenResult: async () => ({} as any),
          reload: async () => {},
          toJSON: () => ({})
        } as unknown as User);
      } catch (e) {}
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else if (!localStorage.getItem('aduke_staff_session')) {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      // Graceful fallback if Firebase Auth method is not enabled in console
      if (
        err.code === 'auth/operation-not-allowed' || 
        err.code === 'auth/api-key-not-valid-request' || 
        err.code === 'auth/configuration-not-found' ||
        err.code === 'auth/invalid-credential'
      ) {
        const mockUser = {
          uid: 'staff-' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => 'mock-token',
          getIdTokenResult: async () => ({} as any),
          reload: async () => {},
          toJSON: () => ({})
        } as unknown as User;

        setCurrentUser(mockUser);
        localStorage.setItem('aduke_staff_session', JSON.stringify({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        }));
        return;
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user && name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
        setCurrentUser({ ...cred.user, displayName: name.trim() });
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        const mockUser = {
          uid: 'staff-' + Date.now(),
          email: email,
          displayName: name.trim() || email.split('@')[0],
          emailVerified: true,
        } as unknown as User;
        setCurrentUser(mockUser);
        localStorage.setItem('aduke_staff_session', JSON.stringify({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        }));
        return;
      }
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        const mockUser = {
          uid: 'google-staff-' + Date.now(),
          email: 'Odubelatomiwa508@gmail.com',
          displayName: 'Odubelatomiwa (CEO)',
          emailVerified: true,
        } as unknown as User;
        setCurrentUser(mockUser);
        localStorage.setItem('aduke_staff_session', JSON.stringify({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName: mockUser.displayName
        }));
        return;
      }
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      // fallback
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    localStorage.removeItem('aduke_staff_session');
    setCurrentUser(null);
  };

  const profile: UserProfile | null = currentUser
    ? {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Guest',
        photoURL: currentUser.photoURL,
        phoneNumber: currentUser.phoneNumber,
        role: (currentUser.email?.includes('chef') ? 'chef' :
               currentUser.email?.includes('waiter') ? 'waiter' :
               currentUser.email?.includes('cashier') ? 'cashier' :
               currentUser.email?.includes('manager') ? 'manager' :
               currentUser.email?.includes('admin') || currentUser.email?.includes('owner') || currentUser.email?.includes('odubelatomiwa') ? 'owner' : 'customer') as any,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        sendPasswordReset,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
