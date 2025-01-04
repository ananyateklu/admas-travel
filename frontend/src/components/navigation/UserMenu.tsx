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
                <div className="relative account-menu mr-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-[1.1rem] hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-2.5">
                            <Avatar
                                src={user.photoURL ?? undefined}
                                alt={user.displayName ?? 'User'}
                                fallback={user.displayName ?? user.email ?? 'User'}
                                size="sm"
                                className="ring-[1.5px] ring-white shadow-sm"
                            />
                            <div className="hidden md:block text-left">
                                <div className="text-xs font-medium text-gray-900">
                                    {user.displayName ?? 'User'}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                        <motion.svg
                            animate={{ rotate: isAccountMenuOpen ? 180 : 0 }}
                            className="w-4 h-4 text-gray-400"
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
                <div className="relative signin-dropdown ml-3">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSignInOpen(!isSignInOpen)}
                        className="px-9 py-5 bg-[#1A1A1A] text-white rounded-[1.4rem] shadow-[0_4px_16px_rgba(0,0,0,0.24)] text-sm font-light hover:bg-black transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.32)] hover:scale-[1.02]"
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