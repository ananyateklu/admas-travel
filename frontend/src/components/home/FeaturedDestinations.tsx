import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedDestination } from '../../data/featured';

interface FeaturedDestinationsProps {
    destinations: FeaturedDestination[];
}

export function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);

    const nextDestinations = () => {
        setCurrentDestinationIndex((prev) =>
            prev + 4 >= destinations.length ? 0 : prev + 4
        );
    };

    const prevDestinations = () => {
        setCurrentDestinationIndex((prev) =>
            prev - 4 < 0 ? Math.max(destinations.length - 4, 0) : prev - 4
        );
    };

    return (
        <section className="py-24">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-serif mb-12 text-center">Featured Destinations</h2>
                <div className="relative px-20">
                    {/* Previous Button */}
                    <button
                        onClick={prevDestinations}
                        className="absolute -left-10 top-[calc(50%-3rem)] -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg transition-all hover:scale-110 z-10 border border-gray-100"
                        aria-label="Previous destinations"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Destinations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {destinations
                            .slice(currentDestinationIndex, currentDestinationIndex + 4)
                            .map((destination) => (
                                <Link to={destination.link} key={destination.link} className="group">
                                    <div className="rounded-3xl overflow-hidden mb-4 aspect-[3/4]">
                                        <img
                                            src={destination.image}
                                            alt={destination.name}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-xl font-serif mb-2 text-gray-900">{destination.name}</h3>
                                    <p className="text-sm text-gray-600 mb-1">{destination.description}</p>
                                    <p className="text-sm font-medium text-gold">{destination.country}</p>
                                </Link>
                            ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={nextDestinations}
                        className="absolute -right-10 top-[calc(50%-3rem)] -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-full shadow-lg transition-all hover:scale-110 z-10 border border-gray-100"
                        aria-label="Next destinations"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.ceil(destinations.length / 4) }).map((_, index) => (
                            <button
                                key={`destination-page-${index + 1}`}
                                onClick={() => setCurrentDestinationIndex(index * 4)}
                                className={`h-2 rounded-full transition-all ${Math.floor(currentDestinationIndex / 4) === index
                                    ? 'bg-gold w-8'
                                    : 'bg-gray-300 hover:bg-gray-400 w-2'
                                    }`}
                                aria-label={`Go to destination set ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
} 