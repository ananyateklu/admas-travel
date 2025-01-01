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
                            className={`relative group overflow-hidden rounded-xl aspect-[3/4] w-full ${selectedRegion === region.id ? 'ring-2 ring-gold' : ''
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
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                        {region.places}
                                    </span>
                                </motion.div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Ethiopian Regions */}
                <AnimatePresence mode="wait">
                    {selectedRegion === 'ethiopia' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="mt-12"
                        >
                            <div className="flex flex-wrap justify-center gap-4 mb-12">
                                {Object.entries(ethiopianRegions).map(([region, destinations]) => (
                                    <motion.button
                                        key={region}
                                        onClick={() => setSelectedEthiopianRegion(region)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-6 py-2.5 rounded-full text-sm transition-all ${selectedEthiopianRegion === region
                                            ? 'bg-[#D4AF37] text-white'
                                            : 'bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        {region.charAt(0).toUpperCase() + region.slice(1)} Ethiopia
                                        <span className="ml-2 opacity-80">({destinations.length})</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="wait">
                                    {ethiopianRegions[selectedEthiopianRegion as keyof EthiopianRegions].map((destination, index) => (
                                        <motion.div
                                            key={destination.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            whileHover={{ y: -5 }}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                                        >
                                            <motion.div
                                                className="aspect-[16/9] overflow-hidden"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.4 }}
                                            >
                                                <img
                                                    src={destination.image}
                                                    alt={destination.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.div>
                                            <div className="p-6">
                                                <h3 className="text-2xl font-serif mb-3">{destination.name}</h3>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">{destination.count}</span> Experiences Available
                                                </p>
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