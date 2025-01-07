import { motion } from 'framer-motion';

interface HotelLoadingStateProps {
    count?: number;
}

export function HotelLoadingState({ count = 3 }: HotelLoadingStateProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={`loading-hotel-${Math.random().toString(36).slice(2, 11)}`}
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
                        <div className="aspect-[3/1] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
                        {/* Rating Badge Skeleton */}
                        <div className="absolute top-2 right-2">
                            <div className="w-10 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-4 space-y-3">
                        {/* Stars */}
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map(() => (
                                <div
                                    key={`loading-star-${Math.random().toString(36).slice(2, 11)}`}
                                    className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-full"
                                />
                            ))}
                        </div>

                        {/* Title */}
                        <div className="w-3/4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />

                        {/* Location */}
                        <div className="w-1/2 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="w-1/3 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />
                            <div className="w-1/4 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
} 