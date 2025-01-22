import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/firebase/useAuth';
import { PolicyModal } from './modals/PolicyModal';
import { useState, useRef, useEffect } from 'react';
import { Portal } from './Portal';

interface SignInDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
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
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: 'easeOut'
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

export function SignInDropdown({ isOpen, onClose }: SignInDropdownProps) {
    const { signInWithGoogle } = useAuth();
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            onClose();
        } catch (error) {
            console.error('Failed to sign in:', error);
        }
    };

    const termsContent = `Terms of Service

1. Acceptance of Terms
By accessing and using Admas Travel's services, you agree to be bound by these Terms of Service.

2. Use of Service
Our services are provided for personal travel planning and booking purposes.

3. User Accounts
You are responsible for maintaining the confidentiality of your account information.

4. Booking and Payments
All bookings are subject to availability and confirmation.

5. Cancellations and Refunds
Cancellation policies vary by booking type and provider.

6. Privacy
Your use of our services is also governed by our Privacy Policy.

7. Modifications
We reserve the right to modify these terms at any time.

8. Limitation of Liability
We strive to provide accurate information but cannot guarantee complete accuracy.

9. Governing Law
These terms are governed by applicable state and federal laws.`;

    const privacyContent = `Privacy Policy

1. Information Collection
We collect information you provide directly to us and automatically through your use of our services.

2. Use of Information
We use collected information to:
- Process your bookings
- Provide customer support
- Send important notifications
- Improve our services

3. Information Sharing
We do not sell your personal information to third parties.

4. Data Security
We implement appropriate security measures to protect your information.

5. Your Rights
You have the right to:
- Access your personal information
- Request corrections
- Request deletion
- Opt out of marketing communications

6. Cookies
We use cookies to enhance your browsing experience.

7. Updates
We may update this policy periodically.

8. Contact Us
For privacy-related questions, please contact our support team.`;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="fixed inset-0 z-40"
                            onClick={onClose}
                        />

                        {/* Dropdown Container */}
                        <motion.div
                            ref={dropdownRef}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute right-0 mt-4 z-50 w-[240px]"
                        >
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/95 backdrop-blur-xl rounded-[1.1rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200/50 overflow-hidden"
                            >
                                <motion.div
                                    variants={itemVariants}
                                    className="p-3 space-y-3"
                                >
                                    {/* Header */}
                                    <motion.div variants={itemVariants} className="text-center space-y-1">
                                        <h3 className="text-sm font-medium text-gray-900">
                                            Welcome to Admas Travel
                                        </h3>
                                        <p className="text-[10px] font-light text-gray-600">
                                            Sign in to book flights, hotels, and cars
                                        </p>
                                    </motion.div>

                                    {/* Sign In Button */}
                                    <motion.div variants={itemVariants}>
                                        <motion.button
                                            onClick={handleGoogleSignIn}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full flex items-center justify-center gap-3 p-2 rounded-[1.1rem] bg-[#1A1A1A] hover:bg-black transition-all duration-200 group relative overflow-hidden"
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                                            />
                                            <motion.span
                                                className="p-1 rounded-lg bg-white/20 text-white group-hover:bg-white/20 transition-colors relative flex items-center justify-center -ml-4"
                                                whileHover={{ rotate: -15 }}
                                            >
                                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                            </motion.span>
                                            <div className="relative text-center">
                                                <span className="block text-xs font-medium text-white">Continue with Google</span>
                                                <span className="text-[9px] font-light text-white/70">Access your account</span>
                                            </div>
                                        </motion.button>
                                    </motion.div>

                                    {/* Terms */}
                                    <motion.div variants={itemVariants} className="text-center">
                                        <p className="text-[8px] font-light text-gray-500">
                                            By continuing, you agree to our{' '}
                                            <motion.button
                                                onClick={() => setShowTerms(true)}
                                                className="text-primary hover:text-primary/90 underline"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Terms of Service
                                            </motion.button>
                                            {' '}and{' '}
                                            <motion.button
                                                onClick={() => setShowPrivacy(true)}
                                                className="text-primary hover:text-primary/90 underline"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Privacy Policy
                                            </motion.button>
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Policy Modals - Rendered in a portal */}
            <Portal>
                <PolicyModal
                    isOpen={showTerms}
                    onClose={() => setShowTerms(false)}
                    title="Terms of Service"
                    content={termsContent}
                />
                <PolicyModal
                    isOpen={showPrivacy}
                    onClose={() => setShowPrivacy(false)}
                    title="Privacy Policy"
                    content={privacyContent}
                />
            </Portal>
        </>
    );
} 