import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navLinks } from './navConfig.tsx';

interface NavLinksProps {
    onLinkClick?: () => void;
    hoveredLink: string | null;
    onHover: (path: string | null) => void;
    className?: string;
}

export function NavLinks({ onLinkClick, hoveredLink, onHover, className = '' }: NavLinksProps) {
    const location = useLocation();

    return (
        <div className={`flex items-center gap-16 ${className}`}>
            {navLinks.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    className="relative group py-2"
                    onClick={onLinkClick}
                    onMouseEnter={() => onHover(link.path)}
                    onMouseLeave={() => onHover(null)}
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
    );
} 