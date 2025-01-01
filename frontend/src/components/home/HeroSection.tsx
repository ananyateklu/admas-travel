import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import mountainsBgImage from '../../assets/mountains.jpeg';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export function HeroSection() {
    const containerRef = useRef(null);
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

    return (
        <motion.section
            ref={containerRef}
            className="relative min-h-screen bg-white overflow-hidden"
            style={{ position: 'relative' }}
        >
            {/* Background with Parallax */}
            <motion.div
                className="absolute inset-0"
                style={{ y }}
            >
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    src={mountainsBgImage}
                    alt="Ethiopian Landscape"
                    className="w-full h-full object-cover"
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"
                    style={{ opacity }}
                />
            </motion.div>

            {/* Content */}
            <motion.div
                ref={contentRef}
                className="relative min-h-screen flex flex-col"
            >
                {/* Main Content */}
                <div className="flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto px-8 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">
                            {/* Left side - Main Title */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{
                                    opacity: isInView ? 1 : 0,
                                    x: isInView ? 0 : -50
                                }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-black/20 backdrop-blur-sm p-12 rounded-3xl flex flex-col justify-center"
                            >
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isInView ? 1 : 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="text-yellow-400 text-sm tracking-wider mb-4"
                                >
                                    WELCOME TO THE LAND OF ORIGINS
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: isInView ? 1 : 0,
                                        y: isInView ? 0 : 20
                                    }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                    className="font-serif text-6xl text-white leading-tight mb-6"
                                >
                                    Discover Ethiopia's Ancient Wonders
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isInView ? 1 : 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="text-white/80"
                                >
                                    From rock-hewn churches to volcanic landscapes
                                </motion.p>
                            </motion.div>

                            {/* Right side - Description */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{
                                    opacity: isInView ? 1 : 0,
                                    x: isInView ? 0 : 50
                                }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="bg-black/20 backdrop-blur-sm p-12 rounded-3xl flex flex-col justify-between"
                            >
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isInView ? 1 : 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    className="text-lg font-light mb-8 max-w-xl text-white"
                                >
                                    Experience the cradle of humanity, where ancient traditions meet breathtaking landscapes. Journey through Ethiopia's diverse heritage, from the churches of Lalibela to the tribes of Omo Valley.
                                </motion.p>
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: isInView ? 1 : 0,
                                        scale: isInView ? 1 : 0.9
                                    }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors text-sm w-fit"
                                >
                                    Start Your Journey
                                </motion.button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
} 