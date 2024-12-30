import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

// Import images
import lalibelaImage from '../assets/lalibela-two.jpg';
import danakelImage from '../assets/danakel.jpg';
import mountainsImage from '../assets/mountains.jpeg';
import omoValleyImage from '../assets/omo-valley-guy.jpeg';
import ethiopianAirlinesImage from '../assets/ethiopian-airlines-two.jpg';
import emiratesAirlinesImage from '../assets/emirates-airlines.jpg';
import qatarAirlinesImage from '../assets/quatar-airlines.jpg';
import turkishAirlinesImage from '../assets/turkish-airlines.jpg';
import koreanAirlinesImage from '../assets/korean-airlines.jpg';
import japanAirlinesImage from '../assets/japan-airlines.jpg';
import alaskaAirlinesImage from '../assets/alaska-airlines.jpg';
import mountainsBgImage from '../assets/mountains.jpeg';
import abayRiverImage from '../assets/abay-river.jpeg';
import lalibelaSecondImage from '../assets/lalibela.jpeg';
import mountainMonkeyImage from '../assets/mountain-monkey.jpg';
import deltaAirlinesImage from '../assets/delta-airlines.jpg';
import airCanadaAirlinesImage from '../assets/air-canada-airlines.jpg';
import singaporeAirlinesImage from '../assets/singapore-airlines.jpg';
import spiritAirlinesImage from '../assets/spirit-airlines.jpg';
import unitedAirlinesImage from '../assets/united-airlines.jpg';

const featuredDestinations = [
    {
        name: "Lalibela",
        description: "Ancient rock-hewn churches, a UNESCO World Heritage site",
        image: lalibelaImage,
        link: "/trips/lalibela",
        country: "Ethiopia"
    },
    {
        name: "Danakil Depression",
        description: "Earth's lowest and hottest place, with otherworldly landscapes",
        image: danakelImage,
        link: "/trips/danakil",
        country: "Ethiopia"
    },
    {
        name: "Simien Mountains",
        description: "Home to endemic wildlife and breathtaking vistas",
        image: mountainsImage,
        link: "/trips/simien",
        country: "Ethiopia"
    },
    {
        name: "Omo Valley",
        description: "Cultural heritage and traditional tribes of Ethiopia",
        image: omoValleyImage,
        link: "/trips/omo",
        country: "Ethiopia"
    },
    {
        name: "Axum",
        description: "Ancient capital with mysterious obelisks and rich history",
        image: mountainsImage, // You'll need to add the actual image
        link: "/trips/axum",
        country: "Ethiopia"
    },
    {
        name: "Gondar",
        description: "Medieval castles and churches in the 'Camelot of Africa'",
        image: mountainsImage, // You'll need to add the actual image
        link: "/trips/gondar",
        country: "Ethiopia"
    },
    {
        name: "Bale Mountains",
        description: "Alpine peaks and rare wildlife in Ethiopia's largest national park",
        image: mountainsImage, // You'll need to add the actual image
        link: "/trips/bale",
        country: "Ethiopia"
    },
    {
        name: "Lake Tana",
        description: "Ancient monasteries and the source of the Blue Nile",
        image: abayRiverImage,
        link: "/trips/lake-tana",
        country: "Ethiopia"
    }
];

