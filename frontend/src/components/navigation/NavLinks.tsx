import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navLinks } from './navConfig.tsx';
import { User } from 'firebase/auth';

interface NavLinksProps {
    onLinkClick?: () => void;
    hoveredLink: string | null;
    onHover: (path: string | null) => void;
    className?: string;
    user: User | null;
}

export function NavLinks({ onLinkClick, hoveredLink, onHover, className = '', user }: NavLinksProps) {
    const location = useLocation();

    const filteredLinks = navLinks.filter(link => {
        // Only show bookings link if user is logged in
        if (link.path === '/bookings') {
            return user !== null;
        }
        return true;
    });

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {filteredLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className={`relative group py-1.5 px-3.5 rounded-lg transition-all duration-200 ${hoveredLink === link.path || location.pathname === link.path
                        ? 'bg-forest/20 shadow-[0_4px_16px_rgba(45,90,39,0.08)]'
                        : 'hover:bg-forest/10'
                        }`}
                    onClick={onLinkClick}
                    onMouseEnter={() => onHover(link.path)}
                    onMouseLeave={() => onHover(null)}
                >
                    <div className="flex items-center gap-1.5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: hoveredLink === link.path || location.pathname === link.path ? 1 : 0.7,
                                scale: hoveredLink === link.path || location.pathname === link.path ? 1 : 0.8
                            }}
                            transition={{ duration: 0.2 }}
                            className={`${hoveredLink === link.path || location.pathname === link.path ? 'text-forest' : 'text-gray-900'}`}
                        >
                            {link.icon}
                        </motion.div>
                        <span className={`text-xs transition-colors ${hoveredLink === link.path || location.pathname === link.path
                            ? 'text-forest font-medium'
                            : 'text-gray-900'
                            }`}>
                            {link.label}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
} 