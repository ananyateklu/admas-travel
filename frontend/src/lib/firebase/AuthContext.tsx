import { createContext, useEffect, useState, useMemo } from 'react';
import {
    GoogleAuthProvider,
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    browserPopupRedirectResolver,
    AuthError
} from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        try {
            const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
            setUser(result.user);
        } catch (error) {
            console.error('Error signing in with Google:', error);
            // Handle specific error cases
            const authError = error as AuthError;
            if (authError.code === 'auth/popup-closed-by-user') {
                throw new Error('Sign-in cancelled. Please try again.');
            } else if (authError.code === 'auth/popup-blocked') {
                throw new Error('Popup was blocked. Please allow popups for this site and try again.');
            } else {
                throw new Error('Failed to sign in with Google. Please try again later.');
            }
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw new Error('Failed to sign out. Please try again.');
        }
    };

    const contextValue = useMemo(
        () => ({ user, loading, signInWithGoogle, signOut }),
        [user, loading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export { AuthContext }; 