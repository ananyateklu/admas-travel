import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks, NavLink, DropdownItem } from './navConfig.tsx';
import { User } from 'firebase/auth';
import { useState } from 'react';

interface NavLinksProps {
    onLinkClick?: () => void;
    hoveredLink: string | null;
    onHover: (path: string | null) => void;
    className?: string;
    user: User | null;
}

export function NavLinks({ onLinkClick, hoveredLink, onHover, className = '', user }: NavLinksProps) {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const filteredLinks = navLinks.filter(link => {
        // Only show bookings and book links if user is logged in
        if (link.path === '/bookings' || link.path === '/book') {
            return user !== null;
        }
        return true;
    });

    const isLinkActive = (link: NavLink) => {
        if (link.dropdown) {
            return link.dropdown.some(item => item.path === location.pathname) || location.pathname === link.path;
        }
        return location.pathname === link.path;
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {filteredLinks.map((link: NavLink) => (
                <div
                    key={link.path}
                    className="relative"
                    onMouseEnter={() => {
                        onHover(link.path);
                        if (link.dropdown) setOpenDropdown(link.path);
                    }}
                    onMouseLeave={() => {
                        onHover(null);
                        setOpenDropdown(null);
                    }}
                >
                    <Link
                        to={link.path}
                        className={`relative flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg transition-all duration-200 ${hoveredLink === link.path || isLinkActive(link)
                            ? 'bg-forest/20 shadow-[0_4px_16px_rgba(45,90,39,0.08)]'
                            : 'hover:bg-forest/10'
                            }`}
                        onClick={onLinkClick}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: hoveredLink === link.path || isLinkActive(link) ? 1 : 0.7,
                                scale: hoveredLink === link.path || isLinkActive(link) ? 1 : 0.8
                            }}
                            transition={{ duration: 0.2 }}
                            className={`${hoveredLink === link.path || isLinkActive(link) ? 'text-forest' : 'text-gray-900'}`}
                        >
                            {link.icon}
                        </motion.div>
                        <span className={`text-xs transition-colors ${hoveredLink === link.path || isLinkActive(link)
                            ? 'text-forest font-medium'
                            : 'text-gray-900'
                            }`}>
                            {link.label}
                        </span>
                        {link.dropdown && (
                            <motion.svg
                                className={`w-4 h-4 ml-0.5 ${hoveredLink === link.path || isLinkActive(link) ? 'text-forest' : 'text-gray-900'
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ rotate: openDropdown === link.path ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        )}
                    </Link>
                    {link.dropdown && (
                        <AnimatePresence>
                            {openDropdown === link.path && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                                >
                                    {link.dropdown.map((item: DropdownItem) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors ${location.pathname === item.path
                                                ? 'bg-forest/20 text-forest font-medium'
                                                : 'text-gray-900 hover:bg-forest/10 hover:text-forest'
                                                }`}
                                            onClick={onLinkClick}
                                        >
                                            <span className="w-4 h-4">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            ))}
        </div>
    );
} 