import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const featuredDestinations = [
    {
        name: "Lalibela",
        description: "Ancient rock-hewn churches, a UNESCO World Heritage site",
        image: "/src/assets/lalibela-two.jpg",
        link: "/trips/lalibela"
    },
    {
        name: "Danakil Depression",
        description: "Earth's lowest and hottest place, with otherworldly landscapes",
        image: "/src/assets/danakel.jpg",
        link: "/trips/danakil"
    },
    {
        name: "Simien Mountains",
        description: "Home to endemic wildlife and breathtaking vistas",
        image: "/src/assets/mountains.jpeg",
        link: "/trips/simien"
    },
    {
        name: "Omo Valley",
        description: "Cultural heritage and traditional tribes of Ethiopia",
        image: "/src/assets/omo-valley-guy.jpeg",
        link: "/trips/omo"
    }
];

const partnerAirlines = [
    {
        id: 'ethiopian',
        name: "Ethiopian Airlines",
        image: "/src/assets/ethiopian-airlines-two.jpg",
        isMainPartner: true
    },
    {
        id: 'emirates',
        name: "Emirates",
        image: "/src/assets/emirates-airlines.jpg"
    },
    {
        id: 'qatar',
        name: "Qatar Airways",
        image: "/src/assets/quatar-airlines.jpg"
    },
    {
        id: 'turkish',
        name: "Turkish Airlines",
        image: "/src/assets/turkish-airlines.jpg"
    },
    {
        id: 'korean',
        name: "Korean Air",
        image: "/src/assets/korean-airlines.jpg"
    }
];

const highlights = [
    {
        id: 'historical-tours',
        title: "Rock-Hewn Churches",
        description: "Explore the magnificent churches of Lalibela",
        image: "/src/assets/lalibela.jpeg"
    },
    {
        id: 'wildlife-safari',
        title: "Endemic Wildlife",
        description: "Meet the unique Gelada baboons in their natural habitat",
        image: "/src/assets/mountain-monkey.jpg"
    },
    {
        id: 'natural-wonders',
        title: "Natural Wonders",
        description: "Witness the power of the Blue Nile Falls",
        image: "/src/assets/abay-river.jpeg"
    }
];

export default function Home() {
    const [currentAirlineIndex, setCurrentAirlineIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            setCurrentAirlineIndex((prev) =>
                prev + 1 >= partnerAirlines.length ? 0 : prev + 1
            );
        }, 7000);

        return () => clearInterval(timer);
    }, [isAutoPlaying]);

    const nextAirline = () => {
        setIsAutoPlaying(false);
        setCurrentAirlineIndex((prev) =>
            prev + 1 >= partnerAirlines.length ? 0 : prev + 1
        );
    };

    const prevAirline = () => {
        setIsAutoPlaying(false);
        setCurrentAirlineIndex((prev) =>
            prev - 1 < 0 ? partnerAirlines.length - 1 : prev - 1
        );
    };

    const goToAirline = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentAirlineIndex(index);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Partner Airlines */}
            <section className="h-[100vh] relative overflow-hidden">
                {/* Current Airline Image */}
                <div className="absolute inset-0">
                    <img
                        src={partnerAirlines[currentAirlineIndex].image}
                        alt={partnerAirlines[currentAirlineIndex].name}
                        className="w-full h-full object-cover transition-opacity duration-500"
                    />
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
                            className={`w-2 h-2 rounded-full transition-all ${index === currentAirlineIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50'
                                }`}
                            aria-label={`Go to airline ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Hero Section */}
            <section className="relative min-h-screen bg-white overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src="/src/assets/mountains.jpeg"
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif mb-12 text-center">Featured Destinations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredDestinations.map((destination) => (
                            <Link to={destination.link} key={destination.link} className="group">
                                <div className="rounded-3xl overflow-hidden mb-4 aspect-[4/5]">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-xl font-serif mb-2 text-gray-900">{destination.name}</h3>
                                <p className="text-sm text-gray-600">{destination.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Highlights Section */}
            <section className="py-24 bg-gray-900 rounded-t-[3rem]">
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
                                src="/src/assets/danakel.jpg"
                                alt="Danakil Depression"
                                className="rounded-2xl w-full aspect-[3/4] object-cover"
                            />
                            <img
                                src="/src/assets/abay-river.jpeg"
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