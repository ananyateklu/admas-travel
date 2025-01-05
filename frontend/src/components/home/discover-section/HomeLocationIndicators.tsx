import { motion } from 'framer-motion';
import { Wonder } from './home-types';

interface LocationIndicatorsProps {
    wonders: Wonder[];
    currentWonder: Wonder;
    onWonderChange: (direction: 'left' | 'right') => void;
}

export function LocationIndicators({ wonders, currentWonder, onWonderChange }: LocationIndicatorsProps) {
    return (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {wonders.map((wonder) => (
                <motion.div
                    key={wonder.id}
                    className={`w-3 h-3 rounded-full ${wonder.id === currentWonder.id ? 'bg-white' : 'bg-white/30'} cursor-pointer`}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => {
                        const direction = wonders.indexOf(wonder) > wonders.indexOf(currentWonder) ? 'right' : 'left';
                        onWonderChange(direction);
                    }}
                />
            ))}
        </div>
    );
} 