const partnerAirlines = [
    {
        id: 'ethiopian',
        name: "Ethiopian Airlines",
        description: "Africa's largest airline with an extensive network across Africa, Europe, Asia, and the Americas. Known for its modern fleet and exceptional service.",
        image: ethiopianAirlinesImage,
        isMainPartner: true,
        features: ["Modern fleet of Boeing 787s and Airbus A350s", "Extensive African network", "Award-winning skylight loyalty program"],
        hub: "Addis Ababa Bole International Airport"
    },
    {
        id: 'delta',
        name: "Delta Air Lines",
        description: "One of America's largest airlines, known for its reliability, extensive domestic network, and superior customer service across the Americas and beyond.",
        image: deltaAirlinesImage,
        features: ["Industry-leading reliability", "SkyMiles loyalty program", "Extensive domestic and international network"],
        hub: "Hartsfield-Jackson Atlanta International Airport"
    },
    {
        id: 'air-canada',
        name: "Air Canada",
        description: "Canada's flag carrier and largest airline, offering premium service and connecting North America with the world through its modern fleet.",
        image: airCanadaAirlinesImage,
        features: ["Award-winning business class", "Extensive North American coverage", "Aeroplan loyalty program"],
        hub: "Toronto Pearson International Airport"
    },
    {
        id: 'singapore',
        name: "Singapore Airlines",
        description: "Renowned for its premium service and luxury travel experience, consistently rated among the world's best airlines with unparalleled Asian hospitality.",
        image: singaporeAirlinesImage,
        features: ["World-class premium cabins", "Award-winning service", "Modern A380 and Boeing 787 fleet"],
        hub: "Singapore Changi Airport"
    },
    {
        id: 'spirit',
        name: "Spirit Airlines",
        description: "America's leading ultra-low-cost carrier, making air travel accessible with competitive fares while maintaining a modern, fuel-efficient fleet.",
        image: spiritAirlinesImage,
        features: ["Ultra-low fares", "Modern Airbus fleet", "Extensive US and Caribbean network"],
        hub: "Fort Lauderdale-Hollywood International Airport"
    },
    {
        id: 'united',
        name: "United Airlines",
        description: "One of the world's largest airlines, offering comprehensive global coverage with a focus on customer comfort and innovative travel solutions.",
        image: unitedAirlinesImage,
        features: ["Global route network", "MileagePlus rewards", "Polaris business class"],
        hub: "Chicago O'Hare International Airport"
    },
    {
        id: 'emirates',
        name: "Emirates",
        description: "One of the world's premier airlines, connecting global destinations through its ultra-modern hub in Dubai with unparalleled luxury.",
        image: emiratesAirlinesImage,
        features: ["World-class first and business class", "Global route network", "Award-winning ICE entertainment system"],
        hub: "Dubai International Airport"
    },
    {
        id: 'qatar',
        name: "Qatar Airways",
        description: "Voted World's Best Airline multiple times, offering premium service and an extensive global network through its state-of-the-art hub.",
        image: qatarAirlinesImage,
        features: ["World's Best Business Class", "Modern fleet with Qsuite", "Global network to 160+ destinations"],
        hub: "Hamad International Airport"
    },
    {
        id: 'turkish',
        name: "Turkish Airlines",
        description: "Flying to more countries than any other airline, offering a unique blend of European and Asian hospitality.",
        image: turkishAirlinesImage,
        features: ["Largest flight network globally", "Award-winning cuisine", "Modern fleet and premium service"],
        hub: "Istanbul Airport"
    },
    {
        id: 'korean',
        name: "Korean Air",
        description: "Leading Asian carrier known for its premium service and extensive transpacific network with excellent connections across Asia.",
        image: koreanAirlinesImage,
        features: ["Premium transpacific service", "Extensive Asian network", "Exceptional Korean hospitality"],
        hub: "Incheon International Airport"
    },
    {
        id: 'japan',
        name: "Japan Airlines",
        description: "Japan's premier carrier offering impeccable service and connecting Asia with the world through its sophisticated network.",
        image: japanAirlinesImage,
        features: ["Renowned Japanese hospitality", "Modern fleet with premium cabins", "Extensive domestic Japan network"],
        hub: "Tokyo Narita & Haneda Airports"
    },
    {
        id: 'alaska',
        name: "Alaska Airlines",
        description: "Leading North American carrier known for its exceptional service and comprehensive coverage of the American West Coast.",
        image: alaskaAirlinesImage,
        features: ["Comprehensive West Coast network", "Award-winning Mileage Plan", "Outstanding customer service"],
        hub: "Seattle-Tacoma International Airport"
    }
];

