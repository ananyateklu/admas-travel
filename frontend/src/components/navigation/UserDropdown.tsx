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
                <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[82px] right-4 z-50 w-[220px]"
                >
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200/50 overflow-hidden"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="p-1.5 space-y-0.5"
                        >
                            {/* Navigation Links */}
                            <motion.div
                                variants={itemVariants}
                                className="space-y-0.5"
                            >
                                <motion.div variants={itemVariants}>
                                    <Link
                                        to="/account"
                                        onClick={onClose}
                                        className="flex items-center gap-2 w-full p-1.5 text-left text-gray-700 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group relative overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                        />
                                        <motion.span
                                            className="p-1.5 rounded-lg bg-primary-50 text-primary group-hover:bg-primary-100 group-hover:text-primary transition-all duration-200 relative"
                                            whileHover={{ rotate: 15, scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </motion.span>
                                        <div className="relative">
                                            <span className="block text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">Account</span>
                                            <span className="text-[10px] text-gray-500 group-hover:text-gray-600 transition-colors duration-200">View your account</span>
                                        </div>
                                    </Link>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Link
                                        to="/bookings"
                                        onClick={onClose}
                                        className="flex items-center gap-2 w-full p-1.5 text-left text-gray-700 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group relative overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                        />
                                        <motion.span
                                            className="p-1.5 rounded-lg bg-primary-50 text-primary group-hover:bg-primary-100 group-hover:text-primary transition-all duration-200 relative"
                                            whileHover={{ rotate: -15, scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 4h-1V3a1 1 0 00-2 0v1H8V3a1 1 0 00-2 0v1H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                            </svg>
                                        </motion.span>
                                        <div className="relative">
                                            <span className="block text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">My Bookings</span>
                                            <span className="text-[10px] text-gray-500 group-hover:text-gray-600 transition-colors duration-200">View your trips</span>
                                        </div>
                                    </Link>
                                </motion.div>

                                {user.email === 'ananya.meseret@gmail.com' && (
                                    <motion.div variants={itemVariants}>
                                        <Link
                                            to="/admin"
                                            onClick={onClose}
                                            className="flex items-center gap-2 w-full p-1.5 text-left text-gray-700 rounded-lg hover:bg-gray-50/80 transition-all duration-200 group relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                            />
                                            <motion.span
                                                className="p-1.5 rounded-lg bg-primary-50 text-primary group-hover:bg-primary-100 group-hover:text-primary transition-all duration-200 relative"
                                                whileHover={{ rotate: -15, scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                </svg>
                                            </motion.span>
                                            <div className="relative">
                                                <span className="block text-sm font-medium group-hover:text-gray-900 transition-colors duration-200">Admin Dashboard</span>
                                                <span className="text-[10px] text-gray-500 group-hover:text-gray-600 transition-colors duration-200">Manage your site</span>
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
                                        className="flex items-center gap-2 w-full p-1.5 text-left text-red-600 rounded-lg hover:bg-red-50/80 transition-all duration-200 group relative overflow-hidden"
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
                                            <svg className="w-3.5 h-3.5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </motion.span>
                                        <div className="relative">
                                            <span className="block text-sm font-medium group-hover:text-red-700 transition-colors duration-200">Sign Out</span>
                                            <span className="text-[10px] text-red-500 group-hover:text-red-600 transition-colors duration-200">See you soon!</span>
                                        </div>
                                    </button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
} 