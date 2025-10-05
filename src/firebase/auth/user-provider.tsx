'use client';

import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import {
  doc,
  DocumentReference,
  Firestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';

type Plan = 'free' | 'pro' | 'business';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: Plan;
  scansToday: number;
  lastScanDate: string; // ISO string
}

interface UserContextState {
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  recordScan: () => Promise<void>;
}

export const UserContext = createContext<UserContextState | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const createProfile = useCallback(async (user: User) => {
    const userRef = doc(firestore, 'users', user.uid);
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      plan: 'free',
      scansToday: 0,
      lastScanDate: new Date(0).toISOString(),
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }, [firestore]);
  
  useEffect(() => {
    if (!auth) {
      setIsUserLoading(false);
      return;
    }
  
    let profileUnsubscribe: (() => void) | null = null;
  
    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);
  
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }
  
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(firestore, 'users', firebaseUser.uid);
  
        profileUnsubscribe = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const userProfile = docSnap.data() as UserProfile;
             // Reset scans if last scan was not today
            const today = new Date().toISOString().split('T')[0];
            if (userProfile.lastScanDate !== today) {
                userProfile.scansToday = 0;
            }
            setProfile(userProfile);
          } else {
            const newProfile = await createProfile(firebaseUser);
            setProfile(newProfile);
          }
          setIsUserLoading(false);
        });
      } else {
        setUser(null);
        setProfile(null);
        setIsUserLoading(false);
      }
    });
  
    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [auth, firestore, createProfile]);


  const signUp = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await createProfile(userCredential.user);
    return userCredential.user;
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error('auth/email-not-verified');
    }
    return userCredential.user;
  };

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  const recordScan = async (): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    const userRef = doc(firestore, 'users', user.uid);
    const today = new Date().toISOString().split('T')[0];
    
    let newScanCount = 1;
    if (profile && profile.lastScanDate === today) {
        newScanCount = (profile.scansToday || 0) + 1;
    }

    await setDoc(userRef, { 
        scansToday: newScanCount,
        lastScanDate: today,
    }, { merge: true });
  };


  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        isUserLoading,
        signIn,
        signUp,
        signOut,
        sendPasswordReset,
        recordScan,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
