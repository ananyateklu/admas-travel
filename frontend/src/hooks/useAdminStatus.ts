import { useState, useEffect } from 'react';
import { useAuth } from '../lib/firebase/useAuth';
import { isUserAdmin } from '../lib/firebase/adminUtils';

export function useAdminStatus() {
    const { user } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user?.email) {
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const adminStatus = await isUserAdmin(user.email);
                setIsAdmin(adminStatus);
                setError(null);
            } catch (err) {
                console.error('Error checking admin status:', err);
                setError('Failed to check admin status');
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminStatus();
    }, [user?.email]);

    return {
        isAdmin,
        isLoading,
        error,
        userEmail: user?.email || null
    };
} 