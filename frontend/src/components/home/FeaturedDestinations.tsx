import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FeaturedDestination } from '../../data/featured';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface FeaturedDestinationsProps {
    destinations: FeaturedDestination[];
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const { ref: sectionRef, isInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const nextDestinations = () => {
        setCurrentDestinationIndex((prev) =>
            prev + 4 >= destinations.length ? 0 : prev + 4
        );
    };

    const prevDestinations = () => {
        setCurrentDestinationIndex((prev) =>
            prev - 4 < 0 ? Math.max(destinations.length - 4, 0) : prev - 4
        );
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
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
        <section className="relative py-24 bg-gray-50">
            <div className="relative">
                <motion.div
                    ref={sectionRef}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
                    style={{ position: 'relative' }}
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-serif mb-12 text-center"
                    >
                        Featured Destinations
                    </motion.h2>
                    <div className="relative px-20">
                        {/* Previous Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevDestinations}
                            className="absolute -left-10 top-[calc(50%-3rem)] -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg transition-all z-10 border border-gray-100"
                            aria-label="Previous destinations"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>

                        {/* Destinations Grid */}
                        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <AnimatePresence mode="sync">
                                {destinations
                                    .slice(currentDestinationIndex, currentDestinationIndex + 4)
                                    .map((destination, index) => (
                                        <motion.div
                                            key={destination.link}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}
                                            className="relative"
                                        >
                                            <Link to={destination.link} className="group block">
                                                <motion.div
                                                    className="relative rounded-3xl overflow-hidden mb-4 aspect-[3/4]"
                                                    whileHover={{ scale: 1.03 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <img
                                                        src={destination.image}
                                                        alt={destination.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </motion.div>
                                                <div className="relative">
                                                    <h3 className="text-xl font-serif mb-2 text-gray-900">{destination.name}</h3>
                                                    <p className="text-sm text-gray-600 mb-1">{destination.description}</p>
                                                    <p className="text-sm font-medium text-gold">{destination.country}</p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                            </AnimatePresence>
                        </div>

                        {/* Next Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextDestinations}
                            className="absolute -right-10 top-[calc(50%-3rem)] -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg transition-all z-10 border border-gray-100"
                            aria-label="Next destinations"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: Math.ceil(destinations.length / 4) }).map((_, index) => (
                                <motion.button
                                    key={`destination-page-${index + 1}`}
                                    onClick={() => setCurrentDestinationIndex(index * 4)}
                                    className={`h-2 rounded-full transition-all ${Math.floor(currentDestinationIndex / 4) === index
                                        ? 'bg-gold w-8'
                                        : 'bg-gray-300 hover:bg-gray-400 w-2'
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Go to destination set ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 