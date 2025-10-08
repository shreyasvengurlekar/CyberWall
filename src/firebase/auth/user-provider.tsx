
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
      // Always start loading when auth state might change
      setIsUserLoading(true);
      if (profileUnsubscribe) profileUnsubscribe();

      if (firebaseUser) {
        setUser(firebaseUser);

        const userRef = doc(firestore, 'users', firebaseUser.uid);
        
        // Asynchronously get the token and listen for profile changes
        const tokenPromise = firebaseUser.getIdTokenResult(true);
        const profilePromise = new Promise<UserProfile>((resolve, reject) => {
            profileUnsubscribe = onSnapshot(userRef, async (docSnap) => {
                if (docSnap.exists()) {
                    resolve(docSnap.data() as UserProfile);
                } else {
                    const newProfile = await createProfileInFirestore(firebaseUser);
                    resolve(newProfile);
                }
            }, (error) => {
                console.error("Error fetching user profile:", error);
                const contextualError = new FirestorePermissionError({ path: userRef.path, operation: 'get' });
                errorEmitter.emit('permission-error', contextualError);
                reject(error);
            });
        });

        try {
            // Wait for both the token and profile to be resolved
            const [idTokenResult, userProfile] = await Promise.all([tokenPromise, profilePromise]);
            
            // Now set the state based on the resolved promises
            setIsAdmin(!!idTokenResult.claims.admin);
            setProfile(userProfile);
            
        } catch (error) {
            console.error("Failed to load user session:", error);
            // If anything fails, ensure we are in a clean, logged-out state
            setUser(null);
            setProfile(null);
            setIsAdmin(false);
        } finally {
            // Only stop loading after all async operations are complete
            setIsUserLoading(false);
        }

      } else {
        // No user, reset all state and stop loading
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
        const error = new Error('auth/email-not-verified');
        error.name = 'FirebaseError';
        (error as any).code = 'auth/email-not-verified';
        throw error;
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
