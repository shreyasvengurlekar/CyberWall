
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
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  doc,
  deleteDoc,
  Firestore,
  onSnapshot,
  setDoc,
  collectionGroup,
  query,
  getDocs,
} from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

type Plan = 'free' | 'pro' | 'business';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: Plan;
}

interface UserContextState {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isUserLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateDisplayName: (newName: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const createProfileInFirestore = useCallback(async (user: User) => {
    const userRef = doc(firestore, 'users', user.uid);
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'New User',
      plan: 'free',
    };
    
    // Use non-blocking write with error handling
    setDoc(userRef, newProfile).catch(err => {
      const contextualError = new FirestorePermissionError({
        path: userRef.path,
        operation: 'create',
        requestResourceData: newProfile,
      });
      errorEmitter.emit('permission-error', contextualError);
    });

    return newProfile;
  }, [firestore]);
  
  useEffect(() => {
    if (!auth || !firestore) {
      setIsUserLoading(false);
      return;
    }

    let profileUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);
      if (profileUnsubscribe) profileUnsubscribe();

      if (firebaseUser) {
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const isAdminUser = !!idTokenResult.claims.admin;

        setUser(firebaseUser);
        setIsAdmin(isAdminUser);

        const userRef = doc(firestore, 'users', firebaseUser.uid);
        profileUnsubscribe = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile = await createProfileInFirestore(firebaseUser);
            setProfile(newProfile);
          }
          setIsUserLoading(false);
        }, (error) => {
          console.error("Error fetching user profile:", error);
          const contextualError = new FirestorePermissionError({ path: userRef.path, operation: 'get' });
          errorEmitter.emit('permission-error', contextualError);
          setIsUserLoading(false);
        });

      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setIsUserLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, [auth, firestore, createProfileInFirestore]);


  const signUp = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createProfileInFirestore(userCredential.user);
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
        await firebaseSignOut(auth);
        throw new Error('auth/email-not-verified');
    }
    // Force refresh of token to get latest claims
    await userCredential.user.getIdToken(true);
    return userCredential.user;
  };

  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };
  
  const updateDisplayName = async (newName: string): Promise<void> => {
    if (!user) throw new Error("No user logged in.");
    
    await updateProfile(user, { displayName: newName });

    const userRef = doc(firestore, 'users', user.uid);
    setDoc(userRef, { displayName: newName }, { merge: true }).catch(err => {
        const contextualError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: { displayName: newName },
        });
        errorEmitter.emit('permission-error', contextualError);
        throw err;
    });
  };

  const updateUserPassword = async (newPassword: string): Promise<void> => {
    if (!user) throw new Error("No user logged in.");
    await updatePassword(user, newPassword);
  };

  const deleteUserAccount = async (): Promise<void> => {
    if (!user) throw new Error("No user logged in.");

    const userId = user.uid;
    const userRef = doc(firestore, 'users', userId);
    
    // This is a simplified deletion. In a real app, you'd want to delete all subcollections too.
    const scansQuery = query(collectionGroup(firestore, 'scans'));
    const scansSnapshot = await getDocs(scansQuery);
    const deletePromises: Promise<void>[] = [];
    scansSnapshot.forEach(doc => {
      if (doc.ref.path.startsWith(`users/${userId}/`)) {
        deletePromises.push(deleteDoc(doc.ref));
      }
    });
    await Promise.all(deletePromises);

    await deleteDoc(userRef).catch(err => {
        const contextualError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', contextualError);
        throw err;
    });

    await deleteUser(user);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };


  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isUserLoading,
        signIn,
        signUp,
        signOut,
        sendPasswordReset,
        updateDisplayName,
        updateUserPassword,
        deleteUserAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
