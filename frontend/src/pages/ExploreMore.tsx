import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { wonders } from '../components/home/discover-section/home-types';

interface Wonder {
    id: string;
    title: string;
    description: string;
    image: string;
    elevation?: string;
    activities?: string[];
    tips?: string[];
}

interface ExploreMoreModalProps {
    wonder: Wonder;
    isOpen: boolean;
    onClose: () => void;
}

function ExploreMoreModal({ wonder, isOpen, onClose }: ExploreMoreModalProps) {
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50 cursor-pointer"
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <motion.div
                            layoutId={`wonder-card-${wonder.id}`}
                            className="bg-white rounded-xl overflow-hidden w-full max-w-6xl max-h-[90vh] shadow-2xl"
                            onClick={handleContentClick}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300
                            }}
                        >
                            <div className="grid grid-cols-[1.2fr,1fr] relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-50"
                                >
                                    ✕
                                </button>
                                <motion.div
                                    layoutId={`wonder-image-${wonder.id}`}
                                    className="relative h-full"
                                >
                                    <motion.img
                                        layoutId={`wonder-img-${wonder.id}`}
                                        src={wonder.image}
                                        alt={wonder.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-8 space-y-6 overflow-y-auto max-h-[90vh]"
                                >
                                    <motion.div
                                        layoutId={`wonder-location-${wonder.id}`}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="h-0.5 w-4 rounded-full bg-yellow-400" />
                                        <span className="text-xs font-medium text-gray-500">
                                            Ethiopia
                                        </span>
                                    </motion.div>
                                    <motion.h2
                                        layoutId={`wonder-title-${wonder.id}`}
                                        className="text-2xl font-serif"
                                    >
                                        {wonder.title}
                                    </motion.h2>

                                    {/* Overview Section */}
                                    <div className="space-y-3">
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-gray-600 leading-relaxed text-sm"
                                        >
                                            {wonder.description}
                                        </motion.p>
                                    </div>

                                    {/* Quick Facts */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100"
                                    >
                                        <div>
                                            <h4 className="text-xs font-medium text-gray-900 mb-0.5">Best Time to Visit</h4>
                                            <p className="text-xs text-gray-600">October to May (Dry Season)</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-medium text-gray-900 mb-0.5">Elevation</h4>
                                            <p className="text-xs text-gray-600">{wonder.elevation ?? "Varies by location"}</p>
                                        </div>
                                    </motion.div>

                                    {/* Activities Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="border-t border-gray-100 pt-3"
                                    >
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Activities & Experiences</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(wonder.activities ?? [
                                                "Hiking",
                                                "Photography",
                                                "Wildlife Viewing",
                                                "Cultural Tours"
                                            ]).map((activity: string) => (
                                                <div
                                                    key={activity}
                                                    className="flex items-center gap-2 text-gray-600"
                                                >
                                                    <div className="w-1 h-1 rounded-full bg-primary-400" />
                                                    <span className="text-xs">{activity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Travel Tips */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="border-t border-gray-100 pt-3"
                                    >
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">Travel Tips</h3>
                                        <ul className="space-y-2">
                                            {(wonder.tips ?? [
                                                "Bring appropriate hiking gear and comfortable shoes",
                                                "Carry plenty of water and snacks",
                                                "Consider hiring a local guide for the best experience",
                                                "Start early to avoid peak sun hours"
                                            ]).map((tip: string, index: number) => (
                                                <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                                                    <span className="text-primary-400 mt-0.5">•</span>
                                                    <span>{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>

                                    {/* Book Now Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="pt-3 border-t border-gray-100"
                                    >
                                        <button
                                            className="w-full bg-primary-400 hover:bg-primary-500 text-white py-2 rounded-lg transition-colors font-medium text-sm"
                                        >
                                            Plan Your Visit
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function NaturalWonders() {
    const [selectedWonder, setSelectedWonder] = useState<Wonder | null>(null);
    const { ref: pageRef, isInView } = useScrollAnimation({
        threshold: 0.1,
        once: true
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <LayoutGroup>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-white"
            >
                {/* Hero Section */}
                <section className="relative h-[40vh] bg-black overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={wonders[0].image}
                            alt="Ethiopian Wonders"
                            className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center pt-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center justify-center gap-2 mb-3"
                            >
                                <div className="h-0.5 w-6 bg-yellow-400 rounded-full" />
                                <span className="text-yellow-400 text-xs font-medium tracking-wider uppercase">
                                    Explore Ethiopia
                                </span>
                                <div className="h-0.5 w-6 bg-primary-400 rounded-full" />
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-4xl font-serif text-white mb-2"
                            >
                                Natural Wonders
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/90 max-w-lg mx-auto px-4 text-sm"
                            >
                                Discover the breathtaking landscapes and ancient treasures that make Ethiopia unique
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Wonders Grid */}
                <motion.section
                    ref={pageRef}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={containerVariants}
                    className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wonders.map((wonder: Wonder) => (
                            <motion.div
                                layoutId={`wonder-card-${wonder.id}`}
                                key={wonder.id}
                                variants={itemVariants}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                    transition: {
                                        duration: 0.3,
                                        ease: "easeOut"
                                    }
                                }}
                                className="group bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.15)] transition-shadow duration-300 cursor-pointer"
                                onClick={() => setSelectedWonder(wonder as Wonder)}
                            >
                                <motion.div
                                    layoutId={`wonder-image-${wonder.id}`}
                                    className="relative aspect-[4/3] overflow-hidden"
                                >
                                    <motion.img
                                        layoutId={`wonder-img-${wonder.id}`}
                                        src={wonder.image}
                                        alt={wonder.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                </motion.div>
                                <div className="p-4">
                                    <motion.div
                                        layoutId={`wonder-location-${wonder.id}`}
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <div className="h-0.5 w-4 rounded-full bg-yellow-400" />
                                        <span className="text-[11px] font-medium text-gray-500">
                                            Ethiopia
                                        </span>
                                    </motion.div>
                                    <motion.h3
                                        layoutId={`wonder-title-${wonder.id}`}
                                        className="text-base font-serif mb-1.5 group-hover:text-primary transition-colors"
                                    >
                                        {wonder.title}
                                    </motion.h3>
                                    <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                                        {wonder.description}
                                    </p>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-3 py-1 text-[11px] rounded-full bg-primary-400/10 text-primary-600 hover:bg-primary-400 hover:text-white transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedWonder(wonder as Wonder);
                                        }}
                                    >
                                        Learn More
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Wonder Details Modal */}
                <ExploreMoreModal
                    wonder={selectedWonder!}
                    isOpen={selectedWonder !== null}
                    onClose={() => setSelectedWonder(null)}
                />
            </motion.div>
        </LayoutGroup>
    );
} 