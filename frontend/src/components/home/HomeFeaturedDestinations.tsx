import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FeaturedDestination } from '../../data/featured';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface FeaturedDestinationsProps {
    destinations: FeaturedDestination[];
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
    const navigate = useNavigate();
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const [slideDirection, setSlideDirection] = useState(0);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [userInteracted, setUserInteracted] = useState(false);
    const { ref: sectionRef, isInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    // Handle image loading
    const handleImageLoad = useCallback((imageSrc: string) => {
        setLoadedImages(prev => new Set(prev).add(imageSrc));
    }, []);

    // Reset user interaction when section comes into view
    useEffect(() => {
        if (isInView) {
            setUserInteracted(false);
        }
    }, [isInView]);

    // Preload images
    useEffect(() => {
        destinations.forEach(destination => {
            const img = new Image();
            img.onload = () => handleImageLoad(destination.image);
            img.src = destination.image;
        });
    }, [destinations, handleImageLoad]);

    const nextDestinations = useCallback(() => {
        setUserInteracted(true);
        setSlideDirection(1);
        setCurrentDestinationIndex((prev) =>
            prev + 4 >= destinations.length ? 0 : prev + 4
        );
    }, [destinations.length]);

    const prevDestinations = useCallback(() => {
        setUserInteracted(true);
        setSlideDirection(-1);
        setCurrentDestinationIndex((prev) =>
            prev - 4 < 0 ? Math.max(destinations.length - 4, 0) : prev - 4
        );
    }, [destinations.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                prevDestinations();
            } else if (e.key === 'ArrowRight') {
                nextDestinations();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextDestinations, prevDestinations]);

    // Auto-advance timer
    useEffect(() => {
        if (!isInView || userInteracted) return;

        const timer = setInterval(() => {
            setSlideDirection(1);
            setCurrentDestinationIndex((prev) =>
                prev + 4 >= destinations.length ? 0 : prev + 4
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [isInView, userInteracted, destinations.length]);

    const handleBooking = (destination: FeaturedDestination) => {
        // Navigate to book page with pre-populated data
        navigate('/book', {
            state: {
                preferences: {
                    destination: 'ethiopia',
                    travelStyle: 'comfort',
                    interests: ['historical', 'cultural'],
                    budget: destination.name.toLowerCase().includes('luxury') ? 'high' : 'medium',
                    duration: 'medium'
                }
            }
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        })
    };

    return (
        <section className="relative py-12 bg-gray-50" aria-label="Featured Destinations">
            <div className="relative">
                <motion.div
                    ref={sectionRef}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
                >
                    <motion.div
                        variants={itemVariants}
                        className="relative text-center mb-8"
                    >
                        <span className="text-primary-400 text-xs font-medium tracking-wider uppercase mb-2 block">Explore With Us</span>
                        <motion.h2
                            variants={itemVariants}
                            className="text-2xl font-serif relative"
                        >
                            Featured Destinations
                        </motion.h2>
                    </motion.div>
                    <div className="relative px-12">
                        {/* Previous Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevDestinations}
                            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-2 rounded-full shadow-md transition-all z-10 border border-gray-100"
                            aria-label="View previous destinations"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>

                        {/* Destinations Grid */}
                        <div className="relative overflow-hidden py-4">
                            <div className="relative w-full" style={{ height: 'min(35vh, 300px)' }}>
                                <AnimatePresence mode="sync">
                                    {destinations
                                        .slice(currentDestinationIndex, currentDestinationIndex + 4)
                                        .map((destination, index) => (
                                            <motion.article
                                                key={`${destination.name}-${currentDestinationIndex + index}`}
                                                custom={slideDirection}
                                                variants={slideVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{
                                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                                    opacity: { duration: 0.2 }
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    width: `${100 / 4}%`,
                                                    left: `${(index * 100) / 4}%`,
                                                    top: '1rem',
                                                    bottom: '1rem',
                                                    padding: '0 0.5rem'
                                                }}
                                                whileHover={{
                                                    scale: 1.05,
                                                    zIndex: 20,
                                                }}
                                                className="origin-center group relative"
                                                aria-label={`${destination.name} in ${destination.country}`}
                                            >
                                                <motion.div
                                                    className="relative h-full rounded-lg overflow-hidden transition-all duration-500 group-hover:shadow-md"
                                                >
                                                    <div className="absolute inset-0">
                                                        {/* Loading Skeleton */}
                                                        {!loadedImages.has(destination.image) && (
                                                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                                        )}

                                                        <motion.img
                                                            src={destination.image}
                                                            alt={destination.name}
                                                            className={`w-full h-full object-cover transition-all duration-700 ${loadedImages.has(destination.image)
                                                                ? 'opacity-100'
                                                                : 'opacity-0'
                                                                }`}
                                                            onLoad={() => handleImageLoad(destination.image)}
                                                        />

                                                        {/* Enhanced Gradient Overlay */}
                                                        <motion.div
                                                            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-50 group-hover:opacity-90"
                                                            initial={{ opacity: 0.5 }}
                                                            whileHover={{ opacity: 0.9 }}
                                                            transition={{ duration: 0.3 }}
                                                        />

                                                        {/* Content Overlay */}
                                                        <div className="absolute inset-0 p-3 flex flex-col justify-end">
                                                            <motion.div
                                                                initial={false}
                                                                animate={{ y: 0, opacity: 1 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="transform transition-all duration-500 group-hover:-translate-y-1"
                                                            >
                                                                <motion.h3
                                                                    className="text-base font-serif mb-1 text-white/70 group-hover:text-white group-hover:text-lg transition-all duration-300"
                                                                    layout
                                                                >
                                                                    {destination.name}
                                                                </motion.h3>
                                                                <motion.p
                                                                    className="text-xs text-white/50 mb-1 group-hover:text-white group-hover:text-sm transition-all duration-300 line-clamp-2 group-hover:line-clamp-none"
                                                                    layout
                                                                >
                                                                    {destination.description}
                                                                </motion.p>
                                                                <motion.div
                                                                    className="flex items-center justify-between gap-1 mt-2"
                                                                    layout
                                                                >
                                                                    <span className="text-xs font-medium text-gold hover:text-gold-300 transition-colors">
                                                                        {destination.country}
                                                                    </span>
                                                                    <motion.button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleBooking(destination);
                                                                        }}
                                                                        className="px-2 py-1 bg-primary text-white text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-400"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        Book Now
                                                                    </motion.button>
                                                                </motion.div>
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.article>
                                        ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Next Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextDestinations}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-2 rounded-full shadow-md transition-all z-10 border border-gray-100"
                            aria-label="View next destinations"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </motion.button>

                        {/* Navigation Dots */}
                        <nav className="flex justify-center gap-1.5 mt-4" aria-label="Destination pages">
                            {Array.from({ length: Math.ceil(destinations.length / 4) }).map((_, index) => (
                                <motion.button
                                    key={`destination-page-${index + 1}`}
                                    onClick={() => {
                                        setUserInteracted(true);
                                        setSlideDirection(index * 4 > currentDestinationIndex ? 1 : -1);
                                        setCurrentDestinationIndex(index * 4);
                                    }}
                                    className={`h-1.5 rounded-full transition-all ${Math.floor(currentDestinationIndex / 4) === index
                                        ? 'bg-gold w-6'
                                        : 'bg-gray-300 hover:bg-gray-400 w-1.5'
                                        }`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={`Go to destination set ${index + 1}`}
                                    aria-current={Math.floor(currentDestinationIndex / 4) === index ? 'true' : 'false'}
                                />
                            ))}
                        </nav>
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 