import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';

interface User {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    emailVerified: boolean;
    createdAt: string; 
}

export const useAllUsers = () => {
    const { firestore } = useFirebase();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!firestore) return;

            try {
                const usersCollection = collection(firestore, 'users');
                const userSnapshot = await getDocs(usersCollection);
                const userList = userSnapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
                })) as User[];
                setUsers(userList);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [firestore]);

    return { users, isLoading, error };
};