import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';
import { ConvaiChat } from './chat/ConvaiChat';
import admasLogo from '../assets/admast.png';

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                                        <Link to="/pricing" className="text-base font-light hover:text-gold transition-colors">Pricing</Link>
                                        <Link to="/contact" className="text-base font-light hover:text-gold transition-colors">Contact</Link>
                                    </div>
                                </div>

                                {/* Right section - Phone number and Get Started */}
                                <div className="flex items-center gap-6">
                                    <a href="tel:+16127437243" className="flex items-center gap-2 text-base font-light">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        +1 (612) 743-7243
                                    </a>
                                    <Link
                                        to="/get-started"
                                        className="px-8 py-6 bg-[#1A1A1A] text-white rounded-[1.2rem] text-base font-light hover:bg-black transition-colors"
                                    >
                                        Get Started
                                    </Link>
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
                                <Link to="/comfort-camp" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Comfort Camp</Link>
                                <Link to="/about-us" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                                <Link to="/cce-projects" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>CCE Projects</Link>
                                <Link to="/faq" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                                <Link to="/blog" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Blog</Link>
                                <Link to="/pricing" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                                <Link to="/contact" className="text-lg font-light" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                            </div>
                            <a
                                href="tel:+1234567890"
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

            {/* Convai Chat Widget */}
            <ConvaiChat agentId="k57XOhpbsRdgDr1Gxn1H" position="bottom-right" />
        </div>
    );
} 