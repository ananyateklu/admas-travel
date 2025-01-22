import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { NavigationIndicator } from './HomeNavigationArrows';
import { ContentPanels } from './HomeContentPanels';
import { Wonder, wonders } from './home-types';

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentWonder, setCurrentWonder] = useState<Wonder>(wonders[0]);
    const [isChanging, setIsChanging] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [isLoading, setIsLoading] = useState(true);
    const [userInteracted, setUserInteracted] = useState(false);
    const autoChangeIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const handleNavigate = useCallback((wonderId: string) => {
        if (isChanging) return;

        const targetWonder = wonders.find(w => w.id === wonderId);
        if (!targetWonder || targetWonder.id === currentWonder.id) return;

        setIsChanging(true);
        setDirection(wonders.indexOf(targetWonder) > wonders.indexOf(currentWonder) ? 'right' : 'left');
        setIsLoading(true);
        setCurrentWonder(targetWonder);

        // Reset auto-change when user interacts
        setUserInteracted(true);
        setTimeout(() => {
            setUserInteracted(false);
        }, 10000); // Reset user interaction after 10 seconds

        setTimeout(() => {
            setIsChanging(false);
            setIsLoading(false);
        }, 300);
    }, [isChanging, currentWonder]);

    const handleAutoChange = useCallback(() => {
        if (!userInteracted) {
            const currentIndex = wonders.findIndex(w => w.id === currentWonder.id);
            const nextIndex = (currentIndex + 1) % wonders.length;
            handleNavigate(wonders[nextIndex].id);
        }
    }, [currentWonder, userInteracted, handleNavigate]);

    // Auto-change functionality
    useEffect(() => {
        autoChangeIntervalRef.current = setInterval(handleAutoChange, 5000);
        return () => {
            if (autoChangeIntervalRef.current) {
                clearInterval(autoChangeIntervalRef.current);
            }
        };
    }, [handleAutoChange]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const { ref: contentRef, isInView } = useScrollAnimation({
        once: true,
        threshold: 0.2
    });

    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    // Add mouse enter/leave handlers for the section
    const handleMouseEnter = useCallback(() => {
        setUserInteracted(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setUserInteracted(false);
    }, []);

    return (
        <motion.section
            ref={containerRef}
            className="relative h-[70vh] bg-black overflow-hidden will-change-transform"
            style={{
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWonder.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, x: direction === 'right' ? '100%' : '-100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === 'right' ? '-100%' : '100%' }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                        transform: 'translate3d(0,0,0)',
                        backfaceVisibility: 'hidden',
                        willChange: 'transform, opacity'
                    }}
                >
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-900 animate-pulse z-10" />
                    )}

                    <motion.img
                        src={currentWonder.image}
                        alt={currentWonder.title}
                        className="w-full h-full object-cover"
                        style={{
                            y,
                            transform: 'translate3d(0,0,0)',
                            backfaceVisibility: 'hidden',
                            willChange: 'transform'
                        }}
                        onLoad={handleImageLoad}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        loading="eager"
                    />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"
                        style={{ opacity }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pointer-events-auto">
                    {/* Left side with title and navigation */}
                    <div className="w-[350px] flex flex-col relative pointer-events-auto">
                        {/* Title Section */}
                        <div className="px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <div className="h-0.5 w-4 bg-primary-400 rounded-full" />
                                <p className="text-yellow-400 text-xs font-medium tracking-[0.2em]">
                                    DISCOVER ETHIOPIA
                                </p>
                            </motion.div>
                            <motion.div className="mb-1">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="text-white text-4xl font-serif leading-[1.2] drop-shadow-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-white">Ancient</span>
                                        <span className="text-primary-400">Wonders</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-2xl text-white">&</span>
                                        <span className="text-white">Natural</span>
                                        <span className="text-yellow-400">Beauty</span>
                                    </div>
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="flex items-center gap-2 mt-4"
                                >
                                    <div className="h-0.5 w-12 bg-yellow-400 rounded-full" />
                                    <div className="h-0.5 w-8 bg-primary-400 rounded-full" />
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Navigation */}
                        <div className="mt-8">
                            <NavigationIndicator
                                wonders={wonders}
                                currentWonder={currentWonder}
                                onNavigate={handleNavigate}
                            />
                        </div>
                    </div>

                    {/* Right side - Content */}
                    <motion.div
                        ref={contentRef}
                        className="flex-1 relative z-50 pointer-events-auto"
                        style={{
                            transform: 'translate3d(0,0,0)',
                            backfaceVisibility: 'hidden'
                        }}
                    >
                        <ContentPanels
                            currentWonder={currentWonder}
                            isInView={isInView}
                        />
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-black/30 via-primary-900/30 to-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />
        </motion.section>
    );
} 