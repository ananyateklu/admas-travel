import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate, AnimationPlaybackControls } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface Airline {
    id: string;
    name: string;
    description: string;
    image: string;
    isMainPartner?: boolean;
    features: string[];
    hub: string;
}

interface AirlinesSectionProps {
    airlines: Airline[];
}

export function AirlinesSection({ airlines }: AirlinesSectionProps) {
    const [currentAirlineIndex, setCurrentAirlineIndex] = useState(0);
    const [previousAirlineIndex, setPreviousAirlineIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [dragStart, setDragStart] = useState(0);
    const { ref: sectionRef, isInView } = useScrollAnimation({
        threshold: 0.2
    });

    // Progress indicator animation
    const progress = useMotionValue(0);
    const opacity = useTransform(progress, [0, 100], [0.3, 1]);
    const scale = useTransform(progress, [0, 100], [1, 1.05]);
    const [animationControls, setAnimationControls] = useState<AnimationPlaybackControls | null>(null);

    const handleImageLoad = useCallback((imageSrc: string) => {
        setLoadedImages(prev => new Set(prev).add(imageSrc));
    }, []);

    // Handle auto-playing slideshow and progress
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const startNextTransition = () => {
            const nextIndex = (currentAirlineIndex + 1) % airlines.length;
            setPreviousAirlineIndex(currentAirlineIndex);
            setIsTransitioning(true);
            setCurrentAirlineIndex(nextIndex);
            progress.set(0);
        };

        if (isAutoPlaying && !isTransitioning && loadedImages.has(airlines[currentAirlineIndex].image)) {
            progress.set(0);
            const controls = animate(progress, 100, {
                duration: 4,
                ease: "linear",
                onComplete: startNextTransition
            });
            setAnimationControls(controls);

            return () => {
                controls.stop();
                setAnimationControls(null);
                clearTimeout(timeoutId);
            };
        }
    }, [isAutoPlaying, isTransitioning, currentAirlineIndex, airlines.length, progress, loadedImages, airlines]);

    // Reset auto-play when section comes into view
    useEffect(() => {
        if (isInView) {
            setIsAutoPlaying(true);
            setIsTransitioning(false);
            progress.set(0);
        } else {
            setIsAutoPlaying(false);
            if (animationControls) {
                animationControls.stop();
                setAnimationControls(null);
            }
        }
    }, [isInView, animationControls, progress]);

    // Preload images
    useEffect(() => {
        airlines.forEach(airline => {
            const img = new Image();
            img.onload = () => handleImageLoad(airline.image);
            img.src = airline.image;
        });
    }, [airlines, handleImageLoad]);

    // Handle transition reset
    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const handleImageTransition = (nextIndex: number) => {
        if (nextIndex === currentAirlineIndex || isTransitioning || !loadedImages.has(airlines[nextIndex].image)) return;

        // Stop current animation
        if (animationControls) {
            animationControls.stop();
            setAnimationControls(null);
        }

        setIsAutoPlaying(false);
        setPreviousAirlineIndex(currentAirlineIndex);
        setIsTransitioning(true);
        setCurrentAirlineIndex(nextIndex);
        progress.set(0);

        // Reset transition state after animation completes
        setTimeout(() => {
            setIsTransitioning(false);
        }, 700);
    };

    // Touch/Mouse handlers for swipe
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragStart(clientX);
    };

    const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
        const delta = dragStart - clientX;

        if (Math.abs(delta) > 50) { // Minimum drag distance
            if (delta > 0) {
                nextAirline();
            } else {
                prevAirline();
            }
        }
    };

    const nextAirline = () => {
        setIsAutoPlaying(false);
        const nextIndex = (currentAirlineIndex + 1) % airlines.length;
        handleImageTransition(nextIndex);
    };

    const prevAirline = () => {
        setIsAutoPlaying(false);
        const nextIndex = currentAirlineIndex - 1 < 0 ? airlines.length - 1 : currentAirlineIndex - 1;
        handleImageTransition(nextIndex);
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

    const contentVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    const featureVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: 0.5 + (i * 0.1),
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <motion.section
            ref={sectionRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="h-[100vh] relative overflow-hidden bg-black"
            style={{ position: 'relative' }}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
        >
            {/* Title Overlay */}
            <motion.div
                variants={contentVariants}
                className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-40 pb-12"
            >
                <div className="max-w-7xl mx-auto px-8">
                    <motion.h2
                        variants={contentVariants}
                        className="text-yellow-400 font-serif text-3xl text-white"
                    >
                        Travel the World with Leading Airlines
                    </motion.h2>
                    <motion.p
                        variants={contentVariants}
                        className="text-white/80 mt-2 max-w-2xl text-sm"
                    >
                        Experience exceptional service and worldwide connectivity with our carefully selected airline partners
                    </motion.p>
                </div>
            </motion.div>

            {/* Current and Previous Airline Images */}
            <AnimatePresence mode="sync" custom={currentAirlineIndex > previousAirlineIndex ? 1 : -1}>
                <motion.div
                    key={currentAirlineIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.7,
                        opacity: {
                            duration: 0.3,
                            ease: "easeInOut"
                        }
                    }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    />
                    <motion.img
                        src={airlines[currentAirlineIndex].image}
                        alt={airlines[currentAirlineIndex].name}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ scale }}
                        transition={{
                            duration: 0.7,
                            opacity: { duration: 0.3, delay: 0.2 },
                            scale: { duration: 0.7, ease: "easeOut" }
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            key={currentAirlineIndex}
                            custom={currentAirlineIndex > previousAirlineIndex ? 1 : -1}
                            variants={contentVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute top-1/2 left-0 right-0 px-8 md:px-16 text-white transform -translate-y-1/2"
                        >
                            <div className="max-w-4xl mx-auto">
                                <motion.h2
                                    className="text-4xl font-serif mb-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {airlines[currentAirlineIndex].name}
                                </motion.h2>
                                <motion.p
                                    className="text-base text-white/90 mb-6 max-w-2xl"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {airlines[currentAirlineIndex].description}
                                </motion.p>
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/30 backdrop-blur-sm rounded-2xl p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-3">
                                            Key Features
                                        </h3>
                                        <ul className="space-y-2">
                                            {airlines[currentAirlineIndex].features.map((feature, i) => (
                                                <motion.li
                                                    key={feature}
                                                    custom={i}
                                                    variants={featureVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    className="flex items-center text-white/90"
                                                >
                                                    <motion.svg
                                                        className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </motion.svg>
                                                    <span className="text-sm">{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-3">Main Hub</h3>
                                        <motion.p
                                            className="text-white/90 flex items-center text-sm mb-4"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <svg className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {airlines[currentAirlineIndex].hub}
                                        </motion.p>
                                        {airlines[currentAirlineIndex].isMainPartner && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-400 text-black">
                                                    Main Partner
                                                </span>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevAirline}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
                aria-label="Previous airline"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </motion.button>

            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextAirline}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all"
                aria-label="Next airline"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </motion.button>

            {/* Progress Bar */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/20 rounded-full overflow-hidden z-20">
                <motion.div
                    className="h-full bg-yellow-400 rounded-full origin-left"
                    style={{
                        scaleX: useTransform(progress, [0, 100], [0, 1]),
                        opacity
                    }}
                />
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20">
                {airlines.map((airline, index) => (
                    <motion.button
                        key={airline.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleImageTransition(index)}
                        className={`h-2 rounded-full transition-all ${index === currentAirlineIndex
                            ? 'bg-yellow-400 w-8'
                            : 'bg-white/50 hover:bg-white/80 w-2'
                            }`}
                        aria-label={`Go to airline ${index + 1}`}
                    />
                ))}
            </div>
        </motion.section>
    );
} 