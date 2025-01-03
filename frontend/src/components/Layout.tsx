import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import admasLogo from '../assets/admast.png';
import { useAuth } from '../lib/firebase/useAuth';
import { SignInDropdown } from './SignInDropdown';
import { ConvaiChat } from './chat/ConvaiChat';
import { motion, AnimatePresence } from 'framer-motion';
import { NavMenu } from './navigation/NavMenu';
import { UserDropdown } from './navigation/UserDropdown';

const navLinks = [
    {
        path: '/', label: 'Home', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        )
    },
    {
        path: '/about-us', label: 'About', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        path: '/book', label: 'Book', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        path: '/contact', label: 'Contact', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        path: '/get-started', label: 'Get Started', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    }
] as const;

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.account-menu') && !target.closest('.signin-dropdown')) {
            setIsAccountMenuOpen(false);
        }
    };

    // Add click outside listener
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white text-dark flex flex-col">
            {/* Header Container */}
            <div className={`fixed top-4 left-0 right-0 z-50`}>
                <div className="mx-4">
                    {/* Header */}
                    <motion.header
                        initial={false}
                        animate={{
                            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            y: isScrolled ? -8 : 0,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeInOut'
                        }}
                        className="mx-auto rounded-[2rem] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-200/50 backdrop-blur-xl"
                    >
                        <nav className={`h-24 pl-6 pr-3 flex items-center transition-all duration-300`}>
                            <div className="flex items-center justify-between gap-8 w-full">
                                {/* Left section */}
                                <div className="flex items-center gap-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center gap-2 text-base font-light hover:text-gold transition-colors"
                                    >
                                        <motion.div
                                            animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </motion.div>
                                    </motion.button>
                                    <Link to="/">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            src={admasLogo}
                                            alt="Admas Travel"
                                            className={`transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'} filter hover:brightness-110`}
                                        />
                                    </Link>
                                </div>

                                {/* Center section - navigation */}
                                <div className="hidden lg:flex flex-1 items-center justify-center">
                                    <div className="flex items-center gap-16 ml-32">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className="relative group py-2"
                                                onMouseEnter={() => setHoveredLink(link.path)}
                                                onMouseLeave={() => setHoveredLink(null)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{
                                                            opacity: hoveredLink === link.path || location.pathname === link.path ? 1 : 0.7,
                                                            scale: hoveredLink === link.path || location.pathname === link.path ? 1 : 0.8
                                                        }}
                                                        transition={{ duration: 0.2 }}
                                                        className={`${hoveredLink === link.path || location.pathname === link.path ? 'text-primary-500' : 'text-primary-600/70'}`}
                                                    >
                                                        {link.icon}
                                                    </motion.div>
                                                    <span className={`text-base font-light transition-colors ${hoveredLink === link.path || location.pathname === link.path
                                                        ? 'text-primary-500 font-medium'
                                                        : 'text-dark-300'
                                                        }`}>
                                                        {link.label}
                                                    </span>
                                                </div>
                                                <motion.span
                                                    className="absolute -bottom-1 left-0 h-[2px] bg-primary-500/60 rounded-full"
                                                    initial={{ width: '0%' }}
                                                    animate={{
                                                        width: (hoveredLink === link.path || location.pathname === link.path) ? '100%' : '0%',
                                                    }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Right section - Phone number and Sign In/Account */}
                                <div className="flex items-center gap-6">
                                    <motion.a
                                        href="tel:+16127437243"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="hidden md:flex items-center gap-2 text-base font-light hover:text-gold transition-colors relative group"
                                    >
                                        <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="relative">
                                            +1 (612) 743-7243<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold transform scale-x-0 transition-transform group-hover:scale-x-100" />
                                        </span>
                                    </motion.a>
                                    {user ? (
                                        <div className="relative account-menu">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                                                className="flex items-center gap-3 px-4 py-2 rounded-[1.2rem] hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {user.photoURL ? (
                                                        <motion.img
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                            src={user.photoURL}
                                                            alt={user.displayName ?? 'User'}
                                                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName ?? 'User')}&background=D4AF37&color=fff&size=40`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            initial={{ opacity: 0, scale: 0.5 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                            className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center text-lg font-medium ring-2 ring-white shadow-sm"
                                                        >
                                                            <motion.span
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: 0.1 }}
                                                            >
                                                                {user.displayName?.[0] ?? user.email?.[0] ?? 'U'}
                                                            </motion.span>
                                                        </motion.div>
                                                    )}
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
                                                onSignOut={handleSignOut}
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
                            </div>
                        </nav>
                    </motion.header>
                </div>
            </div>

            {/* Navigation Menu */}
            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />

            {/* Chat Widget */}
            <ConvaiChat agentId="k57XOhpbsRdgDr1Gxn1H" />
        </div>
    );
} 