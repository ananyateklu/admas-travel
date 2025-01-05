import { motion } from 'framer-motion';

interface HotelBookingHeroProps {
    backgroundImage: string;
    title?: string;
    subtitle?: string;
}

export function HotelBookingHero({
    backgroundImage,
    title = "Find Your Perfect Stay",
    subtitle = "Discover comfort and luxury at your dream destination"
}: HotelBookingHeroProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    return (
        <motion.div
            className="relative h-[30vh] bg-gray-900 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
            >
                <img
                    src={backgroundImage}
                    alt="Luxury Hotel View"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            </motion.div>
            <div className="relative h-full flex items-center justify-center text-center pt-12">
                <motion.div
                    className="max-w-2xl px-4"
                    variants={itemVariants}
                >
                    <motion.h1
                        className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className="text-base text-white/90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {subtitle}
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
} 