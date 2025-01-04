import { motion } from 'framer-motion';

interface BookingHeroProps {
    backgroundImage: string;
    title?: string;
    subtitle?: string;
}

export function BookingHero({
    backgroundImage,
    title = "Book Your Journey",
    subtitle = "Let us help you plan your perfect trip"
}: BookingHeroProps) {
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="relative h-[40vh] bg-gray-900 overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <img
                    src={backgroundImage}
                    alt="View from Airplane Window"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            </motion.div>
            <div className="relative h-full flex items-center justify-center text-center pt-16">
                <motion.div
                    className="max-w-3xl px-4"
                    variants={itemVariants}
                >
                    <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className="text-lg text-white/90"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        {subtitle}
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
} 