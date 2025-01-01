import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';

interface UserDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSignOut: () => Promise<void>;
}

const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            damping: 30,
            stiffness: 400,
            mass: 0.8,
            staggerChildren: 0.05
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: 'easeOut'
        }
    }
};

const itemVariants = {
    hidden: {
        opacity: 0,
        x: -20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: 'spring',
            damping: 25,
            stiffness: 300
        }
    }
};

export function UserDropdown({ isOpen, onClose, user, onSignOut }: UserDropdownProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/10"
                        onClick={onClose}
                    />
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-28 right-0 z-50 w-[250px] mx-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200/50 overflow-hidden"
                        >
                            <motion.div
                                variants={itemVariants}
                                className="p-4 space-y-4"
                            >
                                {/* User Info */}
                                <motion.div
                                    variants={itemVariants}
                                    className="flex items-center gap-3 pb-4 border-b border-gray-100"
                                >
                                    {user.photoURL ? (
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            src={user.photoURL}
                                            alt={user.displayName ?? 'User'}
                                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/50"
                                        />
                                    ) : (
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/80 to-gold flex items-center justify-center ring-2 ring-white/50"
                                        >
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 }}
                                                className="text-xl font-medium text-white"
                                            >
                                                {user.displayName?.[0] ?? user.email?.[0] ?? '?'}
                                            </motion.span>
                                        </motion.div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-base font-medium text-gray-900 truncate"
                                        >
                                            {user.displayName ?? 'User'}
                                        </motion.p>
                                        <motion.p
                                            variants={itemVariants}
                                            className="text-xs text-gray-500 truncate"
                                        >
                                            {user.email}
                                        </motion.p>
                                    </div>
                                </motion.div>

                                {/* Navigation Links */}
                                <motion.div
                                    variants={itemVariants}
                                    className="space-y-1"
                                >
                                    <motion.div variants={itemVariants}>
                                        <Link
                                            to="/profile"
                                            onClick={onClose}
                                            className="flex items-center gap-3 w-full p-2 text-left text-gray-700 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                            />
                                            <motion.span
                                                className="p-1.5 rounded-lg bg-primary-50 text-primary group-hover:bg-primary-100 group-hover:text-primary transition-all duration-200 relative"
                                                whileHover={{ rotate: 15, scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </motion.span>
                                            <div className="relative">
                                                <span className="block text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">Profile</span>
                                                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">View your profile</span>
                                            </div>
                                        </Link>
                                    </motion.div>

                                    <motion.div variants={itemVariants}>
                                        <Link
                                            to="/bookings"
                                            onClick={onClose}
                                            className="flex items-center gap-3 w-full p-2 text-left text-gray-700 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                            />
                                            <motion.span
                                                className="p-1.5 rounded-lg bg-primary-50 text-primary group-hover:bg-primary-100 group-hover:text-primary transition-all duration-200 relative"
                                                whileHover={{ rotate: -15, scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 4h-1V3a1 1 0 00-2 0v1H8V3a1 1 0 00-2 0v1H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                                </svg>
                                            </motion.span>
                                            <div className="relative">
                                                <span className="block text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">My Bookings</span>
                                                <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">View your trips</span>
                                            </div>
                                        </Link>
                                    </motion.div>

                                    {user.email === 'ananya.meseret@gmail.com' && (
                                        <motion.div variants={itemVariants}>
                                            <Link
                                                to="/admin"
                                                onClick={onClose}
                                                className="flex items-center gap-3 w-full p-2 text-left text-gray-700 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group relative overflow-hidden"
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                                />
                                                <motion.span
                                                    className="p-1.5 rounded-lg bg-primary-50 text-primary group-hover:bg-primary-100 group-hover:text-primary transition-all duration-200 relative"
                                                    whileHover={{ rotate: -15, scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                    </svg>
                                                </motion.span>
                                                <div className="relative">
                                                    <span className="block text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">Admin Dashboard</span>
                                                    <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">Manage your site</span>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )}

                                    <motion.div variants={itemVariants}>
                                        <button
                                            onClick={() => {
                                                onSignOut();
                                                onClose();
                                            }}
                                            className="flex items-center gap-3 w-full p-2 text-left text-red-600 rounded-lg hover:bg-red-50/80 transition-all duration-200 group relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                            />
                                            <motion.span
                                                className="p-1.5 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 group-hover:text-red-700 transition-all duration-200 relative"
                                                whileHover={{
                                                    rotate: 360,
                                                    scale: 1.1,
                                                    transition: { duration: 0.5 }
                                                }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </motion.span>
                                            <div className="relative">
                                                <span className="block text-sm font-medium group-hover:text-red-700 transition-colors duration-200">Sign Out</span>
                                                <span className="text-xs text-red-500 group-hover:text-red-600 transition-colors duration-200">See you soon!</span>
                                            </div>
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 