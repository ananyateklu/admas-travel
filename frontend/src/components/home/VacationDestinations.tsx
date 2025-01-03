import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface Region {
    id: string;
    name: string;
    places: string;
    image: string;
    description: string;
}

interface EthiopianDestination {
    name: string;
    count: number;
    image: string;
}

interface EthiopianRegions {
    north: EthiopianDestination[];
    south: EthiopianDestination[];
    east: EthiopianDestination[];
    central: EthiopianDestination[];
}

interface VacationDestinationsProps {
    regions: Region[];
    ethiopianRegions: EthiopianRegions;
}

export function VacationDestinations({ regions, ethiopianRegions }: VacationDestinationsProps) {
    const [selectedRegion, setSelectedRegion] = useState('africa');
    const [selectedEthiopianRegion, setSelectedEthiopianRegion] = useState('north');
    const { ref: sectionRef, isInView } = useScrollAnimation({
        threshold: 0.2
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
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

    const ethiopianRegionVariants = {
        initial: {
            opacity: 0,
            x: 100,
            transition: { duration: 0.3 }
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            x: -100,
            transition: { duration: 0.3 }
        }
    };

    const cardVariants = {
        initial: {
            opacity: 0,
            x: 50
        },
        animate: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        },
        exit: {
            opacity: 0,
            x: -50,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <section className="py-24 bg-gray-50">
            <motion.div
                ref={sectionRef}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="max-w-[1920px] mx-auto px-24"
                style={{ position: 'relative' }}
            >
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-sm font-medium tracking-wider uppercase mb-2 block">Popular Destinations</span>
                    <h2 className="text-3xl font-serif mb-4">Vacation Destinations</h2>
                    <p className="text-gray-600">Need some inspiration to plan your next trip? Plan the ultimate vacation at our top popular destination spots around the world.</p>
                </motion.div>

                {/* Region Selection */}
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-12">
                    {regions.map((region) => (
                        <motion.button
                            key={region.id}
                            variants={itemVariants}
                            onClick={() => setSelectedRegion(region.id)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative group overflow-hidden rounded-xl aspect-[3/4] w-full ${selectedRegion === region.id ? 'ring-2 ring-primary' : ''
                                }`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <motion.img
                                    src={region.image}
                                    alt={region.name}
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.6 }}
                                />
                                {/* Gradient Overlay */}
                                <motion.div
                                    className={`absolute inset-0 transition-opacity duration-300 ${selectedRegion === region.id
                                        ? 'bg-black/60'
                                        : 'bg-gradient-to-t from-black/80 via-black/40 to-black/30 group-hover:bg-black/50'
                                        }`}
                                />
                            </div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-end p-4">
                                <motion.h3
                                    className="font-serif text-base text-white mb-1"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {region.name}
                                </motion.h3>
                                <motion.p
                                    className="text-white/80 text-sm mb-2 line-clamp-2"
                                    initial={{ opacity: 0.6 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    {region.description}
                                </motion.p>
                                <motion.div
                                    className="flex items-center"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary-100">
                                        {region.places}
                                    </span>
                                </motion.div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Ethiopian Regions */}
                <AnimatePresence mode="sync">
                    {selectedRegion === 'ethiopia' && (
                        <motion.div
                            variants={ethiopianRegionVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="mt-12"
                        >
                            <div className="flex flex-wrap justify-center gap-4 mb-12">
                                {Object.entries(ethiopianRegions).map(([region, destinations]) => (
                                    <motion.button
                                        key={region}
                                        variants={cardVariants}
                                        onClick={() => setSelectedEthiopianRegion(region)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-6 py-2.5 rounded-full text-sm transition-all ${selectedEthiopianRegion === region
                                            ? 'bg-primary text-white'
                                            : 'bg-white hover:bg-primary-50 hover:text-primary'
                                            }`}
                                    >
                                        {region.charAt(0).toUpperCase() + region.slice(1)} Ethiopia
                                        <span className="ml-2 opacity-80">({destinations.length})</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="sync">
                                    {ethiopianRegions[selectedEthiopianRegion as keyof EthiopianRegions].map((destination, index) => (
                                        <motion.div
                                            key={destination.name}
                                            variants={cardVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            custom={index}
                                            transition={{
                                                delay: index * 0.1
                                            }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                                        >
                                            <motion.div
                                                className="aspect-[16/9] overflow-hidden relative"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <img
                                                    src={destination.image}
                                                    alt={destination.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </motion.div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="h-0.5 w-6 bg-gold rounded-full" />
                                                    <span className="text-gold text-sm">{destination.count} Experiences</span>
                                                </div>
                                                <h3 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors">{destination.name}</h3>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary hover:text-white transition-all"
                                                >
                                                    View Details
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
} 