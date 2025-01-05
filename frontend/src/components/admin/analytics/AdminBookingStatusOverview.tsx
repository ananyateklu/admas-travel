import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface BookingStatusOverviewProps {
    trends: {
        total: number;
        completed: number;
        cancelled: number;
        pending: number;
    };
}

interface StatusItemProps {
    label: string;
    count: number;
    color: string;
    index: number;
    percentage: number;
    details?: {
        label: string;
        value: string | number;
    }[];
}

function formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
}

function StatusItem({ label, count, color, index, percentage, details = [] }: StatusItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ y: -5 }}
            className="group relative"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <motion.div
                className="bg-white rounded-xl border border-gray-100 p-4 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
            >
                <motion.div
                    className="flex items-center gap-2 mb-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    <motion.span
                        className={`w-3 h-3 rounded-full ${color}`}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    />
                    <motion.span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                        {label}
                    </motion.span>
                </motion.div>

                <div className="flex items-end justify-between mb-2">
                    <motion.span
                        className="text-2xl font-medium text-gray-900 block"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {count}
                    </motion.span>
                    <div className="text-right">
                        <span className={`text-sm font-medium ${percentage >= 0 ? 'text-forest-400' : 'text-red-500'}`}>
                            {formatPercentage(percentage)}
                        </span>
                        <motion.div
                            className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1 }}
                        >
                            of total
                        </motion.div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full ${color.replace('bg-', 'bg-opacity-80 bg-')}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>

                {details && details.length > 0 && (
                    <motion.div
                        className="absolute right-2 top-2 text-gray-400 group-hover:text-gray-600"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {isExpanded && details && details.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 bg-white rounded-xl border border-gray-100 p-4 space-y-2"
                    >
                        {details.map((detail, idx) => (
                            <motion.div
                                key={detail.label}
                                className="flex justify-between text-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <span className="text-gray-600">{detail.label}</span>
                                <span className="font-medium text-gray-900">{detail.value}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function BookingStatusOverview({ trends }: BookingStatusOverviewProps) {
    const total = trends.total || 1; // Prevent division by zero
    const getPercentage = (value: number) => Math.round((value / total) * 100);

    const statuses: Omit<StatusItemProps, 'index'>[] = [
        {
            label: 'Completed',
            count: trends.completed,
            color: 'bg-forest-400',
            percentage: getPercentage(trends.completed),
            details: [
                { label: 'Success rate', value: formatPercentage((trends.completed / total) * 100) },
                { label: 'Completion ratio', value: `${trends.completed} of ${total}` }
            ]
        },
        {
            label: 'Pending',
            count: trends.pending,
            color: 'bg-yellow-500',
            percentage: getPercentage(trends.pending),
            details: [
                { label: 'Pending rate', value: formatPercentage((trends.pending / total) * 100) },
                { label: 'Active bookings', value: trends.pending }
            ]
        },
        {
            label: 'Cancelled',
            count: trends.cancelled,
            color: 'bg-red-500',
            percentage: getPercentage(trends.cancelled),
            details: [
                { label: 'Cancellation rate', value: formatPercentage((trends.cancelled / total) * 100) },
                { label: 'Total cancelled', value: trends.cancelled }
            ]
        },
        {
            label: 'Total',
            count: trends.total,
            color: 'bg-blue-500',
            percentage: 100,
            details: [
                { label: 'Active rate', value: formatPercentage(((trends.completed + trends.pending) / total) * 100) },
                { label: 'Total bookings', value: total }
            ]
        }
    ];

    return (
        <motion.div
            className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <motion.h3
                className="text-lg font-medium text-gray-900 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                Booking Status Overview
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {statuses.map((status, index) => (
                    <StatusItem key={status.label} {...status} index={index} />
                ))}
            </div>
        </motion.div>
    );
} 