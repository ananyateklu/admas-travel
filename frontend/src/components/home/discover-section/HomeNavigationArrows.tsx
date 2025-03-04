import { motion } from 'framer-motion';
import { Wonder } from './home-types';

interface NavigationIndicatorProps {
    wonders: Wonder[];
    currentWonder: Wonder;
    onNavigate: (wonderId: string) => void;
}

export function NavigationIndicator({ wonders, currentWonder, onNavigate }: NavigationIndicatorProps) {
    return (
        <div className="h-full flex items-start pt-6">
            <div className="flex flex-col gap-3 pl-8 relative z-20">
                {wonders.map((wonder, index) => (
                    <motion.div
                        key={wonder.id}
                        className={`group cursor-pointer flex items-center gap-2`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => onNavigate(wonder.id)}
                    >
                        <motion.div className="relative flex items-center gap-1">
                            <motion.div
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 
                                    ${wonder.id === currentWonder.id
                                        ? index % 2 === 0 ? 'bg-yellow-400' : 'bg-primary-400'
                                        : 'bg-white/30'}`}
                            />
                            {wonder.id !== currentWonder.id && (
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-white/30"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.6, 1] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            )}
                        </motion.div>

                        <motion.span
                            className={`text-xs font-light whitespace-nowrap
                                ${wonder.id === currentWonder.id
                                    ? index % 2 === 0 ? 'text-yellow-400' : 'text-primary-400'
                                    : 'text-white/50 group-hover:text-white/70'}`}
                        >
                            {wonder.title}
                        </motion.span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
} 