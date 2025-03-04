import { motion, AnimatePresence } from 'framer-motion';
import { Wonder } from './home-types';
import { useNavigate } from 'react-router-dom';

interface ContentPanelsProps {
    currentWonder: Wonder;
    isInView: boolean;
}

export function ContentPanels({ currentWonder, isInView }: ContentPanelsProps) {
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

    const titleVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    const descriptionBoxVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const descriptionItemVariants = {
        hidden: {
            opacity: 0,
            x: -10
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const navigate = useNavigate();

    return (
        <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-white ml-[calc(2rem+100px)] mr-6 relative z-20 flex flex-col gap-8"
        >
            {/* Title Section */}
            <motion.div variants={itemVariants} className="max-w-xl">
                <div className="overflow-hidden">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.1
                        }}
                        className="flex items-center gap-2 mb-1"
                    >
                        <span className="inline-block text-primary-400 text-4xl font-serif">
                            Discover
                        </span>
                        <div className="h-0.5 w-8 bg-yellow-400 rounded-full" />
                    </motion.div>
                </div>

                <div className="overflow-hidden h-[60px]">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.h2
                            key={currentWonder.id}
                            custom={1}
                            variants={titleVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="text-4xl font-serif leading-tight text-white/70"
                        >
                            {currentWonder.title}
                        </motion.h2>
                    </AnimatePresence>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="mt-4 relative z-50 pointer-events-auto"
                >
                    <motion.button
                        onClick={() => navigate('/explore-more')}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                        }}
                        whileTap={{
                            scale: 0.95,
                            boxShadow: "0 5px 10px rgba(0,0,0,0.2)"
                        }}
                        className="group relative z-50 px-6 py-2 bg-gradient-to-r from-yellow-400 to-primary-400 text-black rounded-full hover:from-yellow-300 hover:to-primary-300 transition-all hover:px-8 text-xs cursor-pointer shadow-lg pointer-events-auto"
                    >
                        <span className="font-medium tracking-wide relative z-50">Learn More</span>
                        <motion.span
                            className="inline-block ml-2 relative z-50"
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            →
                        </motion.span>
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Description Box */}
            <motion.div
                variants={descriptionBoxVariants}
                className="max-w-lg backdrop-blur-[4px] bg-white/5 rounded-xl p-4 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                }}
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 }
                }}
            >
                <motion.div variants={descriptionItemVariants} className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                        <div className="w-0.5 h-4 bg-yellow-400/80 rounded-full" />
                        <div className="w-0.5 h-4 bg-primary-400/80 rounded-full" />
                    </div>
                    <h3 className="text-xs font-medium uppercase tracking-wider text-primary-300">About this Wonder</h3>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentWonder.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-white/70 text-sm leading-relaxed pl-[10px]"
                    >
                        {currentWonder.description}
                    </motion.p>
                </AnimatePresence>

                <motion.div
                    variants={descriptionItemVariants}
                    className="mt-3 pt-3 border-t border-white/10 pl-[10px]"
                >
                    <motion.div
                        className="flex items-center gap-1.5 text-primary-300 hover:text-primary-200 transition-colors"
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs tracking-wide">Ethiopia</span>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
} 