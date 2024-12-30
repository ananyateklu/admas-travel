import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Search:', searchQuery);
    };

    return (
        <div className="min-h-screen bg-white text-dark">
            {/* Header Container */}
            <div className="absolute top-4 left-0 right-0 z-50">
                <div className="mx-8">
                    {/* Header */}
                    <header className="mx-auto bg-white rounded-[2rem] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <nav className="px-8 py-4">
                            <div className="flex items-center justify-between gap-8">
                                {/* Left section */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-1.5 text-sm font-light"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    Menu
                                </button>

                                {/* Center section */}
                                <div className="flex items-center gap-12">
                                    <Link to="/about-us" className="text-sm font-light hover:text-gold transition-colors">About</Link>
                                    <Link to="/pricing" className="text-sm font-light hover:text-gold transition-colors">Pricing</Link>
                                    <Link to="/contact" className="text-sm font-light hover:text-gold transition-colors">Contact</Link>
                                </div>

                                {/* Right section */}
                                <div className="flex items-center gap-4">
                                    <form onSubmit={handleSearch} className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-[180px] px-4 py-1.5 rounded-[1.2rem] bg-[#F5F5F1] text-sm font-light focus:outline-none"
                                        />
                                    </form>
                                    <Link
                                        to="/get-started"
                                        className="px-4 py-1.5 bg-[#1A1A1A] text-white rounded-[1.2rem] text-sm font-light hover:bg-black transition-colors"
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
                            <form onSubmit={handleSearch} className="mt-8">
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[#F5F5F1] text-sm font-light focus:outline-none"
                                />
                            </form>
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
            <main className="min-h-screen">
                <Outlet />
            </main>
        </div>
    );
} 