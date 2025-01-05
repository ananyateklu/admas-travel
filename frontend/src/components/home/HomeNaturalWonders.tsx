import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import danakilImage from '../../assets/danakil.jpg';
import abayRiverImage from '../../assets/abay-river.jpeg';

export function NaturalWonders() {
    const { ref: sectionRef, isInView } = useScrollAnimation({
        threshold: 0.2
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.3
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section className="py-12 bg-gray-50 relative overflow-hidden">
            <motion.div
                ref={sectionRef}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
                style={{ position: 'relative' }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <motion.div variants={textVariants}>
                        <motion.h2
                            variants={textVariants}
                            className="text-2xl font-serif mb-3"
                        >
                            Discover Natural Wonders
                        </motion.h2>
                        <motion.p
                            variants={textVariants}
                            className="text-gray-600 text-sm mb-4"
                        >
                            From the otherworldly landscapes of the Danakil Depression to the lush Simien Mountains,
                            Ethiopia offers some of Africa's most spectacular natural wonders.
                        </motion.p>
                        <motion.div
                            variants={textVariants}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/natural-wonders"
                                className="inline-block px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-400 transition-colors group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-1 text-xs">
                                    Explore More
                                    <motion.span
                                        className="text-gold"
                                        animate={{ x: [0, 2, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        →
                                    </motion.span>
                                </span>
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    initial={false}
                                    animate={{ x: ['0%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </Link>
                        </motion.div>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-3">
                        <motion.div
                            variants={imageVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.img
                                src={danakilImage}
                                alt="Danakil Depression"
                                className="rounded-lg w-full aspect-[3/4] object-cover"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                            />
                        </motion.div>
                        <motion.div
                            variants={imageVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                        >
                            <motion.img
                                src={abayRiverImage}
                                alt="Blue Nile Falls"
                                className="rounded-lg w-full aspect-[3/4] object-cover"
                                whileHover={{ scale: 1.03 }}
                                transition={{ duration: 0.4 }}
                            />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
} 