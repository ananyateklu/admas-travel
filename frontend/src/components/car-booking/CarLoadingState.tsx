import { motion } from 'framer-motion';

interface CarLoadingStateProps {
    count?: number;
}

// Utility to generate stable IDs
const generateStableId = (prefix: string, seed: number) => `${prefix}-${(seed + 1) * 987654321}`;

export function CarLoadingState({ count = 3 }: CarLoadingStateProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={generateStableId('car', i)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                    }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                    {/* Image Skeleton */}
                    <div className="relative">
                        <div className="aspect-[16/9] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
                        {/* Rating Badge Skeleton */}
                        <div className="absolute top-2 right-2">
                            <div className="w-10 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-4 space-y-3">
                        {/* Vehicle Type */}
                        <div className="w-3/4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />

                        {/* Features */}
                        <div className="flex gap-2">
                            {Array.from({ length: 3 }).map((_, j) => (
                                <div
                                    key={generateStableId(`feature-${i}`, j)}
                                    className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded"
                                />
                            ))}
                        </div>

                        {/* Location */}
                        <div className="w-1/2 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="w-1/3 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />
                            <div className="w-1/4 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />
                        </div>

                        {/* Supplier Info */}
                        <div className="flex items-center gap-2 pt-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-full" />
                            <div className="w-1/2 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
} 