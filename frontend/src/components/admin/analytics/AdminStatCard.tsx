import React, { useState } from 'react';
import { Tooltip } from '../../common/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
    details?: {
        label: string;
        value: string | number;
    }[];
}

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    className = '',
    details = []
}: StatCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getIconColorClass = () => {
        if (!trend) {
            return 'bg-gold-50/50 text-gold';
        }
        return trend.isPositive
            ? 'bg-forest-50/50 text-forest-400'
            : 'bg-red-50/50 text-red-600';
    };

    const getValueColorClass = () => {
        if (!trend) return 'text-gold';
        return trend.isPositive ? 'text-forest-400' : 'text-red-600';
    };

    const getTooltipContent = () => {
        if (!trend) return subtitle;
        return trend.isPositive ? 'Increase from previous period' : 'Decrease from previous period';
    };

    return (
        <motion.div
            className={`bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer relative group ${isExpanded ? 'ring-2 ring-gold shadow-lg' : ''} ${className}`}
            onClick={() => setIsExpanded(!isExpanded)}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <div className="flex items-center justify-between mb-4 p-6">
                <Tooltip content={`View details for ${title}`}>
                    <motion.h3
                        className="text-lg font-medium text-gray-900 cursor-pointer hover:text-gold transition-colors"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {title}
                    </motion.h3>
                </Tooltip>
                <Tooltip content={getTooltipContent()}>
                    <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColorClass()}`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {icon}
                    </motion.div>
                </Tooltip>
            </div>

            <div className="px-6 pb-6">
                <motion.div
                    className={`text-3xl font-bold mb-2 ${getValueColorClass()}`}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                >
                    {value}
                </motion.div>
                <motion.p
                    className="text-sm text-gray-600"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                >
                    {subtitle}
                </motion.p>

                <AnimatePresence>
                    {details.length > 0 && isExpanded && (
                        <motion.div
                            className="mt-4 pt-4 border-t border-gray-100 space-y-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {details.map((detail, index) => (
                                <motion.div
                                    key={detail.label}
                                    className="flex justify-between text-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="text-gray-600">{detail.label}</span>
                                    <span className="font-medium text-gray-900">{detail.value}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {details.length > 0 && (
                    <motion.div
                        className="mt-4 flex items-center justify-center text-gray-400 group-hover:text-gray-600"
                    >
                        <motion.div
                            className="flex items-center gap-2 text-sm font-medium"
                            initial={{ opacity: 0.6 }}
                            whileHover={{ opacity: 1 }}
                        >
                            {isExpanded ? 'Show Less' : 'Show More'}
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </div>

            {/* Interactive highlight effect */}
            <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 pointer-events-none"
                animate={{
                    opacity: isHovered ? 1 : 0,
                    backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%',
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
        </motion.div>
    );
} 