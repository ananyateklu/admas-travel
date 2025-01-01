import { motion } from 'framer-motion';
import { Highlight } from '../../data/highlights';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface HighlightsProps {
    highlights: Highlight[];
}

export function Highlights({ highlights }: HighlightsProps) {
    const { ref: sectionRef, isInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="py-24 bg-gray-900 mx-4 rounded-[3rem]">
            <motion.div
                ref={sectionRef}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                style={{ position: 'relative' }}
            >
                <motion.div
                    variants={textVariants}
                    className="text-center mb-16"
                >
                    <h2 className="font-serif text-4xl mb-4 text-white">Experience Ethiopia with Us</h2>
                    <p className="text-gray-400">Curated experiences that showcase the best of Ethiopian culture, history, and nature</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {highlights.map((highlight) => (
                        <motion.div
                            key={highlight.id}
                            variants={itemVariants}
                            className="rounded-3xl overflow-hidden aspect-[3/4] relative group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full"
                            >
                                <img
                                    src={highlight.image}
                                    alt={highlight.title}
                                    className="w-full h-full object-cover"
                                />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
                                    <motion.h3
                                        variants={textVariants}
                                        className="text-2xl font-serif mb-2 text-white"
                                    >
                                        {highlight.title}
                                    </motion.h3>
                                    <motion.p
                                        variants={textVariants}
                                        className="text-white/80"
                                    >
                                        {highlight.description}
                                    </motion.p>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
} 