import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface AdminUser {
    email: string;
    addedAt: Date | Timestamp;
    addedBy: string;
    role: 'admin' | 'super-admin';
    isActive: boolean;
}

/**
 * Check if a user is an admin by checking the admins collection
 */
export async function isUserAdmin(email: string): Promise<boolean> {
    try {
        const adminDoc = await getDoc(doc(db, 'admins', email));
        return adminDoc.exists() && adminDoc.data()?.isActive === true;
    } catch (error) {
        console.error('Error checking admin status:', { email, error });
        return false;
    }
}

/**
 * Add a user as an admin
 */
export async function addAdmin(
    email: string,
    addedBy: string,
    role: 'admin' | 'super-admin' = 'admin'
): Promise<void> {
    try {
        const adminData = {
            email,
            addedAt: serverTimestamp(),
            addedBy,
            role,
            isActive: true
        };

        await setDoc(doc(db, 'admins', email), adminData);
        console.log('Admin added successfully:', { email, role });
    } catch (error) {
        console.error('Error adding admin:', { email, error });
        throw new Error('Failed to add admin user');
    }
}

/**
 * Remove a user from admin role
 */
export async function removeAdmin(email: string): Promise<void> {
    try {
        await deleteDoc(doc(db, 'admins', email));
        console.log('Admin removed successfully:', { email });
    } catch (error) {
        console.error('Error removing admin:', { email, error });
        throw new Error('Failed to remove admin user');
    }
}

/**
 * Get all admin users
 */
export async function getAllAdmins(): Promise<AdminUser[]> {
    try {
        const adminsSnapshot = await getDocs(collection(db, 'admins'));
        return adminsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                addedAt: data.addedAt instanceof Timestamp ? data.addedAt.toDate() : data.addedAt
            } as AdminUser;
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw new Error('Failed to fetch admin users');
    }
}

/**
 * Initialize the admin collection with the current hardcoded admins
 * This should be run once during migration
 */
export async function initializeAdminCollection(currentUserEmail: string): Promise<void> {
    const initialAdmins = [
        import.meta.env.VITE_ADMIN_EMAIL_1,
        import.meta.env.VITE_ADMIN_EMAIL_2
    ].filter(Boolean);

    try {
        for (const email of initialAdmins) {
            await addAdmin(email, currentUserEmail, 'super-admin');
        }
    } catch (error) {
        console.error('Error initializing admin collection:', error);
        throw new Error('Failed to initialize admin collection');
    }
} 