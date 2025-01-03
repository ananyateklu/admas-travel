import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'firebase/auth';
import { useState } from 'react';
import { Avatar } from '../common/ui';
import { UserDropdown } from './UserDropdown';
import { SignInDropdown } from '../SignInDropdown';

interface UserMenuProps {
    user: User | null;
    onSignOut: () => Promise<void>;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);

    return (
        <div className="relative">
            {user ? (
                <div className="relative account-menu">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                        className="flex items-center gap-3 px-4 py-2 rounded-[1.2rem] hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={user.photoURL ?? undefined}
                                alt={user.displayName ?? 'User'}
                                fallback={user.displayName ?? user.email ?? 'User'}
                                size="md"
                                className="ring-2 ring-white shadow-sm"
                            />
                            <div className="hidden md:block text-left">
                                <div className="text-sm font-medium text-gray-900">
                                    {user.displayName ?? 'User'}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                        <motion.svg
                            animate={{ rotate: isAccountMenuOpen ? 180 : 0 }}
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                    </motion.button>
                    <UserDropdown
                        isOpen={isAccountMenuOpen}
                        onClose={() => setIsAccountMenuOpen(false)}
                        user={user}
                        onSignOut={onSignOut}
                    />
                </div>
            ) : (
                <div className="relative signin-dropdown">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSignInOpen(!isSignInOpen)}
                        className="px-8 py-6 bg-[#1A1A1A] text-white rounded-[1.2rem] shadow-[0_4px_16px_rgba(0,0,0,0.24)] text-base font-light hover:bg-black transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.32)] hover:scale-[1.02]"
                    >
                        Sign In
                    </motion.button>
                    <div className="absolute top-[calc(100%+0.5rem)] right-0 z-50">
                        <AnimatePresence>
                            {isSignInOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <SignInDropdown
                                        isOpen={isSignInOpen}
                                        onClose={() => setIsSignInOpen(false)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
} 