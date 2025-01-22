import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { Avatar } from '../common/ui';
import { UserDropdown } from './UserDropdown';
import { SignInDropdown } from '../SignInDropdown';

interface UserMenuProps {
    user: User | null;
    onSignOut: () => Promise<void>;
    isMenuOpen?: boolean;
}

export function UserMenu({ user, onSignOut, isMenuOpen }: UserMenuProps) {
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when nav menu opens
    useEffect(() => {
        if (isMenuOpen) {
            setIsAccountMenuOpen(false);
            setIsSignInOpen(false);
        }
    }, [isMenuOpen]);

    // Handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
                setIsSignInOpen(false);
            }
        }

        if (isAccountMenuOpen || isSignInOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isAccountMenuOpen, isSignInOpen]);

    return (
        <div className="relative" ref={menuRef}>
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
                    <SignInDropdown
                        isOpen={isSignInOpen}
                        onClose={() => setIsSignInOpen(false)}
                    />
                </div>
            )}
        </div>
    );
} 