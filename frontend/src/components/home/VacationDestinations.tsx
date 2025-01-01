import { useState } from 'react';

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

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-[1920px] mx-auto px-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif mb-4">Vacation Destinations</h2>
                    <p className="text-gray-600">Need some inspiration to plan your next trip? Plan the ultimate vacation at our top popular destination spots around the world.</p>
                </div>

                {/* Region Selection */}
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-12">
                    {regions.map((region) => (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(region.id)}
                            className={`relative group overflow-hidden rounded-xl aspect-[3/4] w-full ${selectedRegion === region.id
                                ? 'ring-2 ring-gold'
                                : ''
                                }`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={region.image}
                                    alt={region.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 transition-opacity duration-300 ${selectedRegion === region.id
                                    ? 'bg-black/60'
                                    : 'bg-gradient-to-t from-black/80 via-black/40 to-black/30 group-hover:bg-black/50'
                                    }`}></div>
                            </div>

                            {/* Content */}
                            <div className="relative h-full flex flex-col justify-end p-4">
                                <h3 className="font-serif text-base text-white mb-1">{region.name}</h3>
                                <p className="text-white/80 text-sm mb-2 line-clamp-2">{region.description}</p>
                                <div className="flex items-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                        {region.places}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Ethiopian Regions (shown when Ethiopia is selected) */}
                {selectedRegion === 'ethiopia' && (
                    <div className="mt-12">
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {Object.entries(ethiopianRegions).map(([region, destinations]) => (
                                <button
                                    key={region}
                                    onClick={() => setSelectedEthiopianRegion(region)}
                                    className={`px-6 py-2.5 rounded-full text-sm transition-all ${selectedEthiopianRegion === region
                                        ? 'bg-[#D4AF37] text-white'
                                        : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    {region.charAt(0).toUpperCase() + region.slice(1)} Ethiopia
                                    <span className="ml-2 opacity-80">({destinations.length})</span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {ethiopianRegions[selectedEthiopianRegion as keyof EthiopianRegions].map((destination) => (
                                <div key={destination.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                                    <div className="aspect-[16/9] overflow-hidden">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-serif mb-3">{destination.name}</h3>
                                        <p className="text-gray-600">
                                            <span className="font-medium">{destination.count}</span> Experiences Available
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
} 