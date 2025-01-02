import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import { NavigationIndicator } from './NavigationArrows';
import { ContentPanels } from './ContentPanels';
import { Wonder, wonders } from './types';

export function HeroSection() {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentWonder, setCurrentWonder] = useState<Wonder>(wonders[0]);
    const [isChanging, setIsChanging] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const [isLoading, setIsLoading] = useState(true);

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

    const handleStartJourney = useCallback(() => {
        navigate('/get-started');
    }, [navigate]);

    const handleNavigate = useCallback((wonderId: string) => {
        if (isChanging) return;

        const targetWonder = wonders.find(w => w.id === wonderId);
        if (!targetWonder || targetWonder.id === currentWonder.id) return;

        setIsChanging(true);
        setDirection(wonders.indexOf(targetWonder) > wonders.indexOf(currentWonder) ? 'right' : 'left');
        setIsLoading(true);
        setCurrentWonder(targetWonder);

        setTimeout(() => {
            setIsChanging(false);
        }, 300);
    }, [isChanging, currentWonder]);

    const handleImageLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <motion.section
            ref={containerRef}
            className="relative min-h-screen bg-black overflow-hidden will-change-transform"
            style={{
                transform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden'
            }}
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
                        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"
                        style={{ opacity }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute left-12 top-24 z-10">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-primary-400 text-xs font-medium tracking-[0.2em] mb-3"
                >
                    DISCOVER ETHIOPIA
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-white text-4xl font-serif leading-tight max-w-md"
                >
                    Ancient Wonders<br />& Natural Beauty
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="h-1 w-24 bg-gradient-to-r from-primary-400 to-gold mt-4 rounded-full"
                />
            </div>

            <NavigationIndicator
                wonders={wonders}
                currentWonder={currentWonder}
                onNavigate={handleNavigate}
            />

            <motion.div
                ref={contentRef}
                className="relative min-h-screen flex flex-col"
                style={{
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto px-8 w-full">
                        <ContentPanels
                            currentWonder={currentWonder}
                            isInView={isInView}
                            onStartJourney={handleStartJourney}
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary-900/30 to-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />
        </motion.section>
    );
} 