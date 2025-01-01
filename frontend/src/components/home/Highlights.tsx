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
        <section className="py-24 bg-gradient-to-br from-dark-100 to-dark-300 mx-4 rounded-[3rem] relative overflow-hidden">
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        'radial-gradient(circle at 0% 0%, #D4AF37 0%, transparent 50%)',
                        'radial-gradient(circle at 100% 100%, #4c9959 0%, transparent 50%)',
                        'radial-gradient(circle at 0% 0%, #D4AF37 0%, transparent 50%)',
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                ref={sectionRef}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
            >
                <motion.div
                    variants={textVariants}
                    className="text-center mb-16"
                >
                    <span className="text-primary-400 text-sm font-medium tracking-wider uppercase mb-4 block">Our Highlights</span>
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
                                    <motion.div
                                        className="flex items-center gap-2 mb-2"
                                        variants={textVariants}
                                    >
                                        <span className="h-0.5 w-6 bg-primary rounded-full" />
                                        <span className="text-primary-300 text-sm">{highlight.category}</span>
                                    </motion.div>
                                    <motion.h3
                                        variants={textVariants}
                                        className="text-2xl font-serif mb-2 text-white group-hover:text-gold transition-colors"
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