const highlights = [
    {
        id: 'historical-tours',
        title: "Rock-Hewn Churches",
        description: "Explore the magnificent churches of Lalibela",
        image: lalibelaSecondImage
    },
    {
        id: 'wildlife-safari',
        title: "Endemic Wildlife",
        description: "Meet the unique Gelada baboons in their natural habitat",
        image: mountainMonkeyImage
    },
    {
        id: 'natural-wonders',
        title: "Natural Wonders",
        description: "Witness the power of the Blue Nile Falls",
        image: abayRiverImage
    }
];

const vacationRegions = [
    { id: 'caribbean', name: 'The Caribbean', places: '01 Places' },
    { id: 'mexico', name: 'Mexico', places: '02 Places' },
    { id: 'europe', name: 'Europe', places: '03 Places' },
    { id: 'hawaii', name: 'Hawaii', places: '04 Places' },
    { id: 'israel', name: 'Israel', places: '05 Places' },
    { id: 'usa', name: 'USA', places: '06 Places' },
    { id: 'africa', name: 'Africa / Safaris', places: '07 Places' },
    { id: 'australia', name: 'Australia', places: '08 Places' }
];

const ethiopianRegions = {
    north: [
        { name: "Lalibela", count: 4, image: lalibelaImage },
        { name: "Axum", count: 3, image: mountainsImage },
        { name: "Gondar", count: 5, image: mountainsImage }
    ],
    south: [
        { name: "Omo Valley", count: 6, image: omoValleyImage },
        { name: "Bale Mountains", count: 4, image: mountainsImage }
    ],
    east: [
        { name: "Danakil Depression", count: 3, image: danakelImage }
    ],
    central: [
        { name: "Lake Tana", count: 5, image: abayRiverImage },
        { name: "Simien Mountains", count: 7, image: mountainsImage }
    ]
};

