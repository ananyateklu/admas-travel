import React from 'react';
import { motion } from 'framer-motion';

interface BookingMetaBadgeProps {
    icon: React.ReactNode;
    label?: string;
    value: string;
    className?: string;
}

export function BookingMetaBadge({ icon, label, value, className = '' }: BookingMetaBadgeProps) {
    return (
        <motion.div
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-forest-50/80 text-forest-700 border border-forest-200/50 shadow-sm ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="text-forest-500">{icon}</span>
            {label && <span className="text-forest-600">{label}:</span>}
            <span>{value}</span>
        </motion.div>
    );
} 