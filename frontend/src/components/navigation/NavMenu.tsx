import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'firebase/auth';
import { useAuth } from '../../lib/firebase/useAuth';
import { ADMIN_EMAILS } from '../admin/types';

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 300,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 300,
            staggerChildren: 0.05,
            staggerDirection: -1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 20,
            stiffness: 300
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: {
            duration: 0.2
        }
    }
};

export function NavMenu({ isOpen, onClose, user }: NavMenuProps) {
    const location = useLocation();
    const { signInWithGoogle } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            onClose();
        } catch (error) {
            console.error('Failed to sign in:', error);
        }
    };

    const allNavLinks = [
        {
            path: user?.email && ADMIN_EMAILS.includes(user.email) ? '/admin' : '/bookings',
            label: user?.email && ADMIN_EMAILS.includes(user.email) ? 'Admin Dashboard' : 'My Bookings',
            description: user?.email && ADMIN_EMAILS.includes(user.email) ? 'Manage your site' : 'View your trips',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {user?.email && ADMIN_EMAILS.includes(user.email) ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 4h-1V3a1 1 0 00-2 0v1H8V3a1 1 0 00-2 0v1H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                    )}
                </svg>
            ),
            color: user?.email && ADMIN_EMAILS.includes(user.email) ? 'purple' : 'blue',
            requiresAuth: true
        },
        {
            path: '/about-us',
            label: 'About',
            description: 'Learn about us',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'purple',
            requiresAuth: false
        },
        {
            path: '/book',
            label: 'Book',
            description: 'Book your trip',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'green',
            requiresAuth: true
        },
        {
            path: '/contact',
            label: 'Contact',
            description: 'Get in touch',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            color: 'amber',
            requiresAuth: false
        }
    ] as const;

    const navLinks = allNavLinks.filter(link => !link.requiresAuth || user !== null);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-x-0 top-0 z-40 h-screen bg-black/20 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Menu Container */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-[96px] left-4 z-50 w-[540px]"
                    >
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/95 backdrop-blur-xl rounded-[1.1rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200/50 overflow-hidden"
                        >
                            <div className="grid grid-cols-2 gap-px bg-gray-100/50 p-1">
                                {/* Navigation Links */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white rounded-lg p-2.5 space-y-2.5 m-1"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-medium text-gray-900">Navigation</h3>
                                        <motion.div
                                            animate={{ rotate: [0, 180, 360] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-1 h-1 rounded-full bg-gold"
                                        />
                                    </div>
                                    <nav className="grid grid-cols-2 gap-1.5">
                                        {navLinks.map((link) => (
                                            <motion.div
                                                key={link.path}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Link
                                                    to={link.path}
                                                    onClick={onClose}
                                                    className={`flex flex-col gap-1 p-2 rounded-lg transition-all group hover:bg-gray-50 ${location.pathname === link.path
                                                        ? 'bg-gray-50/80 shadow-sm'
                                                        : ''
                                                        }`}
                                                >
                                                    <motion.span
                                                        className={`p-1.5 rounded-lg w-fit bg-primary-50 text-primary group-hover:bg-primary-100 transition-colors relative overflow-hidden`}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <motion.div
                                                            animate={location.pathname === link.path ? {
                                                                scale: [1, 1.2, 1],
                                                                rotate: [0, 10, -10, 0],
                                                            } : {}}
                                                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                                            className="w-4 h-4"
                                                        >
                                                            {link.icon}
                                                        </motion.div>
                                                    </motion.span>
                                                    <span className="text-xs font-medium text-gray-900">{link.label}</span>
                                                    <span className="text-[9px] text-gray-500">{link.description}</span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </nav>
                                </motion.div>

                                {/* Quick Actions */}
                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white rounded-lg m-1 p-2.5 space-y-2.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-medium text-gray-900 px-4">Quick Actions</h3>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className="w-1 h-1 rounded-full bg-gold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <motion.a
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            href="tel:+16127437243"
                                            className="flex items-center gap-2.5 p-2 px-4 rounded-lg hover:bg-gray-50 transition-colors group relative overflow-hidden"
                                        >
                                            <motion.span
                                                className="p-1.5 rounded-lg bg-[#1A1A1A] text-white group-hover:bg-black transition-colors"
                                                whileHover={{ rotate: 15 }}
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </motion.span>
                                            <div>
                                                <span className="block text-xs font-medium text-gray-900">Call us</span>
                                                <span className="text-[9px] text-gray-500">+1 (612) 743-7243</span>
                                            </div>
                                        </motion.a>

                                        {!user && (
                                            <motion.div
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <button
                                                    onClick={handleGoogleSignIn}
                                                    className="w-full flex items-center gap-2.5 p-2 px-4 rounded-lg hover:bg-gray-50 transition-colors group relative overflow-hidden"
                                                >
                                                    <motion.span
                                                        className="p-1.5 rounded-lg bg-white shadow-sm text-gray-700 group-hover:bg-gray-50 transition-colors"
                                                        whileHover={{ rotate: -15 }}
                                                    >
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                        </svg>
                                                    </motion.span>
                                                    <div>
                                                        <span className="block text-xs font-medium text-gray-900">Continue with Google</span>
                                                        <span className="text-[9px] text-gray-500">Access your account</span>
                                                    </div>
                                                </button>
                                            </motion.div>
                                        )}

                                        <motion.div
                                            variants={itemVariants}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link
                                                to="/get-started"
                                                onClick={onClose}
                                                className="flex items-center gap-2.5 p-2 px-4 bg-[#1A1A1A] rounded-[1.1rem] hover:bg-black transition-colors group relative overflow-hidden"
                                            >
                                                <motion.span
                                                    className="p-1.5 rounded-lg bg-white/10 text-white group-hover:bg-white/20 transition-colors"
                                                    whileHover={{
                                                        rotate: 360,
                                                        transition: { duration: 0.5 }
                                                    }}
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </motion.span>
                                                <div>
                                                    <span className="block text-xs font-medium text-white">Get Started</span>
                                                    <span className="text-[9px] text-gray-400">Begin your adventure</span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 