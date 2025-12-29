// src/firebase/firestore/use-all-users.ts
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, Unsubscribe, Firestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';

// Define a more detailed User interface
export interface AdminUser {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    emailVerified: boolean;
    createdAt: string; // Keep as ISO string for consistency
    lastLoginAt?: string;
    lastActive?: string;
    isOnline?: boolean;
    lastAction?: string;
}

export const useAllUsers = () => {
    const { firestore } = useFirebase();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [retryAttempt, setRetryAttempt] = useState(0);

    useEffect(() => {
        if (!firestore) return;

        const maxRetries = 3;
        const retryDelay = 5000; // 5 seconds

        let unsubscribe: Unsubscribe | undefined;

        const subscribeToUsers = (db: Firestore) => {
            try {
                const usersCollection = collection(db, 'users');
                const q = query(
                    usersCollection, 
                    orderBy('isOnline', 'desc'),
                    orderBy('lastActive', 'desc')
                );

                unsubscribe = onSnapshot(q, {
                    next: (querySnapshot) => {
                        const userList = querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            return {
                                uid: doc.id,
                                email: data.email,
                                displayName: data.displayName,
                                photoURL: data.photoURL,
                                emailVerified: data.emailVerified,
                                createdAt: data.createdAt?.toDate?.() 
                                    ? data.createdAt.toDate().toISOString() 
                                    : new Date().toISOString(),
                                lastLoginAt: data.lastLoginAt?.toDate?.() 
                                    ? data.lastLoginAt.toDate().toISOString() 
                                    : undefined,
                                lastActive: data.lastActive?.toDate?.() 
                                    ? data.lastActive.toDate().toISOString() 
                                    : undefined,
                                isOnline: Boolean(data.isOnline),
                                lastAction: data.lastAction,
                            } as AdminUser;
                        });

                        setUsers(userList);
                        setIsLoading(false);
                        setError(null);
                        setRetryAttempt(0); // Reset retry count on successful connection
                    },
                    error: (err) => {
                        console.error("Error fetching real-time user data:", err);
                        setError(err instanceof Error ? err : new Error(String(err)));
                        setIsLoading(false);

                        // Implement retry logic
                        if (retryAttempt < maxRetries) {
                            setTimeout(() => {
                                setRetryAttempt(prev => prev + 1);
                                subscribeToUsers(db);
                            }, retryDelay * (retryAttempt + 1)); // Exponential backoff
                        }
                    }
                });
            } catch (err) {
                console.error("Error setting up real-time listener:", err);
                setError(err instanceof Error ? err : new Error(String(err)));
                setIsLoading(false);
            }
        };

        // Initial subscription
        subscribeToUsers(firestore);

        // Cleanup: Unsubscribe from the listener when the component unmounts
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [firestore, retryAttempt]);

    return { users, isLoading, error };
};