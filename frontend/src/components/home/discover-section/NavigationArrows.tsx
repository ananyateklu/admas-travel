import { motion } from 'framer-motion';
import { Wonder } from './types';

interface NavigationIndicatorProps {
    wonders: Wonder[];
    currentWonder: Wonder;
    onNavigate: (wonderId: string) => void;
}

export function NavigationIndicator({ wonders, currentWonder, onNavigate }: NavigationIndicatorProps) {
    return (
        <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-10">
            {wonders.map((wonder) => (
                <motion.div
                    key={wonder.id}
                    className={`group cursor-pointer flex items-center gap-3`}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onNavigate(wonder.id)}
                >
                    <motion.div className="relative flex items-center">
                        <motion.div
                            className={`w-2 h-2 rounded-full transition-all duration-300 
                                ${wonder.id === currentWonder.id
                                    ? 'bg-yellow-400'
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
                        className={`text-sm font-light
                            ${wonder.id === currentWonder.id
                                ? 'text-yellow-400'
                                : 'text-white/50 group-hover:text-white/70'}`}
                    >
                        {wonder.title}
                    </motion.span>
                </motion.div>
            ))}
        </div>
    );
} 