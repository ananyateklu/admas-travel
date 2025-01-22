import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from './Footer';
import admasLogo from '../assets/admast.png';
import { useAuth } from '../lib/firebase/useAuth';
import { N8nChat } from './chat/N8nChat';
import { NavMenu } from './navigation/NavMenu';
import { NavLinks } from './navigation/NavLinks';
import { UserMenu } from './navigation/UserMenu';
import { MenuIcon } from './common/icons';

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen bg-white text-dark flex flex-col">
            {/* Header Container */}
            <div className={`fixed top-3 left-0 right-0 z-50`}>
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
                        className="mx-auto rounded-[1.8rem] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-200/50 backdrop-blur-xl"
                    >
                        <nav className={`h-[4.5rem] pl-5 pr-1.5 flex items-center transition-all duration-300`}>
                            <div className="flex items-center justify-between gap-5 w-full">
                                {/* Left section */}
                                <div className="flex items-center gap-5">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center gap-2 text-xs font-light hover:text-gold transition-colors"
                                    >
                                        <motion.div
                                            animate={{ rotate: isMenuOpen ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <MenuIcon className="w-5 h-5" />
                                        </motion.div>
                                    </motion.button>
                                    <Link to="/">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                            src={admasLogo}
                                            alt="Admas Travel"
                                            className={`transition-all duration-300 ${isScrolled ? 'h-10' : 'h-14'} filter hover:brightness-110`}
                                        />
                                    </Link>
                                </div>

                                {/* Center section - navigation */}
                                <div className="hidden lg:flex flex-1 items-center justify-center">
                                    <NavLinks
                                        hoveredLink={hoveredLink}
                                        onHover={setHoveredLink}
                                        onLinkClick={() => setIsMenuOpen(false)}
                                        user={user}
                                    />
                                </div>

                                {/* Right section - Phone number and Sign In/Account */}
                                <div className="flex items-center gap-5">
                                    <motion.a
                                        href="tel:+16127437243"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-forest/20 text-forest hover:bg-forest/30 border border-forest-400/10 shadow-[0_4px_16px_rgba(45,90,39,0.08)] hover:shadow-[0_6px_20px_rgba(45,90,39,0.16)] transition-all duration-200"
                                    >
                                        <svg className="w-3.5 h-3.5 text-forest/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="text-xs font-medium text-forest">
                                            +1 (612) 743-7243
                                        </span>
                                    </motion.a>
                                    <UserMenu user={user} onSignOut={handleSignOut} isMenuOpen={isMenuOpen} />
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
            <N8nChat webhookUrl={import.meta.env.VITE_N8N_WEBHOOK_URL ?? ''} />
        </div>
    );
} 