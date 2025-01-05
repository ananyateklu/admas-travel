import { motion } from 'framer-motion';

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'upcoming': return 'bg-blue-50/80 text-blue-700 border border-blue-200/50 shadow-sm shadow-blue-100/20';
        case 'confirmed': return 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/50 shadow-sm shadow-emerald-100/20';
        case 'pending': return 'bg-amber-50/80 text-amber-700 border border-amber-200/50 shadow-sm shadow-amber-100/20';
        case 'completed': return 'bg-purple-50/80 text-purple-700 border border-purple-200/50 shadow-sm shadow-purple-100/20';
        case 'cancelled': return 'bg-rose-50/80 text-rose-700 border border-rose-200/50 shadow-sm shadow-rose-100/20';
        default: return 'bg-gray-50/80 text-gray-700 border border-gray-200/50 shadow-sm shadow-gray-100/20';
    }
};

interface StatusBadgeProps {
    status: string;
    className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <motion.span
            className={`inline-flex items-center px-1 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${getStatusStyle(status)} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {displayText}
        </motion.span>
    );
} 