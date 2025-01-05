import { motion } from 'framer-motion';

interface PopularDestinationsProps {
    destinations: [string, number][];
}

export function PopularDestinations({ destinations }: PopularDestinationsProps) {
    const maxCount = destinations[0]?.[1] || 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="bg-white rounded-xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 p-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <motion.h3
                className="text-lg font-medium text-gray-900 mb-6"
                variants={itemVariants}
            >
                Popular Destinations
            </motion.h3>
            <motion.div className="space-y-4">
                {destinations.map(([destination, count], index) => (
                    <motion.div
                        key={destination}
                        className="group"
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <motion.span
                                    className="font-medium text-gray-900 group-hover:text-gold transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {destination}
                                </motion.span>
                                <motion.span
                                    className="text-sm text-gray-600"
                                    initial={{ opacity: 0.8 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    {count} bookings
                                </motion.span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="bg-gold h-2 rounded-full origin-left"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: count / maxCount }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeOut",
                                        delay: index * 0.1
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
} 