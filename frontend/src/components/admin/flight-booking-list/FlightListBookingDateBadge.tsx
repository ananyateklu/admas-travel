import { motion } from 'framer-motion';

interface BookingDateBadgeProps {
    date: Date | string;
}

export function BookingDateBadge({ date }: BookingDateBadgeProps) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return null;
    }

    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-forest-400/10 to-forest-600/10 rounded-xl blur-[6px]" />
            <div className="relative flex flex-col items-center justify-center w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-forest-50/90 to-forest-100/80 border border-forest-200/30 shadow-sm backdrop-blur-sm">
                <motion.span
                    className="text-lg font-bold bg-gradient-to-br from-forest-700 to-forest-600 bg-clip-text text-transparent"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {dateObj.getDate()}
                </motion.span>
                <motion.span
                    className="text-[10px] font-medium text-forest-600/80 uppercase tracking-wider"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {dateObj.toLocaleDateString(undefined, { month: 'short' })}
                </motion.span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </motion.div>
    );
} 