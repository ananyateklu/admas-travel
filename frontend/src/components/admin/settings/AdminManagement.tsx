import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllAdmins, addAdmin, removeAdmin, AdminUser } from '../../../lib/firebase/adminUtils';
import { useAuth } from '../../../lib/firebase/useAuth';
import { toast } from 'react-hot-toast';

export function AdminManagement() {
    const { user } = useAuth();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newAdminEmail, setNewAdminEmail] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        try {
            setIsLoading(true);
            const adminList = await getAllAdmins();
            setAdmins(adminList);
        } catch (error) {
            console.error('Error loading admins:', error);
            toast.error('Failed to load admin users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdminEmail.trim() || !user?.email) return;

        try {
            setIsAdding(true);
            await addAdmin(newAdminEmail.trim(), user.email, 'admin');
            setNewAdminEmail('');
            await loadAdmins();
            toast.success('Admin user added successfully');
        } catch (error) {
            console.error('Error adding admin:', error);
            toast.error('Failed to add admin user');
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveAdmin = async (email: string) => {
        if (!confirm(`Are you sure you want to remove ${email} as an admin?`)) return;

        try {
            await removeAdmin(email);
            await loadAdmins();
            toast.success('Admin user removed successfully');
        } catch (error) {
            console.error('Error removing admin:', error);
            toast.error('Failed to remove admin user');
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Admin User Management
            </h3>

            {/* Add New Admin */}
            <form onSubmit={handleAddAdmin} className="mb-6">
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                        required
                    />
                    <motion.button
                        type="submit"
                        disabled={isAdding || !newAdminEmail.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-forest-500 text-white rounded-lg hover:bg-forest-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAdding ? 'Adding...' : 'Add Admin'}
                    </motion.button>
                </div>
            </form>

            {/* Admin List */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Current Admins ({admins.length})</h4>
                {admins.length === 0 ? (
                    <p className="text-gray-500 text-sm">No admin users found.</p>
                ) : (
                    <div className="space-y-2">
                        {admins.map((admin) => (
                            <motion.div
                                key={admin.email}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{admin.email}</span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${admin.role === 'super-admin'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {admin.role}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Added by {admin.addedBy} on {new Date(admin.addedAt).toLocaleDateString()}
                                    </div>
                                </div>
                                {admin.email !== user?.email && (
                                    <motion.button
                                        onClick={() => handleRemoveAdmin(admin.email)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove admin"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </motion.button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Admin users can access the admin dashboard, manage all bookings, and add/remove other admins.
                    Super-admins have the same permissions but are typically the original administrators.
                </p>
            </div>
        </div>
    );
} 