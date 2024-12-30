import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import admasLogo from '../assets/admast.png';
import { useAuth } from '../lib/firebase/AuthContext';
import { SignInDropdown } from './SignInDropdown';

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
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

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-menu') && !target.closest('.signin-dropdown')) {
            setIsProfileMenuOpen(false);
            setIsSignInOpen(false);
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
            <div className="fixed top-4 left-0 right-0 z-50">
                <div className="mx-4">
                    {/* Header */}
                    <header className="mx-auto bg-white/70 backdrop-blur-lg rounded-[2rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <nav className="h-24 pl-6 pr-3 flex items-center">
                            <div className="flex items-center justify-between gap-8 w-full">
                                {/* Left section */}
                                <div className="flex items-center gap-8">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center gap-2 text-base font-light"
                                    >
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <Link to="/">
                                        <img src={admasLogo} alt="Admas Travel" className="h-20 w-auto" />
                                    </Link>
                                </div>

                                {/* Center section - navigation only */}
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="flex items-center gap-16 ml-32">
                                        <Link to="/about-us" className="text-base font-light hover:text-gold transition-colors">About</Link>
                                        <Link to="/book" className="text-base font-light hover:text-gold transition-colors">Book</Link>
                                        <Link to="/contact" className="text-base font-light hover:text-gold transition-colors">Contact</Link>
                                        <Link to="/get-started" className="text-base font-light hover:text-gold transition-colors">Get Started</Link>
                                    </div>
                                </div>

                                {/* Right section - Phone number and Sign In/Profile */}
                                <div className="flex items-center gap-6">
                                    <a href="tel:+16127437243" className="flex items-center gap-2 text-base font-light">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        +1 (612) 743-7243
                                    </a>
                                    {user ? (
                                        <div className="relative profile-menu">
                                            <button
                                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                                className="flex items-center gap-3 px-4 py-2 rounded-[1.2rem] hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {user.photoURL ? (
                                                        <img
                                                            src={user.photoURL}
                                                            alt={user.displayName ?? 'User'}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center text-lg font-medium">
                                                            {user.displayName?.charAt(0) ?? user.email?.charAt(0) ?? 'U'}
                                                        </div>
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
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            {isProfileMenuOpen && (
                                                <div className="absolute right-0 mt-2 w-64 bg-white/70 backdrop-blur-lg rounded-[1.2rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)] py-2">
                                                    <div className="px-4 py-3 border-b border-gray-100/20">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.displayName}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to="/account"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            Your Profile
                                                        </div>
                                                    </Link>
                                                    <Link
                                                        to="/bookings"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                                                        onClick={() => setIsProfileMenuOpen(false)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 4h-1V3a1 1 0 00-2 0v1H8V3a1 1 0 00-2 0v1H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
                                                            </svg>
                                                            Your Bookings
                                                        </div>
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            setIsProfileMenuOpen(false);
                                                            handleSignOut();
                                                        }}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                            </svg>
                                                            Sign Out
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative signin-dropdown">
                                            <button
                                                onClick={() => setIsSignInOpen(!isSignInOpen)}
                                                className="px-8 py-6 bg-[#1A1A1A] text-white rounded-[1.2rem] text-base font-light hover:bg-black transition-colors"
                                            >
                                                Sign In
                                            </button>
                                            <SignInDropdown
                                                isOpen={isSignInOpen}
                                                onClose={() => setIsSignInOpen(false)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </nav>
                    </header>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white">
                    <div className="max-w-7xl mx-auto px-6 py-8 pt-20">
                        <div className="flex flex-col space-y-8">
                            <Link to="/" className="text-3xl font-serif" onClick={() => setIsMenuOpen(false)}>
                                Admas Travel
                            </Link>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <Link to="/trips" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Trips</Link>
                                <Link to="/about-us" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                                <Link to="/book" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Book</Link>
                                <Link to="/contact" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                                <Link to="/get-started" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                                {!user && (
                                    <Link to="/signin" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                                )}
                            </div>
                            <a
                                href="tel:+16127437243"
                                className="flex items-center justify-center gap-2 text-lg font-light mt-8"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +1 (612) 743-7243
                            </a>
                            <Link
                                to="/get-started"
                                className="w-full px-4 py-3 bg-[#1A1A1A] text-white rounded-lg text-center text-sm font-light hover:bg-black transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
} 