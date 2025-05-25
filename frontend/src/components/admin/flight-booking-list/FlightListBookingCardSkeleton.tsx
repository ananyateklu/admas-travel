import { motion } from 'framer-motion';

export function FlightListBookingCardSkeleton() {
    return (
        <motion.div
            className="bg-white/95 rounded-xl shadow-sm border border-gray-200/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="flex items-start gap-4">
                {/* Date skeleton */}
                <motion.div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Content skeleton */}
                <div className="flex-1 space-y-3">
                    <motion.div
                        className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                    />
                    <motion.div
                        className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                </div>

                {/* Avatar skeletons */}
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 * i }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
} 