export default function Home() {
    const [currentAirlineIndex, setCurrentAirlineIndex] = useState(0);
    const [previousAirlineIndex, setPreviousAirlineIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
    const [selectedRegion, setSelectedRegion] = useState('africa');
    const [selectedEthiopianRegion, setSelectedEthiopianRegion] = useState('north');

    const handleImageLoad = useCallback((imageSrc: string) => {
        setLoadedImages(prev => new Set(prev).add(imageSrc));
    }, []);

    const startImageTransition = useCallback((nextIndex: number) => {
        if (!isTransitioning && loadedImages.has(partnerAirlines[nextIndex].image)) {
            setPreviousAirlineIndex(currentAirlineIndex);
            setIsTransitioning(true);
            setCurrentAirlineIndex(nextIndex);
        }
    }, [currentAirlineIndex, isTransitioning, loadedImages]);

    // Preload images
    useEffect(() => {
        partnerAirlines.forEach(airline => {
            const img = new Image();
            img.onload = () => handleImageLoad(airline.image);
            img.src = airline.image;
        });
    }, [handleImageLoad]);

    // Handle auto-playing slideshow
    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            const nextIndex = (currentAirlineIndex + 1) % partnerAirlines.length;
            startImageTransition(nextIndex);
        }, 4000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, currentAirlineIndex, startImageTransition]);

    // Handle transition reset
    useEffect(() => {
        if (isTransitioning) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 700); // Match the duration in the CSS
            return () => clearTimeout(timer);
        }
    }, [isTransitioning]);

    const handleImageTransition = (nextIndex: number) => {
        if (nextIndex === currentAirlineIndex || isTransitioning || !loadedImages.has(partnerAirlines[nextIndex].image)) return;

        setPreviousAirlineIndex(currentAirlineIndex);
        setIsTransitioning(true);
        setCurrentAirlineIndex(nextIndex);
    };

    const nextAirline = () => {
        setIsAutoPlaying(false);
        const nextIndex = (currentAirlineIndex + 1) % partnerAirlines.length;
        handleImageTransition(nextIndex);
    };

    const prevAirline = () => {
        setIsAutoPlaying(false);
        const nextIndex = currentAirlineIndex - 1 < 0 ? partnerAirlines.length - 1 : currentAirlineIndex - 1;
        handleImageTransition(nextIndex);
    };

    const goToAirline = (index: number) => {
        if (index === currentAirlineIndex) return;
        setIsAutoPlaying(false);
        handleImageTransition(index);
    };

    const nextDestinations = () => {
        setCurrentDestinationIndex((prev) =>
            prev + 4 >= featuredDestinations.length ? 0 : prev + 4
        );
    };

    const prevDestinations = () => {
        setCurrentDestinationIndex((prev) =>
            prev - 4 < 0 ? Math.max(featuredDestinations.length - 4, 0) : prev - 4
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Partner Airlines */}
            <section className="h-[100vh] relative overflow-hidden">
                {/* Title Overlay */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 via-black/30 to-transparent pt-32 pb-16">
                    <div className="max-w-7xl mx-auto px-8">
                        <p className="text-yellow-400 text-sm tracking-wider mb-4">GLOBAL AIRLINE PARTNERS</p>
                        <h2 className="font-serif text-4xl text-white">Travel the World with Leading Airlines</h2>
                        <p className="text-white/80 mt-4 max-w-2xl">Experience exceptional service and worldwide connectivity with our carefully selected airline partners</p>
                    </div>
                </div>

                {/* Current and Previous Airline Images */}
                <div className="absolute inset-0">
                    {/* Base layer - Previous Image */}
                    <div className="absolute inset-0">
                        <img
                            key={`prev-${previousAirlineIndex}`}
                            src={partnerAirlines[previousAirlineIndex].image}
                            alt={partnerAirlines[previousAirlineIndex].name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Overlay layer - Current Image */}
                    <div className="absolute inset-0">
                        <img
                            key={`current-${currentAirlineIndex}`}
                            src={partnerAirlines[currentAirlineIndex].image}
                            alt={partnerAirlines[currentAirlineIndex].name}
                            className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${!isTransitioning ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {/* Content Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                            <div className="absolute top-1/2 left-0 right-0 px-8 md:px-16 text-white transform -translate-y-1/2">
                                <div className="max-w-4xl mx-auto">
                                    <h2 className="text-5xl font-serif mb-4">{partnerAirlines[currentAirlineIndex].name}</h2>
                                    <p className="text-xl text-white/90 mb-8 max-w-2xl">{partnerAirlines[currentAirlineIndex].description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/30 backdrop-blur-sm rounded-2xl p-8">
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-400 mb-4">Key Features</h3>
                                            <ul className="space-y-3">
                                                {partnerAirlines[currentAirlineIndex].features.map((feature) => (
                                                    <li key={feature} className="flex items-center text-white/90">
                                                        <svg className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-lg">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-yellow-400 mb-4">Main Hub</h3>
                                            <p className="text-white/90 flex items-center text-lg mb-6">
                                                <svg className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {partnerAirlines[currentAirlineIndex].hub}
                                            </p>
                                            {partnerAirlines[currentAirlineIndex].isMainPartner && (
                                                <div>
                                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-400 text-black">
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
                    {partnerAirlines.map((airline, index) => (
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

            {/* Vacation Destinations */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif mb-4">Vacation Destinations</h2>
                        <p className="text-gray-600">Need some inspiration to plan your next trip? Plan the ultimate vacation at our top popular destination spots around the world.</p>
                    </div>

                    {/* Region Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                        {vacationRegions.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => setSelectedRegion(region.id)}
                                className={`p-4 rounded-xl transition-all ${selectedRegion === region.id
                                    ? 'bg-gold text-white'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                <h3 className="font-serif text-lg mb-2">{region.name}</h3>
                                <p className="text-sm opacity-80">{region.places}</p>
                            </button>
                        ))}
                    </div>

                    {/* Ethiopian Regions (shown when Africa is selected) */}
                    {selectedRegion === 'africa' && (
                        <>
                            <div className="flex justify-center gap-4 mb-12">
                                {Object.entries(ethiopianRegions).map(([region, destinations]) => (
                                    <button
                                        key={region}
                                        onClick={() => setSelectedEthiopianRegion(region)}
                                        className={`px-6 py-3 rounded-full transition-all ${selectedEthiopianRegion === region
                                            ? 'bg-gold text-white'
                                            : 'bg-white hover:bg-gray-50'
                                            }`}
                                    >
                                        {region.charAt(0).toUpperCase() + region.slice(1)} Ethiopia
                                        <span className="ml-2 text-sm opacity-80">({destinations.length})</span>
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {ethiopianRegions[selectedEthiopianRegion as keyof typeof ethiopianRegions].map((destination) => (
                                    <div key={destination.name} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="aspect-[16/9] overflow-hidden">
                                            <img
                                                src={destination.image}
                                                alt={destination.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-serif mb-2">{destination.name}</h3>
                                            <p className="text-sm text-gray-600">{destination.count} Experiences Available</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Hero Section */}
            <section className="relative min-h-screen bg-white overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src={mountainsBgImage}
                        alt="Ethiopian Landscape"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative min-h-screen flex flex-col">
                    {/* Main Content */}
                    <div className="flex-1 flex items-center">
                        <div className="max-w-7xl mx-auto px-8 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">
                                {/* Left side - Main Title */}
                                <div className="bg-black/20 backdrop-blur-sm p-12 rounded-3xl flex flex-col justify-center">
                                    <p className="text-yellow-400 text-sm tracking-wider mb-4">WELCOME TO THE LAND OF ORIGINS</p>
                                    <h1 className="font-serif text-6xl text-white leading-tight mb-6">
                                        Discover Ethiopia's Ancient Wonders
                                    </h1>
                                    <p className="text-white/80">From rock-hewn churches to volcanic landscapes</p>
                                </div>

                                {/* Right side - Description */}
                                <div className="bg-black/20 backdrop-blur-sm p-12 rounded-3xl flex flex-col justify-between">
                                    <p className="text-lg font-light mb-8 max-w-xl text-white">
                                        Experience the cradle of humanity, where ancient traditions meet breathtaking landscapes. Journey through Ethiopia's diverse heritage, from the churches of Lalibela to the tribes of Omo Valley.
                                    </p>
                                    <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors text-sm w-fit">
                                        Start Your Journey
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Destinations */}
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
                            {featuredDestinations
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
                            {Array.from({ length: Math.ceil(featuredDestinations.length / 4) }).map((_, index) => (
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

            {/* Highlights Section */}
            <section className="py-24 bg-gray-900 mx-4 rounded-[3rem]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl mb-4 text-white">Experience Ethiopia with Us</h2>
                        <p className="text-gray-400">Curated experiences that showcase the best of Ethiopian culture, history, and nature</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {highlights.map((highlight) => (
                            <div key={highlight.id} className="rounded-3xl overflow-hidden aspect-[3/4] relative group">
                                <img
                                    src={highlight.image}
                                    alt={highlight.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
                                    <h3 className="text-2xl font-serif mb-2 text-white">{highlight.title}</h3>
                                    <p className="text-white/80">{highlight.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Natural Wonders */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-serif mb-6">Discover Natural Wonders</h2>
                            <p className="text-gray-600 mb-8">
                                From the otherworldly landscapes of the Danakil Depression to the lush Simien Mountains,
                                Ethiopia offers some of Africa's most spectacular natural wonders.
                            </p>
                            <Link
                                to="/natural-wonders"
                                className="inline-block px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                            >
                                Explore More
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src={danakelImage}
                                alt="Danakil Depression"
                                className="rounded-2xl w-full aspect-[3/4] object-cover"
                            />
                            <img
                                src={abayRiverImage}
                                alt="Blue Nile Falls"
                                className="rounded-2xl w-full aspect-[3/4] object-cover mt-8"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 