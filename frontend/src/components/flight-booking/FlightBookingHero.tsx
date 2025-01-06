import { motion } from 'framer-motion';

interface BookingHeroProps {
    backgroundImage: string;
}

export function BookingHero({ backgroundImage }: BookingHeroProps) {
    return (
        <div className="relative h-[300px]">
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
            >
                <img
                    src={backgroundImage}
                    alt="Booking Hero"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            </motion.div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-serif mb-3"
                >
                    Book Your Flight
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base text-white/90 max-w-2xl"
                >
                    Find and book the perfect flight for your journey
                </motion.p>
            </div>
        </div>
    );
} 