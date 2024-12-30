import { Link } from 'react-router-dom';

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
        image: "/src/assets/omo-monkey-two.jpg",
        link: "/trips/omo"
    }
];

const activities = [
    {
        id: 'historical-tours',
        title: "Historical Tours",
        description: "Explore ancient churches and historical sites",
        image: "/src/assets/lalibela-two.jpg"
    },
    {
        id: 'wildlife-safari',
        title: "Wildlife Safari",
        description: "Meet the unique Gelada baboons and Ethiopian wolves",
        image: "/src/assets/mountain-monkey.jpg"
    },
    {
        id: 'cultural-experiences',
        title: "Cultural Experiences",
        description: "Immerse in Ethiopia's rich cultural traditions",
        image: "/src/assets/omo-monkey-two.jpg"
    }
];

const stats = {
    location: "Lalibela",
    temperature: "22°",
    weather: "Sunny",
    rating: "4.6K",
    ratingText: "The most beautiful destinations in Africa"
};

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen bg-white overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src="/src/assets/ethiopian-airlines.jpg"
                        alt="Ethiopian Airlines"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative min-h-screen flex flex-col">
                    {/* Top Navigation Bar */}
                    <div className="absolute top-0 left-0 right-0 z-10">
                        <div className="max-w-7xl mx-auto px-8 py-6">
                            <div className="flex justify-between items-center">
                                <button className="text-white text-sm font-light">Menu</button>
                                <div className="flex items-center gap-12">
                                    <Link to="/about" className="text-white text-sm font-light">About</Link>
                                    <Link to="/pricing" className="text-white text-sm font-light">Pricing</Link>
                                    <Link to="/contact" className="text-white text-sm font-light">Contact</Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="px-4 py-1.5 rounded-full bg-white/10 text-white placeholder-white/70 text-sm"
                                    />
                                    <button className="px-6 py-1.5 bg-black text-white rounded-full text-sm">
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex items-center">
                        <div className="max-w-7xl mx-auto px-8 w-full">
                            <div className="grid grid-cols-2 gap-16 items-center">
                                {/* Left side - Main Title */}
                                <div className="bg-black/20 backdrop-blur-sm p-8 rounded-3xl">
                                    <p className="text-yellow-400 text-sm tracking-wider mb-4">WELCOME TO THE LAND OF ORIGINS</p>
                                    <h1 className="font-serif text-6xl text-white leading-tight mb-8">
                                        Discover Ethiopia
                                    </h1>
                                </div>

                                {/* Right side - Description */}
                                <div className="bg-black/20 backdrop-blur-sm p-8 rounded-3xl">
                                    <p className="text-lg font-light mb-8 max-w-xl text-white">
                                        Experience the cradle of humanity, where ancient traditions meet breathtaking landscapes. From rock-hewn churches to volcanic wonders, embark on an unforgettable journey through Ethiopia.
                                    </p>
                                    <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors text-sm">
                                        Start Your Journey
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Curved Line Decoration */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg className="w-full h-32" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                                d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160"
                            />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Location and Stats Section */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="relative rounded-3xl overflow-hidden aspect-square">
                            <img src="/src/assets/lalibela-two.jpg" alt="Location" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/50 to-transparent">
                                <div className="flex items-center gap-2 text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{stats.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden aspect-square bg-gradient-to-br from-blue-100 to-blue-50 p-6">
                            <div className="flex flex-col h-full justify-between">
                                <div className="text-4xl font-light">{stats.temperature}</div>
                                <div className="text-sm text-gray-600">{stats.weather}</div>
                            </div>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden aspect-square bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex items-center">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-4xl font-light ml-2">{stats.rating}</span>
                                </div>
                                <p className="text-sm text-gray-600">{stats.ratingText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Destinations */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-4 gap-6">
                        {featuredDestinations.map((destination) => (
                            <Link to={destination.link} key={destination.link} className="group">
                                <div className="rounded-3xl overflow-hidden mb-4">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="w-full aspect-square object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-serif mb-2 text-gray-900">{destination.name}</h3>
                                <p className="text-sm text-gray-600">{destination.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Visit Section */}
            <section className="py-24 bg-gray-900 rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl mb-4 text-white">Experience Ethiopia with Us</h2>
                        <p className="text-gray-400">Curated experiences that showcase the best of Ethiopian culture, history, and nature</p>
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Link to="/trips" className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors">
                                Book Now
                            </Link>
                            <div className="text-2xl font-serif text-white">From $800</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="rounded-3xl overflow-hidden aspect-square relative">
                                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 p-6 flex flex-col justify-end">
                                    <h3 className="text-xl font-serif mb-2 text-white">{activity.title}</h3>
                                    <p className="text-sm text-white/80">{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
} 