import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useNavigate } from 'react-router-dom';

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
    description?: string;
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
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedEthiopianRegion, setSelectedEthiopianRegion] = useState('north');
    const { ref: sectionRef, isInView } = useScrollAnimation({
        threshold: 0.2
    });
    const navigate = useNavigate();

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
        <section className="py-12 bg-gray-50">
            <motion.div
                ref={sectionRef}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
                style={{ position: 'relative' }}
            >
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-8"
                >
                    <span className="text-primary text-xs font-medium tracking-wider uppercase mb-1 block">Popular Destinations</span>
                    <h2 className="text-2xl font-serif mb-2">Vacation Destinations</h2>
                    <p className="text-gray-600 text-sm">Need some inspiration to plan your next trip? Plan the ultimate vacation at our top popular destination spots around the world.</p>
                </motion.div>

                {/* Region Selection */}
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {regions.map((region) => (
                        <motion.button
                            key={region.id}
                            variants={itemVariants}
                            onClick={() => setSelectedRegion(region.id)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`relative group overflow-hidden rounded-lg aspect-[3/4] w-full ${selectedRegion === region.id ? 'ring-1 ring-primary' : ''
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
                            <div className="relative h-full flex flex-col justify-end p-2">
                                <motion.h3
                                    className="font-serif text-sm text-white mb-0.5"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {region.name}
                                </motion.h3>
                                <motion.p
                                    className="text-white/80 text-xs mb-1 line-clamp-2"
                                    initial={{ opacity: 0.6 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    {region.description}
                                </motion.p>
                                <motion.div
                                    className="flex items-center"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary-100">
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
                            className="mt-8"
                        >
                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {Object.entries(ethiopianRegions).map(([region, destinations]) => (
                                    <motion.button
                                        key={region}
                                        variants={cardVariants}
                                        onClick={() => setSelectedEthiopianRegion(region)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 py-1.5 rounded-full text-xs transition-all ${selectedEthiopianRegion === region
                                            ? 'bg-primary text-white'
                                            : 'bg-white hover:bg-primary-50 hover:text-primary'
                                            }`}
                                    >
                                        {region.charAt(0).toUpperCase() + region.slice(1)} Ethiopia
                                        <span className="ml-1 opacity-80">({destinations.length})</span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                            whileHover={{ y: -3 }}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
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
                                            <div className="p-3">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <span className="h-0.5 w-4 bg-gold rounded-full" />
                                                    <span className="text-gold text-xs">{destination.count} Experiences</span>
                                                </div>
                                                <h3 className="text-lg font-serif mb-1 group-hover:text-primary transition-colors">{destination.name}</h3>
                                                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{destination.description ?? 'Discover the rich history and natural beauty of this destination.'}</p>
                                                <div className="flex items-center justify-end">
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate('/explore-more');
                                                        }}
                                                        className="px-2 py-1 bg-primary text-white text-[10px] rounded-full transition-all duration-300 hover:bg-primary-400"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Explore More
                                                    </motion.button>
                                                </div>
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