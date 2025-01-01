import { useState, useEffect, useCallback } from 'react';

interface Airline {
    id: string;
    name: string;
    description: string;
    image: string;
    isMainPartner?: boolean;
    features: string[];
    hub: string;
}

interface AirlinesSectionProps {
    airlines: Airline[];
}

export function AirlinesSection({ airlines }: AirlinesSectionProps) {
    const [currentAirlineIndex, setCurrentAirlineIndex] = useState(0);
    const [previousAirlineIndex, setPreviousAirlineIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const handleImageLoad = useCallback((imageSrc: string) => {
        setLoadedImages(prev => new Set(prev).add(imageSrc));
    }, []);

    const startImageTransition = useCallback((nextIndex: number) => {
        if (!isTransitioning && loadedImages.has(airlines[nextIndex].image)) {
            setPreviousAirlineIndex(currentAirlineIndex);
            setIsTransitioning(true);
            setCurrentAirlineIndex(nextIndex);
        }
    }, [currentAirlineIndex, isTransitioning, loadedImages, airlines]);

    // Preload images
    useEffect(() => {
        airlines.forEach(airline => {
            const img = new Image();
            img.onload = () => handleImageLoad(airline.image);
            img.src = airline.image;
        });
    }, [airlines, handleImageLoad]);

    // Handle auto-playing slideshow
    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            const nextIndex = (currentAirlineIndex + 1) % airlines.length;
            startImageTransition(nextIndex);
        }, 4000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, currentAirlineIndex, airlines.length, startImageTransition]);

    // Handle transition reset
    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const handleImageTransition = (nextIndex: number) => {
        if (nextIndex === currentAirlineIndex || isTransitioning || !loadedImages.has(airlines[nextIndex].image)) return;

        setPreviousAirlineIndex(currentAirlineIndex);
        setIsTransitioning(true);
        setCurrentAirlineIndex(nextIndex);
    };

    const nextAirline = () => {
        setIsAutoPlaying(false);
        const nextIndex = (currentAirlineIndex + 1) % airlines.length;
        handleImageTransition(nextIndex);
    };

    const prevAirline = () => {
        setIsAutoPlaying(false);
        const nextIndex = currentAirlineIndex - 1 < 0 ? airlines.length - 1 : currentAirlineIndex - 1;
        handleImageTransition(nextIndex);
    };

    const goToAirline = (index: number) => {
        if (index === currentAirlineIndex) return;
        setIsAutoPlaying(false);
        handleImageTransition(index);
    };

    return (
        <section className="h-[100vh] relative overflow-hidden">
            {/* Title Overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-40 pb-12">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-yellow-400 font-serif text-3xl text-white">Travel the World with Leading Airlines</h2>
                    <p className="text-white/80 mt-2 max-w-2xl text-sm">Experience exceptional service and worldwide connectivity with our carefully selected airline partners</p>
                </div>
            </div>

            {/* Current and Previous Airline Images */}
            <div className="absolute inset-0">
                {/* Base layer - Previous Image */}
                <div className="absolute inset-0">
                    <img
                        key={`prev-${previousAirlineIndex}`}
                        src={airlines[previousAirlineIndex].image}
                        alt={airlines[previousAirlineIndex].name}
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Overlay layer - Current Image */}
                <div className="absolute inset-0">
                    <img
                        key={`current-${currentAirlineIndex}`}
                        src={airlines[currentAirlineIndex].image}
                        alt={airlines[currentAirlineIndex].name}
                        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${!isTransitioning ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {/* Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="absolute top-1/2 left-0 right-0 px-8 md:px-16 text-white transform -translate-y-1/2">
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-4xl font-serif mb-3">{airlines[currentAirlineIndex].name}</h2>
                                <p className="text-base text-white/90 mb-6 max-w-2xl">{airlines[currentAirlineIndex].description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/30 backdrop-blur-sm rounded-2xl p-6">
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-3">Key Features</h3>
                                        <ul className="space-y-2">
                                            {airlines[currentAirlineIndex].features.map((feature) => (
                                                <li key={feature} className="flex items-center text-white/90">
                                                    <svg className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-3">Main Hub</h3>
                                        <p className="text-white/90 flex items-center text-sm mb-4">
                                            <svg className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {airlines[currentAirlineIndex].hub}
                                        </p>
                                        {airlines[currentAirlineIndex].isMainPartner && (
                                            <div>
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-400 text-black">
                                                    Main Partner
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevAirline}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Previous airline"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={nextAirline}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Next airline"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-20">
                {airlines.map((airline, index) => (
                    <button
                        key={airline.id}
                        onClick={() => goToAirline(index)}
                        className={`h-2 rounded-full transition-all ${index === currentAirlineIndex
                            ? 'bg-yellow-400 w-8'
                            : 'bg-white/50 hover:bg-white/80 w-2'
                            }`}
                        aria-label={`Go to airline ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
} 